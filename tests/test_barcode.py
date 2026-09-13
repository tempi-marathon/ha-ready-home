"""Tests for Open Food Facts barcode lookup."""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock, patch
from urllib.parse import quote

import pytest

from custom_components.ready_home.barcode import is_valid_barcode, lookup_product


class _FakeResponse:
    def __init__(self, status: int, payload: dict[str, Any]) -> None:
        self.status = status
        self._payload = payload

    async def json(self) -> dict[str, Any]:
        return self._payload

    async def __aenter__(self) -> _FakeResponse:
        return self

    async def __aexit__(self, *args: Any) -> None:
        return None


def _mock_lookup(payload: dict[str, Any]) -> tuple[MagicMock, MagicMock]:
    hass = MagicMock()
    session = MagicMock()
    session.get = MagicMock(return_value=_FakeResponse(200, payload))
    return hass, session


@pytest.mark.asyncio
async def test_lookup_product_success() -> None:
    hass, session = _mock_lookup(
        {
            "status": 1,
            "product": {
                "product_name": "Nutella",
                "brands": "Ferrero",
                "nutriments": {"energy-kcal_100g": 539},
            },
        }
    )

    with patch(
        "custom_components.ready_home.barcode.async_get_clientsession",
        return_value=session,
    ):
        result = await lookup_product(hass, "3017620422003")

    assert result is not None
    assert result["name"] == "Nutella"
    assert result["brand"] == "Ferrero"
    assert result["calories_per_100g"] == 539.0
    assert result["calories_per_100ml"] is None
    assert result["contents_per_unit"] is None
    assert result["contents_unit"] is None
    assert result["barcode"] == "3017620422003"
    session.get.assert_called_once()
    url = session.get.call_args.args[0]
    assert url.endswith(f"/{quote('3017620422003', safe='')}.json")


@pytest.mark.asyncio
async def test_lookup_decodes_html_entities_in_brand() -> None:
    hass, session = _mock_lookup(
        {
            "status": 1,
            "product": {
                "product_name": "Farfalle",
                "brands": "Grand&#039;Italia",
                "product_quantity": 500,
                "product_quantity_unit": "g",
                "nutriments": {"energy-kcal_100g": 357},
            },
        }
    )

    with patch(
        "custom_components.ready_home.barcode.async_get_clientsession",
        return_value=session,
    ):
        result = await lookup_product(hass, "8000050836927")

    assert result is not None
    assert result["brand"] == "Grand'Italia"
    assert result["name"] == "Farfalle"
    assert result["contents_per_unit"] == 500.0
    assert result["contents_unit"] == "gram"
    assert result["calories_per_100g"] == 357.0


@pytest.mark.asyncio
async def test_lookup_parses_quantity_string_fallback() -> None:
    hass, session = _mock_lookup(
        {
            "status": 1,
            "product": {
                "product_name": "Olive oil",
                "brands": "Acme",
                "quantity": "75 cl",
                "nutriments": {"energy-kcal_100ml": 824},
            },
        }
    )

    with patch(
        "custom_components.ready_home.barcode.async_get_clientsession",
        return_value=session,
    ):
        result = await lookup_product(hass, "3017620422003")

    assert result is not None
    assert result["contents_per_unit"] == 750.0
    assert result["contents_unit"] == "milliliter"
    assert result["calories_per_100ml"] == 824.0


@pytest.mark.asyncio
async def test_lookup_product_not_found() -> None:
    hass = MagicMock()
    session = MagicMock()
    session.get = MagicMock(return_value=_FakeResponse(200, {"status": 0}))

    with patch(
        "custom_components.ready_home.barcode.async_get_clientsession",
        return_value=session,
    ):
        result = await lookup_product(hass, "0000")

    assert result is None


@pytest.mark.asyncio
async def test_lookup_empty_barcode() -> None:
    assert await lookup_product(MagicMock(), "  ") is None


@pytest.mark.parametrize(
    "barcode",
    [
        "../../evil",
        "abc/def",
        "code?x=1",
        "has space",
        "abc",  # too short
        "a" * 33,  # too long
    ],
)
@pytest.mark.asyncio
async def test_lookup_rejects_unsafe_barcode(barcode: str) -> None:
    hass = MagicMock()
    session = MagicMock()
    with patch(
        "custom_components.ready_home.barcode.async_get_clientsession",
        return_value=session,
    ):
        assert await lookup_product(hass, barcode) is None
    session.get.assert_not_called()


def test_is_valid_barcode() -> None:
    assert is_valid_barcode("3017620422003")
    assert is_valid_barcode("Ab12")
    assert not is_valid_barcode("ab")
    assert not is_valid_barcode("../x")
