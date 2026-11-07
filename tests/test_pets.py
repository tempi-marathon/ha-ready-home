"""Tests for pets: targets, pet food readiness, mapping, options helpers, payloads."""

from __future__ import annotations

from datetime import date, timedelta
from types import SimpleNamespace

import pytest
from conftest import (
    LEGACY_ASSESSMENT,
    LEGACY_BUCKET_IDS,
    LEGACY_COMPLETENESS,
    LEGACY_EVENT_SUMMARIES,
)

from custom_components.ready_home.attention import (
    AttentionBuckets,
    build_buckets,
    event_item_summary,
    item_summary,
)
from custom_components.ready_home.completeness import assess_category_completeness
from custom_components.ready_home.config_flow import (
    _add_pet,
    _default_pet_food_categories,
    _merge_category_lists,
    _overlap_error,
    _pet_from_input,
    _remove_pet,
    _stored_pets,
    _update_pet,
)
from custom_components.ready_home.coordinator import ReadyHomeData
from custom_components.ready_home.models import (
    ContentsUnit,
    InventoryItem,
    InventoryPriority,
    InventoryUnit,
    PetTarget,
    ReadinessSettings,
    contents_to_grams,
    pets_from_options,
)
from custom_components.ready_home.readiness import (
    assess,
    pet_food_attr_dict,
    pet_food_readiness_state,
)
from custom_components.ready_home.websocket_api import (
    _assessment_dict,
    _settings_dict,
    _snapshot,
)

TODAY = date(2026, 9, 4)


def _pet(pid: str, food: float, water: float, name: str = "Rex", kind: str = "") -> PetTarget:
    return PetTarget(
        id=pid, name=name, type=kind, food_grams_per_day=food, water_liters_per_day=water
    )


def _kibble(grams: float, *, qty: float = 1, category: str = "Pet food", **kw) -> InventoryItem:
    return InventoryItem(
        name="Kibble",
        quantity=qty,
        category=category,
        contents_per_unit=grams,
        contents_unit=ContentsUnit.GRAM,
        **kw,
    )


# ---------------------------------------------------------------- parsing / grams


def test_pets_from_options_missing_is_empty() -> None:
    assert pets_from_options(None) == ()
    assert ReadinessSettings.from_options({"number_of_people": 2}).pets == ()


def test_pets_from_options_reads_valid_and_skips_malformed() -> None:
    raw = [
        {"id": "a", "name": " Rex ", "type": " dog ", "food_grams_per_day": 400,
         "water_liters_per_day": 0.5},
        {"name": "NoAmounts"},
        {"name": "", "food_grams_per_day": 1, "water_liters_per_day": 1},
        {"name": "Neg", "food_grams_per_day": -1, "water_liters_per_day": 1},
        {"name": "Text", "food_grams_per_day": "lots", "water_liters_per_day": 1},
        {"name": "Nan", "food_grams_per_day": float("nan"), "water_liters_per_day": 1},
        "not a mapping",
        {"name": "Tom", "food_grams_per_day": 0, "water_liters_per_day": 0.2},
    ]
    pets = pets_from_options(raw)
    assert [p.name for p in pets] == ["Rex", "Tom"]
    assert pets[0].type == "dog"
    assert pets[0].id == "a"
    assert pets[1].id == "pet-7"
    assert pets[1].type == ""


def test_contents_to_grams() -> None:
    assert contents_to_grams(250, ContentsUnit.GRAM) == 250
    assert contents_to_grams(2, ContentsUnit.KILOGRAM) == 2000
    assert contents_to_grams(1, ContentsUnit.LITER) is None
    assert contents_to_grams(1, ContentsUnit.MILLILITER) is None


def test_pet_food_grams_on_hand() -> None:
    assert _kibble(500, qty=3).pet_food_grams_on_hand() == 1500
    kg = InventoryItem(
        name="Bag", quantity=2, contents_per_unit=1.5, contents_unit=ContentsUnit.KILOGRAM
    )
    assert kg.pet_food_grams_on_hand() == 3000
    legacy_g = InventoryItem(name="x", quantity=300, unit=InventoryUnit.GRAM)
    assert legacy_g.pet_food_grams_on_hand() == 300
    legacy_kg = InventoryItem(name="x", quantity=2, unit=InventoryUnit.KILOGRAM)
    assert legacy_kg.pet_food_grams_on_hand() == 2000
    liquid = InventoryItem(
        name="Milk", quantity=1, contents_per_unit=1, contents_unit=ContentsUnit.LITER
    )
    assert liquid.pet_food_grams_on_hand() is None
    assert InventoryItem(name="Mystery", quantity=2).pet_food_grams_on_hand() is None


