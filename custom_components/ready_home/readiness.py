"""Readiness assessment — port of HomeReadinessCalculator."""

from __future__ import annotations

from datetime import date

from .models import (
    InventoryItem,
    InventoryPriority,
    ReadinessAssessment,
    ReadinessSettings,
)


def assess(
    items: list[InventoryItem],
    settings: ReadinessSettings,
    today: date | None = None,
) -> ReadinessAssessment:
    """Compare on-hand water/food against per-person targets.

    Overall scores use all non-expired mapped items. Essential scores use only
    items with priority ``essential`` (same targets).
    """
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

    water_on_hand, unmeasurable_water = _aggregate_water(items, settings, today)
    food_on_hand, unmeasurable_food = _aggregate_food(items, settings, today)

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

    essential_items = [
        i for i in items if i.priority == InventoryPriority.ESSENTIAL
    ]
    e_water, e_un_water = _aggregate_water(essential_items, settings, today)
    e_food, e_un_food = _aggregate_food(essential_items, settings, today)
    e_water_percent = _percent(e_water, water_target)
    e_food_percent = _percent(e_food, food_target)
    e_overall = min(e_water_percent, e_food_percent)
    e_water_hours = _supply_hours(e_water, water_target, settings.duration_hours)
    e_food_hours = _supply_hours(e_food, food_target, settings.duration_hours)
    e_supply = min(e_water_hours, e_food_hours)

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
        essential_water_on_hand=e_water,
        essential_water_percent=e_water_percent,
        essential_food_on_hand=e_food,
        essential_food_percent=e_food_percent,
        essential_overall_percent=e_overall,
        essential_water_supply_hours=e_water_hours,
        essential_food_supply_hours=e_food_hours,
        essential_supply_hours=e_supply,
        essential_unmeasurable_water_count=e_un_water,
        essential_unmeasurable_food_count=e_un_food,
    )


def _aggregate_water(
    items: list[InventoryItem],
    settings: ReadinessSettings,
    today: date,
) -> tuple[float, int]:
    total = 0.0
    unmeasurable = 0
    for item in items:
        if not settings.is_water_category(item.category):
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
    items: list[InventoryItem],
    settings: ReadinessSettings,
    today: date,
) -> tuple[float, int]:
    total = 0.0
    unmeasurable = 0
    for item in items:
        if not settings.is_food_category(item.category):
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
