"""Websocket API for Ready Home (reads + subscribe)."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .attention import item_summary
from .barcode import lookup_product
from .const import ATTR_CONFIG_ENTRY_ID, DOMAIN
from .coordinator import ReadyHomeCoordinator, ReadyHomeData
from .helpers import get_coordinator


_LOGGER = logging.getLogger(__name__)

_OPTIONAL_ENTRY = {vol.Optional(ATTR_CONFIG_ENTRY_ID): str}


def _coordinator(hass: HomeAssistant, msg: dict[str, Any]) -> ReadyHomeCoordinator:
    return get_coordinator(
        hass, config_entry_id=msg.get(ATTR_CONFIG_ENTRY_ID) or None
    )


def _assessment_dict(data: ReadyHomeData) -> dict[str, Any]:
    a = data.assessment
    return {
        "needs_people_count": a.needs_people_count,
        "water_on_hand": a.water_on_hand,
        "water_target": a.water_target,
        "water_percent": a.water_percent,
        "food_on_hand": a.food_on_hand,
        "food_target": a.food_target,
        "food_percent": a.food_percent,
        "overall_percent": a.overall_percent,
        "duration_hours": a.duration_hours,
        "water_supply_hours": a.water_supply_hours,
        "food_supply_hours": a.food_supply_hours,
        "supply_hours": a.supply_hours,
        "unmeasurable_water_count": a.unmeasurable_water_count,
        "unmeasurable_food_count": a.unmeasurable_food_count,
    }


def _buckets_dict(data: ReadyHomeData) -> dict[str, Any]:
    b = data.buckets
    return {
        "expired": [item_summary(i) for i in b.expired],
        "within_urgent": [item_summary(i) for i in b.within_urgent],
        "within_expiring": [item_summary(i) for i in b.within_expiring],
        "low_stock": [item_summary(i) for i in b.low_stock],
    }


def _snapshot(coordinator: ReadyHomeCoordinator) -> dict[str, Any]:
    data = coordinator.data
    if data is None:
        return {"items": [], "assessment": {}, "buckets": {}}
    return {
        "items": [item.to_dict() for item in data.items],
        "assessment": _assessment_dict(data),
        "buckets": _buckets_dict(data),
    }


def _settings_dict(coordinator: ReadyHomeCoordinator) -> dict[str, Any]:
    s = coordinator.settings
    return {
        "number_of_people": s.number_of_people,
        "duration_hours": s.duration_hours,
        "water_liters_per_person_per_day": s.water_liters_per_person_per_day,
        "calories_per_person_per_day": s.calories_per_person_per_day,
        "locations": list(s.locations),
        "categories": list(s.categories),
        "expiring_days": s.expiring_days,
        "urgent_days": s.urgent_days,
        "attribute_item_cap": s.attribute_item_cap,
    }


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/items/list", **_OPTIONAL_ENTRY}
)
@websocket_api.async_response
async def ws_items_list(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """Return full inventory snapshot."""
    coordinator = _coordinator(hass, msg)
    connection.send_result(msg["id"], _snapshot(coordinator))


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/settings", **_OPTIONAL_ENTRY}
)
@websocket_api.async_response
async def ws_settings(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """Return readiness settings and reference lists."""
    coordinator = _coordinator(hass, msg)
    connection.send_result(msg["id"], _settings_dict(coordinator))


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/subscribe", **_OPTIONAL_ENTRY}
)
@websocket_api.async_response
async def ws_subscribe(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """Subscribe to inventory changes; push snapshot on each update."""
    coordinator = _coordinator(hass, msg)
    subscription_id = msg["id"]

    @callback
    def _push() -> None:
        connection.send_message(
            websocket_api.event_message(subscription_id, _snapshot(coordinator))
        )

    # Immediate snapshot
    connection.send_result(subscription_id)
    _push()

    unsubscribe = coordinator.store.async_add_listener(_push)
    connection.subscriptions[subscription_id] = unsubscribe


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/barcode/lookup",
        vol.Required("barcode"): str,
    }
)
@websocket_api.async_response
async def ws_barcode_lookup(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """Look up a barcode via Open Food Facts."""
    result = await lookup_product(hass, msg["barcode"])
    if result is None:
        connection.send_error(msg["id"], "not_found", "Product not found")
        return
    connection.send_result(msg["id"], result)


@callback
def async_register_websocket(hass: HomeAssistant) -> None:
    """Register websocket commands once."""
    key = f"{DOMAIN}_ws_registered"
    if hass.data.get(key):
        return
    websocket_api.async_register_command(hass, ws_items_list)
    websocket_api.async_register_command(hass, ws_settings)
    websocket_api.async_register_command(hass, ws_subscribe)
    websocket_api.async_register_command(hass, ws_barcode_lookup)
    hass.data[key] = True
