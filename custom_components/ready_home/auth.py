"""Authorization helpers for Ready Home mutations."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import Unauthorized


async def async_require_admin_or_automation(
    hass: HomeAssistant,
    user_id: str | None,
) -> None:
    """Allow admins and automations; reject logged-in non-admin users.

    Calls with no ``user_id`` (scripts, automations, system) are allowed so
    documented ``ready_home.*`` actions keep working from YAML.
    """
    if user_id is None:
        return
    user = await hass.auth.async_get_user(user_id)
    if user is None or not user.is_admin:
        raise Unauthorized()
