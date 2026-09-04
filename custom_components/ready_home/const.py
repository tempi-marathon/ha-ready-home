"""Constants for the Ready Home integration."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "ready_home"
VERSION: Final = "0.1.0"
STORAGE_KEY: Final = f"{DOMAIN}.inventory"
STORAGE_VERSION: Final = 1
SAVE_DELAY: Final = 1.0

# Config / options keys
CONF_NUMBER_OF_PEOPLE: Final = "number_of_people"
CONF_DURATION_HOURS: Final = "duration_hours"
CONF_WATER_LITERS_PER_PERSON_PER_DAY: Final = "water_liters_per_person_per_day"
CONF_CALORIES_PER_PERSON_PER_DAY: Final = "calories_per_person_per_day"
CONF_LOCATIONS: Final = "locations"
CONF_CATEGORIES: Final = "categories"
CONF_EXPIRING_DAYS: Final = "expiring_days"
CONF_URGENT_DAYS: Final = "urgent_days"
CONF_ATTRIBUTE_ITEM_CAP: Final = "attribute_item_cap"

# Defaults (match Ready Home App)
DEFAULT_DURATION_HOURS: Final = 72
DEFAULT_WATER_LITERS_PER_PERSON_PER_DAY: Final = 3.0
DEFAULT_CALORIES_PER_PERSON_PER_DAY: Final = 2000
DEFAULT_EXPIRING_DAYS: Final = 30
DEFAULT_URGENT_DAYS: Final = 7
DEFAULT_ATTRIBUTE_ITEM_CAP: Final = 100
DEFAULT_LOCATIONS: Final = ["Pantry", "Garage", "Basement"]
DEFAULT_CATEGORIES: Final = ["Food", "Water", "Medical", "Tools", "Other"]

# Events
EVENT_ITEM_EXPIRED: Final = f"{DOMAIN}_item_expired"
EVENT_ITEM_EXPIRING: Final = f"{DOMAIN}_item_expiring"
EVENT_ITEM_LOW_STOCK: Final = f"{DOMAIN}_item_low_stock"

# Platforms
PLATFORMS: Final = ["sensor", "binary_sensor"]

# Attr keys
ATTR_ITEMS: Final = "items"
ATTR_WATER_ON_HAND: Final = "water_on_hand"
ATTR_WATER_TARGET: Final = "water_target"
ATTR_WATER_PERCENT: Final = "water_percent"
ATTR_WATER_SUPPLY_HOURS: Final = "water_supply_hours"
ATTR_FOOD_ON_HAND: Final = "food_on_hand"
ATTR_FOOD_TARGET: Final = "food_target"
ATTR_FOOD_PERCENT: Final = "food_percent"
ATTR_FOOD_SUPPLY_HOURS: Final = "food_supply_hours"
ATTR_SUPPLY_HOURS: Final = "supply_hours"
ATTR_DURATION_HOURS: Final = "duration_hours"
ATTR_UNMEASURABLE_WATER: Final = "unmeasurable_water_count"
ATTR_UNMEASURABLE_FOOD: Final = "unmeasurable_food_count"
ATTR_NEEDS_PEOPLE_COUNT: Final = "needs_people_count"
