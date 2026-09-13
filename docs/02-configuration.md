# 2. Configuration

Open the integration → **Configure**:

- **Readiness targets** — people, duration hours, liters/person/day, kcal/person/day
- **Locations and categories** — storage locations, category labels, and which categories count as **food** or **water** for readiness
- **Thresholds** — expiring window (default 30 days), urgent window (7 days)

## Access

Ready Home treats inventory as a **shared household** resource. Any logged-in Home Assistant user who can open the sidebar panel or call `ready_home.*` actions can read and change the full inventory. Profile settings (people, targets, lists, thresholds) stay in the integration options flow, which is admin-only.

---

**Previous:** [1. Installation](01-installation.md) · **Next:** [3. Usage](03-usage.md)
