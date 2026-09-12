"""Unit tests for readiness math (ported from Ready Home App)."""

from __future__ import annotations

from datetime import date, timedelta

import pytest

from custom_components.ready_home.models import (
    ContentsUnit,
    InventoryItem,
    InventoryUnit,
    ReadinessSettings,
)
from custom_components.ready_home.readiness import assess


def test_empty_assessment_without_people() -> None:
    settings = ReadinessSettings(number_of_people=None)
    result = assess([], settings)
    assert result.needs_people_count is True
    assert result.water_percent == 0.0
    assert result.food_percent == 0.0
    assert result.overall_percent == 0.0
    assert result.water_target is None
    assert result.supply_hours is None


def test_water_from_liters_unit() -> None:
    # 2 people * 3 L/day * 72h/24 = 18 L target
    settings = ReadinessSettings(number_of_people=2, duration_hours=72)
    items = [
        InventoryItem(
            name="Water jug",
            quantity=9.0,
            unit=InventoryUnit.LITER,
            category="Water",
        )
    ]
    result = assess(items, settings)
    assert result.water_target == 18.0
    assert result.water_on_hand == 9.0
    assert result.water_percent == 50.0
    assert result.water_supply_hours == 36.0


def test_water_from_pieces_with_liters_per_unit() -> None:
    settings = ReadinessSettings(number_of_people=1, duration_hours=72)
    # target = 1 * 3 * 3 = 9 L
    items = [
        InventoryItem(
            name="Bottles",
            quantity=6,
            unit=InventoryUnit.PIECE,
            category="Water",
            liters_per_unit=1.5,
        )
    ]
    result = assess(items, settings)
    assert result.water_on_hand == 9.0
    assert result.water_percent == 100.0


def test_milliliters_convert_to_liters() -> None:
    settings = ReadinessSettings(number_of_people=1, duration_hours=24)
    items = [
        InventoryItem(
            name="Small bottles",
            quantity=3000,
            unit=InventoryUnit.MILLILITER,
            category="Water",
        )
    ]
    result = assess(items, settings)
    assert result.water_on_hand == 3.0
    assert result.water_percent == 100.0


def test_food_from_contents_model() -> None:
    settings = ReadinessSettings(
        number_of_people=1,
        duration_hours=72,
        calories_per_person_per_day=2000,
    )
    # 1 piece × 400 g × 3.54 kcal/g = 1416; need more packs for 6000 target
    items = [
        InventoryItem(
            name="Rice",
            quantity=5,
            unit=InventoryUnit.PIECE,
            category="Food",
            contents_per_unit=400,
            contents_unit=ContentsUnit.GRAM,
            calories_per_content=3.0,
        )
    ]
    result = assess(items, settings)
    assert result.food_on_hand == 6000.0
    assert result.food_percent == 100.0


def test_water_from_contents_model() -> None:
    settings = ReadinessSettings(number_of_people=1, duration_hours=72)
    items = [
        InventoryItem(
            name="Bottles",
            quantity=12,
            unit=InventoryUnit.PIECE,
            category="Water",
            contents_per_unit=0.5,
            contents_unit=ContentsUnit.LITER,
        )
    ]
    result = assess(items, settings)
    assert result.water_on_hand == 6.0
    assert result.water_percent == pytest.approx(6 / 9 * 100)
    settings = ReadinessSettings(
        number_of_people=1,
        duration_hours=72,
        calories_per_person_per_day=2000,
    )
    # target = 2000 * 3 = 6000 kcal
    items = [
        InventoryItem(
            name="Rice",
            quantity=10,
            unit=InventoryUnit.PACK,
            category="Food",
            calories_per_unit=600,
        )
    ]
    result = assess(items, settings)
    assert result.food_on_hand == 6000.0
    assert result.food_percent == 100.0


def test_custom_food_category_counts_when_mapped() -> None:
    settings = ReadinessSettings(
        number_of_people=1,
        duration_hours=24,
        calories_per_person_per_day=2000,
        food_categories=("Vegetables",),
        water_categories=("Water",),
    )
    items = [
        InventoryItem(
            name="Carrots",
            quantity=2,
            unit=InventoryUnit.PACK,
            category="Vegetables",
            calories_per_unit=1000,
        )
    ]
    result = assess(items, settings)
    assert result.food_on_hand == 2000.0
    assert result.food_percent == 100.0


def test_unmapped_category_does_not_count() -> None:
    settings = ReadinessSettings(
        number_of_people=1,
        duration_hours=24,
        food_categories=("Food",),
        water_categories=("Water",),
    )
    items = [
        InventoryItem(
            name="Carrots",
            quantity=10,
            unit=InventoryUnit.PACK,
            category="Vegetables",
            calories_per_unit=1000,
        )
    ]
    result = assess(items, settings)
    assert result.food_on_hand == 0.0


def test_overall_is_min_of_water_and_food() -> None:
    settings = ReadinessSettings(number_of_people=1, duration_hours=24)
    items = [
        InventoryItem(
            name="Water",
            quantity=3,
            unit=InventoryUnit.LITER,
            category="Water",
        ),
        InventoryItem(
            name="Food",
            quantity=1,
            unit=InventoryUnit.PACK,
            category="Food",
            calories_per_unit=1000,  # 50% of 2000
        ),
    ]
    result = assess(items, settings)
    assert result.water_percent == 100.0
    assert result.food_percent == 50.0
    assert result.overall_percent == 50.0
    assert result.supply_hours == 12.0


def test_expired_items_excluded() -> None:
    today = date(2026, 9, 4)
    settings = ReadinessSettings(number_of_people=1, duration_hours=24)
    items = [
        InventoryItem(
            name="Expired water",
            quantity=10,
            unit=InventoryUnit.LITER,
            category="Water",
            expiry_date=(today - timedelta(days=1)).isoformat(),
        ),
        InventoryItem(
            name="Fresh water",
            quantity=1.5,
            unit=InventoryUnit.LITER,
            category="Water",
            expiry_date=(today + timedelta(days=30)).isoformat(),
        ),
    ]
    result = assess(items, settings, today=today)
    assert result.water_on_hand == 1.5


def test_unmeasurable_water_counted() -> None:
    settings = ReadinessSettings(number_of_people=1, duration_hours=24)
    items = [
        InventoryItem(
            name="Mystery water",
            quantity=4,
            unit=InventoryUnit.PIECE,
            category="Water",
            # no liters_per_unit
        )
    ]
    result = assess(items, settings)
    assert result.water_on_hand == 0.0
    assert result.unmeasurable_water_count == 1


def test_percent_capped_at_100() -> None:
    settings = ReadinessSettings(number_of_people=1, duration_hours=24)
    items = [
        InventoryItem(
            name="Lots of water",
            quantity=100,
            unit=InventoryUnit.LITER,
            category="Water",
        )
    ]
    result = assess(items, settings)
    assert result.water_percent == 100.0
