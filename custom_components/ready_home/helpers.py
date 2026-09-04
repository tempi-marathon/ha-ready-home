"""Shared helpers for Ready Home coordinators and profile metadata."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError

from .const import CONF_NAME, DEFAULT_PROFILE_NAME, DOMAIN, storage_key_for_entry

if TYPE_CHECKING:
    from .coordinator import ReadyHomeCoordinator


def profile_name(entry: ConfigEntry) -> str:
    """Return the display name for a config entry / readiness profile."""
    return str(entry.data.get(CONF_NAME) or entry.title or DEFAULT_PROFILE_NAME)


# Re-export for callers that imported storage_key_for_entry from helpers.
__all__ = [
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
