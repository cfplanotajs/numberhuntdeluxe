# Release Candidate Audit — Number Hunter Deluxe Quest Hub

## Release Candidate Status

**Feature-complete MVP, blocked for Shopify QR launch by missing local Matter.js asset.**

The static prototype can still use its current CDN Matter.js setup for development review. Shopify production / QR launch requires a local Shopify theme asset named `matter.min.js` before Treasure Merge can launch from the Shopify section.

## MVP Scope Summary

Current MVP scope is present and documented:

- Realm map and six-realm selection flow
- Difficulty selector
- Activity cards and focused quest stage
- Quick Quest
- Key Lock Puzzles
- Treasure Merge
- Guardian Dash
- Even/Odd Critter Sort
- Bonus Guardian Quest Generator
- Treasure Cave reward room
- Parent resources / trust positioning
- `localStorage` progress only
- Shopify scaffold and flattened asset handoff bundle
- Section-safe `window.NumberHunterQuestHub.init(root)` / `destroy(root)` support
- Source-to-Shopify asset sync/check scripts for non-Matter assets

## Current Feature Inventory

| Area | Status | Notes |
| --- | --- | --- |
| Static prototype | Ready for local/manual QA | Uses `index.html` and static assets. |
| Realm map | Implemented | Mirrors the six physical board realms. |
| Difficulty selector | Implemented | Feeds shared math generation and game sessions. |
| Quick Quest | Implemented | Awards stars through hub progress flow. |
| Key Lock Puzzles | Implemented | Unlocks selected realm keys. |
| Treasure Merge | Implemented | Matter.js game; Shopify launch blocked until local Matter asset exists. |
| Guardian Dash | Implemented | Lazy-started capped-star mini-game. |
| Even/Odd Sort | Implemented | Capped-star mini-game, no keys. |
| Guardian Quest Generator | Implemented | Parent/physical-board helper; no digital progress changes. |
| Treasure Cave | Implemented | Unlocks from all six realm keys only. |
| Shopify scaffold | Present | Section/template/assets exist, but Matter asset is missing. |
| Asset sync tooling | Present | Checks/copies mapped non-Matter assets. |

## Reward Rules

Do not change these rules without a product decision:

- Key Lock unlocks realm keys.
- Treasure Merge awards capped stars only.
- Guardian Dash awards capped stars only.
- Even/Odd Sort awards capped stars only.
- Quick Quest awards stars.
- Guardian Quest Generator does not change digital progress.
- Treasure Cave does not award progress.
- Cave unlock remains based on all 6 realm keys.
- Direct reward bypass controls should remain absent.

## Lifecycle Rules

- Treasure Merge and Guardian Dash are lazy-started; selecting their activity cards should not start hidden loops before the child starts the game.
- Only one looped mini-game should run at a time.
- Switching activity cards should stop hidden looped games.
- Realm, difficulty, and reset changes should clean active sessions and keep non-looped selected activities playable.
- Key Lock should remount for the currently selected realm/difficulty before it can unlock a key.
- Section-safe initialization is exposed through `window.NumberHunterQuestHub.init(root)` and `window.NumberHunterQuestHub.destroy(root)`.
- Shopify theme-editor load/unload behavior still requires manual verification in the target theme.

## Shopify Readiness Status

- Shopify Liquid section exists at `shopify/sections/number-hunter-quest-hub.liquid`.
- Shopify JSON page template exists at `shopify/templates/page.number-hunter-quest-hub.json`.
- Flattened non-Matter Shopify asset copies exist in `shopify/assets/`.
- The sync/check scripts verify mapped non-Matter assets match source files.
- The Liquid section references `matter.min.js` in the required script order before Treasure Merge.
- Shopify QR launch is **not ready** until the local Matter.js asset is supplied.

## Known Launch Blockers

### Blocker: `shopify/assets/matter.min.js` is missing

**Impact:** The Shopify scaffold references `matter.min.js`, so Treasure Merge will fall back / fail to start in Shopify until this asset exists.

**Required fix before QR launch:** Manually add **Matter.js 0.20.0** at `shopify/assets/matter.min.js` or upload it as the matching Shopify theme asset referenced by the Liquid section.

**Current workspace status:** The file is intentionally absent in this workspace. Do not create a stub and do not claim Matter.js is bundled until the real asset is present.

## Non-Blocking Known Limitations

- Manual QA is still required on real mobile/tablet devices.
- Shopify theme editor behavior must be verified in the target Shopify theme.
- Progress is browser-local only; clearing site data resets stars/keys.
- Static prototype still uses current CDN Matter.js setup unless a separate production asset path change is made.
- Final art, audio, particles, analytics, accounts, and backend services remain intentionally out of scope.

## Asset Sync Status

Run `node scripts/check-shopify-asset-sync.js` before handoff. Current expectation: all mapped non-Matter assets pass; `matter.min.js` is not part of the source-to-Shopify copy map and remains a manual launch asset blocker.

## Pre-Launch Checklist

- [ ] Add real Matter.js 0.20.0 as `shopify/assets/matter.min.js` or the equivalent Shopify theme asset.
- [ ] Re-run `node scripts/check-shopify-asset-sync.js` after any source asset changes.
- [ ] Confirm Shopify section script order remains data -> math-engine -> progress -> Matter.js -> game modules -> hub last.
- [ ] Smoke test static prototype on mobile/tablet.
- [ ] Smoke test Shopify section in the target theme.
- [ ] Confirm Treasure Merge starts in Shopify after Matter is supplied.
- [ ] Confirm Key Lock unlocks only the currently selected realm key.
- [ ] Confirm capped-star games do not unlock keys.
- [ ] Confirm Treasure Cave unlocks only after all 6 realm keys.
- [ ] Confirm no reward bypass controls are present.
- [ ] Confirm no framework/build artifacts (`package.json`, Vite, Next, TS/JSX/TSX) were added.

## Recommended Next Actions

1. Supply the real Matter.js 0.20.0 Shopify asset and verify its license/version before production.
2. Run the full manual checklist in `docs/manual-test-checklist.md` on mobile and tablet.
3. Test section-safe init/destroy in the target Shopify theme editor.
4. Keep all gameplay/reward changes frozen until the launch blocker is resolved and release QA is complete.
