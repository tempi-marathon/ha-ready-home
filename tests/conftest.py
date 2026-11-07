"""Pytest configuration for Ready Home tests."""

from __future__ import annotations

import sys
import types
from pathlib import Path
from typing import Any
from unittest.mock import MagicMock

import pytest

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
        "homeassistant.helpers.debounce": types.ModuleType(
            "homeassistant.helpers.debounce"
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
    modules["homeassistant.exceptions"].Unauthorized = type(
        "Unauthorized",
        (modules["homeassistant.exceptions"].HomeAssistantError,),
        {},
    )

    ws = modules["homeassistant.components.websocket_api"]
    ws.websocket_command = lambda schema: (lambda f: f)
    ws.async_response = lambda f: f
    ws.async_register_command = MagicMock()
    ws.event_message = lambda sid, data: {"id": sid, "event": data}
    ws.ActiveConnection = MagicMock

    class Debouncer:  # noqa: D101
        def __init__(
            self,
            hass: Any,
            logger: Any,
            *,
            cooldown: float,
            immediate: bool,
            function: Any = None,
        ) -> None:
            self.hass = hass
            self.logger = logger
            self.cooldown = cooldown
            self.immediate = immediate
            self.function = function

        def __class_getitem__(cls, _item: Any) -> type:
            return cls

    modules["homeassistant.helpers.debounce"].Debouncer = Debouncer

    class DataUpdateCoordinator:  # noqa: D101
        def __init__(
            self,
            hass: Any,
            logger: Any,
            name: str = "",
            request_refresh_debouncer: Any = None,
        ) -> None:
            self.hass = hass
            self.logger = logger
            self.name = name
            self.data = None
            self._debounced_refresh = request_refresh_debouncer

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

    class Context:  # noqa: D101
        def __init__(
            self,
            id: str | None = None,
            user_id: str | None = None,
            parent_id: str | None = None,
        ) -> None:
            self.id = id or "stub-context"
            self.user_id = user_id
            self.parent_id = parent_id

    modules["homeassistant.core"].Context = Context

    # Minimal cv stubs used by service schemas at import time.
    cv = modules["homeassistant.helpers.config_validation"]
    cv.string = str
    cv.entity_id = str

    # Selector stubs so config_flow can import without real HA.
    selector = modules["homeassistant.helpers.selector"]

    class _SelectorStub:  # noqa: D101
        def __init__(self, *args: Any, **kwargs: Any) -> None:
            self.args = args
            self.kwargs = kwargs

        def __call__(self, value: Any) -> Any:
            return value

    class _ConfigStub:  # noqa: D101
        def __init__(self, *args: Any, **kwargs: Any) -> None:
            self.kwargs = kwargs

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
    selector.BooleanSelector = _SelectorStub
    selector.EntitySelector = _SelectorStub
    selector.EntitySelectorConfig = _ConfigStub

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


# ---------------------------------------------------------------------------
# Legacy baseline: options saved before the pets feature (no ``pets`` and no
# ``pet_food_categories`` keys). Expected values below are literals captured from
# the code as it was before pets were added; never recompute them with new code.
# ---------------------------------------------------------------------------

LEGACY_TODAY_ISO = "2026-09-04"

LEGACY_OPTIONS: dict[str, Any] = {
    "number_of_people": 3,
    "duration_hours": 72,
    "water_liters_per_person_per_day": 3.0,
    "calories_per_person_per_day": 2000,
    "locations": ["Pantry"],
    # "Pet food" is a plain custom category here and is scored by completeness.
    "categories": ["Food", "Water", "Medical", "Pet food"],
    "food_categories": ["Food"],
    "water_categories": ["Water"],
    "expiring_days": 30,
    "urgent_days": 7,
}

LEGACY_ASSESSMENT: dict[str, Any] = {
    "needs_people_count": False,
    "water_on_hand": 10.0,
    "water_target": 27.0,
    "water_percent": 37.03703703703704,
    "food_on_hand": 7000.0,
    "food_target": 18000.0,
    "food_percent": 38.88888888888889,
    "overall_percent": 37.03703703703704,
    "duration_hours": 72,
    "water_supply_hours": 26.666666666666664,
    "food_supply_hours": 28.0,
    "supply_hours": 26.666666666666664,
    "unmeasurable_water_count": 0,
    "unmeasurable_food_count": 0,
}

# (category, percent, complete, total, missing) for the completeness categories
LEGACY_COMPLETENESS: dict[str, Any] = {
    "overall_percent": 0.0,
    "categories": [
        ("Medical", 0.0, 0, 1, ("Bandages",)),
        ("Pet food", 0.0, 0, 1, ("Dog kibble",)),
    ],
}

LEGACY_BUCKET_IDS: dict[str, list[str]] = {
    "expired": ["f2"],
    "within_urgent": ["f1"],
    "within_expiring": [],
    "low_stock": ["m1", "p1"],
}

LEGACY_EVENT_SUMMARIES: dict[str, dict[str, Any]] = {
    "w1": {
        "id": "w1", "name": "Water jugs", "quantity": 2, "desired_quantity": 0.0,
        "unit": "piece", "location": "", "category": "Water", "priority": "essential",
        "expiry_date": None, "contents_per_unit": 5, "contents_unit": "liter",
        "water_liters_on_hand": 10.0,
    },
    "f1": {
        "id": "f1", "name": "Rice", "quantity": 4, "desired_quantity": 0.0,
        "unit": "piece", "location": "", "category": "Food", "priority": "essential",
        "expiry_date": "2026-09-10", "contents_per_unit": 500, "contents_unit": "gram",
        "calories_per_content": 3.5, "calories_on_hand": 7000.0,
    },
    "f2": {
        "id": "f2", "name": "Old beans", "quantity": 2, "desired_quantity": 0.0,
        "unit": "piece", "location": "", "category": "Food", "priority": "important",
        "expiry_date": "2026-08-01", "calories_per_unit": 400, "calories_on_hand": 800.0,
    },
    "m1": {
        "id": "m1", "name": "Bandages", "quantity": 1, "desired_quantity": 3,
        "unit": "piece", "location": "", "category": "Medical", "priority": "important",
        "expiry_date": None,
    },
    "p1": {
        "id": "p1", "name": "Dog kibble", "quantity": 2, "desired_quantity": 4,
        "unit": "piece", "location": "", "category": "Pet food", "priority": "important",
        "expiry_date": None, "contents_per_unit": 2, "contents_unit": "kilogram",
    },
}


@pytest.fixture
def legacy_options() -> dict[str, Any]:
    """Options of an install that predates pets (see LEGACY_* constants)."""
    return {k: (list(v) if isinstance(v, list) else v) for k, v in LEGACY_OPTIONS.items()}


@pytest.fixture
def legacy_today():  # noqa: ANN201
    from datetime import date

    return date.fromisoformat(LEGACY_TODAY_ISO)


@pytest.fixture
def legacy_items():  # noqa: ANN201
    from custom_components.ready_home.models import (
        ContentsUnit,
        InventoryItem,
        InventoryPriority,
        InventoryUnit,
    )

    return [
        InventoryItem(
            id="w1", name="Water jugs", quantity=2, unit=InventoryUnit.PIECE,
            category="Water", contents_per_unit=5, contents_unit=ContentsUnit.LITER,
            priority=InventoryPriority.ESSENTIAL,
        ),
        InventoryItem(
            id="f1", name="Rice", quantity=4, category="Food", contents_per_unit=500,
            contents_unit=ContentsUnit.GRAM, calories_per_content=3.5,
            priority=InventoryPriority.ESSENTIAL, expiry_date="2026-09-10",
        ),
        InventoryItem(
            id="f2", name="Old beans", quantity=2, category="Food",
            calories_per_unit=400, expiry_date="2026-08-01",
        ),
        InventoryItem(
            id="m1", name="Bandages", quantity=1, desired_quantity=3, category="Medical"
        ),
        InventoryItem(
            id="p1", name="Dog kibble", quantity=2, desired_quantity=4,
            category="Pet food", contents_per_unit=2,
            contents_unit=ContentsUnit.KILOGRAM,
        ),
    ]
