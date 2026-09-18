"""Service actions for Ready Home inventory mutations."""

from __future__ import annotations

import logging
import math
from datetime import date
from typing import Any

import voluptuous as vol
from homeassistant.core import HomeAssistant, ServiceCall, SupportsResponse, callback
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv

from .attention import expiry_severity, item_summary
from .auth import async_require_admin_or_automation
from .barcode import is_valid_barcode, lookup_product
from .const import ATTR_CONFIG_ENTRY_ID, DOMAIN, MAX_INVENTORY_ITEMS
from .helpers import entry_id_from_call_data, get_coordinator
from .models import (
    ContentsUnit,
    InventoryItem,
    InventoryPriority,
    InventoryUnit,
)

_LOGGER = logging.getLogger(__name__)

SERVICE_ADD_ITEM = "add_item"
SERVICE_UPDATE_ITEM = "update_item"
SERVICE_ADJUST_QUANTITY = "adjust_quantity"
SERVICE_REMOVE_ITEM = "remove_item"
SERVICE_LIST_ITEMS = "list_items"
SERVICE_LOOKUP_BARCODE = "lookup_barcode"

ATTR_ITEM_ID = "item_id"
ATTR_NAME = "name"
ATTR_QUANTITY = "quantity"
ATTR_DESIRED_QUANTITY = "desired_quantity"
ATTR_UNIT = "unit"
ATTR_LOCATION = "location"
ATTR_CATEGORY = "category"
ATTR_NOTES = "notes"
ATTR_BARCODE = "barcode"
ATTR_PRIORITY = "priority"
ATTR_EXPIRY_DATE = "expiry_date"
ATTR_LITERS_PER_UNIT = "liters_per_unit"
ATTR_CALORIES_PER_UNIT = "calories_per_unit"
ATTR_CONTENTS_PER_UNIT = "contents_per_unit"
ATTR_CONTENTS_UNIT = "contents_unit"
ATTR_CALORIES_PER_CONTENT = "calories_per_content"
ATTR_DELTA = "delta"
ATTR_STATUS = "status"
ATTR_READINESS = "readiness"

_MAX_NUMERIC = 1e9
_MAX_NAME = 200
_MAX_LOCATION = 100
_MAX_CATEGORY = 100
_MAX_NOTES = 2000


def _resolve_item(
    coordinator: Any,
    item_id: str | None,
    name: str | None,
) -> InventoryItem:
    if item_id:
        item = coordinator.store.get(item_id)
        if item is None:
            raise ServiceValidationError(f"Unknown item_id: {item_id}")
        return item
    if name:
        item = coordinator.store.find_by_name(name)
        if item is None:
            raise ServiceValidationError(f"Unknown or ambiguous name: {name}")
        return item
    raise ServiceValidationError("Provide item_id or name")


def _finite_non_negative(value: Any) -> float:
    """Coerce to a finite float in [0, _MAX_NUMERIC]."""
    try:
        number = float(value)
    except (TypeError, ValueError) as err:
        raise vol.Invalid("expected a number") from err
    if not math.isfinite(number):
        raise vol.Invalid("must be a finite number")
    if number < 0 or number > _MAX_NUMERIC:
        raise vol.Invalid(f"must be between 0 and {_MAX_NUMERIC:g}")
    return number


def _finite_delta(value: Any) -> float:
    """Coerce adjust delta to a finite float within ±_MAX_NUMERIC."""
    try:
        number = float(value)
    except (TypeError, ValueError) as err:
        raise vol.Invalid("expected a number") from err
    if not math.isfinite(number):
        raise vol.Invalid("must be a finite number")
    if abs(number) > _MAX_NUMERIC:
        raise vol.Invalid(f"must be between -{_MAX_NUMERIC:g} and {_MAX_NUMERIC:g}")
    return number


def _optional_finite_non_negative(value: Any) -> float | None:
    if value is None or value == "":
        return None
    return _finite_non_negative(value)


def _bounded_string(max_length: int):
    """Return a voluptuous validator for a bounded string."""

    def validator(value: Any) -> str:
        text = cv.string(value)
        if len(text) > max_length:
            raise vol.Invalid(f"must be at most {max_length} characters")
        return text

    return validator


def _expiry_date(value: Any) -> str | None:
    """Accept None/empty or a valid YYYY-MM-DD date string."""
    if value is None or value == "":
        return None
    text = cv.string(value).strip()
    if not text:
        return None
    try:
        return date.fromisoformat(text).isoformat()
    except ValueError as err:
        raise vol.Invalid("expiry_date must be YYYY-MM-DD") from err


