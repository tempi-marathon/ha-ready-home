"""Unit tests for websocket snapshot / settings dict helpers."""

from __future__ import annotations

from types import SimpleNamespace
from unittest.mock import MagicMock

from custom_components.ready_home.attention import AttentionBuckets
from custom_components.ready_home.coordinator import ReadyHomeData
from custom_components.ready_home.models import (
    InventoryItem,
    InventoryPriority,
    InventoryUnit,
    ReadinessAssessment,
    ReadinessSettings,
)
from custom_components.ready_home.websocket_api import (
    _assessment_dict,
    _settings_dict,
    _snapshot,
)


def _assessment(**overrides: float | int | bool | None) -> ReadinessAssessment:
    base: dict[str, float | int | bool | None] = {
        "needs_people_count": False,
        "water_on_hand": 10.0,
        "water_target": 20.0,
        "water_percent": 50.0,
        "food_on_hand": 1000.0,
        "food_target": 2000.0,
        "food_percent": 50.0,
        "overall_percent": 50.0,
        "duration_hours": 72,
        "water_supply_hours": 36.0,
        "food_supply_hours": 36.0,
        "supply_hours": 36.0,
        "unmeasurable_water_count": 0,
        "unmeasurable_food_count": 1,
    }
    base.update(overrides)
    return ReadinessAssessment(**base)  # type: ignore[arg-type]


def test_assessment_dict_keys() -> None:
    data = ReadyHomeData(
        items=[],
        settings=ReadinessSettings(),
        assessment=_assessment(),
        buckets=AttentionBuckets([], [], [], []),
    )
    result = _assessment_dict(data)
    assert result["water_percent"] == 50.0
    assert result["unmeasurable_food_count"] == 1
    assert result["needs_people_count"] is False
    assert set(result) >= {
        "water_on_hand",
        "food_on_hand",
        "overall_percent",
        "supply_hours",
    }


def test_snapshot_empty_when_no_data() -> None:
    coordinator = MagicMock()
    coordinator.data = None
    assert _snapshot(coordinator) == {
        "items": [],
        "assessment": {},
        "buckets": {},
    }


def test_snapshot_populated() -> None:
    item = InventoryItem(
        name="Water",
        quantity=2,
        unit=InventoryUnit.PACK,
        priority=InventoryPriority.ESSENTIAL,
        location="Garage",
        category="Water",
        expiry_date="2026-01-01",
    )
    buckets = AttentionBuckets(
        expired=[item],
        within_urgent=[],
        within_expiring=[],
        low_stock=[],
    )
    data = ReadyHomeData(
        items=[item],
        settings=ReadinessSettings(),
        assessment=_assessment(),
        buckets=buckets,
    )
    coordinator = MagicMock()
    coordinator.data = data

    snap = _snapshot(coordinator)
    assert len(snap["items"]) == 1
    assert snap["items"][0]["name"] == "Water"
    assert snap["assessment"]["overall_percent"] == 50.0
    assert snap["buckets"]["expired"][0]["id"] == item.id
    assert snap["buckets"]["expired"][0]["name"] == "Water"
    assert snap["buckets"]["low_stock"] == []


def test_settings_dict() -> None:
    settings = ReadinessSettings(
        number_of_people=4,
        duration_hours=96,
        locations=("Garage", "Pantry"),
        categories=("Food", "Water"),
        food_categories=("Food",),
        water_categories=("Water",),
        expiring_days=21,
        urgent_days=5,
        attribute_item_cap=50,
    )
    coordinator = SimpleNamespace(settings=settings)
    result = _settings_dict(coordinator)  # type: ignore[arg-type]
    assert result["number_of_people"] == 4
    assert result["duration_hours"] == 96
    assert result["locations"] == ["Garage", "Pantry"]
    assert result["food_categories"] == ["Food"]
    assert result["water_categories"] == ["Water"]
    assert result["expiring_days"] == 21
    assert result["urgent_days"] == 5
    assert result["attribute_item_cap"] == 50
