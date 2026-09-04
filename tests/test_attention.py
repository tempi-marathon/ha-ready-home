"""Unit tests for attention buckets."""

from __future__ import annotations

from datetime import date, timedelta

from custom_components.ready_home.attention import build_buckets, expiry_severity
from custom_components.ready_home.models import InventoryItem

TODAY = date(2026, 9, 4)


def _item(
    name: str,
    *,
    expiry: date | None = None,
    quantity: float = 5,
    desired: float = 0,
) -> InventoryItem:
    return InventoryItem(
        name=name,
        quantity=quantity,
        desired_quantity=desired,
        expiry_date=expiry.isoformat() if expiry else None,
    )


def test_expiry_severity_buckets() -> None:
    assert (
        expiry_severity(
            _item("a", expiry=TODAY - timedelta(days=1)), today=TODAY
        )
        == "expired"
    )
    assert (
        expiry_severity(
            _item("b", expiry=TODAY + timedelta(days=3)), today=TODAY
        )
        == "within_urgent"
    )
    assert (
        expiry_severity(
            _item("c", expiry=TODAY + timedelta(days=7)), today=TODAY
        )
        == "within_urgent"
    )
    assert (
        expiry_severity(
            _item("d", expiry=TODAY + timedelta(days=15)), today=TODAY
        )
        == "within_expiring"
    )
    assert (
        expiry_severity(
            _item("e", expiry=TODAY + timedelta(days=30)), today=TODAY
        )
        == "within_expiring"
    )
    assert (
        expiry_severity(
            _item("f", expiry=TODAY + timedelta(days=60)), today=TODAY
        )
        is None
    )
    assert expiry_severity(_item("g"), today=TODAY) is None


def test_build_buckets() -> None:
    items = [
        _item("expired", expiry=TODAY - timedelta(days=2)),
        _item("urgent", expiry=TODAY + timedelta(days=2)),
        _item("soon", expiry=TODAY + timedelta(days=20)),
        _item("ok", expiry=TODAY + timedelta(days=90)),
        _item("low", quantity=1, desired=5),
    ]
    buckets = build_buckets(items, today=TODAY)
    assert [i.name for i in buckets.expired] == ["expired"]
    assert [i.name for i in buckets.within_urgent] == ["urgent"]
    assert [i.name for i in buckets.within_expiring] == ["soon"]
    assert [i.name for i in buckets.low_stock] == ["low"]


def test_low_stock_rule() -> None:
    assert _item("x", quantity=4, desired=5).is_low_stock() is True
    assert _item("y", quantity=5, desired=5).is_low_stock() is False
    assert _item("z", quantity=0, desired=0).is_low_stock() is False
