"""Domain models for Ready Home inventory."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field, replace
from datetime import UTC, date, datetime
from enum import StrEnum
from typing import Any
from uuid import uuid4


class InventoryUnit(StrEnum):
    """Measurement units for inventory items."""

    PIECE = "piece"
    GRAM = "gram"
    KILOGRAM = "kilogram"
    LITER = "liter"
    MILLILITER = "milliliter"
    PACK = "pack"
    BOX = "box"

    def is_measurable(self) -> bool:
        """Return True when the unit can convert to liters/grams directly."""
        return self in {
            InventoryUnit.GRAM,
            InventoryUnit.KILOGRAM,
            InventoryUnit.LITER,
            InventoryUnit.MILLILITER,
        }


class InventoryPriority(StrEnum):
    """Priority levels for inventory items."""

    ESSENTIAL = "essential"
    IMPORTANT = "important"
    OPTIONAL = "optional"


class ResourceType(StrEnum):
    """Readiness resource classification."""

    NONE = "none"
    WATER = "water"
    FOOD = "food"


def _utc_now_iso() -> str:
    return datetime.now(UTC).replace(microsecond=0).isoformat()


@dataclass(frozen=True, slots=True)
class InventoryItem:
    """A single inventory stock item."""

    name: str
    quantity: float
    unit: InventoryUnit = InventoryUnit.PIECE
    id: str = field(default_factory=lambda: uuid4().hex)
    location: str = ""
    category: str = ""
    notes: str = ""
    barcode: str = ""
    desired_quantity: float = 0.0
    priority: InventoryPriority = InventoryPriority.IMPORTANT
    expiry_date: str | None = None  # ISO date YYYY-MM-DD
    resource: ResourceType = ResourceType.NONE
    liters_per_unit: float | None = None
    calories_per_unit: float | None = None
    created_at: str = field(default_factory=_utc_now_iso)
    updated_at: str = field(default_factory=_utc_now_iso)

    def is_low_stock(self) -> bool:
        """True when quantity is below desired quantity."""
        return float(self.quantity) < float(self.desired_quantity)

    def is_expired(self, today: date | None = None) -> bool:
        """True when expiry_date is strictly before today."""
        if self.expiry_date is None:
            return False
        today = today or date.today()
        return date.fromisoformat(self.expiry_date) < today

    def water_liters_on_hand(self) -> float | None:
        """Liters contributed by current stock, or None if unmeasurable."""
        if self.resource != ResourceType.WATER:
            return None
        if self.unit == InventoryUnit.LITER:
            return float(self.quantity)
        if self.unit == InventoryUnit.MILLILITER:
            return float(self.quantity) / 1000.0
        if self.liters_per_unit is not None:
            return float(self.quantity) * float(self.liters_per_unit)
        return None

    def calories_on_hand(self) -> float | None:
        """Calories contributed by current stock, or None if unmeasurable."""
        if self.resource != ResourceType.FOOD:
            return None
        if self.calories_per_unit is None:
            return None
        return float(self.quantity) * float(self.calories_per_unit)

    def to_dict(self) -> dict[str, Any]:
        """Serialize to a JSON-compatible dict."""
        data = asdict(self)
        data["unit"] = self.unit.value
        data["priority"] = self.priority.value
        data["resource"] = self.resource.value
        return data

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> InventoryItem:
        """Deserialize from a stored dict."""
        return cls(
            id=str(data.get("id") or uuid4().hex),
            name=str(data["name"]),
            quantity=float(data.get("quantity", 0)),
            desired_quantity=float(data.get("desired_quantity", 0)),
            unit=InventoryUnit(data.get("unit", InventoryUnit.PIECE)),
            location=str(data.get("location") or ""),
            category=str(data.get("category") or ""),
            notes=str(data.get("notes") or ""),
            barcode=str(data.get("barcode") or ""),
            priority=InventoryPriority(data.get("priority", InventoryPriority.IMPORTANT)),
            expiry_date=data.get("expiry_date"),
            resource=ResourceType(data.get("resource", ResourceType.NONE)),
            liters_per_unit=_optional_float(data.get("liters_per_unit")),
            calories_per_unit=_optional_float(data.get("calories_per_unit")),
            created_at=str(data.get("created_at") or _utc_now_iso()),
            updated_at=str(data.get("updated_at") or _utc_now_iso()),
        )

    def with_updates(self, **changes: Any) -> InventoryItem:
        """Return a copy with the given fields updated and updated_at refreshed."""
        changes["updated_at"] = _utc_now_iso()
        if "unit" in changes and isinstance(changes["unit"], str):
            changes["unit"] = InventoryUnit(changes["unit"])
        if "priority" in changes and isinstance(changes["priority"], str):
            changes["priority"] = InventoryPriority(changes["priority"])
        if "resource" in changes and isinstance(changes["resource"], str):
            changes["resource"] = ResourceType(changes["resource"])
        return replace(self, **changes)


@dataclass(frozen=True, slots=True)
class ReadinessSettings:
    """Household readiness targets and reference lists."""

    number_of_people: int | None = None
    duration_hours: int = 72
    water_liters_per_person_per_day: float = 3.0
    calories_per_person_per_day: int = 2000
    locations: tuple[str, ...] = ()
    categories: tuple[str, ...] = ()
    expiring_days: int = 30
    urgent_days: int = 7
    attribute_item_cap: int = 100

    @classmethod
    def from_options(cls, options: dict[str, Any]) -> ReadinessSettings:
        """Build settings from a config entry options dict."""
        people = options.get("number_of_people")
        return cls(
            number_of_people=int(people) if people is not None else None,
            duration_hours=int(options.get("duration_hours", 72)),
            water_liters_per_person_per_day=float(
                options.get("water_liters_per_person_per_day", 3.0)
            ),
            calories_per_person_per_day=int(options.get("calories_per_person_per_day", 2000)),
            locations=tuple(options.get("locations") or ()),
            categories=tuple(options.get("categories") or ()),
            expiring_days=int(options.get("expiring_days", 30)),
            urgent_days=int(options.get("urgent_days", 7)),
            attribute_item_cap=int(options.get("attribute_item_cap", 100)),
        )

    def water_target_liters(self) -> float | None:
        """Total water liters needed for the configured duration."""
        if self.number_of_people is None:
            return None
        return (
            self.number_of_people
            * self.water_liters_per_person_per_day
            * self.duration_hours
            / 24.0
        )

    def food_target_calories(self) -> float | None:
        """Total food calories needed for the configured duration."""
        if self.number_of_people is None:
            return None
        return (
            self.number_of_people
            * self.calories_per_person_per_day
            * self.duration_hours
            / 24.0
        )


@dataclass(frozen=True, slots=True)
class ReadinessAssessment:
    """Result of a readiness calculation."""

    needs_people_count: bool
    water_on_hand: float
    water_target: float | None
    water_percent: float
    food_on_hand: float
    food_target: float | None
    food_percent: float
    overall_percent: float
    duration_hours: int
    water_supply_hours: float | None
    food_supply_hours: float | None
    supply_hours: float | None
    unmeasurable_water_count: int = 0
    unmeasurable_food_count: int = 0


def _optional_float(value: Any) -> float | None:
    if value is None or value == "":
        return None
    return float(value)
