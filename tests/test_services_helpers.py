"""Unit tests for service resolution and status-filter helpers."""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest
import voluptuous as vol
from homeassistant.exceptions import ServiceValidationError

from custom_components.ready_home.models import InventoryItem
from custom_components.ready_home.services import (
    ADD_SCHEMA,
    ADJUST_SCHEMA,
    UPDATE_SCHEMA,
    _matches_status,
    _resolve_item,
)


def test_resolve_item_by_id() -> None:
    item = InventoryItem(name="Water", quantity=2)
    coordinator = MagicMock()
    coordinator.store.get.return_value = item
    assert _resolve_item(coordinator, item.id, None) is item
    coordinator.store.get.assert_called_once_with(item.id)


def test_resolve_item_by_name() -> None:
    item = InventoryItem(name="Rice", quantity=1)
    coordinator = MagicMock()
    coordinator.store.find_by_name.return_value = item
    assert _resolve_item(coordinator, None, "Rice") is item
    coordinator.store.find_by_name.assert_called_once_with("Rice")


def test_resolve_item_unknown_id() -> None:
    coordinator = MagicMock()
    coordinator.store.get.return_value = None
    with pytest.raises(ServiceValidationError, match="Unknown item_id"):
        _resolve_item(coordinator, "missing", None)


def test_resolve_item_unknown_name() -> None:
    coordinator = MagicMock()
    coordinator.store.find_by_name.return_value = None
    with pytest.raises(ServiceValidationError, match="Unknown or ambiguous name"):
        _resolve_item(coordinator, None, "Nope")


def test_resolve_item_requires_id_or_name() -> None:
    coordinator = MagicMock()
    with pytest.raises(ServiceValidationError, match="Provide item_id or name"):
        _resolve_item(coordinator, None, None)


@pytest.mark.parametrize(
    ("status", "severity", "quantity", "desired", "expected"),
    [
        ("expired", "expired", 5, 0, True),
        ("expired", "within_urgent", 5, 0, False),
        ("expiring", "within_urgent", 5, 0, True),
        ("expiring", "within_expiring", 5, 0, True),
        ("expiring", "expired", 5, 0, False),
        ("low_stock", None, 1, 5, True),
        ("low_stock", None, 5, 5, False),
        ("ok", None, 5, 0, True),
        ("ok", "expired", 5, 0, False),
        ("ok", None, 1, 5, False),
        ("unknown", None, 5, 0, False),
    ],
)
def test_matches_status(
    status: str,
    severity: str | None,
    quantity: float,
    desired: float,
    expected: bool,
) -> None:
    item = InventoryItem(name="x", quantity=quantity, desired_quantity=desired)
    assert _matches_status(status, item, severity) is expected


def test_add_schema_rejects_invalid_expiry() -> None:
    with pytest.raises(vol.Invalid):
        ADD_SCHEMA({"name": "Rice", "quantity": 1, "expiry_date": "boom"})


def test_add_schema_accepts_iso_expiry() -> None:
    data = ADD_SCHEMA(
        {"name": "Rice", "quantity": 1, "expiry_date": "2027-06-01"}
    )
    assert data["expiry_date"] == "2027-06-01"


def test_add_schema_rejects_non_finite_quantity() -> None:
    with pytest.raises(vol.Invalid):
        ADD_SCHEMA({"name": "Rice", "quantity": float("inf")})
    with pytest.raises(vol.Invalid):
        ADD_SCHEMA({"name": "Rice", "quantity": float("nan")})
    with pytest.raises(vol.Invalid):
        ADD_SCHEMA({"name": "Rice", "quantity": -1})


def test_update_schema_rejects_invalid_expiry() -> None:
    with pytest.raises(vol.Invalid):
        UPDATE_SCHEMA({"item_id": "abc", "expiry_date": "nope"})


def test_adjust_schema_rejects_non_finite_delta() -> None:
    with pytest.raises(vol.Invalid):
        ADJUST_SCHEMA({"item_id": "abc", "delta": float("nan")})


def test_add_schema_rejects_oversized_name() -> None:
    with pytest.raises(vol.Invalid):
        ADD_SCHEMA({"name": "x" * 201, "quantity": 1})


def test_add_schema_rejects_unsafe_barcode() -> None:
    with pytest.raises(vol.Invalid):
        ADD_SCHEMA({"name": "Rice", "quantity": 1, "barcode": "../../evil"})
