# Actions

Use **Developer Tools → Actions**. The sidebar panel uses `add_item`, `update_item`, and `remove_item` for writes; `adjust_quantity`, `list_items`, and `lookup_barcode` are mainly for automations and scripts.

**Stock vs contents:** `unit` is how you count stock (`piece` / `pack` / `box`). Package size goes in `contents_per_unit` + `contents_unit` (e.g. 1.5 liter per bottle). Prefer those over `liters_per_unit` / `calories_per_unit`.

## Add a water six-pack

```yaml
action: ready_home.add_item
data:
  name: Bottled water
  quantity: 6
  desired_quantity: 12
  unit: piece
  location: Garage
  category: Water
  contents_per_unit: 1.5
  contents_unit: liter
  priority: essential
```

## Add food with calories

```yaml
action: ready_home.add_item
data:
  name: Instant rice
  quantity: 10
  unit: pack
  category: Food
  contents_per_unit: 400
  contents_unit: gram
  calories_per_content: 3.54
  expiry_date: "2027-06-01"
```

## Update an item

```yaml
action: ready_home.update_item
data:
  name: Bottled water
  quantity: 4
  desired_quantity: 12
```

## Remove an item

```yaml
action: ready_home.remove_item
data:
  name: Instant rice
```

## Consume one unit

```yaml
action: ready_home.adjust_quantity
data:
  name: Bottled water
  delta: -1
```

## Look up a barcode

```yaml
action: ready_home.lookup_barcode
data:
  barcode: "3017620422003"
```

## List low-stock items

```yaml
action: ready_home.list_items
data:
  status: low_stock
```
