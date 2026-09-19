"""Unit tests for location/category rename helpers."""

from __future__ import annotations

import pytest

from custom_components.ready_home.lists import apply_list_rename, rename_in_list


def test_rename_in_list_replaces_case_insensitively() -> None:
    assert rename_in_list(["Pantry", "Garage"], "pantry", "Pantry room") == [
        "Pantry room",
        "Garage",
    ]


def test_rename_in_list_allows_casing_only() -> None:
    assert rename_in_list(["Food", "Water"], "Food", "FOOD") == [
        "FOOD",
        "Water",
    ]


def test_rename_in_list_rejects_collision() -> None:
    assert rename_in_list(["Pantry", "Garage"], "Pantry", "garage") is None


def test_rename_in_list_rejects_missing() -> None:
    assert rename_in_list(["Pantry"], "Basement", "Cellar") is None


def test_rename_in_list_rejects_blank() -> None:
    assert rename_in_list(["Pantry"], "Pantry", "  ") is None


def test_apply_list_rename_location() -> None:
    result = apply_list_rename(
        kind="location",
        old_name="Garage",
        new_name="Shed",
        locations=["Pantry", "Garage"],
        categories=["Food", "Water"],
        food_categories=["Food"],
        water_categories=["Water"],
    )
    assert result is not None
    assert result["locations"] == ["Pantry", "Shed"]
    assert result["categories"] == ["Food", "Water"]


def test_apply_list_rename_category_updates_mappings() -> None:
    result = apply_list_rename(
        kind="category",
        old_name="Food",
        new_name="Dry food",
        locations=["Pantry"],
        categories=["Food", "Water", "Medical"],
        food_categories=["Food"],
        water_categories=["Water"],
    )
    assert result is not None
    assert result["categories"] == ["Dry food", "Water", "Medical"]
    assert result["food_categories"] == ["Dry food"]
    assert result["water_categories"] == ["Water"]


def test_apply_list_rename_category_unmapped_leaves_mappings() -> None:
    result = apply_list_rename(
        kind="category",
        old_name="Medical",
        new_name="First aid",
        locations=["Pantry"],
        categories=["Food", "Medical"],
        food_categories=["Food"],
        water_categories=["Water"],
    )
    assert result is not None
    assert result["categories"] == ["Food", "First aid"]
    assert result["food_categories"] == ["Food"]
    assert result["water_categories"] == ["Water"]


@pytest.mark.parametrize(
    ("old_name", "new_name"),
    [("Food", "Water"), ("missing", "Other")],
)
def test_apply_list_rename_category_errors(
    old_name: str, new_name: str
) -> None:
    assert (
        apply_list_rename(
            kind="category",
            old_name=old_name,
            new_name=new_name,
            locations=["Pantry"],
            categories=["Food", "Water"],
            food_categories=["Food"],
            water_categories=["Water"],
        )
        is None
    )
