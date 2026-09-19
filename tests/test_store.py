"""Tests for InventoryStore using a lightweight fake Home Assistant Store."""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest

from custom_components.ready_home.models import InventoryItem
from custom_components.ready_home.store import InventoryStore


class FakeStore:
    """Minimal stand-in for homeassistant.helpers.storage.Store."""

    def __init__(self) -> None:
        self.data: dict[str, Any] | None = None
        self.delay_saves: list[Any] = []

    async def async_load(self) -> dict[str, Any] | None:
        return self.data

    def async_delay_save(self, data_func: Any, delay: float = 0) -> None:
        self.delay_saves.append((data_func, delay))
        self.data = data_func()

    async def async_save(self, data: dict[str, Any]) -> None:
        self.data = data


@pytest.fixture
def inventory_store(monkeypatch: pytest.MonkeyPatch) -> InventoryStore:
    hass = MagicMock()
    fake = FakeStore()

    def _store_factory(*_args: Any, **_kwargs: Any) -> FakeStore:
        return fake

    monkeypatch.setattr(
        "custom_components.ready_home.store.Store", _store_factory
    )
    store = InventoryStore(hass, "test-entry")
    store._fake = fake  # type: ignore[attr-defined]
    return store


@pytest.mark.asyncio
async def test_add_update_remove(inventory_store: InventoryStore) -> None:
    store = inventory_store
    await store.async_load()
    assert store.items == []

    item = InventoryItem(name="Water", quantity=6)
    await store.async_add(item)
    assert len(store.items) == 1
    assert store.get(item.id) is not None

    updated = item.with_updates(quantity=4)
    await store.async_update(updated)
    assert store.get(item.id).quantity == 4

    removed = await store.async_remove(item.id)
    assert removed is not None
    assert store.get(item.id) is None


@pytest.mark.asyncio
async def test_find_by_name(inventory_store: InventoryStore) -> None:
    store = inventory_store
    await store.async_load()
    await store.async_add(InventoryItem(name="Rice", quantity=1))
    assert store.find_by_name("rice") is not None
    assert store.find_by_name("missing") is None


@pytest.mark.asyncio
async def test_persist_and_reload(inventory_store: InventoryStore) -> None:
    store = inventory_store
    await store.async_load()
    item = InventoryItem(name="Beans", quantity=10, barcode="999")
    await store.async_add(item)

    # Simulate reload from the same backing data
    store2 = InventoryStore(MagicMock(), "test-entry")
    store2._store = store._store  # type: ignore[assignment]
    await store2.async_load()
    loaded = store2.get(item.id)
    assert loaded is not None
    assert loaded.name == "Beans"
    assert loaded.barcode == "999"


@pytest.mark.asyncio
async def test_listener_notified(inventory_store: InventoryStore) -> None:
    store = inventory_store
    await store.async_load()
    calls: list[int] = []

    def _listener() -> None:
        calls.append(1)

    store.async_add_listener(_listener)
    await store.async_add(InventoryItem(name="X", quantity=1))
    assert calls == [1]


@pytest.mark.asyncio
async def test_bucket_state_persists(inventory_store: InventoryStore) -> None:
    store = inventory_store
    await store.async_load()
    await store.async_set_bucket_state({"abc": "expired", "abc:low_stock": "1"})
    assert store.get_bucket_state()["abc"] == "expired"
