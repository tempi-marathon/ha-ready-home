"""The Ready Home integration."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from .const import DOMAIN, PLATFORMS

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Ready Home from a config entry."""
    from homeassistant.const import Platform

    from .coordinator import ReadyHomeCoordinator
    from .models import ReadinessSettings
    from .services import async_register_services
    from .store import InventoryStore

    store = InventoryStore(hass)
    settings = ReadinessSettings.from_options(dict(entry.options))
    coordinator = ReadyHomeCoordinator(hass, store, settings)
    await coordinator.async_setup()

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = coordinator

    async_register_services(hass)

    from .frontend import async_setup_frontend
    from .websocket_api import async_register_websocket

    async_register_websocket(hass)
    await async_setup_frontend(hass)

    entry.async_on_unload(entry.add_update_listener(_async_update_listener))

    await hass.config_entries.async_forward_entry_setups(
        entry, [Platform(p) for p in PLATFORMS]
    )
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    from homeassistant.const import Platform

    from .coordinator import ReadyHomeCoordinator
    from .services import async_unregister_services

    unload_ok = await hass.config_entries.async_unload_platforms(
        entry, [Platform(p) for p in PLATFORMS]
    )
    if unload_ok:
        coordinator: ReadyHomeCoordinator = hass.data[DOMAIN].pop(entry.entry_id)
        await coordinator.async_shutdown()
        if not hass.data[DOMAIN]:
            async_unregister_services(hass)
            hass.data.pop(DOMAIN, None)
    return unload_ok


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle options update."""
    from .coordinator import ReadyHomeCoordinator
    from .models import ReadinessSettings

    coordinator: ReadyHomeCoordinator = hass.data[DOMAIN][entry.entry_id]
    coordinator.update_settings(ReadinessSettings.from_options(dict(entry.options)))
