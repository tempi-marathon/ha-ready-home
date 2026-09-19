# 2. Configuration

Open the integration → **Configure**:

- **Readiness targets** — people, duration hours, liters/person/day, kcal/person/day
- **Locations and categories** — storage locations, category labels, and which categories count as **food** or **water** for readiness
- **Thresholds** — expiring window (default 30 days), urgent window (7 days)

## Access

Any logged-in Home Assistant user can open the Ready Home sidebar and **view** the inventory (and call `ready_home.list_items`). **Changing** inventory — panel Add / Edit / Remove / barcode lookup, and the `add_item`, `update_item`, `adjust_quantity`, `remove_item`, and `lookup_barcode` actions — requires an **admin** user.

Automations and scripts (no user context) may still call those write actions. Profile settings (people, targets, lists, thresholds) stay in the integration options flow, which is admin-only.

---

**Previous:** [1. Installation](01-installation.md) · **Next:** [3. Usage](03-usage.md)
