"""Tests for applying kit templates, optionally restricted to chosen items."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

import pytest
import voluptuous as vol
from homeassistant.exceptions import ServiceValidationError

from custom_components.ready_home.kit_templates import get_kit_template
from custom_components.ready_home.models import InventoryItem
from custom_components.ready_home.services import (
    APPLY_KIT_SCHEMA,
    async_apply_kit_template,
)


def _coordinator(existing: list[InventoryItem] | None = None) -> MagicMock:
    coordinator = MagicMock()
    coordinator.store.items = existing if existing is not None else []

    async def _add(item: InventoryItem) -> None:
        coordinator.store.items.append(item)

    coordinator.store.async_add = AsyncMock(side_effect=_add)
    return coordinator


async def test_omitted_item_names_adds_every_missing_item() -> None:
    template = get_kit_template("first_aid")
    coordinator = _coordinator()
    result = await async_apply_kit_template(coordinator, template, None)
    assert result["added_count"] == len(template.items)
    assert result["skipped_count"] == 0


async def test_subset_adds_only_selected_items() -> None:
    template = get_kit_template("first_aid")
    chosen = [template.items[0].name, template.items[2].name]
    coordinator = _coordinator()
    result = await async_apply_kit_template(coordinator, template, chosen)
    assert [i["name"] for i in result["added"]] == chosen
    assert result["skipped"] == []
    assert len(coordinator.store.items) == 2


async def test_selected_existing_item_is_skipped() -> None:
    template = get_kit_template("first_aid")
    first = template.items[0]
    coordinator = _coordinator([InventoryItem(name=first.name.lower(), quantity=1)])
    result = await async_apply_kit_template(
        coordinator, template, [first.name, template.items[1].name]
    )
    assert result["skipped"] == [first.name]
    assert result["added_count"] == 1


async def test_empty_item_names_adds_nothing() -> None:
    coordinator = _coordinator()
    result = await async_apply_kit_template(
        coordinator, get_kit_template("go_bag"), []
    )
    assert result["added_count"] == 0
    coordinator.store.async_add.assert_not_called()


async def test_unknown_item_name_is_rejected() -> None:
    coordinator = _coordinator()
    with pytest.raises(ServiceValidationError):
        await async_apply_kit_template(
            coordinator, get_kit_template("go_bag"), ["Nope"]
        )
    coordinator.store.async_add.assert_not_called()


def test_schema_accepts_optional_item_names() -> None:
    assert "item_names" not in APPLY_KIT_SCHEMA({"template_id": "go_bag"})
    data = APPLY_KIT_SCHEMA({"template_id": "go_bag", "item_names": ["A"]})
    assert data["item_names"] == ["A"]
    with pytest.raises(vol.Invalid):
        APPLY_KIT_SCHEMA({"template_id": "go_bag", "item_names": "A"})
