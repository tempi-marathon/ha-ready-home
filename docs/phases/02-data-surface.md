# Phase 2 — Data surface (websocket + barcode)

## Goal

Expose a websocket read API for Lovelace cards and barcode product lookup via Open Food Facts.

## File ownership

| File | Role |
|------|------|
| `custom_components/ready_home/websocket_api.py` | **Create** — WS commands |
| `custom_components/ready_home/barcode.py` | **Create** — Open Food Facts client |
| `custom_components/ready_home/__init__.py` | Register websocket + barcode service at named points |
| `custom_components/ready_home/services.py` | Add `lookup_barcode` handler |
| `custom_components/ready_home/services.yaml` | Document `lookup_barcode` |
| `custom_components/ready_home/manifest.json` | Add `websocket_api` to dependencies if required |
| `tests/test_barcode.py` | Unit tests with mocked HTTP |
| `tests/test_websocket_api.py` | Command schema / handler unit tests |

Do **not** change `models.py`, `store.py`, `readiness.py`, or `attention.py`.

## Interfaces available (Phase 1)

### Coordinator (in `hass.data[DOMAIN][entry_id]`)

- `.store` → `InventoryStore`
- `.settings` → `ReadinessSettings`
- `.data` → `ReadyHomeData` with `.items`, `.assessment`, `.buckets`, `.settings`
- `.capped_item_dicts(items)` → attribute-safe summaries

### InventoryStore

- `.items` → `list[InventoryItem]`
- `.get(id)`, `.find_by_name(name)`
- Mutations already notify listeners → coordinator refresh

### Item summary shape (`attention.item_summary`)

```json
{
  "id": "...",
  "name": "...",
  "quantity": 1.0,
  "desired_quantity": 0.0,
  "unit": "piece",
  "location": "",
  "category": "",
  "priority": "important",
  "expiry_date": null,
  "resource": "none"
}
```

### Services (write path — reuse, do not duplicate)

`ready_home.add_item` / `update_item` / `adjust_quantity` / `remove_item` / `list_items`

## Websocket commands

Register with `websocket_api.async_register_command`.

### `ready_home/items/list`

Response:

```json
{
  "items": [ /* full item.to_dict() list, uncapped */ ],
  "assessment": {
    "needs_people_count": false,
    "water_on_hand": 0,
    "water_target": 0,
    "water_percent": 0,
    "food_on_hand": 0,
    "food_target": 0,
    "food_percent": 0,
    "overall_percent": 0,
    "duration_hours": 72,
    "water_supply_hours": 0,
    "food_supply_hours": 0,
    "supply_hours": 0,
    "unmeasurable_water_count": 0,
    "unmeasurable_food_count": 0
  },
  "buckets": {
    "expired": [],
    "within_urgent": [],
    "within_expiring": [],
    "low_stock": []
  }
}
```

Bucket lists use `item_summary`.

### `ready_home/settings`

Return `ReadinessSettings` fields as a plain dict (people, duration, targets, locations, categories, thresholds).

### `ready_home/subscribe`

Subscribe to store changes. On each change (and immediately once), push the same payload as `items/list`. Unsubscribe on connection close.

### `ready_home/barcode/lookup`

Input: `{ "barcode": "3017620422003" }`  
Output: product dict from `barcode.lookup_product` or error.

## Barcode lookup

`barcode.lookup_product(hass, barcode: str) -> dict | None`

- GET `https://world.openfoodfacts.org/api/v2/product/{barcode}.json`
- Use `hass.helpers.aiohttp_client.async_get_clientsession(hass)`
- Map: `product_name` / `brands` / `nutriments.energy-kcal_100g` → `{name, brand, calories_per_100g, barcode, raw_name}`
- Return `None` on 404 / missing product
- User-Agent: `ReadyHomeHomeAssistant/0.1.0`

Service `ready_home.lookup_barcode` with `SupportsResponse.ONLY` wrapping the same helper.

## Definition of done

- [ ] All four websocket commands registered on setup
- [ ] `lookup_barcode` action works from Developer Tools
- [ ] Unit tests with mocked aiohttp for OFF responses
- [ ] Existing Phase 1 tests still pass
- [ ] No changes to storage schema

## Registration hook in `__init__.py`

After `async_register_services(hass)`:

```python
from .websocket_api import async_register_websocket
async_register_websocket(hass)
```
