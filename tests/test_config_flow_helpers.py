"""Unit tests for config-flow category merge helpers."""

from __future__ import annotations

import pytest

from custom_components.ready_home.config_flow import (
    _apply_targets,
    _merge_category_lists,
    _new_entry_target_options,
    _overlap_error,
    _targets_form_values,
)


def test_merge_category_lists_dedupes_case_insensitively() -> None:
    merged = _merge_category_lists(
        ["Food", "Medical"],
        ["food", "Dry food"],
        ["Water"],
    )
    assert merged == ["Food", "Medical", "Dry food", "Water"]


def test_merge_category_lists_skips_blank() -> None:
    assert _merge_category_lists(["Food", "  ", ""], ["Water"], []) == [
        "Food",
        "Water",
    ]


def test_merge_category_lists_preserves_first_casing() -> None:
    assert _merge_category_lists(["Food"], ["FOOD"], ["food"]) == ["Food"]


@pytest.mark.parametrize(
    ("food", "water", "expected"),
    [
        (["Food"], ["Water"], False),
        (["Food"], ["food"], True),
        ([" Food "], ["FOOD"], True),
        ([], ["Water"], False),
        (["Food", ""], ["Water", "  "], False),
    ],
)
def test_overlap_error(
    food: list[str], water: list[str], expected: bool
) -> None:
    assert _overlap_error(food, water) is expected


def _form(**overrides: object) -> dict:
    values: dict = {"duration_hours": 72}
    defaults = {
        "adults": (2200, 3.0),
        "children": (1800, 3.0),
        "babies_toddlers": (1000, 3.0),
        "seniors": (1900, 3.0),
    }
    for key, (kcal, water) in defaults.items():
        values[f"count_{key}"] = 0
        values[f"calories_per_day_{key}"] = kcal
        values[f"water_liters_per_day_{key}"] = water
    values.update(overrides)
    return values


def test_legacy_options_prefill_adults() -> None:
    values = _targets_form_values(
        {
            "number_of_people": 3,
            "calories_per_person_per_day": 2500,
            "water_liters_per_person_per_day": 4.0,
            "duration_hours": 48,
        }
    )
    assert values["count_adults"] == 3
    assert values["calories_per_day_adults"] == 2500
    assert values["water_liters_per_day_adults"] == 4.0
    assert values["count_children"] == 0
    assert values["duration_hours"] == 48


def test_unset_household_prefills_two_adults() -> None:
    assert _targets_form_values({})["count_adults"] == 2


def test_apply_targets_writes_new_keys_and_syncs_legacy() -> None:
    updated = _apply_targets(
        {"locations": ["Pantry"], "number_of_people": 1},
        _form(
            count_adults=2,
            count_children=1,
            count_babies_toddlers=1,
            water_liters_per_day_babies_toddlers=4,
            calories_per_day_adults=2400,
        ),
    )
    assert updated is not None
    assert updated["locations"] == ["Pantry"]
    assert updated["number_of_people"] == 4
    assert updated["count_babies_toddlers"] == 1
    assert updated["water_liters_per_day_babies_toddlers"] == 4.0
    assert updated["calories_per_person_per_day"] == 2400
    assert updated["water_liters_per_person_per_day"] == 3.0


def test_apply_targets_rejects_empty_household() -> None:
    assert _apply_targets({}, _form()) is None


def test_apply_targets_roundtrip_totals() -> None:
    from custom_components.ready_home.models import ReadinessSettings

    updated = _apply_targets(
        {},
        _form(count_adults=2, count_children=2, count_babies_toddlers=1, count_seniors=1),
    )
    assert updated is not None
    s = ReadinessSettings.from_options(updated)
    assert s.number_of_people == 6
    assert s.daily_calories() == 10900


def test_legacy_save_without_changes_keeps_totals() -> None:
    from custom_components.ready_home.models import ReadinessSettings

    legacy = {
        "number_of_people": 3,
        "calories_per_person_per_day": 2000,
        "water_liters_per_person_per_day": 3.0,
        "duration_hours": 72,
    }
    before = ReadinessSettings.from_options(legacy)
    updated = _apply_targets(legacy, _targets_form_values(legacy))
    assert updated is not None
    after = ReadinessSettings.from_options(updated)
    assert after.food_target_calories() == before.food_target_calories()
    assert after.water_target_liters() == before.water_target_liters()


def test_new_entry_options_are_adults_only() -> None:
    from custom_components.ready_home.models import ReadinessSettings

    options = _new_entry_target_options(3)
    s = ReadinessSettings.from_options(options)
    assert options["number_of_people"] == 3
    assert [c.count for c in s.category_targets()] == [3, 0, 0, 0]
    assert s.daily_calories() == 3 * 2200


@pytest.mark.asyncio
async def test_targets_form_bounds_and_empty_household_error() -> None:
    from types import SimpleNamespace

    from custom_components.ready_home.config_flow import ReadyHomeOptionsFlow

    class _Flow(ReadyHomeOptionsFlow):
        def async_show_form(self, **kwargs):  # type: ignore[override]
            return kwargs

    flow = _Flow()
    flow.config_entry = SimpleNamespace(options={"number_of_people": 2})  # type: ignore[attr-defined]

    form = await flow.async_step_targets()
    assert form["errors"] == {}
    bounds = {
        str(key): selector.args[0].kwargs
        for key, selector in form["data_schema"].schema.items()
    }
    for category in ("adults", "children", "babies_toddlers", "seniors"):
        count = bounds[f"count_{category}"]
        assert (count["min"], count["max"], count["step"]) == (0, 50, 1)
        kcal = bounds[f"calories_per_day_{category}"]
        assert (kcal["min"], kcal["max"]) == (500, 5000)
        water = bounds[f"water_liters_per_day_{category}"]
        assert (water["min"], water["max"]) == (0.5, 20)
    assert bounds["duration_hours"]["min"] == 24

    # Submitting an empty household re-shows the form with invalid_people.
    again = await flow.async_step_targets(_form())
    assert again["errors"] == {"base": "invalid_people"}
