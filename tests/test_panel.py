"""Tests for sidebar panel registration helpers."""

from __future__ import annotations

import sys
import types
from unittest.mock import MagicMock

# Stub HA frontend modules before importing panel (real HA may lack them unloaded).
for _name in (
    "homeassistant.components.frontend",
    "homeassistant.components.panel_custom",
    "homeassistant.components.http",
):
    sys.modules.setdefault(_name, types.ModuleType(_name))

sys.modules["homeassistant.components.http"].StaticPathConfig = MagicMock  # type: ignore[attr-defined]
sys.modules["homeassistant.components.frontend"].async_remove_panel = MagicMock()  # type: ignore[attr-defined]
sys.modules["homeassistant.components.panel_custom"].async_register_panel = MagicMock()  # type: ignore[attr-defined]

from custom_components.ready_home.panel import (  # noqa: E402
    _PANEL_KEY,
    async_unregister_panel,
)


def test_unregister_removes_panel_when_registered() -> None:
    hass = MagicMock()
    hass.data = {_PANEL_KEY: True}
    frontend = sys.modules["homeassistant.components.frontend"]
    frontend.async_remove_panel = MagicMock()  # type: ignore[attr-defined]
    async_unregister_panel(hass)
    frontend.async_remove_panel.assert_called_once_with(hass, "ready_home")
    assert _PANEL_KEY not in hass.data


def test_unregister_noop_when_not_registered() -> None:
    hass = MagicMock()
    hass.data = {}
    frontend = sys.modules["homeassistant.components.frontend"]
    frontend.async_remove_panel = MagicMock()  # type: ignore[attr-defined]
    async_unregister_panel(hass)
    frontend.async_remove_panel.assert_not_called()
