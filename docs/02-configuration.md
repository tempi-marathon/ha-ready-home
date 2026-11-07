# 2. Configuration

Open the integration → **Configure**:

- **Readiness targets** — a submenu with one entry per age category (adults 18–69, children 4–17, babies and toddlers 0–3, seniors 70+), a **Duration** entry, and **Back**. Each category form holds the number of people, kcal/person/day and liters/person/day (defaults follow Voedingscentrum.nl, light activity); Duration holds the readiness duration in hours. Saving returns to the submenu, whose description summarises the current people per category and the duration. At least one person is required across all categories. Existing setups appear as adults only, with their previous values.
- **Pets** — add, edit or remove any number of pets (name, food in grams per day, water in liters per day, optional type). Pet water is added to the water target; pet food is a separate target in grams. Existing setups have no pets.
- **Locations and categories** — storage locations, category labels, and which categories count as **food**, **water** or **pet food** (default `Pet food`) for readiness
- **Thresholds** — expiring window (default 30 days), urgent window (7 days)
- **Restock** — optional Home Assistant todo / shopping list entity, and whether to auto-push when an item newly becomes low stock

## Access

Any logged-in Home Assistant user can open the Ready Home sidebar and **view** the inventory (and call `ready_home.list_items`). **Changing** inventory — panel Add / Edit / Remove / barcode lookup / kit templates, and write actions — requires an **admin** user.

Automations and scripts (no user context) may still call those write actions. Profile settings stay in the integration options flow, which is admin-only.

---

**Previous:** [1. Installation](01-installation.md) · **Next:** [3. Usage](03-usage.md)