def _item_barcode(value: Any) -> str:
    """Accept empty or a barcode matching the OFF allowlist."""
    text = cv.string(value).strip()
    if not text:
        return ""
    if not is_valid_barcode(text):
        raise vol.Invalid(
            "barcode must be 4–32 alphanumeric characters"
        )
    return text


def required_barcode(value: Any) -> str:
    """Accept a non-empty barcode matching the OFF allowlist."""
    text = cv.string(value).strip()
    if not is_valid_barcode(text):
        raise vol.Invalid(
            "barcode must be 4–32 alphanumeric characters"
        )
    return text


ADD_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_NAME): _bounded_string(_MAX_NAME),
        vol.Required(ATTR_QUANTITY): _finite_non_negative,
        vol.Optional(ATTR_DESIRED_QUANTITY, default=0): _finite_non_negative,
        vol.Optional(ATTR_UNIT, default=InventoryUnit.PIECE.value): vol.In(
            [u.value for u in InventoryUnit]
        ),
        vol.Optional(ATTR_LOCATION, default=""): _bounded_string(_MAX_LOCATION),
        vol.Optional(ATTR_CATEGORY, default=""): _bounded_string(_MAX_CATEGORY),
        vol.Optional(ATTR_NOTES, default=""): _bounded_string(_MAX_NOTES),
        vol.Optional(ATTR_BARCODE, default=""): _item_barcode,
        vol.Optional(ATTR_PRIORITY, default=InventoryPriority.IMPORTANT.value): vol.In(
            [p.value for p in InventoryPriority]
        ),
        vol.Optional(ATTR_EXPIRY_DATE): _expiry_date,
        vol.Optional(ATTR_CONTENTS_PER_UNIT): _optional_finite_non_negative,
        vol.Optional(ATTR_CONTENTS_UNIT): vol.Any(
            None, vol.In([u.value for u in ContentsUnit])
        ),
        vol.Optional(ATTR_CALORIES_PER_CONTENT): _optional_finite_non_negative,
        vol.Optional(ATTR_LITERS_PER_UNIT): _optional_finite_non_negative,
        vol.Optional(ATTR_CALORIES_PER_UNIT): _optional_finite_non_negative,
        vol.Optional(ATTR_CONFIG_ENTRY_ID): cv.string,
    }
)

UPDATE_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_ITEM_ID): cv.string,
        vol.Optional(ATTR_NAME): _bounded_string(_MAX_NAME),
        vol.Optional("new_name"): _bounded_string(_MAX_NAME),
        vol.Optional(ATTR_QUANTITY): _finite_non_negative,
        vol.Optional(ATTR_DESIRED_QUANTITY): _finite_non_negative,
        vol.Optional(ATTR_UNIT): vol.In([u.value for u in InventoryUnit]),
        vol.Optional(ATTR_LOCATION): _bounded_string(_MAX_LOCATION),
        vol.Optional(ATTR_CATEGORY): _bounded_string(_MAX_CATEGORY),
        vol.Optional(ATTR_NOTES): _bounded_string(_MAX_NOTES),
        vol.Optional(ATTR_BARCODE): _item_barcode,
        vol.Optional(ATTR_PRIORITY): vol.In([p.value for p in InventoryPriority]),
        vol.Optional(ATTR_EXPIRY_DATE): _expiry_date,
        vol.Optional(ATTR_CONTENTS_PER_UNIT): _optional_finite_non_negative,
        vol.Optional(ATTR_CONTENTS_UNIT): vol.Any(
            None, "", vol.In([u.value for u in ContentsUnit])
        ),
        vol.Optional(ATTR_CALORIES_PER_CONTENT): _optional_finite_non_negative,
        vol.Optional(ATTR_LITERS_PER_UNIT): _optional_finite_non_negative,
        vol.Optional(ATTR_CALORIES_PER_UNIT): _optional_finite_non_negative,
        vol.Optional(ATTR_CONFIG_ENTRY_ID): cv.string,
    }
)

ADJUST_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_ITEM_ID): cv.string,
        vol.Optional(ATTR_NAME): _bounded_string(_MAX_NAME),
        vol.Required(ATTR_DELTA): _finite_delta,
        vol.Optional(ATTR_CONFIG_ENTRY_ID): cv.string,
    }
)

