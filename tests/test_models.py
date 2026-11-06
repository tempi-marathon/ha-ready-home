"""Unit tests for InventoryItem serialization and helpers."""

from __future__ import annotations

from custom_components.ready_home.models import (
    ContentsUnit,
    InventoryItem,
    InventoryPriority,
    InventoryUnit,
    ReadinessSettings,
)


def test_round_trip_dict() -> None:
    item = InventoryItem(
        name="Beans",
        quantity=12,
        desired_quantity=24,
        unit=InventoryUnit.PACK,
        location="Pantry",
        category="Food",
        priority=InventoryPriority.ESSENTIAL,
        calories_per_unit=350,
        barcode="123",
        expiry_date="2027-01-01",
    )
    restored = InventoryItem.from_dict(item.to_dict())
    assert restored.name == "Beans"
    assert restored.quantity == 12
    assert restored.unit == InventoryUnit.PACK
    assert restored.priority == InventoryPriority.ESSENTIAL
    assert restored.category == "Food"
    assert restored.calories_per_unit == 350
    assert restored.barcode == "123"
    assert restored.calories_on_hand() == 4200
    assert "resource" not in item.to_dict()


def test_legacy_resource_fills_empty_category() -> None:
    food = InventoryItem.from_dict(
        {"name": "Rice", "quantity": 1, "resource": "food"}
    )
    assert food.category == "Food"
    water = InventoryItem.from_dict(
        {"name": "Jug", "quantity": 1, "resource": "water"}
    )
    assert water.category == "Water"


def test_from_dict_normalizes_invalid_expiry() -> None:
    item = InventoryItem.from_dict(
        {"name": "Rice", "quantity": 1, "expiry_date": "boom"}
    )
    assert item.expiry_date is None
    empty = InventoryItem.from_dict(
        {"name": "Rice", "quantity": 1, "expiry_date": ""}
    )
    assert empty.expiry_date is None
    assert empty.is_expired() is False


def test_is_expired_invalid_date_soft_fails() -> None:
    item = InventoryItem(name="X", quantity=1, expiry_date="not-iso")
    assert item.is_expired() is False


def test_with_updates_refreshes_timestamp() -> None:
    item = InventoryItem(name="Rice", quantity=2)
    updated = item.with_updates(quantity=5, calories_per_unit=400)
    assert updated.quantity == 5
    assert updated.calories_per_unit == 400
    assert updated.id == item.id
    assert updated.updated_at >= item.updated_at


def test_water_liters_helpers() -> None:
    liters = InventoryItem(
        name="Jug", quantity=2, unit=InventoryUnit.LITER, category="Water"
    )
    assert liters.water_liters_on_hand() == 2.0

    ml = InventoryItem(
        name="Bottle",
        quantity=500,
        unit=InventoryUnit.MILLILITER,
        category="Water",
    )
    assert ml.water_liters_on_hand() == 0.5

    pieces = InventoryItem(
        name="Six pack",
        quantity=6,
        unit=InventoryUnit.PIECE,
        category="Water",
        liters_per_unit=1.5,
    )
    assert pieces.water_liters_on_hand() == 9.0

    unmeasurable = InventoryItem(
        name="Unknown",
        quantity=3,
        unit=InventoryUnit.PIECE,
        category="Water",
    )
    assert unmeasurable.water_liters_on_hand() is None


def test_contents_model_water_and_food() -> None:
    water = InventoryItem(
        name="Bottles",
        quantity=12,
        unit=InventoryUnit.PIECE,
        category="Water",
        contents_per_unit=0.5,
        contents_unit=ContentsUnit.LITER,
    ).with_synced_derived()
    assert water.water_liters_on_hand() == 6.0
    assert water.liters_per_unit == 0.5

    rice = InventoryItem(
        name="Rice",
        quantity=1,
        unit=InventoryUnit.PIECE,
        category="Food",
        contents_per_unit=400,
        contents_unit=ContentsUnit.GRAM,
        calories_per_content=3.54,
    ).with_synced_derived()
    assert rice.calories_on_hand() == 1416.0
    assert rice.calories_per_unit == 1416.0

    soup = InventoryItem(
        name="Soup",
        quantity=1,
        unit=InventoryUnit.PIECE,
        category="Food",
        contents_per_unit=800,
        contents_unit=ContentsUnit.MILLILITER,
        calories_per_content=0.49,
    )
    assert soup.calories_on_hand() == 392.0
    assert soup.water_liters_on_hand() == 0.8


def test_category_mapping_helpers() -> None:
    settings = ReadinessSettings(
        food_categories=("Food", "Vegetables"),
        water_categories=("Water",),
    )
    assert settings.is_food_category("vegetables")
    assert settings.is_water_category("Water")
    assert settings.readiness_kind("Medical") == "none"
    assert settings.readiness_kind("Vegetables") == "food"