# ---------------------------------------------------------------- targets


def test_targets_with_zero_pets_unchanged() -> None:
    s = ReadinessSettings(number_of_people=2, duration_hours=72)
    assert s.water_target_liters() == 18.0
    assert s.pet_food_target_grams() == 0.0
    assert s.daily_pet_food_grams() == 0.0


def test_targets_with_one_pet() -> None:
    s = ReadinessSettings(
        number_of_people=2, duration_hours=72, pets=(_pet("a", 400, 0.5),)
    )
    assert s.water_target_liters() == pytest.approx(18.0 + 1.5)
    assert s.pet_food_target_grams() == pytest.approx(1200.0)
    assert s.food_target_calories() == pytest.approx(2 * 2000 * 3)


def test_targets_with_many_pets_zero_amounts_and_duplicate_names() -> None:
    pets = (
        _pet("a", 400, 0.5, name="Rex"),
        _pet("b", 100, 0.2, name="Rex"),
        _pet("c", 0, 0.0, name="Fish"),
    )
    s = ReadinessSettings(number_of_people=1, duration_hours=48, pets=pets)
    assert s.water_target_liters() == pytest.approx((3.0 + 0.7) * 2)
    assert s.pet_food_target_grams() == pytest.approx(500 * 2)
    s_removed = ReadinessSettings(number_of_people=1, duration_hours=48, pets=pets[2:])
    assert s_removed.pet_food_target_grams() == 0.0


def test_no_people_count_leaves_targets_unset() -> None:
    s = ReadinessSettings(number_of_people=None, pets=(_pet("a", 400, 0.5),))
    assert s.water_target_liters() is None
    assert s.pet_food_target_grams() is None
    result = assess([], s, TODAY)
    assert result.needs_people_count is True
    assert result.pet_food_target is None


def test_target_breakdown_sums_to_totals() -> None:
    options = {
        "count_adults": 2, "count_children": 1, "count_babies_toddlers": 0,
        "count_seniors": 1, "duration_hours": 96,
        "pets": [
            {"id": "a", "name": "Rex", "food_grams_per_day": 400, "water_liters_per_day": 0.5},
            {"id": "b", "name": "Tom", "food_grams_per_day": 80, "water_liters_per_day": 0.2},
        ],
    }
    s = ReadinessSettings.from_options(options)
    bd = s.target_breakdown()
    water = sum(bd["water_liters"]["age_categories"].values()) + sum(
        bd["water_liters"]["pets"].values()
    )
    assert water == pytest.approx(s.water_target_liters())
    assert sum(bd["food_calories"]["age_categories"].values()) == pytest.approx(
        s.food_target_calories()
    )
    assert sum(bd["pet_food_grams"]["pets"].values()) == pytest.approx(
        s.pet_food_target_grams()
    )
    assert set(bd["water_liters"]["pets"]) == {"a", "b"}
    assert bd["pet_food_grams"]["pets"]["a"] == pytest.approx(1600.0)


def test_target_breakdown_no_pets_and_legacy_settings() -> None:
    s = ReadinessSettings(number_of_people=2, duration_hours=72)
    bd = s.target_breakdown()
    assert bd["water_liters"]["pets"] == {}
    assert bd["pet_food_grams"]["pets"] == {}
    assert bd["water_liters"]["age_categories"]["adults"] == pytest.approx(18.0)
    assert sum(bd["water_liters"]["age_categories"].values()) == pytest.approx(
        s.water_target_liters()
    )
    empty = ReadinessSettings(number_of_people=None).target_breakdown()
    assert empty["water_liters"] == {"age_categories": {}, "pets": {}}


# ---------------------------------------------------------------- readiness


def _pet_settings(**kw) -> ReadinessSettings:
    base = {
        "number_of_people": 1,
        "duration_hours": 72,
        "pets": (_pet("a", 400, 0.5),),
        "pet_food_categories": ("Pet food",),
    }
    base.update(kw)
    return ReadinessSettings(**base)


