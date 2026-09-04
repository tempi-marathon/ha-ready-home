# Ready Home for Home Assistant

Track household emergency supplies, measure readiness against water and calorie targets, and surface expired, expiring, and low-stock items as Home Assistant sensors, events, and Lovelace cards.

Installable through [HACS](https://hacs.xyz/) as a custom repository (category: **Integration**).

## Features

| Area | What you get |
|------|----------------|
| **Inventory** | Items with quantity, desired quantity, expiry, priority, location, and category |
| **Readiness** | Water (liters) and food (calories) on-hand vs per-person targets over a configurable duration (default 72 hours) |
| **Sensors** | Overall / water / food readiness %, expired / expiring / low-stock counts, total items, needs-attention binary sensor |
| **Actions** | `add_item`, `update_item`, `adjust_quantity`, `remove_item`, `list_items`, `lookup_barcode` |
| **Events** | `ready_home_item_expired`, `ready_home_item_expiring`, `ready_home_item_low_stock` (fire once on transition) |
| **Cards** | Bundled Lovelace cards for readiness and inventory (auto-registered in storage mode) |
| **Sidebar** | Ready Home panel for full inventory management |
| **Barcode** | Open Food Facts lookup via action, websocket, or inventory card scan |

## Installation

1. In HACS → Integrations → ⋮ → Custom repositories, add this repository URL with category **Integration**.
2. Install **Ready Home**, then restart Home Assistant.
3. Settings → Devices & Services → Add Integration → **Ready Home**.
4. Enter the number of people in the household.

Cards are registered automatically when Lovelace is in **storage** mode. In **YAML** mode, add this resource manually:

```yaml
url: /ready_home/ready-home.js?v=0.1.3
type: module
```

After setup, a **Ready Home** item appears in the sidebar for inventory management (add/edit/±/remove, filters, barcode).

## Configuration

Open the integration → Configure:

- **Readiness targets** — people, duration hours, liters/person/day, kcal/person/day
- **Locations and categories** — free-text lists used when organizing items
- **Thresholds** — expiring window (default 30 days), urgent window (7 days), attribute item cap (100)

## Lovelace cards

Add via the card picker:

- **Ready Home Readiness** (`custom:ready-home-readiness-card`) — gauges and attention counts
- **Ready Home Inventory** (`custom:ready-home-inventory-card`) — table, filters, quantity steppers, add/edit, barcode scan

```yaml
type: vertical-stack
cards:
  - type: custom:ready-home-readiness-card
  - type: custom:ready-home-inventory-card
```

## Actions

Use **Developer Tools → Actions**.

### Add a water six-pack

```yaml
action: ready_home.add_item
data:
  name: Bottled water
  quantity: 6
  desired_quantity: 12
  unit: piece
  location: Garage
  category: Water
  resource: water
  liters_per_unit: 1.5
  priority: essential
```

### Add food with calories

```yaml
action: ready_home.add_item
data:
  name: Instant rice
  quantity: 10
  unit: pack
  category: Food
  resource: food
  calories_per_unit: 600
  expiry_date: "2027-06-01"
```

### Consume one unit

```yaml
action: ready_home.adjust_quantity
data:
  name: Bottled water
  delta: -1
```

### Look up a barcode

```yaml
action: ready_home.lookup_barcode
data:
  barcode: "3017620422003"
```

### List low-stock items

```yaml
action: ready_home.list_items
data:
  status: low_stock
```

## Example automations

### Notify when something expires

```yaml
alias: Ready Home item expired
triggers:
  - trigger: event
    event_type: ready_home_item_expired
actions:
  - action: notify.persistent_notification
    data:
      title: Inventory expired
      message: "{{ trigger.event.data.item.name }} has expired."
```

### Add low-stock items to a todo list

```yaml
alias: Ready Home low stock to shopping list
triggers:
  - trigger: event
    event_type: ready_home_item_low_stock
actions:
  - action: todo.add_item
    target:
      entity_id: todo.shopping_list
    data:
      item: "Restock {{ trigger.event.data.item.name }}"
```

## Readiness math

```
water_target   = people × water_liters_per_person_per_day × duration_hours / 24
calorie_target = people × calories_per_person_per_day × duration_hours / 24
percent        = min(100, on_hand / target × 100)
overall        = min(water_percent, food_percent)
```

Expired stock is excluded. Water/food items without liters or calories are counted as unmeasurable and left out of totals.

## Development

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
pytest tests/ -v
ruff check custom_components tests

npm ci
npm run build   # writes custom_components/ready_home/dist/{ready-home,ready-home-panel}.js
npm test
```

Phase specifications for follow-up work live in [docs/phases/](docs/phases/).

## Release checklist (HACS default store)

Before submitting to [hacs/default](https://github.com/hacs/default):

1. Push a public GitHub repository under the intended owner
2. Ensure CI is green (hassfest, HACS action, pytest)
3. Publish a GitHub Release (not only a tag), e.g. `v0.1.0`
4. Open a PR adding this repo to the `integration` list in hacs/default

## License

[MIT](LICENSE)
