"""Attention buckets — expired, expiring, low-stock."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta

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


def item_summary(item: InventoryItem) -> dict:
    """Compact dict for sensor attributes and events."""
    return {
        "id": item.id,
        "name": item.name,
        "quantity": item.quantity,
        "desired_quantity": item.desired_quantity,
        "unit": item.unit.value,
        "location": item.location,
        "category": item.category,
        "priority": item.priority.value,
        "expiry_date": item.expiry_date,
        "resource": item.resource.value,
    }
