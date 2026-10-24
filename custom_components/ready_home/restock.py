"""Push low-stock items to a Home Assistant todo list."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError

from .models import InventoryItem

_LOGGER = logging.getLogger(__name__)

TODO_DOMAIN = "todo"
TODO_ADD_ITEM = "add_item"
TODO_GET_ITEMS = "get_items"


def restock_label(item: InventoryItem) -> str:
    """Stable shopping-list summary for an inventory item."""
    return (
        f"Restock {item.name} "
        f"({item.quantity:g}/{item.desired_quantity:g})"
    )


async def async_existing_todo_summaries(
    hass: HomeAssistant, entity_id: str
) -> set[str]:
    """Return current todo item summaries (best-effort)."""
    if not hass.services.has_service(TODO_DOMAIN, TODO_GET_ITEMS):
        return set()
    try:
        response = await hass.services.async_call(
            TODO_DOMAIN,
            TODO_GET_ITEMS,
            target={"entity_id": entity_id},
            blocking=True,
            return_response=True,
        )
    except (HomeAssistantError, TypeError, ValueError) as err:
        _LOGGER.debug("Could not read todo items from %s: %s", entity_id, err)
        return set()

    summaries: set[str] = set()
    if not isinstance(response, dict):
        return summaries
    # HA returns {entity_id: {"items": [{"summary": ...}, ...]}}
    payload = response.get(entity_id) or next(iter(response.values()), None)
    if not isinstance(payload, dict):
        return summaries
    for entry in payload.get("items") or []:
        if isinstance(entry, dict):
            summary = entry.get("summary")
            if isinstance(summary, str) and summary:
                summaries.add(summary)
    return summaries


async def async_push_items_to_todo(
    hass: HomeAssistant,
    entity_id: str,
    items: list[InventoryItem],
) -> dict[str, Any]:
    """Add restock lines for items; skip summaries already on the list."""
    if not entity_id:
        raise ServiceValidationError("todo_entity_id is required")
    if not hass.services.has_service(TODO_DOMAIN, TODO_ADD_ITEM):
        raise ServiceValidationError("Todo integration is not available")

    existing = await async_existing_todo_summaries(hass, entity_id)
    added: list[str] = []
    skipped: list[str] = []

    for item in items:
        label = restock_label(item)
        if label in existing:
            skipped.append(label)
            continue
        await hass.services.async_call(
            TODO_DOMAIN,
            TODO_ADD_ITEM,
            {"item": label},
            target={"entity_id": entity_id},
            blocking=True,
        )
        existing.add(label)
        added.append(label)

    return {
        "entity_id": entity_id,
        "added": added,
        "skipped": skipped,
        "added_count": len(added),
        "skipped_count": len(skipped),
    }
