"""Summary sensors for Ready Home."""

from __future__ import annotations

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import PERCENTAGE, EntityCategory, UnitOfTime, UnitOfVolume
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .attention import item_summary
from .const import (
    ATTR_DURATION_HOURS,
    ATTR_DURATION_HOURS_UNIT,
    ATTR_FOOD_ON_HAND,
    ATTR_FOOD_ON_HAND_UNIT,
    ATTR_FOOD_PERCENT,
    ATTR_FOOD_SUPPLY_HOURS,
    ATTR_FOOD_SUPPLY_HOURS_UNIT,
    ATTR_FOOD_TARGET,
    ATTR_FOOD_TARGET_UNIT,
    ATTR_ITEMS,
    ATTR_NEEDS_PEOPLE_COUNT,
    ATTR_SUPPLY_HOURS,
    ATTR_SUPPLY_HOURS_UNIT,
    ATTR_UNMEASURABLE_FOOD,
    ATTR_UNMEASURABLE_WATER,
    ATTR_WATER_ON_HAND,
    ATTR_WATER_ON_HAND_UNIT,
    ATTR_WATER_PERCENT,
    ATTR_WATER_SUPPLY_HOURS,
    ATTR_WATER_SUPPLY_HOURS_UNIT,
    ATTR_WATER_TARGET,
    ATTR_WATER_TARGET_UNIT,
    ATTRIBUTE_ITEM_CAP,
    DOMAIN,
    UNIT_HOURS,
    UNIT_KCAL,
    UNIT_LITERS,
)
from .coordinator import ReadyHomeCoordinator
from .helpers import device_info_for_entry


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Ready Home sensors."""
    coordinator: ReadyHomeCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities(
        [
            ReadinessSensor(coordinator, entry),
            WaterReadinessSensor(coordinator, entry),
            FoodReadinessSensor(coordinator, entry),
            ExpiredItemsSensor(coordinator, entry),
            ExpiringItemsSensor(coordinator, entry),
            LowStockItemsSensor(coordinator, entry),
            TotalItemsSensor(coordinator, entry),
            PeopleSensor(coordinator, entry),
            DurationSensor(coordinator, entry),
            FoodTargetSensor(coordinator, entry),
            WaterTargetSensor(coordinator, entry),
        ]
    )


class ReadyHomeSensorBase(CoordinatorEntity[ReadyHomeCoordinator], SensorEntity):
    """Base class for Ready Home sensors."""

    _attr_has_entity_name = True

    def __init__(
        self, coordinator: ReadyHomeCoordinator, entry: ConfigEntry, key: str
    ) -> None:
        super().__init__(coordinator)
        self._object_id = key
        self._attr_unique_id = f"{entry.entry_id}_{key}"
        self._attr_device_info = device_info_for_entry(entry)

    @property
    def suggested_object_id(self) -> str | None:
        """Stable English object id (not derived from translated name)."""
        return self._object_id

    @callback
    def _handle_coordinator_update(self) -> None:
        """Apply the shared update context before writing state."""
        ctx = self.coordinator.update_context
        if ctx is not None:
            self.async_set_context(ctx)
        super()._handle_coordinator_update()


class ReadinessSensor(ReadyHomeSensorBase):
    """Overall readiness percentage."""

    _attr_translation_key = "readiness"
    _attr_native_unit_of_measurement = PERCENTAGE
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_icon = "mdi:shield-home"

    def __init__(self, coordinator: ReadyHomeCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry, "readiness")

    @property
    def native_value(self) -> float | None:
        data = self.coordinator.data
        if data is None or data.assessment.needs_people_count:
            return None
        return round(data.assessment.overall_percent, 1)

    @property
    def extra_state_attributes(self) -> dict:
        a = self.coordinator.data.assessment
        return {
            ATTR_WATER_ON_HAND: a.water_on_hand,
            ATTR_WATER_ON_HAND_UNIT: UNIT_LITERS,
            ATTR_WATER_TARGET: a.water_target,
            ATTR_WATER_TARGET_UNIT: UNIT_LITERS,
            ATTR_WATER_PERCENT: a.water_percent,
            ATTR_WATER_SUPPLY_HOURS: a.water_supply_hours,
            ATTR_WATER_SUPPLY_HOURS_UNIT: UNIT_HOURS,
            ATTR_FOOD_ON_HAND: a.food_on_hand,
            ATTR_FOOD_ON_HAND_UNIT: UNIT_KCAL,
            ATTR_FOOD_TARGET: a.food_target,
            ATTR_FOOD_TARGET_UNIT: UNIT_KCAL,
            ATTR_FOOD_PERCENT: a.food_percent,
            ATTR_FOOD_SUPPLY_HOURS: a.food_supply_hours,
            ATTR_FOOD_SUPPLY_HOURS_UNIT: UNIT_HOURS,
            ATTR_SUPPLY_HOURS: a.supply_hours,
            ATTR_SUPPLY_HOURS_UNIT: UNIT_HOURS,
            ATTR_DURATION_HOURS: a.duration_hours,
            ATTR_DURATION_HOURS_UNIT: UNIT_HOURS,
            ATTR_UNMEASURABLE_WATER: a.unmeasurable_water_count,
            ATTR_UNMEASURABLE_FOOD: a.unmeasurable_food_count,
            ATTR_NEEDS_PEOPLE_COUNT: a.needs_people_count,
        }


class WaterReadinessSensor(ReadyHomeSensorBase):
    """Water readiness percentage."""

    _attr_translation_key = "water_readiness"
    _attr_native_unit_of_measurement = PERCENTAGE
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_icon = "mdi:water"

    def __init__(self, coordinator: ReadyHomeCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry, "water_readiness")

    @property
    def native_value(self) -> float | None:
        data = self.coordinator.data
        if data is None or data.assessment.needs_people_count:
            return None
        return round(data.assessment.water_percent, 1)

    @property
    def extra_state_attributes(self) -> dict:
        a = self.coordinator.data.assessment
        return {
            ATTR_WATER_ON_HAND: a.water_on_hand,
            ATTR_WATER_ON_HAND_UNIT: UNIT_LITERS,
            ATTR_WATER_TARGET: a.water_target,
            ATTR_WATER_TARGET_UNIT: UNIT_LITERS,
            ATTR_WATER_SUPPLY_HOURS: a.water_supply_hours,
            ATTR_WATER_SUPPLY_HOURS_UNIT: UNIT_HOURS,
            ATTR_UNMEASURABLE_WATER: a.unmeasurable_water_count,
        }


class FoodReadinessSensor(ReadyHomeSensorBase):
    """Food readiness percentage."""

    _attr_translation_key = "food_readiness"
    _attr_native_unit_of_measurement = PERCENTAGE
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_icon = "mdi:food-apple"

    def __init__(self, coordinator: ReadyHomeCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry, "food_readiness")

    @property
    def native_value(self) -> float | None:
        data = self.coordinator.data
        if data is None or data.assessment.needs_people_count:
            return None
        return round(data.assessment.food_percent, 1)

    @property
    def extra_state_attributes(self) -> dict:
        a = self.coordinator.data.assessment
        return {
            ATTR_FOOD_ON_HAND: a.food_on_hand,
            ATTR_FOOD_ON_HAND_UNIT: UNIT_KCAL,
            ATTR_FOOD_TARGET: a.food_target,
            ATTR_FOOD_TARGET_UNIT: UNIT_KCAL,
            ATTR_FOOD_SUPPLY_HOURS: a.food_supply_hours,
            ATTR_FOOD_SUPPLY_HOURS_UNIT: UNIT_HOURS,
            ATTR_UNMEASURABLE_FOOD: a.unmeasurable_food_count,
        }


class _BucketSensor(ReadyHomeSensorBase):
    """Count sensor with capped item list attribute."""

    _attr_state_class = SensorStateClass.MEASUREMENT
    _unrecorded_attributes = frozenset({ATTR_ITEMS})

    def __init__(
        self, coordinator: ReadyHomeCoordinator, entry: ConfigEntry, key: str
    ) -> None:
        super().__init__(coordinator, entry, key)


class ExpiredItemsSensor(_BucketSensor):
    """Count of expired items."""

    _attr_translation_key = "expired_items"
    _attr_icon = "mdi:calendar-remove"

    def __init__(self, coordinator: ReadyHomeCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry, "expired_items")

    @property
    def native_value(self) -> int:
        return len(self.coordinator.data.buckets.expired)

    @property
    def extra_state_attributes(self) -> dict:
        return {
            ATTR_ITEMS: self.coordinator.capped_item_dicts(
                self.coordinator.data.buckets.expired
            )
        }


class ExpiringItemsSensor(_BucketSensor):
    """Count of items expiring within the configured window (includes urgent)."""

    _attr_translation_key = "expiring_items"
    _attr_icon = "mdi:calendar-alert"
    _unrecorded_attributes = frozenset({ATTR_ITEMS, "urgent_items"})

    def __init__(self, coordinator: ReadyHomeCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry, "expiring_items")

    @property
    def native_value(self) -> int:
        b = self.coordinator.data.buckets
        return len(b.within_urgent) + len(b.within_expiring)

    @property
    def extra_state_attributes(self) -> dict:
        b = self.coordinator.data.buckets
        urgent = self.coordinator.capped_item_dicts(b.within_urgent)
        # Fill remaining cap with non-urgent expiring
        remaining = max(0, ATTRIBUTE_ITEM_CAP - len(urgent))
        expiring = [item_summary(i) for i in b.within_expiring[:remaining]]
        return {
            ATTR_ITEMS: urgent + expiring,
            "urgent_count": len(b.within_urgent),
            "urgent_items": urgent,
        }


class LowStockItemsSensor(_BucketSensor):
    """Count of low-stock items."""

    _attr_translation_key = "low_stock_items"
    _attr_icon = "mdi:package-variant-closed-remove"

    def __init__(self, coordinator: ReadyHomeCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry, "low_stock_items")

    @property
    def native_value(self) -> int:
        return len(self.coordinator.data.buckets.low_stock)

    @property
    def extra_state_attributes(self) -> dict:
        return {
            ATTR_ITEMS: self.coordinator.capped_item_dicts(
                self.coordinator.data.buckets.low_stock
            )
        }


class TotalItemsSensor(ReadyHomeSensorBase):
    """Total inventory item count (diagnostic)."""

    _attr_translation_key = "items"
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_icon = "mdi:package-variant"
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, coordinator: ReadyHomeCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry, "items")

    @property
    def native_value(self) -> int:
        return len(self.coordinator.data.items)


class PeopleSensor(ReadyHomeSensorBase):
    """Household size from readiness settings."""

    _attr_translation_key = "people"
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_icon = "mdi:account-group"
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, coordinator: ReadyHomeCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry, "people")

    @property
    def native_value(self) -> int | None:
        return self.coordinator.settings.number_of_people


class DurationSensor(ReadyHomeSensorBase):
    """Planning horizon duration from readiness settings."""

    _attr_translation_key = "duration"
    _attr_native_unit_of_measurement = UnitOfTime.HOURS
    _attr_device_class = SensorDeviceClass.DURATION
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_icon = "mdi:timer-sand"
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, coordinator: ReadyHomeCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry, "duration")

    @property
    def native_value(self) -> int:
        return self.coordinator.settings.duration_hours


class FoodTargetSensor(ReadyHomeSensorBase):
    """Computed food calorie target for the planning horizon."""

    _attr_translation_key = "food_target"
    _attr_native_unit_of_measurement = UNIT_KCAL
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_icon = "mdi:food-apple"
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, coordinator: ReadyHomeCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry, "food_target")

    @property
    def native_value(self) -> float | None:
        target = self.coordinator.settings.food_target_calories()
        if target is None:
            return None
        return round(target, 1)


class WaterTargetSensor(ReadyHomeSensorBase):
    """Computed water liter target for the planning horizon."""

    _attr_translation_key = "water_target"
    _attr_native_unit_of_measurement = UnitOfVolume.LITERS
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_icon = "mdi:water"
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, coordinator: ReadyHomeCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry, "water_target")

    @property
    def native_value(self) -> float | None:
        target = self.coordinator.settings.water_target_liters()
        if target is None:
            return None
        return round(target, 1)
