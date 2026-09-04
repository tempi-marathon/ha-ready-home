"""Unit tests for InventoryItem serialization and helpers."""

from __future__ import annotations

from custom_components.ready_home.models import (
    InventoryItem,
    InventoryPriority,
    InventoryUnit,
    ResourceType,
)


def test_round_trip_dict() -> None:
    item = InventoryItem(
        name="Beans",
        quantity=12,
        desired_quantity=24,
        unit=InventoryUnit.PACK,
        location="Pantry",
        category="Food",
        priority=InventoryPriority.ESSENTIAL,
        resource=ResourceType.FOOD,
        calories_per_unit=350,
        barcode="123",
        expiry_date="2027-01-01",
    )
    restored = InventoryItem.from_dict(item.to_dict())
    assert restored.name == "Beans"
    assert restored.quantity == 12
    assert restored.unit == InventoryUnit.PACK
    assert restored.priority == InventoryPriority.ESSENTIAL
    assert restored.resource == ResourceType.FOOD
    assert restored.calories_per_unit == 350
    assert restored.barcode == "123"
    assert restored.calories_on_hand() == 4200


def test_with_updates_refreshes_timestamp() -> None:
    item = InventoryItem(name="Rice", quantity=2)
    updated = item.with_updates(quantity=5, resource="food", calories_per_unit=400)
    assert updated.quantity == 5
    assert updated.resource == ResourceType.FOOD
    assert updated.calories_per_unit == 400
    assert updated.id == item.id
    assert updated.updated_at >= item.updated_at


def test_water_liters_helpers() -> None:
    liters = InventoryItem(
        name="Jug", quantity=2, unit=InventoryUnit.LITER, resource=ResourceType.WATER
    )
    assert liters.water_liters_on_hand() == 2.0

    ml = InventoryItem(
        name="Bottle",
        quantity=500,
        unit=InventoryUnit.MILLILITER,
        resource=ResourceType.WATER,
    )
    assert ml.water_liters_on_hand() == 0.5

    pieces = InventoryItem(
        name="Six pack",
        quantity=6,
        unit=InventoryUnit.PIECE,
        resource=ResourceType.WATER,
        liters_per_unit=1.5,
    )
    assert pieces.water_liters_on_hand() == 9.0

    unmeasurable = InventoryItem(
        name="Unknown",
        quantity=3,
        unit=InventoryUnit.PIECE,
        resource=ResourceType.WATER,
    )
    assert unmeasurable.water_liters_on_hand() is None
