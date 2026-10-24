"""Coordinator that recomputes readiness and fires attention events."""

from __future__ import annotations

import logging
from datetime import date, datetime
from typing import Any

from homeassistant.core import CALLBACK_TYPE, Context, HomeAssistant, callback
from homeassistant.helpers.event import async_track_time_change
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

from .attention import AttentionBuckets, build_buckets, event_item_summary, item_summary
from .completeness import assess_category_completeness
from .const import (
    ATTRIBUTE_ITEM_CAP,
    DOMAIN,
    EVENT_ITEM_EXPIRED,
    EVENT_ITEM_EXPIRED_CLEARED,
    EVENT_ITEM_EXPIRING,
    EVENT_ITEM_EXPIRING_CLEARED,
    EVENT_ITEM_LOW_STOCK,
    EVENT_ITEM_LOW_STOCK_CLEARED,
)
from .models import (
    CategoryCompleteness,
    InventoryItem,
    ReadinessAssessment,
    ReadinessSettings,
)
from .readiness import assess
from .store import InventoryStore

_LOGGER = logging.getLogger(__name__)


class ReadyHomeData:
    """Snapshot published to entities after each recompute."""

    def __init__(
        self,
        *,
        items: list[InventoryItem],
        settings: ReadinessSettings,
        assessment: ReadinessAssessment,
        buckets: AttentionBuckets,
        completeness: CategoryCompleteness,
    ) -> None:
        self.items = items
        self.settings = settings
        self.assessment = assessment
        self.buckets = buckets
        self.completeness = completeness


