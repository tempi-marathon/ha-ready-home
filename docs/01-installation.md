# 1. Installation

Ready Home installs through [HACS](https://hacs.xyz/) (category: **Integration**).

[![Open Ready Home on Home Assistant Community Store (HACS).](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=tempi-marathon&repository=ha-ready-home&category=integration)

From Home Assistant 2026.11, install and updates use **Settings → Marketplace** (the HACS button above still works and opens Ready Home there after you upgrade).

## Steps

1. Open HACS → search for **Ready Home**, or use the button above (custom repository if needed).
2. Download **Ready Home**, restart Home Assistant.
3. Settings → Devices & Services → Add Integration → **Ready Home**, or use the button below.
4. Enter the number of people in the household.

[![Open your Home Assistant instance and start setting up a new integration.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=ready_home)

After setup, a **Ready Home** item appears in the sidebar for inventory management (add/edit/remove, filters, barcode).

## Lovelace resource cleanup

If you previously added a Lovelace resource for `/ready_home/ready-home.js`, you can remove it (Settings → Dashboards → ⋮ → Resources, or from YAML). Storage-mode installs clean that resource up automatically on the next load.

---

**Next:** [2. Configuration](02-configuration.md)
