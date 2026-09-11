"""The Ready Home integration."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

from .const import DOMAIN, PLATFORMS

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry
    from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)


def _unique_preserve(names: list[str]) -> list[str]:
    """Deduplicate names case-insensitively, preserving first-seen casing."""
    out: list[str] = []
    seen: set[str] = set()
    for name in names:
        cleaned = str(name).strip()
        if not cleaned:
            continue
        key = cleaned.lower()
        if key in seen:
            continue
        seen.add(key)
        out.append(cleaned)
    return out


def _migrate_category_mapping(
    options: dict[str, Any],
    legacy_food: set[str],
    legacy_water: set[str],
) -> dict[str, Any] | None:
    """Seed food/water category lists once when missing from options."""
    from .const import (
        CONF_CATEGORIES,
        CONF_FOOD_CATEGORIES,
        CONF_WATER_CATEGORIES,
        DEFAULT_CATEGORIES,
        DEFAULT_FOOD_CATEGORIES,
        DEFAULT_WATER_CATEGORIES,
    )

    if (
        CONF_FOOD_CATEGORIES in options
        and CONF_WATER_CATEGORIES in options
    ):
        return None

    food = list(options.get(CONF_FOOD_CATEGORIES) or DEFAULT_FOOD_CATEGORIES)
    water = list(options.get(CONF_WATER_CATEGORIES) or DEFAULT_WATER_CATEGORIES)
    food = _unique_preserve([*food, *sorted(legacy_food)])
    water = _unique_preserve([*water, *sorted(legacy_water)])

    # Drop any accidental overlap (prefer food).
    water_keys = {w.lower() for w in water}
    food = [f for f in food if f.lower() not in water_keys]

    categories = list(options.get(CONF_CATEGORIES) or DEFAULT_CATEGORIES)
    categories = _unique_preserve([*categories, *food, *water])

    updated = dict(options)
    updated[CONF_FOOD_CATEGORIES] = food
    updated[CONF_WATER_CATEGORIES] = water
    updated[CONF_CATEGORIES] = categories
    return updated


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Ready Home from a config entry."""
    from homeassistant.const import Platform

    from .const import CONF_NAME, DEFAULT_PROFILE_NAME
    from .coordinator import ReadyHomeCoordinator
    from .models import ReadinessSettings
    from .services import async_register_services
    from .store import InventoryStore

    if CONF_NAME not in entry.data:
        name = str(entry.title or DEFAULT_PROFILE_NAME).strip() or DEFAULT_PROFILE_NAME
        hass.config_entries.async_update_entry(
            entry, data={**dict(entry.data), CONF_NAME: name}
        )

    store = InventoryStore(hass, entry.entry_id)
    await store.async_load()

    options = dict(entry.options)
    migrated = _migrate_category_mapping(
        options, store.legacy_food_categories, store.legacy_water_categories
    )
    if migrated is not None:
        hass.config_entries.async_update_entry(entry, options=migrated)
        options = migrated
        _LOGGER.info(
            "Migrated Ready Home category mapping for entry %s", entry.entry_id
        )

    settings = ReadinessSettings.from_options(options)
    coordinator = ReadyHomeCoordinator(hass, store, settings)
    coordinator.entry_id = entry.entry_id
    # Store already loaded; coordinator.async_setup must not load again.
    await coordinator.async_setup(skip_store_load=True)

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = coordinator

    async_register_services(hass)

    from .panel import async_setup_panel
    from .websocket_api import async_register_websocket

    async_register_websocket(hass)
    await async_setup_panel(hass)

    entry.async_on_unload(entry.add_update_listener(_async_update_listener))

    await hass.config_entries.async_forward_entry_setups(
        entry, [Platform(p) for p in PLATFORMS]
    )
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    from homeassistant.const import Platform

    from .coordinator import ReadyHomeCoordinator
    from .panel import async_unregister_panel
    from .services import async_unregister_services

    unload_ok = await hass.config_entries.async_unload_platforms(
        entry, [Platform(p) for p in PLATFORMS]
    )
    if unload_ok:
        coordinator: ReadyHomeCoordinator = hass.data[DOMAIN].pop(entry.entry_id)
        await coordinator.async_shutdown()
        if not hass.data[DOMAIN]:
            async_unregister_services(hass)
            async_unregister_panel(hass)
            hass.data.pop(DOMAIN, None)
    return unload_ok


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle options update."""
    from .coordinator import ReadyHomeCoordinator
    from .models import ReadinessSettings

    coordinator: ReadyHomeCoordinator = hass.data[DOMAIN][entry.entry_id]
    coordinator.update_settings(ReadinessSettings.from_options(dict(entry.options)))