def test_pet_food_percent_from_gram_and_kilogram_items() -> None:
    kg = InventoryItem(
        name="Bag", quantity=1, category="Pet food",
        contents_per_unit=0.4, contents_unit=ContentsUnit.KILOGRAM,
    )
    result = assess([_kibble(200), kg], _pet_settings(), TODAY)
    assert result.pet_food_target == pytest.approx(1200.0)
    assert result.pet_food_on_hand == pytest.approx(600.0)
    assert result.pet_food_percent == pytest.approx(50.0)
    assert result.pet_food_supply_hours == pytest.approx(36.0)


def test_pet_food_excludes_expired_and_counts_unmeasurable() -> None:
    expired = _kibble(1000, expiry_date=(TODAY - timedelta(days=1)).isoformat())
    unknown = InventoryItem(name="Mystery", quantity=2, category="Pet food")
    result = assess([expired, unknown, _kibble(300)], _pet_settings(), TODAY)
    assert result.pet_food_on_hand == 300.0
    assert result.unmeasurable_pet_food_count == 1


def test_overall_includes_pet_food_only_when_target_positive() -> None:
    water = InventoryItem(
        name="W", quantity=100, unit=InventoryUnit.LITER, category="Water"
    )
    food = InventoryItem(name="F", quantity=1, category="Food", calories_per_unit=100000)
    with_pets = assess([water, food, _kibble(300)], _pet_settings(), TODAY)
    assert with_pets.water_percent == 100.0
    assert with_pets.food_percent == 100.0
    assert with_pets.overall_percent == pytest.approx(25.0)
    assert with_pets.supply_hours == pytest.approx(18.0)

    no_pets = assess([water, food], _pet_settings(pets=()), TODAY)
    assert no_pets.pet_food_target == 0.0
    assert no_pets.pet_food_percent == 0.0
    assert no_pets.overall_percent == 100.0

    zero_food_pet = assess(
        [water, food], _pet_settings(pets=(_pet("z", 0, 0.5),)), TODAY
    )
    assert zero_food_pet.overall_percent == 100.0


def test_pet_water_uses_shared_water_stock() -> None:
    water = InventoryItem(name="W", quantity=19.5, unit=InventoryUnit.LITER, category="Water")
    s = ReadinessSettings(number_of_people=2, pets=(_pet("a", 400, 0.5),))
    result = assess([water], s, TODAY)
    assert result.water_target == pytest.approx(19.5)
    assert result.water_percent == pytest.approx(100.0)


def test_pet_food_not_counted_as_human_food() -> None:
    s = _pet_settings(food_categories=("Food",))
    result = assess([_kibble(300)], s, TODAY)
    assert result.food_on_hand == 0.0
    assert result.pet_food_on_hand == 300.0


def test_pet_food_attr_dict() -> None:
    result = assess([_kibble(600, priority=InventoryPriority.ESSENTIAL)], _pet_settings(), TODAY)
    attrs = pet_food_attr_dict(result)
    assert attrs["pet_food_on_hand"] == 600.0
    assert attrs["pet_food_on_hand_unit"] == "g"
    assert attrs["pet_food_target"] == pytest.approx(1200.0)
    assert attrs["pet_food_supply_hours_unit"] == "h"
    assert attrs["pet_food_percent"] == pytest.approx(50.0)


def test_pet_food_readiness_state_is_percent_of_target() -> None:
    result = assess([_kibble(600, priority=InventoryPriority.ESSENTIAL)], _pet_settings(), TODAY)
    assert pet_food_readiness_state(result) == 50.0


def test_pet_food_readiness_state_rounds_to_one_decimal() -> None:
    result = assess([_kibble(401)], _pet_settings(), TODAY)
    assert pet_food_readiness_state(result) == round(401 / 1200 * 100, 1)


def test_pet_food_readiness_state_is_zero_with_target_and_no_stock() -> None:
    result = assess([], _pet_settings(), TODAY)
    assert result.pet_food_target > 0
    assert pet_food_readiness_state(result) == 0.0


def test_pet_food_readiness_state_has_no_value_without_pets() -> None:
    result = assess([_kibble(600)], _pet_settings(pets=()), TODAY)
    assert pet_food_readiness_state(result) is None


def test_pet_food_readiness_state_has_no_value_for_pet_with_zero_food() -> None:
    result = assess([_kibble(600)], _pet_settings(pets=(_pet("a", 0, 0.5),)), TODAY)
    assert pet_food_readiness_state(result) is None


def test_pet_food_readiness_state_caps_at_100() -> None:
    result = assess([_kibble(5000)], _pet_settings(), TODAY)
    assert pet_food_readiness_state(result) == 100.0


