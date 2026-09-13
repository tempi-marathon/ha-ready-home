"""Logbook descriptions for Ready Home attention events."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from homeassistant.components.logbook import (
    LOGBOOK_ENTRY_MESSAGE,
    LOGBOOK_ENTRY_NAME,
)
from homeassistant.const import ATTR_NAME
from homeassistant.core import Event, HomeAssistant, callback

from .const import (
    DOMAIN,
    EVENT_ITEM_EXPIRED,
    EVENT_ITEM_EXPIRING,
    EVENT_ITEM_LOW_STOCK,
)


@callback
def async_describe_events(
    hass: HomeAssistant,
    async_describe_event: Callable[[str, str, Callable[[Event], dict[str, Any]]], None],
) -> None:
    """Describe Ready Home events for the Activity / logbook UI."""

    @callback
    def _describe_expired(event: Event) -> dict[str, Any]:
        item = event.data.get("item") or {}
        name = item.get("name") or "An item"
        return {
            LOGBOOK_ENTRY_NAME: "Ready Home",
            LOGBOOK_ENTRY_MESSAGE: f"{name} expired",
            ATTR_NAME: name,
        }

    @callback
    def _describe_expiring(event: Event) -> dict[str, Any]:
        item = event.data.get("item") or {}
        name = item.get("name") or "An item"
        return {
            LOGBOOK_ENTRY_NAME: "Ready Home",
            LOGBOOK_ENTRY_MESSAGE: f"{name} is expiring soon",
            ATTR_NAME: name,
        }

    @callback
    def _describe_low_stock(event: Event) -> dict[str, Any]:
        item = event.data.get("item") or {}
        name = item.get("name") or "An item"
        return {
            LOGBOOK_ENTRY_NAME: "Ready Home",
            LOGBOOK_ENTRY_MESSAGE: f"{name} is running low",
            ATTR_NAME: name,
        }

    async_describe_event(DOMAIN, EVENT_ITEM_EXPIRED, _describe_expired)
    async_describe_event(DOMAIN, EVENT_ITEM_EXPIRING, _describe_expiring)
    async_describe_event(DOMAIN, EVENT_ITEM_LOW_STOCK, _describe_low_stock)
