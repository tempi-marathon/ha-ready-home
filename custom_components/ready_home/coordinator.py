"""Coordinator that recomputes readiness and fires attention events."""

from __future__ import annotations

import logging
from datetime import date, datetime
from typing import Any

from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers.event import async_track_time_change
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

from .attention import AttentionBuckets, build_buckets, item_summary
from .const import (
    DOMAIN,
    EVENT_ITEM_EXPIRED,
    EVENT_ITEM_EXPIRING,
    EVENT_ITEM_LOW_STOCK,
)
from .models import InventoryItem, ReadinessAssessment, ReadinessSettings
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
    ) -> None:
        self.items = items
        self.settings = settings
        self.assessment = assessment
        self.buckets = buckets


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
        self._unsub_daily: CALLBACK_TYPE | None = None
        self._unsub_store: CALLBACK_TYPE | None = None

    async def async_setup(self) -> None:
        """Load store, wire listeners, run first recompute."""
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

    def update_settings(self, settings: ReadinessSettings) -> None:
        """Replace settings (e.g. after options flow) and request refresh."""
        self.settings = settings
        self.hass.async_create_task(self.async_request_refresh())

    @callback
    def _on_store_changed(self) -> None:
        self.hass.async_create_task(self.async_request_refresh())

    @callback
    def _on_daily(self, _now: datetime) -> None:
        self.hass.async_create_task(self.async_request_refresh())

    async def _async_update_data(self) -> ReadyHomeData:
        items = self.store.items
        today = date.today()
        assessment = assess(items, self.settings, today)
        buckets = build_buckets(
            items,
            today=today,
            urgent_days=self.settings.urgent_days,
            expiring_days=self.settings.expiring_days,
        )
        await self._async_fire_transition_events(buckets)
        return ReadyHomeData(
            items=items,
            settings=self.settings,
            assessment=assessment,
            buckets=buckets,
        )

    async def _async_fire_transition_events(self, buckets: AttentionBuckets) -> None:
        """Fire events only when an item newly enters a bucket."""
        previous = self.store.get_bucket_state()
        current: dict[str, str] = {}

        for item in buckets.expired:
            current[item.id] = "expired"
        for item in buckets.within_urgent:
            # Prefer expired if somehow in both; urgent is distinct
            current.setdefault(item.id, "expiring")
        for item in buckets.within_expiring:
            current.setdefault(item.id, "expiring")

        low_stock_ids = {item.id for item in buckets.low_stock}

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
                {"item": item_summary(item), "bucket": bucket},
            )

        for item in buckets.low_stock:
            if previous.get(f"{item.id}:low_stock") == "1":
                continue
            self.hass.bus.async_fire(
                EVENT_ITEM_LOW_STOCK,
                {"item": item_summary(item)},
            )

        # Persist combined map: expiry bucket + low_stock flags
        new_state: dict[str, str] = dict(current)
        for item_id in low_stock_ids:
            new_state[f"{item_id}:low_stock"] = "1"

        await self.store.async_set_bucket_state(new_state)

    def capped_item_dicts(self, items: list[InventoryItem]) -> list[dict[str, Any]]:
        """Return item summaries capped for sensor attributes."""
        cap = self.settings.attribute_item_cap
        return [item_summary(i) for i in items[:cap]]
