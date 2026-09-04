"""Summary sensors for Ready Home."""

from __future__ import annotations

from homeassistant.components.sensor import (
    SensorEntity,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import PERCENTAGE, EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .attention import item_summary
from .const import (
    ATTR_DURATION_HOURS,
    ATTR_FOOD_ON_HAND,
    ATTR_FOOD_PERCENT,
    ATTR_FOOD_SUPPLY_HOURS,
    ATTR_FOOD_TARGET,
    ATTR_ITEMS,
    ATTR_NEEDS_PEOPLE_COUNT,
    ATTR_SUPPLY_HOURS,
    ATTR_UNMEASURABLE_FOOD,
    ATTR_UNMEASURABLE_WATER,
    ATTR_WATER_ON_HAND,
    ATTR_WATER_PERCENT,
    ATTR_WATER_SUPPLY_HOURS,
    ATTR_WATER_TARGET,
    DOMAIN,
    VERSION,
)
from .coordinator import ReadyHomeCoordinator


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
        ]
    )


class ReadyHomeSensorBase(CoordinatorEntity[ReadyHomeCoordinator], SensorEntity):
    """Base class for Ready Home sensors."""

    _attr_has_entity_name = True

    def __init__(
        self, coordinator: ReadyHomeCoordinator, entry: ConfigEntry, key: str
    ) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{entry.entry_id}_{key}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name="Ready Home",
            manufacturer="Ready Home",
            model="Emergency inventory",
            sw_version=VERSION,
            entry_type=DeviceEntryType.SERVICE,
        )


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
            ATTR_WATER_TARGET: a.water_target,
            ATTR_WATER_PERCENT: a.water_percent,
            ATTR_WATER_SUPPLY_HOURS: a.water_supply_hours,
            ATTR_FOOD_ON_HAND: a.food_on_hand,
            ATTR_FOOD_TARGET: a.food_target,
            ATTR_FOOD_PERCENT: a.food_percent,
            ATTR_FOOD_SUPPLY_HOURS: a.food_supply_hours,
            ATTR_SUPPLY_HOURS: a.supply_hours,
            ATTR_DURATION_HOURS: a.duration_hours,
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
            ATTR_WATER_TARGET: a.water_target,
            ATTR_WATER_SUPPLY_HOURS: a.water_supply_hours,
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
            ATTR_FOOD_TARGET: a.food_target,
            ATTR_FOOD_SUPPLY_HOURS: a.food_supply_hours,
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
        remaining = max(0, self.coordinator.settings.attribute_item_cap - len(urgent))
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
    """Total inventory item count."""

    _attr_translation_key = "items"
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_icon = "mdi:package-variant"
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, coordinator: ReadyHomeCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry, "items")

    @property
    def native_value(self) -> int:
        return len(self.coordinator.data.items)
