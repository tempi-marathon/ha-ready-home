# Ready Home Constitution

## Core Principles

### I. Home Assistant-Native
Ready Home MUST behave as a first-class Home Assistant custom integration (domain `ready_home`).
State is exposed through standard entities (sensors, binary sensors), actions (services), events,
websocket commands, and a sidebar panel. Config entries and config flows MUST be used for setup;
no YAML-only configuration is introduced. User-facing strings MUST live in `strings.json` and
`translations/`, and the panel MUST remain localized (currently en/nl).
Rationale: users install this through HACS / the Marketplace and expect HA conventions.

### II. Readiness Math Is the Core and Stays Pure
Readiness, completeness, and attention (expired / expiring / low-stock) calculations MUST live in
side-effect-free modules (`readiness.py`, `completeness.py`, `attention.py`, `helpers.py`) that
do not depend on a running Home Assistant instance. Any change to a formula MUST be reflected in
`docs/07-readiness.md` in the same change. Water (liters) and food (calories) targets remain
per-person over a configurable duration.
Rationale: the numbers drive safety-relevant decisions and must be explainable and testable.

### III. Test-Backed Changes
Every behavioral change MUST ship with tests: pytest for Python (`tests/`) and vitest for the
frontend. Bug fixes MUST include a regression test. Logic that can be tested without Home
Assistant fixtures SHOULD be factored out so it can be. CI-equivalent checks (`ruff check`,
`pytest`, `npm run lint`, `npm test`, `npm run build`) MUST pass before merge.
Rationale: inventory data and readiness scores are only useful if they are trustworthy.

### IV. Local-First, Privacy-Respecting, Secure by Default
Inventory data MUST be stored locally in Home Assistant storage. The only permitted external
call is the opt-in barcode lookup against Open Food Facts, and it MUST be user-initiated and
fail gracefully. No telemetry, accounts, or cloud dependencies may be added. Mutating websocket
commands and actions MUST enforce Home Assistant authorization (see `auth.py`). Security issues
follow `SECURITY.md`.
Rationale: household emergency data is sensitive and must work during outages.

### V. Stable Public Surface and Data Compatibility
Entity IDs, action schemas, event names/payloads, websocket commands, and stored data are public
contracts documented in `docs/`. Breaking changes MUST be avoided; when unavoidable they require
a storage migration, a release note, and a version bump. Docs (`docs/`, `README.md`) MUST be
updated in the same change as any contract change. Prefer the simplest design that satisfies the
requirement (YAGNI); added complexity MUST be justified in the change description.
Rationale: users build automations and dashboards on top of these contracts.

## Technology & Compatibility Constraints

- Backend: Python 3.12+, linted with ruff (line length 100; rules E, F, I, UP, B, SIM).
- Frontend: TypeScript and Lit, built with Vite into `custom_components/ready_home/dist`; the
  built bundle MUST be committed/shipped consistently with the source it was built from.
- Minimum supported Home Assistant version is declared in `hacs.json` (currently 2024.12.0) and
  MUST NOT be raised without a documented reason and release note.
- Distribution is via HACS and the Home Assistant Marketplace (zip release `ready_home.zip`);
  `manifest.json`, `pyproject.toml`, and `package.json` versions MUST stay in sync.
- New runtime dependencies MUST be justified; prefer Home Assistant built-ins.

## Development Workflow & Quality Gates

- Work happens on feature branches and lands via pull request against `main`.
- Commits follow conventional style (`feat:`, `fix:`, `docs:`, etc.) as in existing history.
- Each PR MUST state which principles it touches, pass the checks in Principle III, and update
  documentation and translations for any user-visible change.
- Dependency updates (e.g., Dependabot) MUST pass the full test and build suite before merge.

## Governance

This constitution supersedes ad-hoc practices for this repository. Amendments are made by pull
request that updates this file, states the rationale, and includes a migration plan for any
affected code or docs. Versioning follows semantic versioning: MAJOR for removed or redefined
principles, MINOR for added principles/sections or materially expanded guidance, PATCH for
clarifications. Reviewers MUST verify compliance with these principles on every PR, and any
deviation MUST be recorded and justified in the PR description. `README.md` and `docs/` serve as
runtime guidance for contributors and users.

**Version**: 1.0.0 | **Ratified**: 2026-11-06 | **Last Amended**: 2026-11-06
