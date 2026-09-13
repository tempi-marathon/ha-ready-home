"""Unit tests for attention buckets."""

from __future__ import annotations

from datetime import date, timedelta

from custom_components.ready_home.attention import (
    AttentionBuckets,
    attention_cause_attrs,
    build_buckets,
    expiry_severity,
    item_summary,
)
from custom_components.ready_home.models import (
    ContentsUnit,
    InventoryItem,
    InventoryPriority,
    InventoryUnit,
)

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


def test_item_summary() -> None:
    item = InventoryItem(
        name="Beans",
        quantity=3,
        desired_quantity=6,
        unit=InventoryUnit.BOX,
        location="Pantry",
        category="Food",
        priority=InventoryPriority.ESSENTIAL,
        expiry_date="2027-01-15",
    )
    assert item_summary(item) == {
        "id": item.id,
        "name": "Beans",
        "quantity": 3,
        "desired_quantity": 6,
        "unit": "box",
        "location": "Pantry",
        "category": "Food",
        "priority": "essential",
        "expiry_date": "2027-01-15",
    }


def test_item_summary_includes_measurable_fields() -> None:
    item = InventoryItem(
        name="Beans",
        quantity=2,
        unit=InventoryUnit.BOX,
        contents_per_unit=400.0,
        contents_unit=ContentsUnit.GRAM,
        calories_per_content=3.5,
    ).with_synced_derived()
    summary = item_summary(item)
    assert summary["contents_per_unit"] == 400.0
    assert summary["contents_unit"] == "gram"
    assert summary["calories_per_content"] == 3.5
    assert summary["calories_per_unit"] == 1400.0
    assert summary["calories_on_hand"] == 2800.0
    assert "water_liters_on_hand" not in summary
    assert "liters_per_unit" not in summary


def test_item_summary_includes_water_fields() -> None:
    item = InventoryItem(
        name="Water",
        quantity=4,
        unit=InventoryUnit.PACK,
        contents_per_unit=1.5,
        contents_unit=ContentsUnit.LITER,
    ).with_synced_derived()
    summary = item_summary(item)
    assert summary["contents_per_unit"] == 1.5
    assert summary["contents_unit"] == "liter"
    assert summary["liters_per_unit"] == 1.5
    assert summary["water_liters_on_hand"] == 6.0
    assert "calories_on_hand" not in summary


def test_attention_cause_attrs() -> None:
    buckets = AttentionBuckets(
        expired=[_item("a")],
        within_urgent=[_item("b"), _item("c")],
        within_expiring=[],
        low_stock=[_item("d")],
    )
    attrs = attention_cause_attrs(buckets)
    assert attrs["expired_count"] == 1
    assert attrs["urgent_count"] == 2
    assert attrs["expiring_count"] == 0
    assert attrs["low_stock_count"] == 1
    assert attrs["causes"] == ["expired", "urgent", "low_stock"]
    assert attrs["cause"] == "1 expired, 2 urgent, 1 low stock"


def test_attention_cause_attrs_empty() -> None:
    attrs = attention_cause_attrs(AttentionBuckets([], [], [], []))
    assert attrs["causes"] == []
    assert attrs["cause"] is None
