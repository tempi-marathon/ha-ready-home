"""Config and options flows for Ready Home."""

from __future__ import annotations

import math
from typing import Any
from uuid import uuid4

import voluptuous as vol
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import callback
from homeassistant.helpers.selector import (
    BooleanSelector,
    EntitySelector,
    EntitySelectorConfig,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
)

from .const import (
    AGE_CATEGORIES,
    AGE_CATEGORY_ADULTS,
    CONF_AUTO_PUSH_RESTOCK,
    CONF_CALORIES_PER_PERSON_PER_DAY,
    CONF_CATEGORIES,
    CONF_DURATION_HOURS,
    CONF_EXPIRING_DAYS,
    CONF_FOOD_CATEGORIES,
    CONF_LOCATIONS,
    CONF_NAME,
    CONF_NUMBER_OF_PEOPLE,
    CONF_PET_FOOD_CATEGORIES,
    CONF_PETS,
    CONF_TODO_ENTITY_ID,
    CONF_URGENT_DAYS,
    CONF_WATER_CATEGORIES,
    CONF_WATER_LITERS_PER_PERSON_PER_DAY,
    DEFAULT_AGE_CATEGORY_CALORIES,
    DEFAULT_AGE_CATEGORY_WATER_LITERS,
    DEFAULT_CATEGORIES,
    DEFAULT_DURATION_HOURS,
    DEFAULT_EXPIRING_DAYS,
    DEFAULT_FOOD_CATEGORIES,
    DEFAULT_LOCATIONS,
    DEFAULT_PET_FOOD_CATEGORIES,
    DEFAULT_PROFILE_NAME,
    DEFAULT_URGENT_DAYS,
    DEFAULT_WATER_CATEGORIES,
    DOMAIN,
    conf_calories,
    conf_count,
    conf_water,
)
from .models import ReadinessSettings, pets_from_options

PET_TYPE = "type"
PET_FOOD_GRAMS = "food_grams_per_day"
PET_WATER_LITERS = "water_liters_per_day"
PET_SELECT = "pet"


def _targets_form_values(options: dict[str, Any]) -> dict[str, Any]:
    """Current effective target values (legacy entries read as all adults)."""
    settings = ReadinessSettings.from_options(options)
    values: dict[str, Any] = {CONF_DURATION_HOURS: settings.duration_hours}
    for target in settings.category_targets():
        values[conf_count(target.key)] = target.count
        values[conf_calories(target.key)] = target.calories_per_day
        values[conf_water(target.key)] = target.water_liters_per_day
    if not any(values[conf_count(k)] for k in AGE_CATEGORIES):
        values[conf_count(AGE_CATEGORY_ADULTS)] = 2
    return values


def _apply_targets(
    options: dict[str, Any], user_input: dict[str, Any]
) -> dict[str, Any] | None:
    """Return options updated with submitted targets, or None for an empty household.

    Legacy keys stay in sync: the headcount is the total and the per-person values
    are the adult values, so older code still reads sensible numbers.
    """
    updated = dict(options)
    total = 0
    for key in AGE_CATEGORIES:
        count = int(user_input[conf_count(key)])
        total += count
        updated[conf_count(key)] = count
        updated[conf_calories(key)] = int(user_input[conf_calories(key)])
        updated[conf_water(key)] = float(user_input[conf_water(key)])
    if total < 1:
        return None
    updated[CONF_DURATION_HOURS] = int(user_input[CONF_DURATION_HOURS])
    updated[CONF_NUMBER_OF_PEOPLE] = total
    updated[CONF_CALORIES_PER_PERSON_PER_DAY] = updated[conf_calories(AGE_CATEGORY_ADULTS)]
    updated[CONF_WATER_LITERS_PER_PERSON_PER_DAY] = updated[
        conf_water(AGE_CATEGORY_ADULTS)
    ]
    return updated