# ---------------------------------------------------------------- category mapping


def test_pet_food_category_mapping_and_rename() -> None:
    s = ReadinessSettings(pet_food_categories=("Pet food",))
    assert s.is_pet_food_category("pet FOOD")
    assert s.readiness_kind("Pet food") == "pet_food"
    renamed = ReadinessSettings(pet_food_categories=("Kibble",))
    assert not renamed.is_pet_food_category("Pet food")
    assert renamed.readiness_kind("kibble") == "pet_food"
    assert renamed.readiness_kind("") == "none"


def test_overlap_precedence_water_then_food_then_pet_food() -> None:
    s = ReadinessSettings(
        food_categories=("Both", "FoodPet"),
        water_categories=("Both",),
        pet_food_categories=("Both", "FoodPet", "Pets"),
    )
    assert s.readiness_kind("Both") == "water"
    assert s.readiness_kind("FoodPet") == "food"
    assert s.readiness_kind("Pets") == "pet_food"


def test_absent_pet_food_categories_reads_empty() -> None:
    s = ReadinessSettings.from_options({"number_of_people": 2})
    assert s.pet_food_categories == ()
    assert s.readiness_kind("Pet food") == "none"


def test_mapped_pet_food_category_excluded_from_completeness() -> None:
    items = [
        InventoryItem(name="Kibble", quantity=0, desired_quantity=2, category="Pet food"),
        InventoryItem(name="Bandages", quantity=0, desired_quantity=2, category="Medical"),
    ]
    unmapped = ReadinessSettings(categories=("Medical", "Pet food"))
    mapped = ReadinessSettings(
        categories=("Medical", "Pet food"), pet_food_categories=("Pet food",)
    )
    def names(settings: ReadinessSettings) -> list[str]:
        result = assess_category_completeness(items, settings, TODAY)
        return [c.category for c in result.categories]

    assert names(unmapped) == ["Medical", "Pet food"]
    assert names(mapped) == ["Medical"]


# ---------------------------------------------------------------- attention


def test_pet_food_items_get_item_level_attention() -> None:
    expired = _kibble(500, expiry_date=(TODAY - timedelta(days=1)).isoformat())
    soon = _kibble(500, expiry_date=(TODAY + timedelta(days=3)).isoformat())
    low = _kibble(500, qty=1, desired_quantity=4)
    b = build_buckets([expired, soon, low], today=TODAY, urgent_days=7, expiring_days=30)
    assert b.expired == [expired]
    assert b.within_urgent == [soon]
    assert b.low_stock == [low]


def test_summary_grams_only_for_pet_food_category() -> None:
    s = _pet_settings()
    pet_item = _kibble(500, qty=2)
    human = InventoryItem(
        name="Rice", quantity=2, category="Food",
        contents_per_unit=500, contents_unit=ContentsUnit.GRAM,
    )
    for fn in (item_summary, event_item_summary):
        assert fn(pet_item, s)["pet_food_grams_on_hand"] == 1000.0
        assert "pet_food_grams_on_hand" not in fn(human, s)
        assert "pet_food_grams_on_hand" not in fn(pet_item)
        unmeasurable = InventoryItem(name="?", quantity=1, category="Pet food")
        assert "pet_food_grams_on_hand" not in fn(unmeasurable, s)
    assert "name" in event_item_summary(pet_item, s)
    assert "Rex" not in str(event_item_summary(pet_item, s))


# ---------------------------------------------------------------- options flow helpers


def _form(name="Rex", kind="dog", food=400, water=0.5) -> dict:
    return {"name": name, "type": kind, "food_grams_per_day": food, "water_liters_per_day": water}


def test_add_pet_accepts_valid_and_optional_type() -> None:
    updated, error = _add_pet({}, _form(kind=""))
    assert error is None and updated is not None
    pet = updated["pets"][0]
    assert pet["name"] == "Rex" and pet["type"] == ""
    assert pet["food_grams_per_day"] == 400.0 and len(pet["id"]) == 32


@pytest.mark.parametrize(
    ("form", "error"),
    [
        (_form(name="  "), "invalid_pet_name"),
        (_form(food=-1), "invalid_pet_amount"),
        (_form(water="abc"), "invalid_pet_amount"),
        (_form(food=None), "invalid_pet_amount"),
        (_form(water=float("inf")), "invalid_pet_amount"),
    ],
)
def test_add_pet_rejects_invalid(form: dict, error: str) -> None:
    assert _add_pet({}, form) == (None, error)
    assert _pet_from_input(form, "x") == (None, error)


