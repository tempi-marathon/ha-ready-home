# Phase 7 — Sidebar management panel

## Goal

Add an Alarmo-style **Ready Home** sidebar panel for full inventory management. Keep Lovelace cards for dashboard *status*, not CRUD.

| Surface | Role after this phase |
|---------|------------------------|
| **Sidebar panel** | Primary UX: list, filter, add/edit/remove, quantity adjust, barcode lookup |
| **Readiness card** | Glanceable readiness on a dashboard |
| **Inventory card** | Deprecate as admin UI (keep briefly for migration, or slim to attention-only) |
| **Sensors + services** | Automations and scripts; services remain the write API |

## Non-goals (this phase)

- Multiple config entries / profile picker in the panel (prep already done; still `single_config_entry: true`)
- Built-in HA notifications / todo entities
- Per-item entities
- Reworking readiness math

## Architecture (Alarmo-shaped)

```
Sidebar panel (Lit, served from integration)
    │  read / subscribe  →  websocket_api (ready_home/*)
    │  write             →  hass.callService("ready_home", …)
    ▼
Coordinator + InventoryStore (per entry_id)
    ▼
Sensors / events (unchanged)
```

### Why this split

- Reads stay push-friendly (subscribe → live table).
- Writes reuse existing services (`add_item`, `update_item`, `adjust_quantity`, `remove_item`, `lookup_barcode`) so Developer Tools, scripts, and the panel share one mutation path.
- No second persistence layer.

## Backend work

1. **Panel registration** (in `panel.py`)
   - Register via `homeassistant.components.panel_custom.async_register_panel` with **`module_url`** (Alarmo pattern — not bare `async_register_built_in_panel` / `js_url`).
   - Sidebar title: “Ready Home”; icon: `mdi:shield-home`; route: `/ready_home`.
   - `require_admin`: **false** (household users should manage inventory); document that HA user permissions still apply to services.
   - Unregister with `frontend.async_remove_panel` on last entry unload.
   - Manifest dependency: `panel_custom`.

2. **Static assets**
   - Extend the existing Vite build to emit a **panel bundle** (e.g. `dist/ready-home-panel.js`) in addition to `ready-home.js` (cards).
   - Serve both from the same HTTP static path already used for cards.
   - Lovelace resource registration stays for cards; panel loads via panel config `js_url` / `embed_iframe` as required by current HA panel APIs.

3. **Websocket**
   - Keep: `ready_home/items/list`, `ready_home/settings`, `ready_home/subscribe`, `ready_home/barcode/lookup`.
   - Ensure optional `config_entry_id` is accepted (already prepared).
   - Optional later: dedicated write websocket commands — **not required** if services cover mutations.

4. **Services**
   - No new services required for MVP panel if current ones cover the form fields.
   - Gap-check during UI design: bulk delete, “consume 1”, set quantity absolute — add only if the panel needs them.

## Frontend work

### Panel IA (first viewport + sections)

1. **Header** — profile name (entry title), overall readiness %, water/food mini summary.
2. **Toolbar** — search, filters (location, category, resource, attention status), Add item.
3. **Table / list** — name, qty / desired, expiry, location, resource; row actions: ±, edit, delete.
4. **Editor drawer/dialog** — full item fields (match service schemas + barcode lookup).
5. **Empty state** — short copy + Add CTA (no dashboard-card clutter).

### Tech

- Lit + existing frontend toolchain (`frontend/`).
- HA design system where practical (`ha-card` is optional; prefer panel layout, not nested dashboard cards).
- Localize via HA `hass.localize` / integration strings, or a small panel i18n map (en + nl).
- Subscribe on connect; tear down on disconnect.

### Inventory card fate

- Short term: leave card working; document panel as preferred management UI.
- Follow-up: convert inventory card to **attention / compact list only**, or remove from docs once panel ships.

## Implementation sequence

1. Scaffold panel entrypoint + HA panel registration (blank “Ready Home” shell in sidebar).
2. Wire subscribe + render read-only inventory table.
3. Add item dialog → `add_item` service; edit/delete/adjust → existing services.
4. Filters, search, barcode lookup.
5. Readiness summary header from coordinator snapshot / settings WS.
6. NL/EN copy; README + HACS description update (“sidebar panel for management”).
7. Soft-deprecate full CRUD on inventory card (docs + optional in-card link to panel).

## Acceptance criteria

- [ ] Sidebar shows **Ready Home** after integration setup; disappears when integration is removed.
- [ ] User can add, edit, adjust quantity, and remove items without Developer Tools.
- [ ] Table updates live when services mutate inventory (another tab / automation).
- [ ] Barcode lookup fills name/calories hints in the add form when OFF finds a product.
- [ ] Readiness card still works on Lovelace; management does not require it.
- [ ] Existing Dutch entity IDs are unrelated; panel does not depend on entity object ids.
- [ ] Single profile only; no profile picker required.

## Effort / risk notes

- **Largest risk:** HA panel registration API details and frontend build packaging (iframe vs module). Spike Alarmo’s current `frontend` registration against the HA version we target before committing to layout.
- **UX risk:** Duplicating inventory card + panel confuses users — mitigate with docs and a clear “Manage in sidebar” note on the card.
- **Scope creep:** Settings (people, targets) can stay in the options flow for v1 of the panel; move into panel only if sidebar feels incomplete without them.

## Follow-ups (later phases)

- Multi-profile: panel profile switcher using `config_entry_id`.
- Attention-only Lovelace card.
- Fix inventory-card ± / UX (only if card remains a management surface).
