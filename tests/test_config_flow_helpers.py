"""Unit tests for config-flow category merge helpers."""

from __future__ import annotations

import pytest

from custom_components.ready_home.config_flow import (
    _merge_category_lists,
    _overlap_error,
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
