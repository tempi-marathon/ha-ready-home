"""Tests for coordinator resolution helpers."""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError

from custom_components.ready_home.const import DOMAIN, VERSION, storage_key_for_entry
from custom_components.ready_home.helpers import (
    device_info_for_entry,
    device_name,
    get_coordinator,
    profile_name,
)


def test_storage_key_is_entry_scoped() -> None:
    assert storage_key_for_entry("abc") == "ready_home.inventory.abc"


def test_profile_name_prefers_data() -> None:
    entry = MagicMock()
    entry.data = {"name": "Dogs"}
    entry.title = "House"
    assert profile_name(entry) == "Dogs"


@pytest.mark.parametrize(
    ("name", "expected"),
    [
        ("Home", "Ready Home"),
        ("home", "Ready Home"),
        ("Ready Home", "Ready Home"),
        ("ready home", "Ready Home"),
        ("Cabin", "Ready Home (Cabin)"),
        ("Dogs", "Ready Home (Dogs)"),
    ],
)
def test_device_name_brands_generic_profiles(name: str, expected: str) -> None:
    entry = MagicMock()
    entry.data = {"name": name}
    entry.title = name
    assert device_name(entry) == expected


def test_device_info_for_entry() -> None:
    entry = MagicMock()
    entry.entry_id = "abc"
    entry.data = {"name": "Home"}
    entry.title = "Home"
    info = device_info_for_entry(entry)
    assert info["name"] == "Ready Home"
    assert info["manufacturer"] == "Ready Home"
    assert info["model"] == "Emergency inventory"
    assert info["sw_version"] == VERSION
    assert info["entry_type"] == "service"
    assert info["identifiers"] == {(DOMAIN, "abc")}


def test_get_coordinator_single_entry() -> None:
    hass = MagicMock()
    coord = object()
    hass.data = {DOMAIN: {"entry-1": coord}}
    assert get_coordinator(hass) is coord


def test_get_coordinator_requires_id_when_multiple() -> None:
    hass = MagicMock()
    hass.data = {DOMAIN: {"a": object(), "b": object()}}
    with pytest.raises(ServiceValidationError):
        get_coordinator(hass)
    assert get_coordinator(hass, config_entry_id="a") is hass.data[DOMAIN]["a"]


def test_get_coordinator_not_setup() -> None:
    hass = MagicMock()
    hass.data = {}
    with pytest.raises(HomeAssistantError):
        get_coordinator(hass)