def _new_entry_target_options(adults: int) -> dict[str, Any]:
    """Target options for a new profile: adults only, other categories at 0."""
    options: dict[str, Any] = {}
    for key in AGE_CATEGORIES:
        options[conf_count(key)] = adults if key == AGE_CATEGORY_ADULTS else 0
        options[conf_calories(key)] = DEFAULT_AGE_CATEGORY_CALORIES[key]
        options[conf_water(key)] = DEFAULT_AGE_CATEGORY_WATER_LITERS[key]
    options[CONF_NUMBER_OF_PEOPLE] = adults
    options[CONF_CALORIES_PER_PERSON_PER_DAY] = DEFAULT_AGE_CATEGORY_CALORIES[
        AGE_CATEGORY_ADULTS
    ]
    options[CONF_WATER_LITERS_PER_PERSON_PER_DAY] = DEFAULT_AGE_CATEGORY_WATER_LITERS[
        AGE_CATEGORY_ADULTS
    ]
    return options


def _merge_category_lists(
    categories: list[str],
    food_categories: list[str],
    water_categories: list[str],
    pet_food_categories: list[str] | None = None,
) -> list[str]:
    """Ensure mapped food/water/pet food names exist in the master categories list."""
    merged: list[str] = []
    seen: set[str] = set()
    for name in [
        *categories,
        *food_categories,
        *water_categories,
        *(pet_food_categories or []),
    ]:
        cleaned = str(name).strip()
        if not cleaned:
            continue
        key = cleaned.lower()
        if key in seen:
            continue
        seen.add(key)
        merged.append(cleaned)
    return merged


def _category_keys(categories: list[str]) -> set[str]:
    return {str(c).strip().lower() for c in categories if str(c).strip()}


def _overlap_error(
    food_categories: list[str],
    water_categories: list[str],
    pet_food_categories: list[str] | None = None,
) -> bool:
    """True when a category name appears in more than one of the mapping lists."""
    food_keys = _category_keys(food_categories)
    water_keys = _category_keys(water_categories)
    pet_keys = _category_keys(pet_food_categories or [])
    return bool(food_keys & water_keys or food_keys & pet_keys or water_keys & pet_keys)


def _default_pet_food_categories(
    food_categories: list[str], water_categories: list[str]
) -> list[str]:
    """Default pet food categories, leaving out names already mapped to food or water."""
    taken = _category_keys(food_categories) | _category_keys(water_categories)
    return [c for c in DEFAULT_PET_FOOD_CATEGORIES if c.strip().lower() not in taken]


def _pet_label(pet: dict[str, Any]) -> str:
    """Name with the optional type, for pick lists."""
    pet_type = str(pet.get("type") or "").strip()
    return f"{pet['name']} ({pet_type})" if pet_type else str(pet["name"])


def _stored_pets(options: dict[str, Any]) -> list[dict[str, Any]]:
    """Valid pets from options as plain dicts (malformed entries are dropped)."""
    return [
        {
            "id": p.id,
            "name": p.name,
            PET_TYPE: p.type,
            PET_FOOD_GRAMS: p.food_grams_per_day,
            PET_WATER_LITERS: p.water_liters_per_day,
        }
        for p in pets_from_options(options.get(CONF_PETS))
    ]


def _pet_from_input(
    user_input: dict[str, Any], pet_id: str
) -> tuple[dict[str, Any] | None, str | None]:
    """Validate a pet form submission; returns (pet, None) or (None, error key)."""
    name = str(user_input.get(CONF_NAME) or "").strip()
    if not name:
        return None, "invalid_pet_name"
    amounts: list[float] = []
    for key in (PET_FOOD_GRAMS, PET_WATER_LITERS):
        raw = user_input.get(key)
        try:
            value = float(raw)
        except (TypeError, ValueError):
            return None, "invalid_pet_amount"
        if isinstance(raw, bool) or not math.isfinite(value) or value < 0:
            return None, "invalid_pet_amount"
        amounts.append(value)
    return {
        "id": pet_id,
        "name": name,
        PET_TYPE: str(user_input.get(PET_TYPE) or "").strip(),
        PET_FOOD_GRAMS: amounts[0],
        PET_WATER_LITERS: amounts[1],
    }, None


