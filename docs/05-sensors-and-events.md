# 5. Sensors and events

## Sensors

Ready Home exposes entities such as:

| Entity (object id) | Platform | State | Useful attributes |
|--------------------|----------|-------|-------------------|
| `readiness` / `water_readiness` / `food_readiness` | sensor | % ready | people, duration, on-hand / target totals |
| `expired_items` | sensor | count | `items` — capped list of item summaries |
| `expiring_items` | sensor | urgent + expiring count | `items`, `urgent_count`, `urgent_items` |
| `low_stock_items` | sensor | count | `items` |
| `items` | sensor | total inventory count | (diagnostic) |
| `needs_attention` | binary_sensor (`problem`) | `on` when any attention bucket is non-empty | see below |

Suggested entity ids depend on your device name, e.g. `sensor.ready_home_expired_items`, `binary_sensor.ready_home_needs_attention`.

![Home Assistant sensors](images/ha-sensors.png)

Diagnostic attributes (people, duration, targets, totals) are also available on the device:

![Diagnostics](images/ha-diagnostics.png)

### Needs-attention (problem) attributes

| Attribute | Meaning |
|-----------|---------|
| `expired_count` | Items past expiry |
| `urgent_count` | Items inside the urgent window |
| `expiring_count` | Items inside the wider expiring window (excluding urgent) |
| `low_stock_count` | Items at or below desired quantity |
| `causes` | List of active cause keys, e.g. `["expired","low_stock"]` |
| `cause` | Short human string, e.g. `"1 expired, 2 low stock"` |

### List attributes (`items` / `urgent_items`)

Each entry is an **item summary** (same shape as `list_items` responses). Lists are capped (100 items).

**Always present:**

| Field | Notes |
|-------|--------|
| `id` | Stable item id |
| `name` | |
| `quantity` / `desired_quantity` | |
| `unit` | Stock unit (`piece` / `pack` / `box`, …) |
| `location` / `category` | |
| `notes` / `barcode` | |
| `priority` | `essential` / `important` / `optional` |
| `expiry_date` | ISO `YYYY-MM-DD` or `null` |

**Optional** (only when set / computable): `contents_per_unit`, `contents_unit`, `calories_per_content`, `calories_per_unit`, `calories_on_hand`, `liters_per_unit`, `water_liters_on_hand`.

`expiring_items` puts urgent items first in `items`, and also exposes `urgent_items` (urgent-only) plus `urgent_count`.

## Events

These fire **once when an item newly enters** an attention bucket (deduped via persisted bucket state). Clearing attention does **not** fire an event. Leaving a bucket and entering again later can fire again.

| Event | When |
|-------|------|
| `ready_home_item_expired` | Item moves into the expired bucket |
| `ready_home_item_expiring` | Item moves into the urgent **or** wider expiring window |
| `ready_home_item_low_stock` | Item newly becomes low stock |

There is **no** dedicated “problem” event — use `binary_sensor.ready_home_needs_attention` (or the list sensors) for state-based automations.

### Event payloads

Event `item` objects use a **lean** summary: same stock / readiness fields as list attributes, but **without** `notes` or `barcode` (those stay on the panel, websocket snapshot, and sensor attributes only).

**Expired / expiring:**

```yaml
item:   # lean item summary (no notes/barcode)
bucket: "expired"   # or "expiring"
```

`bucket` is only `"expired"` or `"expiring"`. Urgent vs wider-expiring is **not** distinguished in the payload (both use `ready_home_item_expiring` with `bucket: expiring`).

**Low stock:**

```yaml
item:   # lean item summary (no notes/barcode)
```

(no `bucket` field)

See [6. Automations](06-automations.md) for examples.

---

**Previous:** [4. Actions](04-actions.md) · **Next:** [6. Automations](06-automations.md)