def _old_water(people: int, liters: float, hours: int) -> float:
    return people * liters * hours / 24.0


def _old_calories(people: int, kcal: int, hours: int) -> float:
    return people * kcal * hours / 24.0


MIXED = {
    "count_adults": 2,
    "count_children": 2,
    "count_babies_toddlers": 1,
    "count_seniors": 1,
    "duration_hours": 24,
}


def test_mixed_household_defaults_sum() -> None:
    s = ReadinessSettings.from_options(dict(MIXED))
    assert s.number_of_people == 6
    assert s.daily_calories() == 2 * 2200 + 2 * 1800 + 1000 + 1900 == 10900
    assert s.daily_water_liters() == 18.0
    assert s.food_target_calories() == 10900
    assert s.water_target_liters() == 18.0


def test_mixed_household_fourteen_day_period() -> None:
    s = ReadinessSettings.from_options({**MIXED, "duration_hours": 14 * 24})
    assert s.food_target_calories() == 10900 * 14
    assert s.water_target_liters() == 18.0 * 14


def test_legacy_options_match_old_formula() -> None:
    for people in range(1, 11):
        for kcal in (1500, 2000, 2500):
            for liters in (2, 3, 4.5):
                for hours in (24, 72, 336):
                    s = ReadinessSettings.from_options(
                        {
                            "number_of_people": people,
                            "calories_per_person_per_day": kcal,
                            "water_liters_per_person_per_day": liters,
                            "duration_hours": hours,
                        }
                    )
                    assert s.number_of_people == people
                    assert s.food_target_calories() == _old_calories(people, kcal, hours)
                    assert s.water_target_liters() == _old_water(people, liters, hours)


def test_legacy_defaults_when_values_missing() -> None:
    s = ReadinessSettings.from_options({"number_of_people": 3})
    assert s.food_target_calories() == _old_calories(3, 2000, 72)
    assert s.water_target_liters() == _old_water(3, 3.0, 72)


def test_missing_headcount_is_no_household() -> None:
    s = ReadinessSettings.from_options({})
    assert s.number_of_people is None
    assert s.food_target_calories() is None
    assert s.water_target_liters() is None


def test_all_counts_zero_is_no_household() -> None:
    s = ReadinessSettings.from_options(
        {"count_adults": 0, "count_children": 0, "number_of_people": 4}
    )
    assert s.number_of_people is None
    assert s.food_target_calories() is None


def test_new_keys_win_over_legacy() -> None:
    s = ReadinessSettings.from_options(
        {
            "number_of_people": 9,
            "calories_per_person_per_day": 3000,
            "count_adults": 1,
            "duration_hours": 24,
        }
    )
    assert s.number_of_people == 1
    assert s.daily_calories() == 2200


def test_invalid_stored_values_are_clamped_or_defaulted() -> None:
    s = ReadinessSettings.from_options(
        {
            "count_adults": 2,
            "count_children": -3,
            "count_seniors": "x",
            "calories_per_day_adults": "oops",
            "duration_hours": 24,
        }
    )
    assert s.number_of_people == 2
    assert s.daily_calories() == 2 * 2200


def test_override_changes_only_that_category() -> None:
    base = ReadinessSettings.from_options(dict(MIXED))
    s = ReadinessSettings.from_options({**MIXED, "water_liters_per_day_babies_toddlers": 4})
    assert s.daily_water_liters() == base.daily_water_liters() + 1
    assert s.daily_calories() == base.daily_calories()


def test_zero_value_with_people_is_honoured() -> None:
    s = ReadinessSettings.from_options(
        {"count_adults": 1, "calories_per_day_adults": 0, "duration_hours": 24}
    )
    assert s.daily_calories() == 0


def test_household_attributes_legacy_and_mixed() -> None:
    legacy = ReadinessSettings.from_options({"number_of_people": 3})
    assert legacy.number_of_people == 3  # people sensor value stays the total headcount
    assert legacy.household_attributes() == {
        "age_categories": {"adults": 3, "children": 0, "babies_toddlers": 0, "seniors": 0},
        "daily_calories": 6000.0,
        "daily_water_liters": 9.0,
    }
    mixed = ReadinessSettings.from_options(dict(MIXED))
    assert mixed.number_of_people == 6
    assert mixed.household_attributes() == {
        "age_categories": {"adults": 2, "children": 2, "babies_toddlers": 1, "seniors": 1},
        "daily_calories": 10900.0,
        "daily_water_liters": 18.0,
    }


def test_household_attributes_without_household() -> None:
    attrs = ReadinessSettings.from_options({}).household_attributes()
    assert attrs["daily_calories"] is None
    assert attrs["daily_water_liters"] is None