REMOVE_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_ITEM_ID): cv.string,
        vol.Optional(ATTR_NAME): _bounded_string(_MAX_NAME),
        vol.Optional(ATTR_CONFIG_ENTRY_ID): cv.string,
    }
)

LIST_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_LOCATION): _bounded_string(_MAX_LOCATION),
        vol.Optional(ATTR_CATEGORY): _bounded_string(_MAX_CATEGORY),
        vol.Optional(ATTR_READINESS): vol.In(["food", "water", "none"]),
        vol.Optional(ATTR_STATUS): vol.In(
            ["expired", "expiring", "low_stock", "ok"]
        ),
        vol.Optional(ATTR_CONFIG_ENTRY_ID): cv.string,
    }
)

LOOKUP_SCHEMA = vol.Schema({
    vol.Required(ATTR_BARCODE): required_barcode,
    vol.Optional(ATTR_CONFIG_ENTRY_ID): cv.string,
})


def _matches_status(
    status: str, item: InventoryItem, severity: str | None
) -> bool:
    """Return True if the item matches the list_items status filter."""
    if status == "expired":
        return severity == "expired"
    if status == "expiring":
        return severity in ("within_urgent", "within_expiring")
    if status == "low_stock":
        return item.is_low_stock()
    if status == "ok":
        return severity is None and not item.is_low_stock()
    return False


