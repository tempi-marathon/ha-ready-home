# Ready Home for Home Assistant

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5?style=for-the-badge&logo=homeassistantcommunitystore&logoColor=white)](https://hacs.xyz/)
[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2024.12%2B-41BDF5?style=for-the-badge&logo=homeassistant&logoColor=white)](https://www.home-assistant.io/)
[![GitHub Release](https://img.shields.io/github/v/release/tempi-marathon/ha-ready-home?style=for-the-badge&include_prereleases&logo=github&logoColor=white)](https://github.com/tempi-marathon/ha-ready-home/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Security Policy](https://img.shields.io/badge/Security-Policy-green?style=for-the-badge&logo=github&logoColor=white)](SECURITY.md)

Track household emergency supplies, measure readiness against water and calorie targets, and surface expired, expiring, and low-stock items as Home Assistant sensors, events, and a sidebar management panel.

<p align="center">
  <img src="https://raw.githubusercontent.com/tempi-marathon/ha-ready-home/main/docs/images/hero.png" alt="Ready Home" width="640" />
</p>

## Features

- **Inventory** — Items with quantity, desired quantity, expiry, priority, location, and category
- **Readiness** — Water (liters) and food (calories) on-hand vs per-person targets over a configurable duration (default 72 hours), plus **essential-only** readiness
- **Category completeness** — Checklist scoring for non–food/water categories; kit templates seed first-aid / go-bag / tools
- **Sensors** — Overall / water / food / essential readiness %, category completeness, expired / expiring / low-stock counts, needs-attention binary sensor
- **Actions** — Inventory CRUD, barcode lookup, kit templates, restock → todo list, import/export
- **Events** — Enter and clear transitions for expired / expiring / low stock
- **Sidebar** — Ready Home panel (en/nl) for inventory management
- **Barcode** — Open Food Facts lookup via action, websocket, or sidebar panel. Camera scan uses the Home Assistant Companion app; on desktop enter the code and tap Lookup

## Screenshots

<p align="center">
  <img src="https://raw.githubusercontent.com/tempi-marathon/ha-ready-home/main/docs/images/panel-mobile.png" alt="Ready Home on mobile" width="280" /><br />
  <em>Mobile panel — readiness cards and inventory list</em>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/tempi-marathon/ha-ready-home/main/docs/images/panel-add-item.png" alt="Add item with barcode lookup" width="360" /><br />
  <em>Add / edit item — barcode lookup, stock, calories, expiry</em>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/tempi-marathon/ha-ready-home/main/docs/images/ha-sensors.png" alt="Home Assistant readiness sensors" width="280" /><br />
  <em>Home Assistant sensors — readiness %, expired, expiring, low stock</em>
</p>

## Install

[![Open Ready Home on Home Assistant Community Store (HACS).](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=tempi-marathon&repository=ha-ready-home&category=integration)

From Home Assistant 2026.11, install and updates use **Settings → Marketplace** (the HACS button above still works and opens Ready Home there after you upgrade).

1. Open HACS → search for **Ready Home**, or use the button above (custom repository if needed)
2. Download **Ready Home**, restart Home Assistant
3. Settings → Devices & Services → Add Integration → **Ready Home**, or use the button below
4. Enter the number of people in the household

[![Open your Home Assistant instance and start setting up a new integration.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=ready_home)

Full guide: [1. Installation](docs/01-installation.md) · [2. Configuration](docs/02-configuration.md) · [3. Usage](docs/03-usage.md)

## Documentation

1. [Installation](docs/01-installation.md)
2. [Configuration](docs/02-configuration.md)
3. [Usage](docs/03-usage.md)
4. [Actions](docs/04-actions.md)
5. [Sensors and events](docs/05-sensors-and-events.md)
6. [Automations](docs/06-automations.md)
7. [Readiness math](docs/07-readiness.md)

## License

[MIT](LICENSE)
