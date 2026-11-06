"""Unit tests for service resolution and status-filter helpers."""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest
import voluptuous as vol
from homeassistant.exceptions import ServiceValidationError

from custom_components.ready_home.models import InventoryItem
from custom_components.ready_home.services import (
    ADD_SCHEMA,
    ADJUST_SCHEMA,
    LIST_SCHEMA,
    UPDATE_SCHEMA,
    _matches_status,
    _resolve_item,
)


def test_resolve_item_by_id() -> None:
    item = InventoryItem(name="Water", quantity=2)
    coordinator = MagicMock()
    coordinator.store.get.return_value = item
    assert _resolve_item(coordinator, item.id, None) is item
    coordinator.store.get.assert_called_once_with(item.id)


def test_resolve_item_by_name() -> None:
    item = InventoryItem(name="Rice", quantity=1)
    coordinator = MagicMock()
    coordinator.store.find_by_name.return_value = item
    assert _resolve_item(coordinator, None, "Rice") is item
    coordinator.store.find_by_name.assert_called_once_with("Rice")


def test_resolve_item_unknown_id() -> None:
    coordinator = MagicMock()
    coordinator.store.get.return_value = None
    with pytest.raises(ServiceValidationError, match="Unknown item_id"):
        _resolve_item(coordinator, "missing", None)


def test_resolve_item_unknown_name() -> None:
    coordinator = MagicMock()
    coordinator.store.find_by_name.return_value = None
    with pytest.raises(ServiceValidationError, match="Unknown or ambiguous name"):
        _resolve_item(coordinator, None, "Nope")


def test_resolve_item_requires_id_or_name() -> None:
    coordinator = MagicMock()
    with pytest.raises(ServiceValidationError, match="Provide item_id or name"):
        _resolve_item(coordinator, None, None)


@pytest.mark.parametrize(
    ("status", "severity", "quantity", "desired", "expected"),
    [
        ("expired", "expired", 5, 0, True),
        ("expired", "within_urgent", 5, 0, False),
        ("expiring", "within_urgent", 5, 0, True),
        ("expiring", "within_expiring", 5, 0, True),
        ("expiring", "expired", 5, 0, False),
        ("low_stock", None, 1, 5, True),
        ("low_stock", None, 5, 5, False),
        ("ok", None, 5, 0, True),
        ("ok", "expired", 5, 0, False),
        ("ok", None, 1, 5, False),
        ("unknown", None, 5, 0, False),
    ],
)
def test_matches_status(
    status: str,
    severity: str | None,
    quantity: float,
    desired: float,
    expected: bool,
) -> None:
    item = InventoryItem(name="x", quantity=quantity, desired_quantity=desired)
    assert _matches_status(status, item, severity) is expected


def test_add_schema_rejects_invalid_expiry() -> None:
    with pytest.raises(vol.Invalid):
        ADD_SCHEMA({"name": "Rice", "quantity": 1, "expiry_date": "boom"})


def test_add_schema_accepts_iso_expiry() -> None:
    data = ADD_SCHEMA(
        {"name": "Rice", "quantity": 1, "expiry_date": "2027-06-01"}
    )
    assert data["expiry_date"] == "2027-06-01"


def test_add_schema_rejects_non_finite_quantity() -> None:
    with pytest.raises(vol.Invalid):
        ADD_SCHEMA({"name": "Rice", "quantity": float("inf")})
    with pytest.raises(vol.Invalid):
        ADD_SCHEMA({"name": "Rice", "quantity": float("nan")})
    with pytest.raises(vol.Invalid):
        ADD_SCHEMA({"name": "Rice", "quantity": -1})


def test_update_schema_rejects_invalid_expiry() -> None:
    with pytest.raises(vol.Invalid):
        UPDATE_SCHEMA({"item_id": "abc", "expiry_date": "nope"})


def test_adjust_schema_rejects_non_finite_delta() -> None:
    with pytest.raises(vol.Invalid):
        ADJUST_SCHEMA({"item_id": "abc", "delta": float("nan")})


def test_add_schema_rejects_oversized_name() -> None:
    with pytest.raises(vol.Invalid):
        ADD_SCHEMA({"name": "x" * 201, "quantity": 1})


