"""Serve Lovelace card bundle and register the resource."""

from __future__ import annotations

import json
import logging
from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_call_later

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

URL_BASE = f"/{DOMAIN}"
DIST_DIR = Path(__file__).parent / "dist"
CARD_FILENAME = "ready-home.js"


def _version() -> str:
    manifest = Path(__file__).parent / "manifest.json"
    try:
        return json.loads(manifest.read_text(encoding="utf-8")).get("version", "0")
    except OSError:
        return "0"


async def async_setup_frontend(hass: HomeAssistant) -> None:
    """Register static path and Lovelace resource once per HA run."""
    key = f"{DOMAIN}_frontend_registered"
    if hass.data.get(key):
        return

    if not DIST_DIR.is_dir():
        _LOGGER.warning(
            "Ready Home frontend dist/ missing — run `npm run build` before using cards"
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

    await _async_register_lovelace_resource(hass)
    hass.data[key] = True


async def _async_register_lovelace_resource(hass: HomeAssistant) -> None:
    """Add or update the module resource in Lovelace storage mode."""
    version = _version()
    wanted_url = f"{URL_BASE}/{CARD_FILENAME}?v={version}"

    try:
        lovelace = hass.data.get("lovelace")
    except Exception:  # noqa: BLE001
        lovelace = None

    if lovelace is None:
        _LOGGER.debug("Lovelace not ready yet; retrying resource registration")
        async_call_later(hass, 5, lambda _now: hass.async_create_task(
            _async_register_lovelace_resource(hass)
        ))
        return

    mode = getattr(lovelace, "mode", None) or getattr(lovelace, "resource_mode", None)
    if mode != "storage":
        _LOGGER.info(
            "Lovelace is not in storage mode — add this resource manually: %s",
            wanted_url,
        )
        return

    resources = getattr(lovelace, "resources", None)
    if resources is None:
        _LOGGER.warning("Lovelace resources unavailable")
        return

    # Ensure collection is loaded before mutating (avoids wiping lovelace_resources)
    if hasattr(resources, "async_load") and not getattr(resources, "loaded", False):
        try:
            await resources.async_load()
        except Exception:  # noqa: BLE001
            _LOGGER.exception("Failed to load Lovelace resources")
            return

    try:
        items = list(resources.async_items())
    except Exception:  # noqa: BLE001
        _LOGGER.exception("Failed to list Lovelace resources")
        return

    existing = None
    for item in items:
        url = item.get("url", "")
        if url.startswith(f"{URL_BASE}/{CARD_FILENAME}"):
            existing = item
            break

    try:
        if existing is None:
            await resources.async_create_item(
                {"res_type": "module", "url": wanted_url}
            )
            _LOGGER.info("Registered Ready Home Lovelace resource: %s", wanted_url)
        elif existing.get("url") != wanted_url:
            await resources.async_update_item(
                existing["id"], {"res_type": "module", "url": wanted_url}
            )
            _LOGGER.info("Updated Ready Home Lovelace resource: %s", wanted_url)
    except Exception:  # noqa: BLE001
        _LOGGER.exception("Failed to register Ready Home Lovelace resource")
