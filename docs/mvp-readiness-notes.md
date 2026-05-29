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
- Even/Odd Sort awards capped stars only
- Quick Quest awards stars
- Guardian Quest generation changes no digital progress
- Treasure Cave awards no progress
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
- Shopify QR launch is blocked until the real Matter.js 0.20.0 asset is manually supplied as `shopify/assets/matter.min.js` or an equivalent Shopify theme asset referenced by the Liquid section.
- The static prototype can still use its current CDN Matter.js setup for development review.
- Do not use a placeholder or stub for Matter.js.
