"""Binary sensors for Ready Home."""

from __future__ import annotations

from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import ReadyHomeCoordinator
from .helpers import device_info_for_entry


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
        self._object_id = "needs_attention"
        self._attr_unique_id = f"{entry.entry_id}_needs_attention"
        self._attr_device_info = device_info_for_entry(entry)

    @property
    def suggested_object_id(self) -> str | None:
        """Stable English object id (not derived from translated name)."""
        return self._object_id

    @property
    def is_on(self) -> bool:
        b = self.coordinator.data.buckets
        return bool(b.expired or b.within_urgent or b.within_expiring or b.low_stock)
