"""Persistent inventory store for Ready Home."""

from __future__ import annotations

import logging
from collections.abc import Awaitable, Callable
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import SAVE_DELAY, STORAGE_KEY_LEGACY, STORAGE_VERSION, storage_key_for_entry
from .models import InventoryItem

_LOGGER = logging.getLogger(__name__)

Listener = Callable[[], Awaitable[None] | None]


class InventoryStore:
    """Versioned Store-backed CRUD for inventory items and bucket state.

    Storage is scoped per config entry so multiple readiness profiles can
    coexist later without colliding.
    """

    def __init__(self, hass: HomeAssistant, entry_id: str) -> None:
        self.hass = hass
        self.entry_id = entry_id
        self._store: Store[dict[str, Any]] = Store(
            hass,
            STORAGE_VERSION,
            storage_key_for_entry(entry_id),
            serialize_in_event_loop=False,
        )
        self._legacy_store: Store[dict[str, Any]] = Store(
            hass,
            STORAGE_VERSION,
            STORAGE_KEY_LEGACY,
            serialize_in_event_loop=False,
        )
        self._items: dict[str, InventoryItem] = {}
        self._bucket_state: dict[str, str] = {}
        self._listeners: list[Listener] = []
        self._loaded = False

    def async_add_listener(self, listener: Listener) -> Callable[[], None]:
        """Register a callback invoked after mutations. Returns an unsubscribe."""

        self._listeners.append(listener)

        def _remove() -> None:
            if listener in self._listeners:
                self._listeners.remove(listener)

        return _remove

    async def async_load(self) -> None:
        """Load items and bucket state from disk, migrating legacy storage if needed."""
        data = await self._store.async_load()
        migrated = False
        if data is None:
            legacy = await self._legacy_store.async_load()
            if legacy is not None:
                _LOGGER.info(
                    "Migrating Ready Home inventory from legacy store key to entry %s",
                    self.entry_id,
                )
                data = legacy
                migrated = True

        if data is None:
            self._items = {}
            self._bucket_state = {}
            self._loaded = True
            return

        items_raw = data.get("items") or []
        self._items = {}
        for raw in items_raw:
            try:
                item = InventoryItem.from_dict(raw)
                self._items[item.id] = item
            except (KeyError, TypeError, ValueError) as err:
                _LOGGER.warning("Skipping corrupt inventory item: %s (%s)", raw, err)

        self._bucket_state = {
            str(k): str(v) for k, v in (data.get("bucket_state") or {}).items()
        }
        self._loaded = True
        _LOGGER.debug(
            "Loaded %s inventory items for entry %s", len(self._items), self.entry_id
        )
        if migrated:
            self._schedule_save()
            # Prevent a future second profile from re-importing the same legacy data.
            self._legacy_store.async_delay_save(lambda: {}, SAVE_DELAY)

    def _schedule_save(self) -> None:
        self._store.async_delay_save(self._data_to_save, SAVE_DELAY)

    def _data_to_save(self) -> dict[str, Any]:
        return {
            "items": [item.to_dict() for item in self._items.values()],
            "bucket_state": dict(self._bucket_state),
        }

    async def _notify_listeners(self) -> None:
        for listener in list(self._listeners):
            result = listener()
            if result is not None and hasattr(result, "__await__"):
                await result  # type: ignore[misc]

    @property
    def items(self) -> list[InventoryItem]:
        """Return all items as a list."""
        return list(self._items.values())

    def get(self, item_id: str) -> InventoryItem | None:
        """Return an item by id."""
        return self._items.get(item_id)

    def find_by_name(self, name: str) -> InventoryItem | None:
        """Return the unique item matching name (case-insensitive), or None."""
        matches = [i for i in self._items.values() if i.name.lower() == name.lower()]
        if len(matches) == 1:
            return matches[0]
        return None

    async def async_add(self, item: InventoryItem) -> InventoryItem:
        """Add a new item and persist."""
        self._items[item.id] = item
        self._schedule_save()
        await self._notify_listeners()
        return item

    async def async_update(self, item: InventoryItem) -> InventoryItem:
        """Replace an existing item and persist."""
        if item.id not in self._items:
            raise KeyError(item.id)
        self._items[item.id] = item
        self._schedule_save()
        await self._notify_listeners()
        return item

    async def async_remove(self, item_id: str) -> InventoryItem | None:
        """Remove an item by id. Returns the removed item or None."""
        item = self._items.pop(item_id, None)
        if item is None:
            return None
        self._bucket_state.pop(item_id, None)
        self._schedule_save()
        await self._notify_listeners()
        return item

    def get_bucket_state(self) -> dict[str, str]:
        """Return a copy of the persisted attention-bucket map."""
        return dict(self._bucket_state)

    async def async_set_bucket_state(self, state: dict[str, str]) -> None:
        """Persist the attention-bucket map without notifying inventory listeners."""
        self._bucket_state = dict(state)
        self._schedule_save()

    async def async_save_now(self) -> None:
        """Flush pending writes immediately."""
        await self._store.async_save(self._data_to_save())
