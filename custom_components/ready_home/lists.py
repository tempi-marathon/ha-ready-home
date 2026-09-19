"""Helpers for renaming location and category list entries."""

from __future__ import annotations

from typing import Literal

RenameKind = Literal["location", "category"]


def _norm(name: str) -> str:
    return str(name).strip().lower()


def rename_in_list(
    names: list[str],
    old_name: str,
    new_name: str,
) -> list[str] | None:
    """Return a copy of names with old_name replaced by new_name.

    Matching is case-insensitive. Returns None when old_name is not found,
    or when new_name collides with a different existing entry.
    Casing-only renames (Food → FOOD) are allowed.
    """
    old_key = _norm(old_name)
    new_cleaned = str(new_name).strip()
    if not old_key or not new_cleaned:
        return None
    new_key = new_cleaned.lower()

    found = False
    result: list[str] = []
    for name in names:
        key = _norm(name)
        if not key:
            continue
        if key == old_key:
            found = True
            result.append(new_cleaned)
            continue
        if key == new_key:
            return None
        result.append(str(name).strip())

    if not found:
        return None
    return result


def _replace_matching(names: list[str], old_name: str, new_name: str) -> list[str]:
    """Replace matching names (case-insensitive); leave list unchanged if absent."""
    old_key = _norm(old_name)
    new_cleaned = str(new_name).strip()
    return [
        new_cleaned if _norm(name) == old_key else str(name).strip()
        for name in names
        if str(name).strip()
    ]


def apply_list_rename(
    *,
    kind: RenameKind,
    old_name: str,
    new_name: str,
    locations: list[str],
    categories: list[str],
    food_categories: list[str],
    water_categories: list[str],
) -> dict[str, list[str]] | None:
    """Rewrite option lists for a location or category rename.

    Returns a dict of updated lists, or None on not-found / collision.
    Category renames also update food_categories and water_categories.
    """
    if kind == "location":
        renamed = rename_in_list(locations, old_name, new_name)
        if renamed is None:
            return None
        return {
            "locations": renamed,
            "categories": list(categories),
            "food_categories": list(food_categories),
            "water_categories": list(water_categories),
        }

    renamed_cats = rename_in_list(categories, old_name, new_name)
    if renamed_cats is None:
        return None

    return {
        "locations": list(locations),
        "categories": renamed_cats,
        "food_categories": _replace_matching(
            food_categories, old_name, new_name
        ),
        "water_categories": _replace_matching(
            water_categories, old_name, new_name
        ),
    }