def test_add_pets_keeps_duplicate_names_and_unique_ids() -> None:
    first, _ = _add_pet({}, _form())
    second, _ = _add_pet(first, _form())
    assert second is not None
    pets = second["pets"]
    assert [p["name"] for p in pets] == ["Rex", "Rex"]
    assert pets[0]["id"] != pets[1]["id"]


def test_first_pet_seeds_pet_food_category_only_when_absent() -> None:
    updated, _ = _add_pet({"categories": ["Food", "Water"]}, _form())
    assert updated["pet_food_categories"] == ["Pet food"]
    assert "Pet food" in updated["categories"]

    cleared, _ = _add_pet({"pet_food_categories": []}, _form())
    assert cleared["pet_food_categories"] == []

    kept, _ = _add_pet({"pet_food_categories": ["Kibble"]}, _form())
    assert kept["pet_food_categories"] == ["Kibble"]


def test_first_pet_does_not_seed_a_category_already_mapped_to_food_or_water() -> None:
    options = {"food_categories": ["Food", "pet food"], "water_categories": ["Water"]}
    updated, _ = _add_pet(options, _form())
    assert updated["pet_food_categories"] == []
    assert updated["food_categories"] == ["Food", "pet food"]
    assert updated["water_categories"] == ["Water"]


def test_update_pet_keeps_id_and_other_pets() -> None:
    one, _ = _add_pet({}, _form(name="Rex"))
    two, _ = _add_pet(one, _form(name="Tom", food=80))
    rex, tom = two["pets"]
    edited, error = _update_pet(two, rex["id"], _form(name="Rexy", food=450))
    assert error is None
    assert [p["id"] for p in edited["pets"]] == [rex["id"], tom["id"]]
    assert edited["pets"][0]["name"] == "Rexy"
    assert edited["pets"][0]["food_grams_per_day"] == 450.0
    assert edited["pets"][1] == tom
    assert _update_pet(two, "missing", _form()) == (None, "unknown_pet")
    assert _update_pet(two, rex["id"], _form(name="")) == (None, "invalid_pet_name")


def test_remove_pet() -> None:
    one, _ = _add_pet({}, _form(name="Rex"))
    two, _ = _add_pet(one, _form(name="Tom"))
    removed = _remove_pet(two, two["pets"][0]["id"])
    assert [p["name"] for p in removed["pets"]] == ["Tom"]
    assert _stored_pets(_remove_pet(removed, removed["pets"][0]["id"])) == []


def test_stored_pets_reads_pet_without_id() -> None:
    options = {"pets": [{"name": "Rex", "food_grams_per_day": 1, "water_liters_per_day": 1}]}
    assert _stored_pets(options)[0]["id"] == "pet-0"
    edited, _ = _update_pet(options, "pet-0", _form())
    assert edited is not None and edited["pets"][0]["id"] == "pet-0"


def test_pet_food_category_overlap_and_defaults() -> None:
    assert _overlap_error(["Food"], ["Water"], ["Pet food"]) is False
    assert _overlap_error(["Food"], ["Water"], ["food"]) is True
    assert _overlap_error(["Food"], ["Water"], ["WATER"]) is True
    assert _overlap_error(["Food"], ["Water"]) is False
    assert _default_pet_food_categories(["Food"], ["Water"]) == ["Pet food"]
    assert _default_pet_food_categories(["Pet Food"], ["Water"]) == []
    assert _merge_category_lists(["Food"], ["Food"], ["Water"], ["Pet food"]) == [
        "Food",
        "Water",
        "Pet food",
    ]


# ---------------------------------------------------------------- websocket payloads


def _data(settings: ReadinessSettings, items: list[InventoryItem]) -> ReadyHomeData:
    return ReadyHomeData(
        items=items,
        settings=settings,
        assessment=assess(items, settings, TODAY),
        buckets=build_buckets(items, today=TODAY, urgent_days=7, expiring_days=30),
        completeness=assess_category_completeness(items, settings, TODAY),
    )


def test_settings_dict_includes_pets_and_breakdown() -> None:
    settings = _pet_settings(number_of_people=2)
    result = _settings_dict(SimpleNamespace(settings=settings))
    assert result["pets"] == [
        {"id": "a", "name": "Rex", "type": "", "food_grams_per_day": 400,
         "water_liters_per_day": 0.5}
    ]
    assert result["pet_food_categories"] == ["Pet food"]
    assert result["daily_pet_food_grams"] == 400
    assert result["daily_pet_water_liters"] == 0.5
    assert result["daily_water_liters"] == pytest.approx(6.5)
    assert result["target_breakdown"]["pet_food_grams"]["pets"]["a"] == pytest.approx(1200.0)


