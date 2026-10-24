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
    EVENT_ITEM_EXPIRED_CLEARED,
    EVENT_ITEM_EXPIRING,
    EVENT_ITEM_EXPIRING_CLEARED,
    EVENT_ITEM_LOW_STOCK,
    EVENT_ITEM_LOW_STOCK_CLEARED,
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

    @callback
    def _describe_expired_cleared(event: Event) -> dict[str, Any]:
        item = event.data.get("item") or {}
        name = item.get("name") or "An item"
        return {
            LOGBOOK_ENTRY_NAME: "Ready Home",
            LOGBOOK_ENTRY_MESSAGE: f"{name} is no longer expired",
            ATTR_NAME: name,
        }

    @callback
    def _describe_expiring_cleared(event: Event) -> dict[str, Any]:
        item = event.data.get("item") or {}
        name = item.get("name") or "An item"
        return {
            LOGBOOK_ENTRY_NAME: "Ready Home",
            LOGBOOK_ENTRY_MESSAGE: f"{name} is no longer expiring soon",
            ATTR_NAME: name,
        }

    @callback
    def _describe_low_stock_cleared(event: Event) -> dict[str, Any]:
        item = event.data.get("item") or {}
        name = item.get("name") or "An item"
        return {
            LOGBOOK_ENTRY_NAME: "Ready Home",
            LOGBOOK_ENTRY_MESSAGE: f"{name} is no longer low stock",
            ATTR_NAME: name,
        }

    async_describe_event(DOMAIN, EVENT_ITEM_EXPIRED, _describe_expired)
    async_describe_event(DOMAIN, EVENT_ITEM_EXPIRING, _describe_expiring)
    async_describe_event(DOMAIN, EVENT_ITEM_LOW_STOCK, _describe_low_stock)
    async_describe_event(DOMAIN, EVENT_ITEM_EXPIRED_CLEARED, _describe_expired_cleared)
    async_describe_event(
        DOMAIN, EVENT_ITEM_EXPIRING_CLEARED, _describe_expiring_cleared
    )
    async_describe_event(
        DOMAIN, EVENT_ITEM_LOW_STOCK_CLEARED, _describe_low_stock_cleared
    )