def test_add_schema_rejects_unsafe_barcode() -> None:
    with pytest.raises(vol.Invalid):
        ADD_SCHEMA({"name": "Rice", "quantity": 1, "barcode": "../../evil"})


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "options",
    [
        {"number_of_people": 2},  # old-format entry, no category keys
        {"count_adults": 2, "count_children": 1},  # new-format entry
    ],
)
async def test_list_items_readiness_filter_with_old_and_new_settings(
    options: dict, monkeypatch: pytest.MonkeyPatch
) -> None:
    from types import SimpleNamespace

    from custom_components.ready_home.const import DOMAIN
    from custom_components.ready_home.models import ReadinessSettings
    from custom_components.ready_home.services import async_register_services

    items = [
        InventoryItem(name="Jug", quantity=1, category="Water"),
        InventoryItem(name="Beans", quantity=1, category="Food"),
        InventoryItem(name="Saw", quantity=1, category="Tools"),
    ]
    coordinator = SimpleNamespace(
        settings=ReadinessSettings.from_options(options),
        store=SimpleNamespace(items=items),
    )
    monkeypatch.setattr(
        "custom_components.ready_home.services.SupportsResponse", MagicMock()
    )
    hass = MagicMock()
    hass.data = {DOMAIN: {"entry": coordinator}}
    hass.services.has_service.return_value = False
    handlers = {}
    hass.services.async_register = lambda _d, name, handler, **_k: handlers.update(
        {name: handler}
    )
    async_register_services(hass)

    result = await handlers["list_items"](MagicMock(data={"readiness": "water"}))
    assert result["count"] == 1
    assert result["items"][0]["name"] == "Jug"



@pytest.mark.parametrize("readiness", ["food", "water", "none", "pet_food"])
def test_list_schema_accepts_readiness_filters(readiness: str) -> None:
    assert LIST_SCHEMA({"readiness": readiness})["readiness"] == readiness


def test_list_schema_old_payload_and_unknown_readiness() -> None:
    assert LIST_SCHEMA({"category": "Food", "status": "expired"}) == {
        "category": "Food",
        "status": "expired",
    }
    with pytest.raises(vol.Invalid):
        LIST_SCHEMA({"readiness": "pets"})


def _register_handlers(coordinator, monkeypatch: pytest.MonkeyPatch) -> dict:
    from unittest.mock import AsyncMock

    from custom_components.ready_home.const import DOMAIN
    from custom_components.ready_home.services import async_register_services

    monkeypatch.setattr(
        "custom_components.ready_home.services.SupportsResponse", MagicMock()
    )
    monkeypatch.setattr(
        "custom_components.ready_home.services.async_require_admin_or_automation",
        AsyncMock(),
    )
    hass = MagicMock()
    hass.data = {DOMAIN: {"entry": coordinator}}
    hass.services.has_service.return_value = False
    handlers: dict = {}
    hass.services.async_register = lambda _d, name, handler, **_k: handlers.update(
        {name: handler}
    )
    async_register_services(hass)
    return handlers


@pytest.mark.asyncio
async def test_action_responses_carry_pet_food_grams_only_for_pet_food(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    from types import SimpleNamespace
    from unittest.mock import AsyncMock

    from custom_components.ready_home.models import ContentsUnit, ReadinessSettings

    kibble = InventoryItem(
        name="Kibble",
        quantity=2,
        category="Pet food",
        contents_per_unit=500,
        contents_unit=ContentsUnit.GRAM,
    )
    rice = InventoryItem(
        name="Rice",
        quantity=2,
        category="Food",
        contents_per_unit=500,
        contents_unit=ContentsUnit.GRAM,
    )
    store = SimpleNamespace(
        items=[kibble, rice],
        get=lambda item_id: {kibble.id: kibble, rice.id: rice}.get(item_id),
        async_update=AsyncMock(),
        async_add=AsyncMock(),
    )
    coordinator = SimpleNamespace(
        settings=ReadinessSettings.from_options(
            {"number_of_people": 2, "pet_food_categories": ["Pet food"]}
        ),
        store=store,
    )
    handlers = _register_handlers(coordinator, monkeypatch)

    listed = await handlers["list_items"](MagicMock(data={}))
    by_name = {i["name"]: i for i in listed["items"]}
    assert by_name["Kibble"]["pet_food_grams_on_hand"] == 1000.0
    assert "pet_food_grams_on_hand" not in by_name["Rice"]

    adjusted = await handlers["adjust_quantity"](
        MagicMock(data={"item_id": kibble.id, "delta": 1})
    )
    assert adjusted["item"]["pet_food_grams_on_hand"] == 1500.0
    adjusted_rice = await handlers["adjust_quantity"](
        MagicMock(data={"item_id": rice.id, "delta": 1})
    )
    assert "pet_food_grams_on_hand" not in adjusted_rice["item"]


@pytest.mark.asyncio
async def test_action_responses_unchanged_without_pet_food_categories(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    from types import SimpleNamespace

    from custom_components.ready_home.models import ContentsUnit, ReadinessSettings

    item = InventoryItem(
        name="Kibble",
        quantity=2,
        category="Pet food",
        contents_per_unit=500,
        contents_unit=ContentsUnit.GRAM,
    )
    coordinator = SimpleNamespace(
        settings=ReadinessSettings.from_options({"number_of_people": 2}),
        store=SimpleNamespace(items=[item]),
    )
    handlers = _register_handlers(coordinator, monkeypatch)
    listed = await handlers["list_items"](MagicMock(data={}))
    assert "pet_food_grams_on_hand" not in listed["items"][0]