def test_assessment_dict_includes_pet_fields() -> None:
    data = _data(_pet_settings(), [_kibble(600)])
    result = _assessment_dict(data)
    assert result["pet_food_on_hand"] == 600.0
    assert result["pet_food_target"] == pytest.approx(1200.0)
    assert result["pet_food_percent"] == pytest.approx(50.0)
    assert "unmeasurable_pet_food_count" in result
    assert not any(key.startswith("essential_") for key in result)


def test_snapshot_buckets_carry_pet_food_grams() -> None:
    low = _kibble(500, qty=1, desired_quantity=4)
    settings = _pet_settings()
    coordinator = SimpleNamespace(
        settings=settings, data=_data(settings, [low]), store=SimpleNamespace(items=[low])
    )
    snap = _snapshot(coordinator)
    assert snap["buckets"]["low_stock"][0]["pet_food_grams_on_hand"] == 500.0


# ---------------------------------------------------------------- legacy installs unchanged


def test_legacy_options_load_with_no_pets(legacy_options) -> None:
    s = ReadinessSettings.from_options(legacy_options)
    assert s.pets == ()
    assert s.pet_food_categories == ()
    assert s.pet_food_target_grams() == 0.0


def test_legacy_assessment_unchanged(legacy_options, legacy_items, legacy_today) -> None:
    s = ReadinessSettings.from_options(legacy_options)
    a = assess(legacy_items, s, legacy_today)
    for key, expected in LEGACY_ASSESSMENT.items():
        assert getattr(a, key) == expected, key
    assert a.pet_food_target == 0.0
    assert a.pet_food_on_hand == 0.0
    assert a.unmeasurable_pet_food_count == 0


def test_legacy_completeness_unchanged(legacy_options, legacy_items, legacy_today) -> None:
    s = ReadinessSettings.from_options(legacy_options)
    c = assess_category_completeness(legacy_items, s, legacy_today)
    assert c.overall_percent == LEGACY_COMPLETENESS["overall_percent"]
    got = [(x.category, x.percent, x.complete, x.total, x.missing) for x in c.categories]
    assert got == LEGACY_COMPLETENESS["categories"]


def test_legacy_attention_and_events_unchanged(
    legacy_options, legacy_items, legacy_today
) -> None:
    s = ReadinessSettings.from_options(legacy_options)
    b = build_buckets(
        legacy_items, today=legacy_today,
        urgent_days=s.urgent_days, expiring_days=s.expiring_days,
    )
    assert isinstance(b, AttentionBuckets)
    assert {k: [i.id for i in getattr(b, k)] for k in LEGACY_BUCKET_IDS} == LEGACY_BUCKET_IDS
    for item in legacy_items:
        assert event_item_summary(item, s) == LEGACY_EVENT_SUMMARIES[item.id]
        assert event_item_summary(item) == LEGACY_EVENT_SUMMARIES[item.id]
        assert {
            k: v for k, v in item_summary(item, s).items() if k in LEGACY_EVENT_SUMMARIES[item.id]
        } == LEGACY_EVENT_SUMMARIES[item.id]
        assert "pet_food_grams_on_hand" not in item_summary(item, s)


def test_legacy_websocket_payloads_keep_existing_keys_and_add_pet_keys(
    legacy_options, legacy_items, legacy_today
) -> None:
    s = ReadinessSettings.from_options(legacy_options)
    data = _data(s, legacy_items)
    assessment = _assessment_dict(data)
    for key, expected in LEGACY_ASSESSMENT.items():
        assert assessment[key] == expected, key
    assert assessment["pet_food_target"] == 0.0

    settings = _settings_dict(SimpleNamespace(settings=s))
    assert settings["number_of_people"] == 3
    assert settings["daily_water_liters"] == 9.0
    assert settings["food_categories"] == ["Food"]
    assert settings["pets"] == []
    assert settings["pet_food_categories"] == []
    assert settings["daily_pet_food_grams"] == 0.0
    assert settings["target_breakdown"]["water_liters"]["pets"] == {}
    assert settings["target_breakdown"]["pet_food_grams"]["pets"] == {}
