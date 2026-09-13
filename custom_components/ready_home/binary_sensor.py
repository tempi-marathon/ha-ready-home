"""Binary sensors for Ready Home."""

from __future__ import annotations

from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .attention import attention_cause_attrs
from .const import (
    ATTR_CAUSE,
    ATTR_CAUSES,
    ATTR_EXPIRED_COUNT,
    ATTR_EXPIRING_COUNT,
    ATTR_LOW_STOCK_COUNT,
    ATTR_URGENT_COUNT,
    DOMAIN,
)
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
    _unrecorded_attributes = frozenset({ATTR_CAUSES, ATTR_CAUSE})

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

    @callback
    def _handle_coordinator_update(self) -> None:
        """Apply the shared update context before writing state."""
        ctx = self.coordinator.update_context
        if ctx is not None:
            self.async_set_context(ctx)
        super()._handle_coordinator_update()

    @property
    def is_on(self) -> bool:
        b = self.coordinator.data.buckets
        return bool(b.expired or b.within_urgent or b.within_expiring or b.low_stock)

    @property
    def extra_state_attributes(self) -> dict:
        attrs = attention_cause_attrs(self.coordinator.data.buckets)
        return {
            ATTR_EXPIRED_COUNT: attrs["expired_count"],
            ATTR_URGENT_COUNT: attrs["urgent_count"],
            ATTR_EXPIRING_COUNT: attrs["expiring_count"],
            ATTR_LOW_STOCK_COUNT: attrs["low_stock_count"],
            ATTR_CAUSES: attrs["causes"],
            ATTR_CAUSE: attrs["cause"],
        }
