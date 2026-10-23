# 1. Installation

Ready Home is a custom **Integration**. On Home Assistant **2026.11+** it installs through the built-in [Marketplace](https://www.hacs.xyz/docs/marketplace/) (**Settings → Marketplace**). On **2026.10 and older**, use [HACS](https://hacs.xyz/).

## Home Assistant 2026.11+ (Marketplace)

[![Open Ready Home in the Home Assistant Marketplace.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/marketplace_repository/?owner=tempi-marathon&repository=ha-ready-home&category=integration)

### Steps

1. Settings → **Marketplace** → search for **Ready Home**, or use the button above (custom repository if needed).
2. Download **Ready Home** (restart if Home Assistant asks).
3. Settings → Devices & Services → Add Integration → **Ready Home**, or use the button below.
4. Enter the number of people in the household.

[![Open your Home Assistant instance and start setting up a new integration.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=ready_home)

After setup, a **Ready Home** item appears in the sidebar for inventory management (add/edit/remove, filters, barcode).

## Home Assistant 2026.10 and older (HACS)

[![Open Ready Home on Home Assistant Community Store (HACS).](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=tempi-marathon&repository=ha-ready-home&category=integration)

### Steps

1. Open HACS → search for **Ready Home**, or use the button above (custom repository if needed).
2. Download **Ready Home**, restart Home Assistant.
3. Settings → Devices & Services → Add Integration → **Ready Home**, or use the setup button in the Marketplace section above.
4. Enter the number of people in the household.

## Lovelace resource cleanup

If you previously added a Lovelace resource for `/ready_home/ready-home.js`, you can remove it (Settings → Dashboards → ⋮ → Resources, or from YAML). Storage-mode installs clean that resource up automatically on the next load.

---

**Next:** [2. Configuration](02-configuration.md)
