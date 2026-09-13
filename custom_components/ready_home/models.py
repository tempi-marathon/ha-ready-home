"""Domain models for Ready Home inventory."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field, replace
from datetime import UTC, date, datetime
from enum import StrEnum
from typing import Any
from uuid import uuid4


class InventoryUnit(StrEnum):
    """Stock count units (how many bottles/packs you have).

    Measurable units (liter/gram/…) remain valid for legacy stored items;
    new UI only offers piece/pack/box and uses ContentsUnit for package size.
    """

    PIECE = "piece"
    PACK = "pack"
    BOX = "box"
    GRAM = "gram"
    KILOGRAM = "kilogram"
    LITER = "liter"
    MILLILITER = "milliliter"

    @classmethod
    def stock_units(cls) -> tuple[InventoryUnit, ...]:
        """Units offered for quantity in the panel."""
        return (cls.BOX, cls.PACK, cls.PIECE)

    def is_measurable(self) -> bool:
        """Return True when the unit can convert to liters/grams directly."""
        return self in {
            InventoryUnit.GRAM,
            InventoryUnit.KILOGRAM,
            InventoryUnit.LITER,
            InventoryUnit.MILLILITER,
        }


class ContentsUnit(StrEnum):
    """Unit for the contents of one stock unit (bottle, can, bag)."""

    GRAM = "gram"
    KILOGRAM = "kilogram"
    LITER = "liter"
    MILLILITER = "milliliter"

    @classmethod
    def sorted(cls) -> tuple[ContentsUnit, ...]:
        return (cls.GRAM, cls.KILOGRAM, cls.LITER, cls.MILLILITER)

    def is_volume(self) -> bool:
        return self in {ContentsUnit.LITER, ContentsUnit.MILLILITER}

    def is_mass(self) -> bool:
        return self in {ContentsUnit.GRAM, ContentsUnit.KILOGRAM}


class InventoryPriority(StrEnum):
    """Priority levels for inventory items."""

    ESSENTIAL = "essential"
    IMPORTANT = "important"
    OPTIONAL = "optional"


def _utc_now_iso() -> str:
    return datetime.now(UTC).replace(microsecond=0).isoformat()


def _norm_cat(value: str) -> str:
    return value.strip().lower()


def contents_to_liters(amount: float, unit: ContentsUnit) -> float | None:
    """Convert a contents amount to liters, or None if not volume."""
    if unit == ContentsUnit.LITER:
        return float(amount)
    if unit == ContentsUnit.MILLILITER:
        return float(amount) / 1000.0
    return None


def derive_liters_per_unit(
    contents_per_unit: float | None,
    contents_unit: ContentsUnit | None,
) -> float | None:
    """Liters contained in one stock unit, when contents are volume."""
    if contents_per_unit is None or contents_unit is None:
        return None
    return contents_to_liters(contents_per_unit, contents_unit)


def derive_calories_per_unit(
    contents_per_unit: float | None,
    calories_per_content: float | None,
) -> float | None:
    """Calories in one stock unit from contents × kcal-per-contents-unit."""
    if contents_per_unit is None or calories_per_content is None:
        return None
    return float(contents_per_unit) * float(calories_per_content)


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
    contents_per_unit: float | None = None
    contents_unit: ContentsUnit | None = None
    calories_per_content: float | None = None  # kcal per 1 contents_unit
    # Legacy / derived fields kept for readiness fallbacks and older clients
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

    def total_contents(self) -> float | None:
        """Quantity × contents_per_unit, when contents are set."""
        if self.contents_per_unit is None:
            return None
        return float(self.quantity) * float(self.contents_per_unit)

    def water_liters_on_hand(self) -> float | None:
        """Liters from current stock, or None if unmeasurable.

        Callers must decide whether the item counts as water (category mapping).
        """
        if self.contents_per_unit is not None and self.contents_unit is not None:
            liters_each = contents_to_liters(
                float(self.contents_per_unit), self.contents_unit
            )
            if liters_each is not None:
                return float(self.quantity) * liters_each

        # Legacy: quantity stored directly in volume units
        if self.unit == InventoryUnit.LITER:
            return float(self.quantity)
        if self.unit == InventoryUnit.MILLILITER:
            return float(self.quantity) / 1000.0
        if self.liters_per_unit is not None:
            return float(self.quantity) * float(self.liters_per_unit)
        return None

    def calories_on_hand(self) -> float | None:
        """Calories from current stock, or None if unmeasurable.

        Callers must decide whether the item counts as food (category mapping).
        """
        if (
            self.contents_per_unit is not None
            and self.calories_per_content is not None
        ):
            return (
                float(self.quantity)
                * float(self.contents_per_unit)
                * float(self.calories_per_content)
            )
        if self.calories_per_unit is None:
            return None
        return float(self.quantity) * float(self.calories_per_unit)

    def with_synced_derived(self) -> InventoryItem:
        """Refresh liters_per_unit / calories_per_unit from contents fields."""
        if self.contents_per_unit is None or self.contents_unit is None:
            return self
        return replace(
            self,
            liters_per_unit=derive_liters_per_unit(
                self.contents_per_unit, self.contents_unit
            ),
            calories_per_unit=derive_calories_per_unit(
                self.contents_per_unit, self.calories_per_content
            ),
        )

    def to_dict(self) -> dict[str, Any]:
        """Serialize to a JSON-compatible dict (no legacy resource field)."""
        data = asdict(self)
        data["unit"] = self.unit.value
        data["priority"] = self.priority.value
        data["contents_unit"] = (
            self.contents_unit.value if self.contents_unit is not None else None
        )
        return data

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> InventoryItem:
        """Deserialize from a stored dict.

        Legacy ``resource`` is used only to fill an empty category so existing
        inventory keeps counting after the category-mapping migration.
        """
        category = str(data.get("category") or "")
        if not category.strip():
            legacy = str(data.get("resource") or "").lower()
            if legacy == "food":
                category = "Food"
            elif legacy == "water":
                category = "Water"

        raw_contents_unit = data.get("contents_unit")
        contents_unit: ContentsUnit | None = None
        if raw_contents_unit:
            contents_unit = ContentsUnit(str(raw_contents_unit))

        item = cls(
            id=str(data.get("id") or uuid4().hex),
            name=str(data["name"]),
            quantity=float(data.get("quantity", 0)),
            desired_quantity=float(data.get("desired_quantity", 0)),
            unit=InventoryUnit(data.get("unit", InventoryUnit.PIECE)),
            location=str(data.get("location") or ""),
            category=category,
            notes=str(data.get("notes") or ""),
            barcode=str(data.get("barcode") or ""),
            priority=InventoryPriority(data.get("priority", InventoryPriority.IMPORTANT)),
            expiry_date=data.get("expiry_date"),
            contents_per_unit=_optional_float(data.get("contents_per_unit")),
            contents_unit=contents_unit,
            calories_per_content=_optional_float(data.get("calories_per_content")),
            liters_per_unit=_optional_float(data.get("liters_per_unit")),
            calories_per_unit=_optional_float(data.get("calories_per_unit")),
            created_at=str(data.get("created_at") or _utc_now_iso()),
            updated_at=str(data.get("updated_at") or _utc_now_iso()),
        )
        return item

    def with_updates(self, **changes: Any) -> InventoryItem:
        """Return a copy with the given fields updated and updated_at refreshed."""
        changes["updated_at"] = _utc_now_iso()
        changes.pop("resource", None)
        if "unit" in changes and isinstance(changes["unit"], str):
            changes["unit"] = InventoryUnit(changes["unit"])
        if "priority" in changes and isinstance(changes["priority"], str):
            changes["priority"] = InventoryPriority(changes["priority"])
        if "contents_unit" in changes:
            raw = changes["contents_unit"]
            if raw is None or raw == "":
                changes["contents_unit"] = None
            elif isinstance(raw, str):
                changes["contents_unit"] = ContentsUnit(raw)
        updated = replace(self, **changes)
        return updated.with_synced_derived()


@dataclass(frozen=True, slots=True)
class ReadinessSettings:
    """Household readiness targets and reference lists."""

    number_of_people: int | None = None
    duration_hours: int = 72
    water_liters_per_person_per_day: float = 3.0
    calories_per_person_per_day: int = 2000
    locations: tuple[str, ...] = ()
    categories: tuple[str, ...] = ()
    food_categories: tuple[str, ...] = ("Food",)
    water_categories: tuple[str, ...] = ("Water",)
    expiring_days: int = 30
    urgent_days: int = 7

    @classmethod
    def from_options(cls, options: dict[str, Any]) -> ReadinessSettings:
        """Build settings from a config entry options dict."""
        people = options.get("number_of_people")
        categories = tuple(options.get("categories") or ())
        food_categories = options.get("food_categories")
        water_categories = options.get("water_categories")
        food_categories = (
            ("Food",) if food_categories is None else tuple(food_categories)
        )
        water_categories = (
            ("Water",) if water_categories is None else tuple(water_categories)
        )
        return cls(
            number_of_people=int(people) if people is not None else None,
            duration_hours=int(options.get("duration_hours", 72)),
            water_liters_per_person_per_day=float(
                options.get("water_liters_per_person_per_day", 3.0)
            ),
            calories_per_person_per_day=int(options.get("calories_per_person_per_day", 2000)),
            locations=tuple(options.get("locations") or ()),
            categories=categories,
            food_categories=food_categories,
            water_categories=water_categories,
            expiring_days=int(options.get("expiring_days", 30)),
            urgent_days=int(options.get("urgent_days", 7)),
        )

    def is_food_category(self, category: str) -> bool:
        """True when category is mapped to food readiness."""
        key = _norm_cat(category)
        if not key:
            return False
        return any(_norm_cat(c) == key for c in self.food_categories)

    def is_water_category(self, category: str) -> bool:
        """True when category is mapped to water readiness."""
        key = _norm_cat(category)
        if not key:
            return False
        return any(_norm_cat(c) == key for c in self.water_categories)

    def readiness_kind(self, category: str) -> str:
        """Return food, water, or none for a category name."""
        if self.is_water_category(category):
            return "water"
        if self.is_food_category(category):
            return "food"
        return "none"

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
