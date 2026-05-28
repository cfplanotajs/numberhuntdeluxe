# MVP Readiness Notes

## Current MVP Scope
- Realm map, difficulty, activity cards, focused quest stage
- Quick Quest, Key Lock, Treasure Merge, Guardian Dash, Even/Odd Sort, Bonus Guardian Quest
- Treasure Cave reward room
- localStorage progress only

## Reward Rules (Confirmed)
- Key Lock unlocks realm keys
- Treasure Merge awards capped stars only
- Guardian Dash awards capped stars only
- Guardian Quest generation changes no digital progress
- Treasure Cave unlock is key-based only

## Known Limitations
- No automated test suite yet (manual QA checklist is required)
- Print actions use `window.print()` only
- No account sync/backups (local browser storage only)

## Recommended Next Candidates
- Daily Quest
- Pattern Path
- Badge collection (after reward audits)

## Production Blockers
- None critical found in this pass; continue manual cross-device verification before release.

- Matter.js is still loaded from CDN in `index.html`; before Shopify/QR production launch, upload Matter.js 0.20.0 as a local static asset and switch the script path.
