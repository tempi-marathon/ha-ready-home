"""Unit tests for config-flow category merge helpers."""

from __future__ import annotations

import pytest

from custom_components.ready_home.config_flow import (
    _apply_category,
    _apply_duration,
    _merge_category_lists,
    _new_entry_target_options,
    _overlap_error,
    _targets_form_values,
    _targets_summary_placeholders,
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


def _apply_form(options: dict, form: dict) -> dict | None:
    """Apply every category of a full form in turn (as the nested menu does)."""
    for key in ("adults", "children", "babies_toddlers", "seniors"):
        options = _apply_category(
            options,
            key,
            {k: v for k, v in form.items() if k.endswith(f"_{key}")},
        )
        if options is None:
            return None
    return options


def test_apply_category_writes_keys_and_syncs_legacy() -> None:
    updated = _apply_form(
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


def test_apply_category_changes_only_that_category() -> None:
    base = _apply_form({}, _form(count_adults=2))
    assert base is not None
    updated = _apply_category(
        base,
        "children",
        {
            "count_children": 3,
            "calories_per_day_children": 1700,
            "water_liters_per_day_children": 2.5,
        },
    )
    assert updated is not None
    changed = {k for k in updated if updated[k] != base.get(k)}
    assert changed == {
        "count_children",
        "calories_per_day_children",
        "water_liters_per_day_children",
        "number_of_people",
    }
    assert updated["number_of_people"] == 5


def test_apply_category_rejects_empty_household() -> None:
    assert _apply_form({}, _form()) is None
    only_adults = _apply_form({}, _form(count_adults=2))
    assert only_adults is not None
    zero_adults = {
        "count_adults": 0,
        "calories_per_day_adults": 2200,
        "water_liters_per_day_adults": 3.0,
    }
    assert _apply_category(only_adults, "adults", zero_adults) is None


def test_apply_category_allows_moving_people_to_another_category() -> None:
    base = _apply_form({}, _form(count_adults=2))
    assert base is not None
    moved = _apply_category(
        base,
        "seniors",
        {"count_seniors": 2, "calories_per_day_seniors": 1900, "water_liters_per_day_seniors": 3.0},
    )
    assert moved is not None
    zero_adults = {
        "count_adults": 0,
        "calories_per_day_adults": 2200,
        "water_liters_per_day_adults": 3.0,
    }
    updated = _apply_category(moved, "adults", zero_adults)
    assert updated is not None
    assert updated["number_of_people"] == 2


def test_apply_category_roundtrip_totals() -> None:
    from custom_components.ready_home.models import ReadinessSettings

    updated = _apply_form(
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
    values = _targets_form_values(legacy)
    updated = _apply_category(
        legacy,
        "children",
        {k: v for k, v in values.items() if k.endswith("_children")},
    )
    assert updated is not None
    after = ReadinessSettings.from_options(updated)
    assert after.food_target_calories() == before.food_target_calories()
    assert after.water_target_liters() == before.water_target_liters()
    assert updated["number_of_people"] == 3


def test_apply_duration_changes_only_duration() -> None:
    options = {"count_adults": 2, "duration_hours": 72}
    assert _apply_duration(options, {"duration_hours": 96.0}) == {
        "count_adults": 2,
        "duration_hours": 96,
    }


def test_targets_summary_placeholders() -> None:
    options = _apply_form({"duration_hours": 72}, _form(count_adults=2, count_children=2))
    assert options is not None
    assert _targets_summary_placeholders(options) == {
        "adults": "2",
        "children": "2",
        "babies_toddlers": "0",
        "seniors": "0",
        "hours": "72",
    }


def test_targets_summary_placeholders_legacy_fallback() -> None:
    assert _targets_summary_placeholders(
        {"number_of_people": 3, "duration_hours": 48}
    ) == {"adults": "3", "children": "0", "babies_toddlers": "0", "seniors": "0", "hours": "48"}


def test_new_entry_options_are_adults_only() -> None:
    from custom_components.ready_home.models import ReadinessSettings

    options = _new_entry_target_options(3)
    s = ReadinessSettings.from_options(options)
    assert options["number_of_people"] == 3
    assert [c.count for c in s.category_targets()] == [3, 0, 0, 0]
    assert s.daily_calories() == 3 * 2200


def _make_flow(options: dict):
    from types import SimpleNamespace

    from custom_components.ready_home.config_flow import ReadyHomeOptionsFlow

    class Flow(ReadyHomeOptionsFlow):
        def async_show_form(self, **kwargs):  # type: ignore[override]
            return {"type": "form", **kwargs}

        def async_show_menu(self, **kwargs):  # type: ignore[override]
            return {"type": "menu", **kwargs}

    flow = Flow()
    saved: list[dict] = []

    def _update(entry, options):
        entry.options = options
        saved.append(options)

    entry = SimpleNamespace(options=options)
    flow.config_entry = entry  # type: ignore[attr-defined]
    flow.hass = SimpleNamespace(  # type: ignore[attr-defined]
        config_entries=SimpleNamespace(async_update_entry=_update)
    )
    return flow, saved


def _bounds(form: dict) -> dict:
    return {
        str(key): selector.args[0].kwargs
        for key, selector in form["data_schema"].schema.items()
    }


@pytest.mark.asyncio
async def test_targets_menu_lists_categories_duration_and_back() -> None:
    flow, _ = _make_flow({"number_of_people": 2, "duration_hours": 72})
    menu = await flow.async_step_targets()
    assert menu["type"] == "menu"
    assert menu["step_id"] == "targets"
    assert menu["menu_options"] == [
        "targets_adults",
        "targets_children",
        "targets_babies_toddlers",
        "targets_seniors",
        "targets_duration",
        "init",
    ]
    assert menu["description_placeholders"] == {
        "adults": "2",
        "children": "0",
        "babies_toddlers": "0",
        "seniors": "0",
        "hours": "72",
    }


@pytest.mark.asyncio
@pytest.mark.parametrize("category", ["adults", "children", "babies_toddlers", "seniors"])
async def test_category_form_fields_and_bounds(category: str) -> None:
    flow, _ = _make_flow({"number_of_people": 2})
    form = await getattr(flow, f"async_step_targets_{category}")()
    assert form["errors"] == {}
    assert form["step_id"] == f"targets_{category}"
    bounds = _bounds(form)
    assert set(bounds) == {
        f"count_{category}",
        f"calories_per_day_{category}",
        f"water_liters_per_day_{category}",
    }
    count = bounds[f"count_{category}"]
    assert (count["min"], count["max"], count["step"]) == (0, 50, 1)
    kcal = bounds[f"calories_per_day_{category}"]
    assert (kcal["min"], kcal["max"], kcal["step"]) == (500, 5000, 50)
    water = bounds[f"water_liters_per_day_{category}"]
    assert (water["min"], water["max"], water["step"]) == (0.5, 20, 0.1)


@pytest.mark.asyncio
async def test_category_submit_saves_and_returns_to_menu() -> None:
    flow, saved = _make_flow({"number_of_people": 2, "duration_hours": 72})
    result = await flow.async_step_targets_children(
        {"count_children": 2, "calories_per_day_children": 1800, "water_liters_per_day_children": 3}
    )
    assert result["type"] == "menu"
    assert result["step_id"] == "targets"
    assert saved[-1]["count_children"] == 2
    assert saved[-1]["number_of_people"] == 4
    assert result["description_placeholders"]["children"] == "2"


@pytest.mark.asyncio
async def test_category_submit_empty_household_shows_error_and_keeps_values() -> None:
    flow, saved = _make_flow({"number_of_people": 2})
    again = await flow.async_step_targets_adults(
        {"count_adults": 0, "calories_per_day_adults": 2200, "water_liters_per_day_adults": 3}
    )
    assert again["type"] == "form"
    assert again["errors"] == {"base": "invalid_people"}
    assert saved == []


@pytest.mark.asyncio
async def test_duration_form_and_save() -> None:
    flow, saved = _make_flow({"number_of_people": 2, "duration_hours": 48})
    form = await flow.async_step_targets_duration()
    bounds = _bounds(form)
    assert set(bounds) == {"duration_hours"}
    assert (bounds["duration_hours"]["min"], bounds["duration_hours"]["max"]) == (24, 720)
    assert next(iter(form["data_schema"].schema)).default() == 48

    result = await flow.async_step_targets_duration({"duration_hours": 96})
    assert result["type"] == "menu"
    assert saved[-1]["duration_hours"] == 96
    assert result["description_placeholders"]["hours"] == "96"
