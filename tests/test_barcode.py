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


@pytest.mark.asyncio
async def test_lookup_product_success() -> None:
    hass = MagicMock()
    session = MagicMock()
    session.get = MagicMock(
        return_value=_FakeResponse(
            200,
            {
                "status": 1,
                "product": {
                    "product_name": "Nutella",
                    "brands": "Ferrero",
                    "nutriments": {"energy-kcal_100g": 539},
                },
            },
        )
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
    assert result["barcode"] == "3017620422003"
    session.get.assert_called_once()
    url = session.get.call_args.args[0]
    assert url.endswith(f"/{quote('3017620422003', safe='')}.json")


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
