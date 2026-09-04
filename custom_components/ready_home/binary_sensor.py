"""Binary sensors for Ready Home."""

from __future__ import annotations

from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN, VERSION
from .coordinator import ReadyHomeCoordinator


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Ready Home binary sensors."""
    coordinator: ReadyHomeCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([NeedsAttentionBinarySensor(coordinator, entry)])


class NeedsAttentionBinarySensor(
    CoordinatorEntity[ReadyHomeCoordinator], BinarySensorEntity
):
    """On when any attention bucket is non-empty."""

    _attr_has_entity_name = True
    _attr_translation_key = "needs_attention"
    _attr_device_class = BinarySensorDeviceClass.PROBLEM
    _attr_icon = "mdi:alert-circle"

    def __init__(
        self, coordinator: ReadyHomeCoordinator, entry: ConfigEntry
    ) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{entry.entry_id}_needs_attention"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name="Ready Home",
            manufacturer="Ready Home",
            model="Emergency inventory",
            sw_version=VERSION,
            entry_type=DeviceEntryType.SERVICE,
        )

    @property
    def is_on(self) -> bool:
        b = self.coordinator.data.buckets
        return bool(b.expired or b.within_urgent or b.within_expiring or b.low_stock)