def _add_pet(
    options: dict[str, Any], user_input: dict[str, Any]
) -> tuple[dict[str, Any] | None, str | None]:
    """Return options with a new pet appended, or (None, error key).

    The first pet also opts the install into pet food: when no pet food category
    list exists yet it is seeded with the default (minus names already mapped to
    food or water), so existing installs only change once the user adds a pet.
    """
    pet, error = _pet_from_input(user_input, uuid4().hex)
    if pet is None:
        return None, error
    updated = dict(options)
    updated[CONF_PETS] = [*_stored_pets(options), pet]
    if CONF_PET_FOOD_CATEGORIES not in options:
        food = list(options.get(CONF_FOOD_CATEGORIES) or DEFAULT_FOOD_CATEGORIES)
        water = list(options.get(CONF_WATER_CATEGORIES) or DEFAULT_WATER_CATEGORIES)
        seeded = _default_pet_food_categories(food, water)
        updated[CONF_PET_FOOD_CATEGORIES] = seeded
        updated[CONF_CATEGORIES] = _merge_category_lists(
            list(options.get(CONF_CATEGORIES) or DEFAULT_CATEGORIES), [], [], seeded
        )
    return updated, None


def _update_pet(
    options: dict[str, Any], pet_id: str, user_input: dict[str, Any]
) -> tuple[dict[str, Any] | None, str | None]:
    """Return options with one pet replaced (id kept), or (None, error key)."""
    pet, error = _pet_from_input(user_input, pet_id)
    if pet is None:
        return None, error
    pets = _stored_pets(options)
    if not any(p["id"] == pet_id for p in pets):
        return None, "unknown_pet"
    updated = dict(options)
    updated[CONF_PETS] = [pet if p["id"] == pet_id else p for p in pets]
    return updated, None


def _remove_pet(options: dict[str, Any], pet_id: str) -> dict[str, Any]:
    """Return options without the given pet."""
    updated = dict(options)
    updated[CONF_PETS] = [p for p in _stored_pets(options) if p["id"] != pet_id]
    return updated


class ReadyHomeConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Ready Home."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Initial setup: profile name and household size."""
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()

        errors: dict[str, str] = {}

        if user_input is not None:
            people = user_input.get(CONF_NUMBER_OF_PEOPLE)
            name = str(user_input.get(CONF_NAME) or DEFAULT_PROFILE_NAME).strip()
            if not name:
                errors["base"] = "invalid_name"
            elif people is None or int(people) < 1:
                errors["base"] = "invalid_people"
            else:
                return self.async_create_entry(
                    title=name,
                    data={CONF_NAME: name},
                    options={
                        **_new_entry_target_options(int(people)),
                        CONF_DURATION_HOURS: DEFAULT_DURATION_HOURS,
                        CONF_LOCATIONS: list(DEFAULT_LOCATIONS),
                        CONF_CATEGORIES: _merge_category_lists(
                            list(DEFAULT_CATEGORIES),
                            [],
                            [],
                            list(DEFAULT_PET_FOOD_CATEGORIES),
                        ),
                        CONF_FOOD_CATEGORIES: list(DEFAULT_FOOD_CATEGORIES),
                        CONF_WATER_CATEGORIES: list(DEFAULT_WATER_CATEGORIES),
                        CONF_PET_FOOD_CATEGORIES: list(DEFAULT_PET_FOOD_CATEGORIES),
                        CONF_EXPIRING_DAYS: DEFAULT_EXPIRING_DAYS,
                        CONF_URGENT_DAYS: DEFAULT_URGENT_DAYS,
                    },
                )

        schema = vol.Schema(
            {
                vol.Required(CONF_NAME, default=DEFAULT_PROFILE_NAME): TextSelector(),
                vol.Required(CONF_NUMBER_OF_PEOPLE, default=2): NumberSelector(
                    NumberSelectorConfig(
                        min=1, max=50, mode=NumberSelectorMode.BOX, step=1
                    )
                ),
            }
        )
        return self.async_show_form(step_id="user", data_schema=schema, errors=errors)

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        """Create the options flow."""
        return ReadyHomeOptionsFlow()


