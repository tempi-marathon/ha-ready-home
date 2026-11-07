"""Sensor translations stay complete (the sensor platform itself needs real Home Assistant)."""

from __future__ import annotations

import json
import re
from pathlib import Path

import pytest

COMPONENT = Path(__file__).resolve().parents[1] / "custom_components" / "ready_home"
TRANSLATION_FILES = ("strings.json", "translations/en.json", "translations/nl.json")

# Entity ids and attributes are public contracts: none of these may disappear.
EXISTING_SENSOR_KEYS = {
    "readiness",
    "water_readiness",
    "food_readiness",
    "category_completeness",
    "expired_items",
    "expiring_items",
    "low_stock_items",
    "items",
    "people",
    "duration",
    "food_target",
    "water_target",
}


def _sensor_keys() -> set[str]:
    source = (COMPONENT / "sensor.py").read_text()
    return set(re.findall(r'_attr_translation_key = "([a-z_]+)"', source))


def test_existing_sensors_are_still_defined() -> None:
    assert _sensor_keys() >= EXISTING_SENSOR_KEYS


def test_pet_food_readiness_sensor_is_added() -> None:
    assert "pet_food_readiness" in _sensor_keys()
    assert "PetFoodReadinessSensor(coordinator, entry)" in (
        COMPONENT / "sensor.py"
    ).read_text()


@pytest.mark.parametrize("filename", TRANSLATION_FILES)
def test_every_sensor_has_a_name_in_every_translation_file(filename: str) -> None:
    sensors = json.loads((COMPONENT / filename).read_text())["entity"]["sensor"]
    missing = sorted(key for key in _sensor_keys() if not sensors.get(key, {}).get("name"))
    assert missing == []


CATEGORIES = ("adults", "children", "babies_toddlers", "seniors")


def _option_steps(filename: str) -> dict:
    return json.loads((COMPONENT / filename).read_text())["options"]["step"]


@pytest.mark.parametrize("filename", TRANSLATION_FILES)
def test_targets_menu_and_steps_are_translated(filename: str) -> None:
    steps = _option_steps(filename)
    menu = steps["targets"]["menu_options"]
    expected = [f"targets_{c}" for c in CATEGORIES] + ["targets_duration", "init"]
    assert list(menu) == expected
    assert all(menu.values())
    for category in CATEGORIES:
        step = steps[f"targets_{category}"]
        assert step["title"]
        assert set(step["data"]) == {
            f"count_{category}",
            f"calories_per_day_{category}",
            f"water_liters_per_day_{category}",
        }
    assert set(steps["targets_duration"]["data"]) == {"duration_hours"}


@pytest.mark.parametrize("filename", TRANSLATION_FILES)
def test_targets_menu_description_uses_summary_placeholders(filename: str) -> None:
    description = _option_steps(filename)["targets"]["description"]
    for placeholder in (*CATEGORIES, "hours"):
        assert "{" + placeholder + "}" in description


def test_targets_steps_have_the_same_keys_in_every_file() -> None:
    def shape(filename: str) -> dict:
        steps = _option_steps(filename)
        return {k: sorted(v) for k, v in steps.items() if k.startswith("targets")}

    shapes = [shape(f) for f in TRANSLATION_FILES]
    assert shapes[0] == shapes[1] == shapes[2]
