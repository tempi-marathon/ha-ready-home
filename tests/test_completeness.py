"""Unit tests for category completeness scoring."""

from __future__ import annotations

from datetime import date, timedelta

from custom_components.ready_home.completeness import assess_category_completeness
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
