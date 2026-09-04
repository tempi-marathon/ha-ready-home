# Phase 5 — Inventory card

## Goal

Full inventory management card: filterable table, quantity steppers, add/edit dialog, barcode camera scanning.

## Depends on

Phases 2 (websocket + barcode) and 3 (frontend foundation).

## File ownership

| Path | Role |
|------|------|
| `frontend/src/cards/inventory-card.ts` | **Create** |
| `frontend/src/cards/inventory-editor.ts` | **Create** |
| `frontend/src/api.ts` | WS helpers: list, subscribe, barcode lookup |
| `frontend/src/main.ts` | Register card |

## Data flow

- **Read**: `hass.connection.sendMessagePromise` / subscribe via `ready_home/subscribe`
- **Write**: `hass.callService('ready_home', 'add_item' | 'update_item' | 'adjust_quantity' | 'remove_item', …)`

## UI requirements

1. Table columns: name, quantity, unit, location, category, expiry, priority, resource
2. Filters: location, category, resource, status (expired / expiring / low_stock / all)
3. Sort by name, expiry, quantity
4. Inline +/- steppers calling `adjust_quantity` with delta ±1
5. Add / Edit dialog with fields matching `add_item` / `update_item`
6. Barcode: prefer `BarcodeDetector` API; on detect call `ready_home/barcode/lookup` and prefill name + calories; fallback to manual barcode text field
7. Delete with confirm

## Definition of done

- [ ] Card usable as the primary day-to-day inventory UI
- [ ] Live updates when another client mutates inventory
- [ ] Barcode path works in Chromium-based browsers that support BarcodeDetector
