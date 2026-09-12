"""Pytest configuration for Ready Home tests."""

from __future__ import annotations

import sys
import types
from pathlib import Path
from typing import Any
from unittest.mock import MagicMock

# Allow importing custom_components.ready_home without installing the package
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))


def _ensure_homeassistant_stubs() -> None:
    """Install lightweight stubs so store/coordinator import without HA installed."""
    if "homeassistant" in sys.modules and hasattr(
        sys.modules["homeassistant"], "__file__"
    ):
        # Real homeassistant is installed — do nothing
        return

    modules: dict[str, Any] = {
        "homeassistant": types.ModuleType("homeassistant"),
        "homeassistant.core": types.ModuleType("homeassistant.core"),
        "homeassistant.helpers": types.ModuleType("homeassistant.helpers"),
        "homeassistant.helpers.storage": types.ModuleType(
            "homeassistant.helpers.storage"
        ),
        "homeassistant.helpers.event": types.ModuleType("homeassistant.helpers.event"),
        "homeassistant.helpers.update_coordinator": types.ModuleType(
            "homeassistant.helpers.update_coordinator"
        ),
        "homeassistant.helpers.aiohttp_client": types.ModuleType(
            "homeassistant.helpers.aiohttp_client"
        ),
        "homeassistant.helpers.device_registry": types.ModuleType(
            "homeassistant.helpers.device_registry"
        ),
        "homeassistant.helpers.config_validation": types.ModuleType(
            "homeassistant.helpers.config_validation"
        ),
        "homeassistant.helpers.selector": types.ModuleType(
            "homeassistant.helpers.selector"
        ),
        "homeassistant.exceptions": types.ModuleType("homeassistant.exceptions"),
        "homeassistant.config_entries": types.ModuleType(
            "homeassistant.config_entries"
        ),
        "homeassistant.components": types.ModuleType("homeassistant.components"),
        "homeassistant.components.websocket_api": types.ModuleType(
            "homeassistant.components.websocket_api"
        ),
    }

    class Store:  # noqa: D101
        def __init__(self, *args: Any, **kwargs: Any) -> None:
            self._data = None

        async def async_load(self) -> Any:
            return self._data

        def async_delay_save(self, data_func: Any, delay: float = 0) -> None:
            self._data = data_func()

        async def async_save(self, data: Any) -> None:
            self._data = data

    modules["homeassistant.helpers.storage"].Store = Store
    modules["homeassistant.helpers.aiohttp_client"].async_get_clientsession = MagicMock()

    class DeviceEntryType:  # noqa: D101
        SERVICE = "service"

    def DeviceInfo(**kwargs: Any) -> dict[str, Any]:  # noqa: N802
        return kwargs

    modules["homeassistant.helpers.device_registry"].DeviceEntryType = DeviceEntryType
    modules["homeassistant.helpers.device_registry"].DeviceInfo = DeviceInfo

    modules["homeassistant.exceptions"].HomeAssistantError = type(
        "HomeAssistantError", (Exception,), {}
    )
    modules["homeassistant.exceptions"].ServiceValidationError = type(
        "ServiceValidationError", (Exception,), {}
    )

    ws = modules["homeassistant.components.websocket_api"]
    ws.websocket_command = lambda schema: (lambda f: f)
    ws.async_response = lambda f: f
    ws.async_register_command = MagicMock()
    ws.event_message = lambda sid, data: {"id": sid, "event": data}
    ws.ActiveConnection = MagicMock

    class DataUpdateCoordinator:  # noqa: D101
        def __init__(self, hass: Any, logger: Any, name: str = "") -> None:
            self.hass = hass
            self.logger = logger
            self.name = name
            self.data = None

        def __class_getitem__(cls, _item: Any) -> type:
            return cls

        async def async_refresh(self) -> None:
            self.data = await self._async_update_data()

        async def async_request_refresh(self) -> None:
            await self.async_refresh()

        async def _async_update_data(self) -> Any:
            raise NotImplementedError

    modules["homeassistant.helpers.update_coordinator"].DataUpdateCoordinator = (
        DataUpdateCoordinator
    )
    modules["homeassistant.helpers.event"].async_track_time_change = MagicMock(
        return_value=MagicMock()
    )
    modules["homeassistant.core"].HomeAssistant = MagicMock
    modules["homeassistant.core"].callback = lambda f: f
    modules["homeassistant.core"].CALLBACK_TYPE = object
    modules["homeassistant.core"].ServiceCall = MagicMock
    modules["homeassistant.core"].SupportsResponse = MagicMock

    # Minimal cv stubs used by service schemas at import time.
    cv = modules["homeassistant.helpers.config_validation"]
    cv.string = str

    # Selector stubs so config_flow can import without real HA.
    selector = modules["homeassistant.helpers.selector"]

    class _SelectorStub:  # noqa: D101
        def __init__(self, *args: Any, **kwargs: Any) -> None:
            pass

    class _ConfigStub:  # noqa: D101
        def __init__(self, *args: Any, **kwargs: Any) -> None:
            pass

    class _ModeStub:  # noqa: D101
        BOX = "box"
        DROPDOWN = "dropdown"
        SLIDER = "slider"

    selector.NumberSelector = _SelectorStub
    selector.NumberSelectorConfig = _ConfigStub
    selector.NumberSelectorMode = _ModeStub
    selector.SelectSelector = _SelectorStub
    selector.SelectSelectorConfig = _ConfigStub
    selector.SelectSelectorMode = _ModeStub
    selector.TextSelector = _SelectorStub

    class ConfigFlow:  # noqa: D101
        def __init_subclass__(cls, domain: str | None = None, **kwargs: Any) -> None:
            super().__init_subclass__(**kwargs)
            cls.DOMAIN = domain  # type: ignore[attr-defined]

    class OptionsFlow:  # noqa: D101
        pass

    modules["homeassistant.config_entries"].ConfigEntry = MagicMock
    modules["homeassistant.config_entries"].ConfigFlow = ConfigFlow
    modules["homeassistant.config_entries"].ConfigFlowResult = dict
    modules["homeassistant.config_entries"].OptionsFlow = OptionsFlow

    for name, mod in modules.items():
        sys.modules.setdefault(name, mod)


_ensure_homeassistant_stubs()
