"""Unit tests for category completeness scoring."""

from __future__ import annotations

from datetime import date, timedelta

from custom_components.ready_home.completeness import (
    assess_category_completeness,
    completeness_attr_dict,
    completeness_ws_dict,
)
from custom_components.ready_home.const import ATTRIBUTE_ITEM_CAP
from custom_components.ready_home.models import InventoryItem, ReadinessSettings


def test_empty_when_no_checklist_items() -> None:
    settings = ReadinessSettings(
        categories=("Food", "Water", "Medical"),
        food_categories=("Food",),
        water_categories=("Water",),
    )
    result = assess_category_completeness([], settings)
    assert result.overall_percent is None
    assert result.categories == ()


def test_food_water_categories_ignored() -> None:
    settings = ReadinessSettings(
        categories=("Food", "Medical"),
        food_categories=("Food",),
        water_categories=("Water",),
    )
    items = [
        InventoryItem(
            name="Rice",
            quantity=0,
            desired_quantity=5,
            category="Food",
        ),
        InventoryItem(
            name="Bandages",
            quantity=2,
            desired_quantity=2,
            category="Medical",
        ),
    ]
    result = assess_category_completeness(items, settings)
    assert result.overall_percent == 100.0
    assert len(result.categories) == 1
    assert result.categories[0].category == "Medical"


def test_partial_and_expired_count_as_missing() -> None:
    today = date(2026, 1, 15)
    settings = ReadinessSettings(
        categories=("Medical", "Tools"),
        food_categories=("Food",),
        water_categories=("Water",),
    )
    items = [
        InventoryItem(
            name="First aid kit",
            quantity=1,
            desired_quantity=1,
            category="Medical",
        ),
        InventoryItem(
            name="Pain meds",
            quantity=0,
            desired_quantity=1,
            category="Medical",
        ),
        InventoryItem(
            name="Flashlight",
            quantity=1,
            desired_quantity=1,
            category="Tools",
            expiry_date=(today - timedelta(days=1)).isoformat(),
        ),
    ]
    result = assess_category_completeness(items, settings, today=today)
    assert len(result.categories) == 2
    medical = next(s for s in result.categories if s.category == "Medical")
    tools = next(s for s in result.categories if s.category == "Tools")
    assert medical.percent == 50.0
    assert medical.missing == ("Pain meds",)
    assert tools.percent == 0.0
    assert tools.missing == ("Flashlight",)
    assert result.overall_percent == 25.0


def _medical_settings() -> ReadinessSettings:
    return ReadinessSettings(categories=("Medical",))


def test_missing_items_carry_reasons() -> None:
    today = date(2026, 1, 15)
    low = InventoryItem(
        name="Plasters", quantity=2, desired_quantity=5, category="Medical"
    )
    old = InventoryItem(
        name="Bandage",
        quantity=4,
        desired_quantity=2,
        category="Medical",
        expiry_date=(today - timedelta(days=1)).isoformat(),
    )
    both = InventoryItem(
        name="Gauze",
        quantity=0,
        desired_quantity=3,
        category="Medical",
        expiry_date=(today - timedelta(days=5)).isoformat(),
    )
    ok = InventoryItem(name="Tape", quantity=2, desired_quantity=2, category="Medical")
    result = assess_category_completeness(
        [low, old, both, ok], _medical_settings(), today=today
    )
    score = result.categories[0]
    assert score.missing == ("Plasters", "Bandage", "Gauze")
    by_name = {m.name: m for m in score.missing_items}
    assert by_name["Plasters"].id == low.id
    assert (by_name["Plasters"].quantity, by_name["Plasters"].desired_quantity) == (2, 5)
    assert by_name["Plasters"].expired is False
    assert by_name["Bandage"].expired is True
    assert by_name["Gauze"].expired is True


def test_ws_dict_is_uncapped_objects_and_attr_dict_unchanged() -> None:
    count = ATTRIBUTE_ITEM_CAP + 5
    items = [
        InventoryItem(
            name=f"Item {n}", quantity=0, desired_quantity=1, category="Medical"
        )
        for n in range(count)
    ]
    result = assess_category_completeness(items, _medical_settings())

    ws = completeness_ws_dict(result)["categories"]["Medical"]  # type: ignore[index]
    assert len(ws["missing"]) == count
    assert set(ws["missing"][0]) == {
        "id",
        "name",
        "quantity",
        "desired_quantity",
        "expired",
    }
    assert ws["percent"] == 0.0 and ws["complete"] == 0 and ws["total"] == count

    attr = completeness_attr_dict(result)["categories"]["Medical"]  # type: ignore[index]
    assert attr["missing"] == [f"Item {n}" for n in range(ATTRIBUTE_ITEM_CAP)]


def test_ws_dict_complete_category_has_empty_missing() -> None:
    items = [
        InventoryItem(name="Tape", quantity=2, desired_quantity=2, category="Medical")
    ]
    result = assess_category_completeness(items, _medical_settings())
    ws = completeness_ws_dict(result)
    assert ws["categories"]["Medical"]["missing"] == []  # type: ignore[index]
    assert ws["overall_percent"] == 100.0
