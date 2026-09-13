"""Attention buckets — expired, expiring, low-stock."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta
from typing import Any

from .models import InventoryItem


@dataclass(frozen=True, slots=True)
class AttentionBuckets:
    """Grouped inventory items needing attention."""

    expired: list[InventoryItem]
    within_urgent: list[InventoryItem]
    within_expiring: list[InventoryItem]
    low_stock: list[InventoryItem]


def expiry_severity(
    item: InventoryItem,
    *,
    today: date | None = None,
    urgent_days: int = 7,
    expiring_days: int = 30,
) -> str | None:
    """Return expiry bucket: expired, within_urgent, within_expiring, or None.

    Matches the Laravel expirySeverity buckets, with configurable windows
    (defaults: 7 and 30 days).
    """
    if item.expiry_date is None:
        return None

    today = today or date.today()
    expiry = date.fromisoformat(item.expiry_date)

    if expiry < today:
        return "expired"
    if expiry <= today + timedelta(days=urgent_days):
        return "within_urgent"
    if expiry <= today + timedelta(days=expiring_days):
        return "within_expiring"
    return None


def build_buckets(
    items: list[InventoryItem],
    *,
    today: date | None = None,
    urgent_days: int = 7,
    expiring_days: int = 30,
) -> AttentionBuckets:
    """Partition items into attention buckets."""
    today = today or date.today()
    expired: list[InventoryItem] = []
    within_urgent: list[InventoryItem] = []
    within_expiring: list[InventoryItem] = []
    low_stock: list[InventoryItem] = []

    for item in items:
        severity = expiry_severity(
            item, today=today, urgent_days=urgent_days, expiring_days=expiring_days
        )
        if severity == "expired":
            expired.append(item)
        elif severity == "within_urgent":
            within_urgent.append(item)
        elif severity == "within_expiring":
            within_expiring.append(item)

        if item.is_low_stock():
            low_stock.append(item)

    return AttentionBuckets(
        expired=expired,
        within_urgent=within_urgent,
        within_expiring=within_expiring,
        low_stock=low_stock,
    )


def item_summary(item: InventoryItem) -> dict[str, Any]:
    """Compact dict for sensor attributes and events.

    Always includes identity and stock fields. Measurable fields
    (contents, kcal, liters) are included only when set / computable.
    """
    summary: dict[str, Any] = {
        "id": item.id,
        "name": item.name,
        "quantity": item.quantity,
        "desired_quantity": item.desired_quantity,
        "unit": item.unit.value,
        "location": item.location,
        "category": item.category,
        "notes": item.notes,
        "barcode": item.barcode,
        "priority": item.priority.value,
        "expiry_date": item.expiry_date,
    }
    if item.contents_per_unit is not None:
        summary["contents_per_unit"] = item.contents_per_unit
    if item.contents_unit is not None:
        summary["contents_unit"] = item.contents_unit.value
    if item.calories_per_content is not None:
        summary["calories_per_content"] = item.calories_per_content
    if item.calories_per_unit is not None:
        summary["calories_per_unit"] = item.calories_per_unit
    calories = item.calories_on_hand()
    if calories is not None:
        summary["calories_on_hand"] = calories
    if item.liters_per_unit is not None:
        summary["liters_per_unit"] = item.liters_per_unit
    liters = item.water_liters_on_hand()
    if liters is not None:
        summary["water_liters_on_hand"] = liters
    return summary


def attention_cause_attrs(buckets: AttentionBuckets) -> dict[str, Any]:
    """Counts, cause keys, and a short cause string for the problem sensor."""
    expired_count = len(buckets.expired)
    urgent_count = len(buckets.within_urgent)
    expiring_count = len(buckets.within_expiring)
    low_stock_count = len(buckets.low_stock)

    causes: list[str] = []
    parts: list[str] = []
    if expired_count:
        causes.append("expired")
        parts.append(f"{expired_count} expired")
    if urgent_count:
        causes.append("urgent")
        parts.append(f"{urgent_count} urgent")
    if expiring_count:
        causes.append("expiring")
        parts.append(f"{expiring_count} expiring")
    if low_stock_count:
        causes.append("low_stock")
        parts.append(f"{low_stock_count} low stock")

    return {
        "expired_count": expired_count,
        "urgent_count": urgent_count,
        "expiring_count": expiring_count,
        "low_stock_count": low_stock_count,
        "causes": causes,
        "cause": ", ".join(parts) if parts else None,
    }
