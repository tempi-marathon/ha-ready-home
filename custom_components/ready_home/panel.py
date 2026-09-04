"""Sidebar panel registration for Ready Home."""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.core import HomeAssistant

from .const import (
    DOMAIN,
    PANEL_FILENAME,
    PANEL_ICON,
    PANEL_TITLE,
    PANEL_URL_PATH,
    PANEL_WEBCOMPONENT,
    VERSION,
)
from .frontend import URL_BASE, async_setup_frontend

_LOGGER = logging.getLogger(__name__)

_PANEL_KEY = f"{DOMAIN}_panel_registered"
DIST_DIR = Path(__file__).parent / "dist"


async def async_setup_panel(hass: HomeAssistant) -> None:
    """Serve frontend assets and register the sidebar panel once."""
    if hass.data.get(_PANEL_KEY):
        return

    await async_setup_frontend(hass)

    panel_path = DIST_DIR / PANEL_FILENAME
    if not panel_path.is_file():
        _LOGGER.warning(
            "Ready Home panel bundle missing (%s) — run `npm run build`",
            panel_path,
        )
        return

    try:
        cache_bust = int(panel_path.stat().st_mtime)
    except OSError:
        cache_bust = 0

    module_url = f"{URL_BASE}/{PANEL_FILENAME}?v={VERSION}&m={cache_bust}"

    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_URL_PATH,
        webcomponent_name=PANEL_WEBCOMPONENT,
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        module_url=module_url,
        embed_iframe=False,
        require_admin=False,
        config={},
    )
    hass.data[_PANEL_KEY] = True
    _LOGGER.info("Registered Ready Home sidebar panel (%s)", module_url)


def async_unregister_panel(hass: HomeAssistant) -> None:
    """Remove the sidebar panel when the last config entry unloads."""
    if not hass.data.pop(_PANEL_KEY, None):
        return
    frontend.async_remove_panel(hass, PANEL_URL_PATH)
    _LOGGER.debug("Removed Ready Home sidebar panel")
