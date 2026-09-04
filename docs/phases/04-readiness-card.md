# Phase 4 — Readiness card

## Goal

Compact Lovelace card: water/food gauges, overall %, supply hours, attention counts. Reads **sensor states only** (no websocket dependency).

## File ownership

| Path | Role |
|------|------|
| `frontend/src/cards/readiness-card.ts` | **Create** |
| `frontend/src/cards/readiness-editor.ts` | **Create** — config editor |
| `frontend/src/main.ts` | Import/register the card |
| `frontend/src/localize.ts` | Optional strings |

Depends on Phase 3. Does **not** require Phase 2.

## Config

```yaml
type: custom:ready-home-readiness-card
# Optional overrides; defaults discover ready_home sensors by entity_id prefix
entity: sensor.ready_home_readiness
water_entity: sensor.ready_home_water_readiness
food_entity: sensor.ready_home_food_readiness
expired_entity: sensor.ready_home_expired_items
expiring_entity: sensor.ready_home_expiring_items
low_stock_entity: sensor.ready_home_low_stock_items
attention_entity: binary_sensor.ready_home_needs_attention
```

## UI

- Overall readiness as primary percentage
- Water and food as secondary gauges or progress bars
- Supply hours from attributes (`supply_hours`, `water_supply_hours`, `food_supply_hours`)
- Attention row: expired / expiring / low-stock counts
- Highlight when `needs_attention` is on

Use HA theme CSS variables. No purple-glow AI clichés.

## Definition of done

- [ ] Card appears in picker as "Ready Home Readiness"
- [ ] Works with default entity IDs after fresh install
- [ ] Config editor allows entity overrides
- [ ] Stub card may remain for debugging or be removed