class ReadyHomeCoordinator(DataUpdateCoordinator[ReadyHomeData]):
    """Owns recompute timing, event dedupe, and settings refresh."""

    def __init__(
        self,
        hass: HomeAssistant,
        store: InventoryStore,
        settings: ReadinessSettings,
    ) -> None:
        super().__init__(hass, _LOGGER, name=DOMAIN)
        self.store = store
        self.settings = settings
        self.entry_id: str | None = None
        self.config_entry: Any | None = None
        self.update_context: Context | None = None
        self._unsub_daily: CALLBACK_TYPE | None = None
        self._unsub_store: CALLBACK_TYPE | None = None

    async def async_setup(self, *, skip_store_load: bool = False) -> None:
        """Load store, wire listeners, run first recompute."""
        if not skip_store_load:
            await self.store.async_load()
        self._unsub_store = self.store.async_add_listener(self._on_store_changed)
        self._unsub_daily = async_track_time_change(
            self.hass,
            self._on_daily,
            hour=0,
            minute=5,
            second=0,
        )
        await self.async_refresh()

    async def async_shutdown(self) -> None:
        """Detach listeners."""
        if self._unsub_daily is not None:
            self._unsub_daily()
            self._unsub_daily = None
        if self._unsub_store is not None:
            self._unsub_store()
            self._unsub_store = None

    def _schedule_refresh(self) -> None:
        """Request a refresh via the config entry when available."""
        entry = self.config_entry
        if entry is not None and hasattr(entry, "async_create_task"):
            entry.async_create_task(
                self.hass,
                self.async_request_refresh(),
                f"{DOMAIN}_refresh",
            )
            return
        self.hass.async_create_task(self.async_request_refresh())

    def update_settings(self, settings: ReadinessSettings) -> None:
        """Replace settings (e.g. after options flow) and request refresh."""
        self.settings = settings
        self._schedule_refresh()

    @callback
    def _on_store_changed(self) -> None:
        self._schedule_refresh()

    @callback
    def _on_daily(self, _now: datetime) -> None:
        self._schedule_refresh()

    async def _async_update_data(self) -> ReadyHomeData:
        # One context per refresh so Activity can chain related state changes
        # and logbook rows (HA 2026.9 "What happened").
        self.update_context = Context()
        items = self.store.items
        today = date.today()
        assessment = assess(items, self.settings, today)
        buckets = build_buckets(
            items,
            today=today,
            urgent_days=self.settings.urgent_days,
            expiring_days=self.settings.expiring_days,
        )
        completeness = assess_category_completeness(items, self.settings, today)
        await self._async_fire_transition_events(buckets)
        return ReadyHomeData(
            items=items,
            settings=self.settings,
            assessment=assessment,
            buckets=buckets,
            completeness=completeness,
        )

    async def _async_fire_transition_events(self, buckets: AttentionBuckets) -> None:
        """Fire events when an item enters or leaves an attention bucket."""
        previous = self.store.get_bucket_state()
        current: dict[str, str] = {}
        context = self.update_context

        for item in buckets.expired:
            current[item.id] = "expired"
        for item in buckets.within_urgent:
            current.setdefault(item.id, "expiring")
        for item in buckets.within_expiring:
            current.setdefault(item.id, "expiring")

        low_stock_ids = {item.id for item in buckets.low_stock}
        newly_low_stock: list[InventoryItem] = []

        for item_id, bucket in current.items():
            prev = previous.get(item_id)
            if prev == bucket:
                continue
            item = self.store.get(item_id)
            if item is None:
                continue
            event_type = (
                EVENT_ITEM_EXPIRED if bucket == "expired" else EVENT_ITEM_EXPIRING
            )
            self.hass.bus.async_fire(
                event_type,
                {"item": event_item_summary(item), "bucket": bucket},
                context=context,
            )

        # Cleared: was in an expiry bucket, not in current (or changed away)
        for item_id, prev_bucket in previous.items():
            if item_id.endswith(":low_stock"):
                continue
            if item_id in current:
                continue
            item = self.store.get(item_id)
            if item is None:
                continue
            cleared_type = (
                EVENT_ITEM_EXPIRED_CLEARED
                if prev_bucket == "expired"
                else EVENT_ITEM_EXPIRING_CLEARED
            )
            self.hass.bus.async_fire(
                cleared_type,
                {"item": event_item_summary(item), "bucket": prev_bucket},
                context=context,
            )

        for item in buckets.low_stock:
            key = f"{item.id}:low_stock"
            if previous.get(key) == "1":
                continue
            self.hass.bus.async_fire(
                EVENT_ITEM_LOW_STOCK,
                {"item": event_item_summary(item)},
                context=context,
            )
            newly_low_stock.append(item)

        # Cleared low stock
        for key, value in previous.items():
            if not key.endswith(":low_stock") or value != "1":
                continue
            item_id = key[: -len(":low_stock")]
            if item_id in low_stock_ids:
                continue
            item = self.store.get(item_id)
            if item is None:
                continue
            self.hass.bus.async_fire(
                EVENT_ITEM_LOW_STOCK_CLEARED,
                {"item": event_item_summary(item)},
                context=context,
            )

        # Persist combined map: expiry bucket + low_stock flags
        new_state: dict[str, str] = dict(current)
        for item_id in low_stock_ids:
            new_state[f"{item_id}:low_stock"] = "1"

        await self.store.async_set_bucket_state(new_state)

        if newly_low_stock and self.settings.auto_push_restock:
            await self._async_auto_push_restock(newly_low_stock)

    async def _async_auto_push_restock(self, items: list[InventoryItem]) -> None:
        """Push newly low-stock items to the configured todo list."""
        from .restock import async_push_items_to_todo

        entity_id = self.settings.todo_entity_id
        if not entity_id:
            return
        try:
            await async_push_items_to_todo(self.hass, entity_id, items)
        except Exception:  # noqa: BLE001 — never fail a coordinator refresh
            _LOGGER.exception(
                "Auto-push restock to %s failed", entity_id
            )

    def capped_item_dicts(self, items: list[InventoryItem]) -> list[dict[str, Any]]:
        """Return item summaries capped for sensor attributes."""
        return [item_summary(i) for i in items[:ATTRIBUTE_ITEM_CAP]]
