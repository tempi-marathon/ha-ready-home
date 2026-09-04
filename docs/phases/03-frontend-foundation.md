# Phase 3 — Frontend foundation

## Goal

Vite + Lit + TypeScript build, serve the bundle from the integration, auto-register the Lovelace resource, prove the pipeline with a stub card.

## File ownership

| Path | Role |
|------|------|
| `frontend/` | **Create** — TS sources, `package.json`, `vite.config.ts`, `tsconfig.json` |
| `custom_components/ready_home/dist/` | **Create** — committed build output |
| `custom_components/ready_home/frontend.py` | **Create** — static path + resource registration |
| `custom_components/ready_home/__init__.py` | Call `async_setup_frontend(hass)` once |
| `custom_components/ready_home/manifest.json` | Add dependencies: `http`, `frontend`, `lovelace` |
| `package.json` (repo root) | Scripts: `build`, `test` |

## Build

Match `ha-weather-card` conventions:

- Lit 3, TypeScript, Vite library mode
- Entry: `frontend/src/main.ts`
- Output: `custom_components/ready_home/dist/ready-home.js` (single ES module)
- `npm run build` must be runnable from repo root

## Stub card

Register custom element `ready-home-stub-card` that renders:

```text
Ready Home frontend OK — replace in phases 4/5
```

Register in `window.customCards` with name `ready-home-stub-card`.

## `frontend.py` requirements

1. `await hass.http.async_register_static_paths([StaticPathConfig(...)])` serving `dist/`
2. Auto-register Lovelace module resource **only** when Lovelace is in storage mode
3. Never use `add_extra_js_url` together with a resource entry
4. Ensure resource collection is loaded before `async_create_item` / `async_update_item`
5. URL cache-bust: `/ready_home/ready-home.js?v={VERSION}` (from `manifest.json`)
6. Update existing resource in place when version changes; do not duplicate
7. On YAML Lovelace mode: log an instruction to add the resource manually
8. Swallow `RuntimeError` if static path already registered (reload)

## Definition of done

- [ ] `npm run build` produces `dist/ready-home.js`
- [ ] After HA restart with integration loaded, stub card appears in card picker (storage mode)
- [ ] README notes YAML-mode manual resource URL
- [ ] Phase 1 tests unaffected