@callback
def async_register_services(hass: HomeAssistant) -> None:
    """Register Ready Home services once."""
    if hass.services.has_service(DOMAIN, SERVICE_ADD_ITEM):
        return

    async def handle_add(call: ServiceCall) -> dict[str, Any]:
        await async_require_admin_or_automation(hass, call.context.user_id)
        data = ADD_SCHEMA(dict(call.data))
        coordinator = get_coordinator(hass, config_entry_id=entry_id_from_call_data(data))
        if len(coordinator.store.items) >= MAX_INVENTORY_ITEMS:
            raise ServiceValidationError(
                f"Inventory is full (max {MAX_INVENTORY_ITEMS} items)"
            )
        item = InventoryItem(
            name=data[ATTR_NAME],
            quantity=data[ATTR_QUANTITY],
            desired_quantity=data.get(ATTR_DESIRED_QUANTITY, 0),
            unit=InventoryUnit(data.get(ATTR_UNIT, InventoryUnit.PIECE)),
            location=data.get(ATTR_LOCATION, ""),
            category=data.get(ATTR_CATEGORY, ""),
            notes=data.get(ATTR_NOTES, ""),
            barcode=data.get(ATTR_BARCODE, ""),
            priority=InventoryPriority(
                data.get(ATTR_PRIORITY, InventoryPriority.IMPORTANT)
            ),
            expiry_date=data.get(ATTR_EXPIRY_DATE),
            contents_per_unit=data.get(ATTR_CONTENTS_PER_UNIT),
            contents_unit=(
                ContentsUnit(data[ATTR_CONTENTS_UNIT])
                if data.get(ATTR_CONTENTS_UNIT)
                else None
            ),
            calories_per_content=data.get(ATTR_CALORIES_PER_CONTENT),
            liters_per_unit=data.get(ATTR_LITERS_PER_UNIT),
            calories_per_unit=data.get(ATTR_CALORIES_PER_UNIT),
        ).with_synced_derived()
        await coordinator.store.async_add(item)
        return {"item_id": item.id, "item": item_summary(item)}

    async def handle_update(call: ServiceCall) -> dict[str, Any]:
        await async_require_admin_or_automation(hass, call.context.user_id)
        data = UPDATE_SCHEMA(dict(call.data))
        coordinator = get_coordinator(hass, config_entry_id=entry_id_from_call_data(data))
        item = _resolve_item(
            coordinator, data.get(ATTR_ITEM_ID), data.get(ATTR_NAME)
        )
        changes: dict[str, Any] = {}
        field_map = {
            "new_name": "name",
            ATTR_QUANTITY: "quantity",
            ATTR_DESIRED_QUANTITY: "desired_quantity",
            ATTR_UNIT: "unit",
            ATTR_LOCATION: "location",
            ATTR_CATEGORY: "category",
            ATTR_NOTES: "notes",
            ATTR_BARCODE: "barcode",
            ATTR_PRIORITY: "priority",
            ATTR_EXPIRY_DATE: "expiry_date",
            ATTR_CONTENTS_PER_UNIT: "contents_per_unit",
            ATTR_CONTENTS_UNIT: "contents_unit",
            ATTR_CALORIES_PER_CONTENT: "calories_per_content",
            ATTR_LITERS_PER_UNIT: "liters_per_unit",
            ATTR_CALORIES_PER_UNIT: "calories_per_unit",
        }
        for src, dest in field_map.items():
            if src in data:
                changes[dest] = data[src]
        if not changes:
            raise ServiceValidationError("No fields to update")
        updated = item.with_updates(**changes)
        await coordinator.store.async_update(updated)
        return {"item_id": updated.id, "item": item_summary(updated)}

    async def handle_adjust(call: ServiceCall) -> dict[str, Any]:
        await async_require_admin_or_automation(hass, call.context.user_id)
        data = ADJUST_SCHEMA(dict(call.data))
        coordinator = get_coordinator(hass, config_entry_id=entry_id_from_call_data(data))
        item = _resolve_item(
            coordinator, data.get(ATTR_ITEM_ID), data.get(ATTR_NAME)
        )
        new_qty = float(item.quantity) + float(data[ATTR_DELTA])
        if new_qty < 0:
            raise ServiceValidationError("Quantity cannot go below zero")
        updated = item.with_updates(quantity=new_qty)
        await coordinator.store.async_update(updated)
        return {"item_id": updated.id, "item": item_summary(updated)}

    async def handle_remove(call: ServiceCall) -> dict[str, Any]:
        await async_require_admin_or_automation(hass, call.context.user_id)
        data = REMOVE_SCHEMA(dict(call.data))
        coordinator = get_coordinator(hass, config_entry_id=entry_id_from_call_data(data))
        item = _resolve_item(
            coordinator, data.get(ATTR_ITEM_ID), data.get(ATTR_NAME)
        )
        removed = await coordinator.store.async_remove(item.id)
        return {"item_id": item.id, "removed": removed is not None}

    async def handle_list(call: ServiceCall) -> dict[str, Any]:
        data = LIST_SCHEMA(dict(call.data))
        coordinator = get_coordinator(hass, config_entry_id=entry_id_from_call_data(data))
        settings = coordinator.settings
        items = list(coordinator.store.items)

        if loc := data.get(ATTR_LOCATION):
            items = [i for i in items if i.location.lower() == loc.lower()]
        if cat := data.get(ATTR_CATEGORY):
            items = [i for i in items if i.category.lower() == cat.lower()]
        if readiness := data.get(ATTR_READINESS):
            items = [
                i
                for i in items
                if settings.readiness_kind(i.category) == readiness
            ]
        if status := data.get(ATTR_STATUS):
            filtered: list[InventoryItem] = []
            for item in items:
                severity = expiry_severity(
                    item,
                    urgent_days=settings.urgent_days,
                    expiring_days=settings.expiring_days,
                )
                if _matches_status(status, item, severity):
                    filtered.append(item)
            items = filtered

        return {
            "count": len(items),
            "items": [item_summary(i) for i in items],
        }

    async def handle_lookup(call: ServiceCall) -> dict[str, Any]:
        await async_require_admin_or_automation(hass, call.context.user_id)
        data = LOOKUP_SCHEMA(dict(call.data))
        rate_key = call.context.user_id or "automation"
        result = await lookup_product(
            hass, data[ATTR_BARCODE], rate_key=rate_key
        )
        if result is None:
            return {"found": False, "barcode": data[ATTR_BARCODE]}
        return {"found": True, **result}

    hass.services.async_register(
        DOMAIN,
        SERVICE_ADD_ITEM,
        handle_add,
        schema=ADD_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_UPDATE_ITEM,
        handle_update,
        schema=UPDATE_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_ADJUST_QUANTITY,
        handle_adjust,
        schema=ADJUST_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_REMOVE_ITEM,
        handle_remove,
        schema=REMOVE_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_LIST_ITEMS,
        handle_list,
        schema=LIST_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_LOOKUP_BARCODE,
        handle_lookup,
        schema=LOOKUP_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )


def async_unregister_services(hass: HomeAssistant) -> None:
    """Remove services when the last entry unloads."""
    for service in (
        SERVICE_ADD_ITEM,
        SERVICE_UPDATE_ITEM,
        SERVICE_ADJUST_QUANTITY,
        SERVICE_REMOVE_ITEM,
        SERVICE_LIST_ITEMS,
        SERVICE_LOOKUP_BARCODE,
    ):
        if hass.services.has_service(DOMAIN, service):
            hass.services.async_remove(DOMAIN, service)
