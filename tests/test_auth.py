"""Tests for admin-or-automation authorization helper."""

from __future__ import annotations

from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest
from homeassistant.exceptions import Unauthorized

from custom_components.ready_home.auth import async_require_admin_or_automation


@pytest.mark.asyncio
async def test_allows_automation_without_user() -> None:
    hass = MagicMock()
    await async_require_admin_or_automation(hass, None)
    hass.auth.async_get_user.assert_not_called()


@pytest.mark.asyncio
async def test_allows_admin_user() -> None:
    hass = MagicMock()
    hass.auth.async_get_user = AsyncMock(
        return_value=SimpleNamespace(is_admin=True)
    )
    await async_require_admin_or_automation(hass, "admin-id")
    hass.auth.async_get_user.assert_awaited_once_with("admin-id")


@pytest.mark.asyncio
async def test_rejects_non_admin_user() -> None:
    hass = MagicMock()
    hass.auth.async_get_user = AsyncMock(
        return_value=SimpleNamespace(is_admin=False)
    )
    with pytest.raises(Unauthorized):
        await async_require_admin_or_automation(hass, "guest-id")


@pytest.mark.asyncio
async def test_rejects_unknown_user() -> None:
    hass = MagicMock()
    hass.auth.async_get_user = AsyncMock(return_value=None)
    with pytest.raises(Unauthorized):
        await async_require_admin_or_automation(hass, "missing")