class ReadyHomeOptionsFlow(OptionsFlow):
    """Options menu for readiness targets, pets, lists, and thresholds."""

    _pet_id: str | None = None

    async def _async_save_and_menu(self, **update_kwargs: Any) -> ConfigFlowResult:
        """Persist entry updates and return to the options menu."""
        if update_kwargs:
            self.hass.config_entries.async_update_entry(
                self.config_entry, **update_kwargs
            )
        return await self.async_step_init()

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Show the options menu."""
        return self.async_show_menu(
            step_id="init",
            menu_options=[
                "profile",
                "targets",
                "pets",
                "lists",
                "thresholds",
                "restock",
            ],
        )

    async def async_step_profile(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Rename the readiness profile."""
        from .helpers import profile_name

        current = profile_name(self.config_entry)

        if user_input is not None:
            name = str(user_input.get(CONF_NAME) or "").strip()
            if not name:
                return self.async_show_form(
                    step_id="profile",
                    data_schema=vol.Schema(
                        {
                            vol.Required(CONF_NAME, default=current): TextSelector(),
                        }
                    ),
                    errors={"base": "invalid_name"},
                )
            return await self._async_save_and_menu(
                title=name,
                data={**dict(self.config_entry.data), CONF_NAME: name},
            )

        schema = vol.Schema(
            {
                vol.Required(CONF_NAME, default=current): TextSelector(),
            }
        )
        return self.async_show_form(step_id="profile", data_schema=schema)

    async def async_step_targets(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit readiness targets."""
        options = dict(self.config_entry.options)
        errors: dict[str, str] = {}

        if user_input is not None:
            updated = _apply_targets(options, user_input)
            if updated is not None:
                return await self._async_save_and_menu(options=updated)
            errors["base"] = "invalid_people"
            current = user_input
        else:
            current = _targets_form_values(options)

        fields: dict[Any, Any] = {}
        for key in AGE_CATEGORIES:
            fields[vol.Required(conf_count(key), default=current[conf_count(key)])] = (
                NumberSelector(
                    NumberSelectorConfig(
                        min=0, max=50, mode=NumberSelectorMode.BOX, step=1
                    )
                )
            )
            fields[
                vol.Required(conf_calories(key), default=current[conf_calories(key)])
            ] = NumberSelector(
                NumberSelectorConfig(
                    min=500, max=5000, mode=NumberSelectorMode.BOX, step=50
                )
            )
            fields[vol.Required(conf_water(key), default=current[conf_water(key)])] = (
                NumberSelector(
                    NumberSelectorConfig(
                        min=0.5, max=20, mode=NumberSelectorMode.BOX, step=0.1
                    )
                )
            )
        fields[
            vol.Required(CONF_DURATION_HOURS, default=current[CONF_DURATION_HOURS])
        ] = NumberSelector(
            NumberSelectorConfig(min=24, max=720, mode=NumberSelectorMode.BOX, step=1)
        )
        schema = vol.Schema(fields)
        return self.async_show_form(
            step_id="targets", data_schema=schema, errors=errors
        )

    async def async_step_pets(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Pets menu: add, edit, or remove a pet."""
        menu = ["pet_add"]
        if _stored_pets(dict(self.config_entry.options)):
            menu += ["pet_edit", "pet_remove"]
        menu.append("init")
        return self.async_show_menu(step_id="pets", menu_options=menu)

    def _pet_form(
        self,
        step_id: str,
        current: dict[str, Any],
        errors: dict[str, str] | None = None,
    ) -> ConfigFlowResult:
        schema = vol.Schema(
            {
                vol.Required(
                    CONF_NAME, default=current.get(CONF_NAME, "")
                ): TextSelector(),
                vol.Optional(
                    PET_TYPE, default=current.get(PET_TYPE, "")
                ): TextSelector(),
                vol.Required(
                    PET_FOOD_GRAMS, default=current.get(PET_FOOD_GRAMS, 0)
                ): NumberSelector(
                    NumberSelectorConfig(
                        min=0, max=100000, mode=NumberSelectorMode.BOX, step=1
                    )
                ),
                vol.Required(
                    PET_WATER_LITERS, default=current.get(PET_WATER_LITERS, 0)
                ): NumberSelector(
                    NumberSelectorConfig(
                        min=0, max=100, mode=NumberSelectorMode.BOX, step=0.1
                    )
                ),
            }
        )
        return self.async_show_form(
            step_id=step_id, data_schema=schema, errors=errors or {}
        )

    def _pet_pick_form(self, step_id: str, pets: list[dict[str, Any]]) -> ConfigFlowResult:
        schema = vol.Schema(
            {
                vol.Required(PET_SELECT): SelectSelector(
                    SelectSelectorConfig(
                        options=[{"value": p["id"], "label": _pet_label(p)} for p in pets],
                        mode=SelectSelectorMode.DROPDOWN,
                    )
                )
            }
        )
        return self.async_show_form(step_id=step_id, data_schema=schema)

    async def async_step_pet_add(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Add a pet."""
        if user_input is None:
            return self._pet_form("pet_add", {})
        updated, error = _add_pet(dict(self.config_entry.options), user_input)
        if updated is None:
            return self._pet_form("pet_add", user_input, {"base": error or ""})
        self.hass.config_entries.async_update_entry(self.config_entry, options=updated)
        return await self.async_step_pets()

    async def async_step_pet_edit(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Pick the pet to edit."""
        pets = _stored_pets(dict(self.config_entry.options))
        if not pets:
            return await self.async_step_pets()
        if user_input is None:
            return self._pet_pick_form("pet_edit", pets)
        self._pet_id = str(user_input[PET_SELECT])
        return await self.async_step_pet_edit_form()

    async def async_step_pet_edit_form(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit the picked pet."""
        options = dict(self.config_entry.options)
        pet_id = self._pet_id
        current = next((p for p in _stored_pets(options) if p["id"] == pet_id), None)
        if pet_id is None or current is None:
            return await self.async_step_pets()
        if user_input is None:
            return self._pet_form("pet_edit_form", {**current, CONF_NAME: current["name"]})
        updated, error = _update_pet(options, pet_id, user_input)
        if updated is None:
            return self._pet_form("pet_edit_form", user_input, {"base": error or ""})
        self._pet_id = None
        self.hass.config_entries.async_update_entry(self.config_entry, options=updated)
        return await self.async_step_pets()

    async def async_step_pet_remove(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Remove a pet."""
        options = dict(self.config_entry.options)
        pets = _stored_pets(options)
        if not pets:
            return await self.async_step_pets()
        if user_input is None:
            return self._pet_pick_form("pet_remove", pets)
        updated = _remove_pet(options, str(user_input[PET_SELECT]))
        self.hass.config_entries.async_update_entry(self.config_entry, options=updated)
        return await self.async_step_pets()

    async def async_step_lists(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit locations, categories, and food/water category mapping."""
        options = dict(self.config_entry.options)
        errors: dict[str, str] = {}

        locations = list(options.get(CONF_LOCATIONS) or DEFAULT_LOCATIONS)
        categories = list(options.get(CONF_CATEGORIES) or DEFAULT_CATEGORIES)
        food_categories = list(
            options.get(CONF_FOOD_CATEGORIES) or DEFAULT_FOOD_CATEGORIES
        )
        water_categories = list(
            options.get(CONF_WATER_CATEGORIES) or DEFAULT_WATER_CATEGORIES
        )
        if CONF_PET_FOOD_CATEGORIES in options:
            pet_food_categories = list(options.get(CONF_PET_FOOD_CATEGORIES) or [])
        else:
            pet_food_categories = _default_pet_food_categories(
                food_categories, water_categories
            )

        if user_input is not None:
            locations = list(user_input.get(CONF_LOCATIONS) or [])
            categories = list(user_input.get(CONF_CATEGORIES) or [])
            food_categories = list(user_input.get(CONF_FOOD_CATEGORIES) or [])
            water_categories = list(user_input.get(CONF_WATER_CATEGORIES) or [])
            pet_food_categories = list(user_input.get(CONF_PET_FOOD_CATEGORIES) or [])
            if _overlap_error(food_categories, water_categories, pet_food_categories):
                errors["base"] = "category_overlap"
            else:
                categories = _merge_category_lists(
                    categories, food_categories, water_categories, pet_food_categories
                )
                options.update(
                    {
                        CONF_LOCATIONS: locations,
                        CONF_CATEGORIES: categories,
                        CONF_FOOD_CATEGORIES: food_categories,
                        CONF_WATER_CATEGORIES: water_categories,
                        CONF_PET_FOOD_CATEGORIES: pet_food_categories,
                    }
                )
                return await self._async_save_and_menu(options=options)

        # Selector options include current categories plus any mapped names.
        selector_options = _merge_category_lists(
            categories, food_categories, water_categories, pet_food_categories
        )

        schema = vol.Schema(
            {
                vol.Optional(CONF_LOCATIONS, default=locations): SelectSelector(
                    SelectSelectorConfig(
                        options=locations,
                        multiple=True,
                        custom_value=True,
                        mode=SelectSelectorMode.DROPDOWN,
                    )
                ),
                vol.Optional(CONF_CATEGORIES, default=categories): SelectSelector(
                    SelectSelectorConfig(
                        options=selector_options,
                        multiple=True,
                        custom_value=True,
                        mode=SelectSelectorMode.DROPDOWN,
                    )
                ),
                vol.Optional(
                    CONF_FOOD_CATEGORIES, default=food_categories
                ): SelectSelector(
                    SelectSelectorConfig(
                        options=selector_options,
                        multiple=True,
                        custom_value=True,
                        mode=SelectSelectorMode.DROPDOWN,
                    )
                ),
                vol.Optional(
                    CONF_WATER_CATEGORIES, default=water_categories
                ): SelectSelector(
                    SelectSelectorConfig(
                        options=selector_options,
                        multiple=True,
                        custom_value=True,
                        mode=SelectSelectorMode.DROPDOWN,
                    )
                ),
                vol.Optional(
                    CONF_PET_FOOD_CATEGORIES, default=pet_food_categories
                ): SelectSelector(
                    SelectSelectorConfig(
                        options=selector_options,
                        multiple=True,
                        custom_value=True,
                        mode=SelectSelectorMode.DROPDOWN,
                    )
                ),
            }
        )
        return self.async_show_form(
            step_id="lists", data_schema=schema, errors=errors
        )

    async def async_step_thresholds(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit expiry windows."""
        options = dict(self.config_entry.options)

        if user_input is not None:
            options.update(
                {
                    CONF_EXPIRING_DAYS: int(user_input[CONF_EXPIRING_DAYS]),
                    CONF_URGENT_DAYS: int(user_input[CONF_URGENT_DAYS]),
                }
            )
            options.pop("attribute_item_cap", None)
            return await self._async_save_and_menu(options=options)

        schema = vol.Schema(
            {
                vol.Required(
                    CONF_EXPIRING_DAYS,
                    default=options.get(CONF_EXPIRING_DAYS, DEFAULT_EXPIRING_DAYS),
                ): NumberSelector(
                    NumberSelectorConfig(
                        min=1, max=365, mode=NumberSelectorMode.BOX, step=1
                    )
                ),
                vol.Required(
                    CONF_URGENT_DAYS,
                    default=options.get(CONF_URGENT_DAYS, DEFAULT_URGENT_DAYS),
                ): NumberSelector(
                    NumberSelectorConfig(
                        min=1, max=30, mode=NumberSelectorMode.BOX, step=1
                    )
                ),
            }
        )
        return self.async_show_form(step_id="thresholds", data_schema=schema)

    async def async_step_restock(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure shopping-list restock push."""
        options = dict(self.config_entry.options)

        if user_input is not None:
            todo_raw = user_input.get(CONF_TODO_ENTITY_ID)
            if isinstance(todo_raw, list):
                todo_raw = todo_raw[0] if todo_raw else None
            todo_entity = str(todo_raw).strip() if todo_raw else ""
            options.update(
                {
                    CONF_TODO_ENTITY_ID: todo_entity or None,
                    CONF_AUTO_PUSH_RESTOCK: bool(
                        user_input.get(CONF_AUTO_PUSH_RESTOCK, False)
                    ),
                }
            )
            return await self._async_save_and_menu(options=options)

        current_todo = options.get(CONF_TODO_ENTITY_ID) or vol.UNDEFINED
        schema_dict: dict[Any, Any] = {
            vol.Optional(
                CONF_AUTO_PUSH_RESTOCK,
                default=bool(options.get(CONF_AUTO_PUSH_RESTOCK, False)),
            ): BooleanSelector(),
        }
        if current_todo is vol.UNDEFINED:
            schema_dict[vol.Optional(CONF_TODO_ENTITY_ID)] = EntitySelector(
                EntitySelectorConfig(domain="todo", multiple=False)
            )
        else:
            schema_dict[
                vol.Optional(CONF_TODO_ENTITY_ID, default=current_todo)
            ] = EntitySelector(EntitySelectorConfig(domain="todo", multiple=False))
        return self.async_show_form(
            step_id="restock", data_schema=vol.Schema(schema_dict)
        )
