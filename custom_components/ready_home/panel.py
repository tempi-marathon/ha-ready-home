"""Sidebar panel registration for Ready Home."""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import (
    BRAND_URL_PATH,
    DOMAIN,
    PANEL_FILENAME,
    PANEL_ICON,
    PANEL_MODULE_URL,
    PANEL_TITLE,
    PANEL_URL_PATH,
    PANEL_WEBCOMPONENT,
    VERSION,
)

_LOGGER = logging.getLogger(__name__)

_PANEL_KEY = f"{DOMAIN}_panel_registered"
DIST_DIR = Path(__file__).parent / "dist"
BRAND_DIR = Path(__file__).parent / "brand"


async def async_setup_panel(hass: HomeAssistant) -> None:
    """Serve the panel JS as a single file and register the sidebar panel.

    The SPA route is ``/ready_home``; the module is served from
    ``/api/panel_custom/ready_home`` so those URLs never collide (important for
    Nabu Casa service-worker fetches of the panel route). Brand assets are
    served from ``/api/ready_home/brand``.
    """
    if hass.data.get(_PANEL_KEY):
        return

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

    static_paths = [
        StaticPathConfig(
            url_path=PANEL_MODULE_URL,
            path=str(panel_path),
            cache_headers=False,
        )
    ]
    if BRAND_DIR.is_dir():
        static_paths.append(
            StaticPathConfig(
                url_path=BRAND_URL_PATH,
                path=str(BRAND_DIR),
                cache_headers=True,
            )
        )

    try:
        await hass.http.async_register_static_paths(static_paths)
    except RuntimeError:
        _LOGGER.debug("Static paths already registered for Ready Home panel")

    from .frontend import async_cleanup_legacy_lovelace_resource

    await async_cleanup_legacy_lovelace_resource(hass)

    module_url = f"{PANEL_MODULE_URL}?v={VERSION}&m={cache_bust}"

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
        config_panel_domain=DOMAIN,
    )
    hass.data[_PANEL_KEY] = True
    _LOGGER.info("Registered Ready Home sidebar panel (%s)", module_url)


def async_unregister_panel(hass: HomeAssistant) -> None:
    """Remove the sidebar panel when the last config entry unloads."""
    if hass.data.pop(_PANEL_KEY, None):
        return
    frontend.async_remove_panel(hass, PANEL_URL_PATH)
    _LOGGER.debug("Removed Ready Home sidebar panel")
