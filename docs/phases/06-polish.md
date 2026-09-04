# Phase 6 — Polish and HACS default store

## Goal

Dutch translations, brand polish, and prepare for HACS default repository inclusion.

## Tasks

1. Add `custom_components/ready_home/translations/nl.json` (full parity with `en.json` + `strings.json`)
2. Improve `brands/icon.png` if needed (256×256, recognizable mark)
3. Ensure `hacs.json`, `manifest.json` (`documentation`, `issue_tracker`, `codeowners`) are accurate
4. Tag a GitHub release (e.g. `v0.1.0`) after CI is green
5. Open a PR against [hacs/default](https://github.com/hacs/default) adding the repo to `integration` — only after:
   - Public GitHub repo
   - HACS Action + hassfest pass with no ignores
   - At least one GitHub Release

## Definition of done

- [ ] Dutch UI strings for config flow, options, and entity names
- [ ] Release checklist documented in README
- [ ] Default-store PR opened **or** explicitly deferred with checklist remaining

Note: Opening the hacs/default PR requires a public remote and maintainer action; this phase can stop at "ready to submit".
