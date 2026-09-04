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
    CONF_ATTRIBUTE_ITEM_CAP,
    CONF_CALORIES_PER_PERSON_PER_DAY,
    CONF_CATEGORIES,
    CONF_DURATION_HOURS,
    CONF_EXPIRING_DAYS,
    CONF_LOCATIONS,
    CONF_NAME,
    CONF_NUMBER_OF_PEOPLE,
    CONF_URGENT_DAYS,
    CONF_WATER_LITERS_PER_PERSON_PER_DAY,
    DEFAULT_ATTRIBUTE_ITEM_CAP,
    DEFAULT_CALORIES_PER_PERSON_PER_DAY,
    DEFAULT_CATEGORIES,
    DEFAULT_DURATION_HOURS,
    DEFAULT_EXPIRING_DAYS,
    DEFAULT_LOCATIONS,
    DEFAULT_PROFILE_NAME,
    DEFAULT_URGENT_DAYS,
    DEFAULT_WATER_LITERS_PER_PERSON_PER_DAY,
    DOMAIN,
)


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
                        CONF_EXPIRING_DAYS: DEFAULT_EXPIRING_DAYS,
                        CONF_URGENT_DAYS: DEFAULT_URGENT_DAYS,
                        CONF_ATTRIBUTE_ITEM_CAP: DEFAULT_ATTRIBUTE_ITEM_CAP,
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

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Show the options menu."""
        return self.async_show_menu(
            step_id="init",
            menu_options=["profile", "targets", "lists", "thresholds"],
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
            self.hass.config_entries.async_update_entry(
                self.config_entry,
                title=name,
                data={**dict(self.config_entry.data), CONF_NAME: name},
            )
            return self.async_create_entry(
                title="", data=dict(self.config_entry.options)
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
            return self.async_create_entry(title="", data=options)

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
        """Edit locations and categories."""
        options = dict(self.config_entry.options)

        if user_input is not None:
            options.update(
                {
                    CONF_LOCATIONS: list(user_input.get(CONF_LOCATIONS) or []),
                    CONF_CATEGORIES: list(user_input.get(CONF_CATEGORIES) or []),
                }
            )
            return self.async_create_entry(title="", data=options)

        locations = list(options.get(CONF_LOCATIONS) or DEFAULT_LOCATIONS)
        categories = list(options.get(CONF_CATEGORIES) or DEFAULT_CATEGORIES)

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
                        options=categories,
                        multiple=True,
                        custom_value=True,
                        mode=SelectSelectorMode.DROPDOWN,
                    )
                ),
            }
        )
        return self.async_show_form(step_id="lists", data_schema=schema)

    async def async_step_thresholds(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit expiry windows and attribute cap."""
        options = dict(self.config_entry.options)

        if user_input is not None:
            options.update(
                {
                    CONF_EXPIRING_DAYS: int(user_input[CONF_EXPIRING_DAYS]),
                    CONF_URGENT_DAYS: int(user_input[CONF_URGENT_DAYS]),
                    CONF_ATTRIBUTE_ITEM_CAP: int(user_input[CONF_ATTRIBUTE_ITEM_CAP]),
                }
            )
            return self.async_create_entry(title="", data=options)

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
                vol.Required(
                    CONF_ATTRIBUTE_ITEM_CAP,
                    default=options.get(
                        CONF_ATTRIBUTE_ITEM_CAP, DEFAULT_ATTRIBUTE_ITEM_CAP
                    ),
                ): NumberSelector(
                    NumberSelectorConfig(
                        min=10, max=500, mode=NumberSelectorMode.BOX, step=1
                    )
                ),
            }
        )
        return self.async_show_form(step_id="thresholds", data_schema=schema)
