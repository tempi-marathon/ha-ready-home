"""Readiness assessment — port of HomeReadinessCalculator."""

from __future__ import annotations

from datetime import date

from .models import (
    InventoryItem,
    ReadinessAssessment,
    ReadinessSettings,
    ResourceType,
)


def assess(
    items: list[InventoryItem],
    settings: ReadinessSettings,
    today: date | None = None,
) -> ReadinessAssessment:
    """Compare on-hand water/food against per-person targets."""
    today = today or date.today()

    if settings.number_of_people is None:
        return ReadinessAssessment(
            needs_people_count=True,
            water_on_hand=0.0,
            water_target=None,
            water_percent=0.0,
            food_on_hand=0.0,
            food_target=None,
            food_percent=0.0,
            overall_percent=0.0,
            duration_hours=settings.duration_hours,
            water_supply_hours=None,
            food_supply_hours=None,
            supply_hours=None,
        )

    water_target = settings.water_target_liters()
    food_target = settings.food_target_calories()

    water_on_hand, unmeasurable_water = _aggregate_water(items, today)
    food_on_hand, unmeasurable_food = _aggregate_food(items, today)

    water_percent = _percent(water_on_hand, water_target)
    food_percent = _percent(food_on_hand, food_target)
    overall_percent = min(water_percent, food_percent)

    water_supply_hours = _supply_hours(
        water_on_hand, water_target, settings.duration_hours
    )
    food_supply_hours = _supply_hours(
        food_on_hand, food_target, settings.duration_hours
    )
    supply_hours = min(water_supply_hours, food_supply_hours)

    return ReadinessAssessment(
        needs_people_count=False,
        water_on_hand=water_on_hand,
        water_target=water_target,
        water_percent=water_percent,
        food_on_hand=food_on_hand,
        food_target=food_target,
        food_percent=food_percent,
        overall_percent=overall_percent,
        duration_hours=settings.duration_hours,
        water_supply_hours=water_supply_hours,
        food_supply_hours=food_supply_hours,
        supply_hours=supply_hours,
        unmeasurable_water_count=unmeasurable_water,
        unmeasurable_food_count=unmeasurable_food,
    )


def _aggregate_water(
    items: list[InventoryItem], today: date
) -> tuple[float, int]:
    total = 0.0
    unmeasurable = 0
    for item in items:
        if item.resource != ResourceType.WATER:
            continue
        if item.is_expired(today):
            continue
        amount = item.water_liters_on_hand()
        if amount is None:
            unmeasurable += 1
        else:
            total += amount
    return total, unmeasurable


def _aggregate_food(
    items: list[InventoryItem], today: date
) -> tuple[float, int]:
    total = 0.0
    unmeasurable = 0
    for item in items:
        if item.resource != ResourceType.FOOD:
            continue
        if item.is_expired(today):
            continue
        amount = item.calories_on_hand()
        if amount is None:
            unmeasurable += 1
        else:
            total += amount
    return total, unmeasurable


def _percent(on_hand: float, target: float | None) -> float:
    if target is None or target <= 0:
        return 0.0
    return min(100.0, (on_hand / target) * 100.0)


def _supply_hours(on_hand: float, target: float | None, duration_hours: int) -> float:
    if target is None or target <= 0:
        return 0.0
    return (on_hand / target) * duration_hours
