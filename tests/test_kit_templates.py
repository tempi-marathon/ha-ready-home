"""Tests for built-in kit templates."""

from __future__ import annotations

from custom_components.ready_home.kit_templates import (
    get_kit_template,
    list_kit_templates,
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
