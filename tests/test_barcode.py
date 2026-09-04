"""Tests for Open Food Facts barcode lookup."""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock, patch

import pytest

from custom_components.ready_home.barcode import lookup_product


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


@pytest.mark.asyncio
async def test_lookup_product_not_found() -> None:
    hass = MagicMock()
    session = MagicMock()
    session.get = MagicMock(return_value=_FakeResponse(200, {"status": 0}))

    with patch(
        "custom_components.ready_home.barcode.async_get_clientsession",
        return_value=session,
    ):
        result = await lookup_product(hass, "000")

    assert result is None


@pytest.mark.asyncio
async def test_lookup_empty_barcode() -> None:
    assert await lookup_product(MagicMock(), "  ") is None
