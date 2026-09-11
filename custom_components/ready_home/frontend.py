"""Serve the sidebar panel bundle from a static path."""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_call_later

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

# Serve assets under /ready_home/static so they do not collide with the
# sidebar panel route at /ready_home (Nabu Casa SW fetches the panel URL).
URL_BASE = f"/{DOMAIN}/static"
# Pre-panel Lovelace card path (cleaned up on upgrade).
_LEGACY_URL_BASE = f"/{DOMAIN}"
DIST_DIR = Path(__file__).parent / "dist"
_LEGACY_CARD_FILENAME = "ready-home.js"


async def async_setup_frontend(hass: HomeAssistant) -> None:
    """Register static path once per HA run; clean up old Lovelace card resources."""
    key = f"{DOMAIN}_frontend_registered"
    if hass.data.get(key):
        return

    if not DIST_DIR.is_dir():
        _LOGGER.warning(
            "Ready Home frontend dist/ missing — run `npm run build` before using the panel"
        )
        return

    try:
        await hass.http.async_register_static_paths(
            [
                StaticPathConfig(
                    url_path=URL_BASE,
                    path=str(DIST_DIR),
                    cache_headers=False,
                )
            ]
        )
    except RuntimeError:
        _LOGGER.debug("Static path %s already registered", URL_BASE)

    await _async_remove_legacy_lovelace_resource(hass)
    hass.data[key] = True


async def _async_remove_legacy_lovelace_resource(hass: HomeAssistant) -> None:
    """Best-effort remove of the old card module resource in storage mode."""
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
                _async_remove_legacy_lovelace_resource(hass)
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

    prefixes = (
        f"{_LEGACY_URL_BASE}/{_LEGACY_CARD_FILENAME}",
        f"{URL_BASE}/{_LEGACY_CARD_FILENAME}",
    )
    for item in items:
        url = item.get("url", "")
        if not any(url.startswith(prefix) for prefix in prefixes):
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
