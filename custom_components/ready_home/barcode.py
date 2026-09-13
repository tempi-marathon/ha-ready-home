"""Open Food Facts barcode lookup."""

from __future__ import annotations

import html
import logging
import re
from typing import Any
from urllib.parse import quote

from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

_LOGGER = logging.getLogger(__name__)

OFF_PRODUCT_URL = "https://world.openfoodfacts.org/api/v2/product/{barcode}.json"
USER_AGENT = "ReadyHomeHomeAssistant/0.1.0"
# EAN/UPC digits and Code 128 alphanumerics; blocks path/query separators.
BARCODE_PATTERN = re.compile(r"^[A-Za-z0-9]{4,32}$")
_LOG_BARCODE_MAX = 16

# OFF unit tokens → (ContentsUnit value, multiplier applied to the numeric amount).
_UNIT_MAP: dict[str, tuple[str, float]] = {
    "g": ("gram", 1.0),
    "gr": ("gram", 1.0),
    "gram": ("gram", 1.0),
    "grams": ("gram", 1.0),
    "kg": ("kilogram", 1.0),
    "kilogram": ("kilogram", 1.0),
    "kilograms": ("kilogram", 1.0),
    "ml": ("milliliter", 1.0),
    "milliliter": ("milliliter", 1.0),
    "milliliters": ("milliliter", 1.0),
    "millilitre": ("milliliter", 1.0),
    "millilitres": ("milliliter", 1.0),
    "l": ("liter", 1.0),
    "liter": ("liter", 1.0),
    "liters": ("liter", 1.0),
    "litre": ("liter", 1.0),
    "litres": ("liter", 1.0),
    "cl": ("milliliter", 10.0),
    "dl": ("milliliter", 100.0),
}

_QUANTITY_RE = re.compile(
    r"(?P<amount>\d+(?:[.,]\d+)?)\s*(?P<unit>[A-Za-z]+)",
)


def is_valid_barcode(barcode: str) -> bool:
    """Return True when barcode is safe to embed in the OFF product URL."""
    return bool(BARCODE_PATTERN.fullmatch(barcode))


def _log_barcode(barcode: str) -> str:
    """Truncate barcode for logs."""
    if len(barcode) <= _LOG_BARCODE_MAX:
        return barcode
    return f"{barcode[:_LOG_BARCODE_MAX]}…"


def _decode_text(value: Any) -> str:
    """Strip and HTML-unescape a product text field."""
    if not isinstance(value, str):
        return ""
    return html.unescape(value).strip()


def _parse_amount(value: Any) -> float | None:
    """Parse a numeric amount from OFF (int, float, or decimal string)."""
    if value is None or isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        amount = float(value)
        return amount if amount > 0 else None
    if isinstance(value, str):
        text = value.strip().replace(",", ".")
        if not text:
            return None
        try:
            amount = float(text)
        except ValueError:
            return None
        return amount if amount > 0 else None
    return None


def _map_unit(unit: str | None) -> tuple[str, float] | None:
    """Map an OFF unit token to (contents_unit, amount multiplier)."""
    if not unit:
        return None
    return _UNIT_MAP.get(unit.strip().lower())


def _contents_from_product(product: dict[str, Any]) -> tuple[float | None, str | None]:
    """Extract contents_per_unit and contents_unit from an OFF product."""
    amount = _parse_amount(product.get("product_quantity"))
    mapped = _map_unit(
        product.get("product_quantity_unit")
        if isinstance(product.get("product_quantity_unit"), str)
        else None
    )
    if amount is not None and mapped is not None:
        unit, multiplier = mapped
        return amount * multiplier, unit

    quantity = product.get("quantity")
    if isinstance(quantity, str):
        match = _QUANTITY_RE.search(quantity)
        if match:
            amount = _parse_amount(match.group("amount"))
            mapped = _map_unit(match.group("unit"))
            if amount is not None and mapped is not None:
                unit, multiplier = mapped
                return amount * multiplier, unit

    return None, None


def _optional_float(value: Any) -> float | None:
    """Coerce a nutriment value to float, or None."""
    if value is None or isinstance(value, bool):
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


async def lookup_product(hass: HomeAssistant, barcode: str) -> dict[str, Any] | None:
    """Look up a barcode on Open Food Facts.

    Returns name, brand, contents, calories, and barcode — or None if not found.
    """
    barcode = barcode.strip()
    if not barcode or not is_valid_barcode(barcode):
        return None

    session = async_get_clientsession(hass)
    url = OFF_PRODUCT_URL.format(barcode=quote(barcode, safe=""))
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
                    _log_barcode(barcode),
                )
                return None
            payload = await response.json()
    except Exception:  # noqa: BLE001
        _LOGGER.exception(
            "Open Food Facts lookup failed for %s", _log_barcode(barcode)
        )
        return None

    if payload.get("status") != 1:
        return None

    product = payload.get("product") or {}
    name = _decode_text(
        product.get("product_name") or product.get("product_name_en") or ""
    )
    brand = _decode_text(product.get("brands") or "")
    contents_per_unit, contents_unit = _contents_from_product(product)

    nutriments = product.get("nutriments") or {}
    kcal_100g = nutriments.get("energy-kcal_100g")
    if kcal_100g is None:
        kcal_100g = nutriments.get("energy-kcal_value")
    kcal_100ml = nutriments.get("energy-kcal_100ml")

    return {
        "barcode": barcode,
        "name": name,
        "brand": brand,
        "contents_per_unit": contents_per_unit,
        "contents_unit": contents_unit,
        "calories_per_100g": _optional_float(kcal_100g),
        "calories_per_100ml": _optional_float(kcal_100ml),
        "raw_name": name,
    }
