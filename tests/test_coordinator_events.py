"""Tests for event dedupe across coordinator refreshes."""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any
from unittest.mock import MagicMock

import pytest

from custom_components.ready_home.attention import build_buckets
from custom_components.ready_home.const import (
    EVENT_ITEM_EXPIRED,
    EVENT_ITEM_LOW_STOCK,
)
from custom_components.ready_home.coordinator import ReadyHomeCoordinator
from custom_components.ready_home.models import InventoryItem, ReadinessSettings
from custom_components.ready_home.store import InventoryStore


class FakeStoreBackend:
    def __init__(self) -> None:
        self.data: dict[str, Any] | None = None

    async def async_load(self) -> dict[str, Any] | None:
        return self.data

    def async_delay_save(self, data_func: Any, delay: float = 0) -> None:
        self.data = data_func()

    async def async_save(self, data: dict[str, Any]) -> None:
        self.data = data


@pytest.fixture
def coordinator(monkeypatch: pytest.MonkeyPatch) -> ReadyHomeCoordinator:
    hass = MagicMock()
    hass.bus = MagicMock()
    hass.async_create_task = MagicMock()

    backend = FakeStoreBackend()

    def _factory(*_a: Any, **_k: Any) -> FakeStoreBackend:
        return backend

    monkeypatch.setattr("custom_components.ready_home.store.Store", _factory)
    store = InventoryStore(hass)
    settings = ReadinessSettings(number_of_people=2)
    coord = ReadyHomeCoordinator(hass, store, settings)
    # Skip daily tracker / listener wiring; call _async_update_data directly
    return coord


@pytest.mark.asyncio
async def test_events_fire_once_on_transition(
    coordinator: ReadyHomeCoordinator,
) -> None:
    today = date.today()
    await coordinator.store.async_load()
    expired = InventoryItem(
        name="Old",
        quantity=1,
        expiry_date=(today - timedelta(days=1)).isoformat(),
    )
    low = InventoryItem(name="Low", quantity=1, desired_quantity=5)
    await coordinator.store.async_add(expired)
    await coordinator.store.async_add(low)

    # First recompute should fire events
    data1 = await coordinator._async_update_data()
    assert len(data1.buckets.expired) == 1
    assert len(data1.buckets.low_stock) == 1

    fired = [c.args[0] for c in coordinator.hass.bus.async_fire.call_args_list]
    assert EVENT_ITEM_EXPIRED in fired
    assert EVENT_ITEM_LOW_STOCK in fired

    coordinator.hass.bus.async_fire.reset_mock()

    # Second recompute with same state should not re-fire
    await coordinator._async_update_data()
    assert coordinator.hass.bus.async_fire.call_count == 0


@pytest.mark.asyncio
async def test_bucket_helpers_match_coordinator_windows() -> None:
    today = date(2026, 1, 1)
    items = [
        InventoryItem(
            name="Soon",
            quantity=1,
            expiry_date=(today + timedelta(days=10)).isoformat(),
        )
    ]
    buckets = build_buckets(items, today=today, urgent_days=7, expiring_days=30)
    assert len(buckets.within_expiring) == 1
    assert len(buckets.within_urgent) == 0
