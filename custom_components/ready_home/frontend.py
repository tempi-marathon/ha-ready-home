"""Legacy Lovelace card resource cleanup."""

from __future__ import annotations

import logging

from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_call_later

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

# Historical paths used before the sidebar panel (directory mounts).
_LEGACY_CARD_PREFIXES = (
    f"/{DOMAIN}/ready-home.js",
    f"/{DOMAIN}/static/ready-home.js",
)


async def async_cleanup_legacy_lovelace_resource(hass: HomeAssistant) -> None:
    """Best-effort remove of the old Lovelace card module resource in storage mode."""
    try:
        lovelace = hass.data.get("lovelace")
    except Exception:  # noqa: BLE001
        lovelace = None

    if lovelace is None:
        _LOGGER.debug("Lovelace not ready yet; retrying legacy resource cleanup")
        async_call_later(
            hass,
            5,
            lambda _now: hass.async_create_task(
                async_cleanup_legacy_lovelace_resource(hass)
            ),
        )
        return

    mode = getattr(lovelace, "mode", None) or getattr(lovelace, "resource_mode", None)
    if mode != "storage":
        return

    resources = getattr(lovelace, "resources", None)
    if resources is None:
        return

    if hasattr(resources, "async_load") and not getattr(resources, "loaded", False):
        try:
            await resources.async_load()
        except Exception:  # noqa: BLE001
            _LOGGER.exception("Failed to load Lovelace resources for cleanup")
            return

    try:
        items = list(resources.async_items())
    except Exception:  # noqa: BLE001
        _LOGGER.exception("Failed to list Lovelace resources for cleanup")
        return

    for item in items:
        url = item.get("url", "")
        if not any(url.startswith(prefix) for prefix in _LEGACY_CARD_PREFIXES):
            continue
        item_id = item.get("id")
        if item_id is None:
            continue
        try:
            await resources.async_delete_item(item_id)
            _LOGGER.info("Removed legacy Ready Home Lovelace resource: %s", url)
        except Exception:  # noqa: BLE001
            _LOGGER.exception(
                "Failed to remove legacy Ready Home Lovelace resource: %s", url
            )
