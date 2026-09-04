"""Open Food Facts barcode lookup."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

_LOGGER = logging.getLogger(__name__)

OFF_PRODUCT_URL = "https://world.openfoodfacts.org/api/v2/product/{barcode}.json"
USER_AGENT = "ReadyHomeHomeAssistant/0.1.0"


async def lookup_product(hass: HomeAssistant, barcode: str) -> dict[str, Any] | None:
    """Look up a barcode on Open Food Facts.

    Returns a dict with name, brand, calories_per_100g, barcode, or None if not found.
    """
    barcode = barcode.strip()
    if not barcode:
        return None

    session = async_get_clientsession(hass)
    url = OFF_PRODUCT_URL.format(barcode=barcode)
    try:
        async with session.get(
            url, headers={"User-Agent": USER_AGENT}, timeout=15
        ) as response:
            if response.status == 404:
                return None
            if response.status >= 400:
                _LOGGER.warning(
                    "Open Food Facts returned %s for barcode %s",
                    response.status,
                    barcode,
                )
                return None
            payload = await response.json()
    except Exception:  # noqa: BLE001
        _LOGGER.exception("Open Food Facts lookup failed for %s", barcode)
        return None

    if payload.get("status") != 1:
        return None

    product = payload.get("product") or {}
    name = product.get("product_name") or product.get("product_name_en") or ""
    brand = product.get("brands") or ""
    nutriments = product.get("nutriments") or {}
    kcal = nutriments.get("energy-kcal_100g")
    if kcal is None:
        kcal = nutriments.get("energy-kcal_value")

    return {
        "barcode": barcode,
        "name": name.strip() if isinstance(name, str) else "",
        "brand": brand.strip() if isinstance(brand, str) else "",
        "calories_per_100g": float(kcal) if kcal is not None else None,
        "raw_name": name,
    }
