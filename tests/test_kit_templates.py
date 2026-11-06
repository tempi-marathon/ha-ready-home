"""Tests for built-in kit templates."""

from __future__ import annotations

import pytest

from custom_components.ready_home.kit_templates import (
    get_kit_template,
    list_kit_templates,
    select_template_items,
)


def test_templates_listed() -> None:
    listed = list_kit_templates()
    ids = {t["id"] for t in listed}
    assert ids == {"first_aid", "go_bag", "basic_tools"}
    for row in listed:
        assert row["item_count"] > 0
        assert row["name"]
        assert get_kit_template(row["id"]) is not None


def test_unknown_template() -> None:
    assert get_kit_template("nope") is None


def test_select_template_items_all_when_none() -> None:
    template = get_kit_template("first_aid")
    assert select_template_items(template, None) == template.items


def test_select_template_items_subset_keeps_template_order() -> None:
    template = get_kit_template("first_aid")
    first, second = template.items[0], template.items[1]
    picked = select_template_items(
        template, [f"  {second.name.upper()} ", first.name]
    )
    assert picked == (first, second)


def test_select_template_items_empty_list_selects_nothing() -> None:
    assert select_template_items(get_kit_template("go_bag"), []) == ()


def test_select_template_items_unknown_name_raises() -> None:
    with pytest.raises(ValueError, match="Not a thing"):
        select_template_items(get_kit_template("go_bag"), ["Not a thing"])
