"""Shared helpers for Ready Home coordinators and profile metadata."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo

from .const import CONF_NAME, DEFAULT_PROFILE_NAME, DOMAIN, VERSION, storage_key_for_entry

if TYPE_CHECKING:
    from .coordinator import ReadyHomeCoordinator

_GENERIC_PROFILES = frozenset({"home", "ready home"})


def profile_name(entry: ConfigEntry) -> str:
    """Return the display name for a config entry / readiness profile."""
    return str(entry.data.get(CONF_NAME) or entry.title or DEFAULT_PROFILE_NAME)


def device_name(entry: ConfigEntry) -> str:
    """Return the service/device name shown in HA entity pickers.

    Generic profiles (Home / Ready Home) brand as Ready Home so the Add card
    flow is discoverable. Other profiles keep a Ready Home prefix with the
    profile as a suffix, e.g. Ready Home (Cabin).
    """
    name = profile_name(entry).strip()
    if not name or name.casefold() in _GENERIC_PROFILES:
        return DEFAULT_PROFILE_NAME
    return f"{DEFAULT_PROFILE_NAME} ({name})"


def device_info_for_entry(entry: ConfigEntry) -> DeviceInfo:
    """Shared DeviceInfo for Ready Home sensor platforms."""
    return DeviceInfo(
        identifiers={(DOMAIN, entry.entry_id)},
        name=device_name(entry),
        manufacturer="Ready Home",
        model="Emergency inventory",
        sw_version=VERSION,
        entry_type=DeviceEntryType.SERVICE,
    )


# Re-export for callers that imported storage_key_for_entry from helpers.
__all__ = [
    "device_info_for_entry",
    "device_name",
    "entry_id_from_call_data",
    "get_coordinator",
    "profile_name",
    "storage_key_for_entry",
]


def get_coordinator(
    hass: HomeAssistant,
    *,
    config_entry_id: str | None = None,
) -> ReadyHomeCoordinator:
    """Resolve a coordinator, optionally by config entry id.

    With a single profile, config_entry_id may be omitted.
    With multiple profiles, config_entry_id is required.
    """
    data = hass.data.get(DOMAIN) or {}
    if not data:
        raise HomeAssistantError("Ready Home is not set up")

    if config_entry_id:
        coordinator = data.get(config_entry_id)
        if coordinator is None:
            raise ServiceValidationError(
                f"Unknown Ready Home config entry: {config_entry_id}"
            )
        return coordinator

    if len(data) == 1:
        return next(iter(data.values()))

    raise ServiceValidationError(
        "Multiple Ready Home profiles are configured; provide config_entry_id"
    )


def entry_id_from_call_data(data: dict[str, Any]) -> str | None:
    """Extract optional config_entry_id from service/websocket data."""
    value = data.get("config_entry_id")
    if value is None or value == "":
        return None
    return str(value)
