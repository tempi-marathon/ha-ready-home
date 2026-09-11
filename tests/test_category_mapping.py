"""Tests for category-mapping migration helpers."""

from __future__ import annotations

from custom_components.ready_home.__init__ import _migrate_category_mapping
from custom_components.ready_home.models import ReadinessSettings


def test_migrate_seeds_defaults_when_missing() -> None:
    updated = _migrate_category_mapping({}, set(), set())
    assert updated is not None
    assert updated["food_categories"] == ["Food"]
    assert updated["water_categories"] == ["Water"]
    assert "Food" in updated["categories"]
    assert "Water" in updated["categories"]


def test_migrate_includes_legacy_item_categories() -> None:
    updated = _migrate_category_mapping(
        {"categories": ["Food", "Water", "Medical"]},
        {"Dry food"},
        {"Bottled"},
    )
    assert updated is not None
    assert "Dry food" in updated["food_categories"]
    assert "Bottled" in updated["water_categories"]


def test_migrate_noop_when_already_present() -> None:
    options = {
        "food_categories": ["Food"],
        "water_categories": ["Water"],
        "categories": ["Food", "Water"],
    }
    assert _migrate_category_mapping(options, {"X"}, {"Y"}) is None


def test_settings_from_options_reads_mapping() -> None:
    settings = ReadinessSettings.from_options(
        {
            "number_of_people": 2,
            "food_categories": ["Vegetables", "Food"],
            "water_categories": ["Water"],
            "categories": ["Vegetables", "Food", "Water", "Medical"],
        }
    )
    assert settings.is_food_category("vegetables")
    assert settings.readiness_kind("Medical") == "none"
