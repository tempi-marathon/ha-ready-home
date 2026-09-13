# 1. Installation

Ready Home installs through [HACS](https://hacs.xyz/) as a **custom repository** (category: **Integration**). A default-store listing (and one-click add button) may follow once approved.

## Steps

1. In HACS → Integrations → ⋮ → **Custom repositories**, add this repository URL with category **Integration**.
2. Install **Ready Home**, then restart Home Assistant.
3. Settings → Devices & Services → Add Integration → **Ready Home**.
4. Enter the number of people in the household.

After setup, a **Ready Home** item appears in the sidebar for inventory management (add/edit/remove, filters, barcode).

## Lovelace resource cleanup

If you previously added a Lovelace resource for `/ready_home/ready-home.js`, you can remove it (Settings → Dashboards → ⋮ → Resources, or from YAML). Storage-mode installs clean that resource up automatically on the next load.

---

**Next:** [2. Configuration](02-configuration.md)
