"""Config and options flows for Ready Home."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import callback
from homeassistant.helpers.selector import (
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
)

from .const import (
    CONF_CALORIES_PER_PERSON_PER_DAY,
    CONF_CATEGORIES,
    CONF_DURATION_HOURS,
    CONF_EXPIRING_DAYS,
    CONF_FOOD_CATEGORIES,
    CONF_LOCATIONS,
    CONF_NAME,
    CONF_NUMBER_OF_PEOPLE,
    CONF_URGENT_DAYS,
    CONF_WATER_CATEGORIES,
    CONF_WATER_LITERS_PER_PERSON_PER_DAY,
    DEFAULT_CALORIES_PER_PERSON_PER_DAY,
    DEFAULT_CATEGORIES,
    DEFAULT_DURATION_HOURS,
    DEFAULT_EXPIRING_DAYS,
    DEFAULT_FOOD_CATEGORIES,
    DEFAULT_LOCATIONS,
    DEFAULT_PROFILE_NAME,
    DEFAULT_URGENT_DAYS,
    DEFAULT_WATER_CATEGORIES,
    DEFAULT_WATER_LITERS_PER_PERSON_PER_DAY,
    DOMAIN,
)
from .lists import RenameKind, apply_list_rename

CONF_FROM_NAME = "from_name"
CONF_TO_NAME = "to_name"


def _merge_category_lists(
    categories: list[str],
    food_categories: list[str],
    water_categories: list[str],
) -> list[str]:
    """Ensure mapped food/water names exist in the master categories list."""
    merged: list[str] = []
    seen: set[str] = set()
    for name in [*categories, *food_categories, *water_categories]:
        cleaned = str(name).strip()
        if not cleaned:
            continue
        key = cleaned.lower()
        if key in seen:
            continue
        seen.add(key)
        merged.append(cleaned)
    return merged


def _overlap_error(
    food_categories: list[str], water_categories: list[str]
) -> bool:
    """True when the same category name appears in both food and water lists."""
    food_keys = {str(c).strip().lower() for c in food_categories if str(c).strip()}
    water_keys = {str(c).strip().lower() for c in water_categories if str(c).strip()}
    return bool(food_keys & water_keys)


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
                        CONF_NUMBER_OF_PEOPLE: int(people),
                        CONF_DURATION_HOURS: DEFAULT_DURATION_HOURS,
                        CONF_WATER_LITERS_PER_PERSON_PER_DAY: (
                            DEFAULT_WATER_LITERS_PER_PERSON_PER_DAY
                        ),
                        CONF_CALORIES_PER_PERSON_PER_DAY: (
                            DEFAULT_CALORIES_PER_PERSON_PER_DAY
                        ),
                        CONF_LOCATIONS: list(DEFAULT_LOCATIONS),
                        CONF_CATEGORIES: list(DEFAULT_CATEGORIES),
                        CONF_FOOD_CATEGORIES: list(DEFAULT_FOOD_CATEGORIES),
                        CONF_WATER_CATEGORIES: list(DEFAULT_WATER_CATEGORIES),
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
    """Options menu for readiness targets, lists, and thresholds."""

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
                "lists",
                "rename_location",
                "rename_category",
                "thresholds",
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

        if user_input is not None:
            options.update(
                {
                    CONF_NUMBER_OF_PEOPLE: int(user_input[CONF_NUMBER_OF_PEOPLE]),
                    CONF_DURATION_HOURS: int(user_input[CONF_DURATION_HOURS]),
                    CONF_WATER_LITERS_PER_PERSON_PER_DAY: float(
                        user_input[CONF_WATER_LITERS_PER_PERSON_PER_DAY]
                    ),
                    CONF_CALORIES_PER_PERSON_PER_DAY: int(
                        user_input[CONF_CALORIES_PER_PERSON_PER_DAY]
                    ),
                }
            )
            return await self._async_save_and_menu(options=options)

        schema = vol.Schema(
            {
                vol.Required(
                    CONF_NUMBER_OF_PEOPLE,
                    default=options.get(CONF_NUMBER_OF_PEOPLE, 2),
                ): NumberSelector(
                    NumberSelectorConfig(
                        min=1, max=50, mode=NumberSelectorMode.BOX, step=1
                    )
                ),
                vol.Required(
                    CONF_DURATION_HOURS,
                    default=options.get(CONF_DURATION_HOURS, DEFAULT_DURATION_HOURS),
                ): NumberSelector(
                    NumberSelectorConfig(
                        min=24, max=720, mode=NumberSelectorMode.BOX, step=1
                    )
                ),
                vol.Required(
                    CONF_WATER_LITERS_PER_PERSON_PER_DAY,
                    default=options.get(
                        CONF_WATER_LITERS_PER_PERSON_PER_DAY,
                        DEFAULT_WATER_LITERS_PER_PERSON_PER_DAY,
                    ),
                ): NumberSelector(
                    NumberSelectorConfig(
                        min=0.5, max=20, mode=NumberSelectorMode.BOX, step=0.1
                    )
                ),
                vol.Required(
                    CONF_CALORIES_PER_PERSON_PER_DAY,
                    default=options.get(
                        CONF_CALORIES_PER_PERSON_PER_DAY,
                        DEFAULT_CALORIES_PER_PERSON_PER_DAY,
                    ),
                ): NumberSelector(
                    NumberSelectorConfig(
                        min=500, max=5000, mode=NumberSelectorMode.BOX, step=50
                    )
                ),
            }
        )
        return self.async_show_form(step_id="targets", data_schema=schema)

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

        if user_input is not None:
            locations = list(user_input.get(CONF_LOCATIONS) or [])
            categories = list(user_input.get(CONF_CATEGORIES) or [])
            food_categories = list(user_input.get(CONF_FOOD_CATEGORIES) or [])
            water_categories = list(user_input.get(CONF_WATER_CATEGORIES) or [])
            if _overlap_error(food_categories, water_categories):
                errors["base"] = "category_overlap"
            else:
                categories = _merge_category_lists(
                    categories, food_categories, water_categories
                )
                options.update(
                    {
                        CONF_LOCATIONS: locations,
                        CONF_CATEGORIES: categories,
                        CONF_FOOD_CATEGORIES: food_categories,
                        CONF_WATER_CATEGORIES: water_categories,
                    }
                )
                return await self._async_save_and_menu(options=options)

        # Selector options include current categories plus any mapped names.
        selector_options = _merge_category_lists(
            categories, food_categories, water_categories
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
            }
        )
        return self.async_show_form(
            step_id="lists", data_schema=schema, errors=errors
        )

    async def async_step_rename_location(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Rename a storage location and cascade to inventory items."""
        return await self._async_rename_step("location", user_input)

    async def async_step_rename_category(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Rename a category and cascade to inventory items and mappings."""
        return await self._async_rename_step("category", user_input)

    async def _async_rename_step(
        self,
        kind: RenameKind,
        user_input: dict[str, Any] | None,
    ) -> ConfigFlowResult:
        """Shared rename form for locations or categories."""
        options = dict(self.config_entry.options)
        locations = list(options.get(CONF_LOCATIONS) or DEFAULT_LOCATIONS)
        categories = list(options.get(CONF_CATEGORIES) or DEFAULT_CATEGORIES)
        food_categories = list(
            options.get(CONF_FOOD_CATEGORIES) or DEFAULT_FOOD_CATEGORIES
        )
        water_categories = list(
            options.get(CONF_WATER_CATEGORIES) or DEFAULT_WATER_CATEGORIES
        )
        choices = locations if kind == "location" else categories
        step_id = "rename_location" if kind == "location" else "rename_category"
        errors: dict[str, str] = {}

        if user_input is not None:
            old_name = str(user_input.get(CONF_FROM_NAME) or "").strip()
            new_name = str(user_input.get(CONF_TO_NAME) or "").strip()
            if not old_name or not new_name:
                errors["base"] = "invalid_name"
            else:
                renamed = apply_list_rename(
                    kind=kind,
                    old_name=old_name,
                    new_name=new_name,
                    locations=locations,
                    categories=categories,
                    food_categories=food_categories,
                    water_categories=water_categories,
                )
                if renamed is None:
                    # Distinguish not-found vs collision when possible.
                    old_key = old_name.lower()
                    present = any(
                        str(c).strip().lower() == old_key for c in choices
                    )
                    errors["base"] = (
                        "name_exists" if present else "name_not_found"
                    )
                else:
                    options.update(
                        {
                            CONF_LOCATIONS: renamed["locations"],
                            CONF_CATEGORIES: renamed["categories"],
                            CONF_FOOD_CATEGORIES: renamed["food_categories"],
                            CONF_WATER_CATEGORIES: renamed["water_categories"],
                        }
                    )
                    await self._async_cascade_item_rename(
                        field=kind, old_name=old_name, new_name=new_name
                    )
                    return await self._async_save_and_menu(options=options)

        default_from = choices[0] if choices else ""
        schema = vol.Schema(
            {
                vol.Required(
                    CONF_FROM_NAME, default=default_from
                ): SelectSelector(
                    SelectSelectorConfig(
                        options=choices,
                        mode=SelectSelectorMode.DROPDOWN,
                    )
                ),
                vol.Required(CONF_TO_NAME, default=""): TextSelector(),
            }
        )
        return self.async_show_form(
            step_id=step_id, data_schema=schema, errors=errors
        )

    async def _async_cascade_item_rename(
        self, *, field: str, old_name: str, new_name: str
    ) -> None:
        """Update matching inventory items after a list rename."""
        from .coordinator import ReadyHomeCoordinator

        coordinator: ReadyHomeCoordinator | None = self.hass.data.get(
            DOMAIN, {}
        ).get(self.config_entry.entry_id)
        if coordinator is None:
            return
        await coordinator.store.async_rename_field(
            field=field, old_name=old_name, new_name=new_name
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
