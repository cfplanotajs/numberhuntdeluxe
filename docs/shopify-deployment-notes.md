# Shopify Deployment Notes (Prep)

## Recommended approach
- Use a dedicated Shopify page template (or one custom Liquid section) for the Quest Hub content.
- Keep the hub isolated in a single root wrapper: `#numberHunterHub` / `.number-hunter-hub`.

## Asset mapping
- `index.html` body content -> Shopify custom page template / custom Liquid section markup.
- `assets/number-hunter/number-hunter-hub.css` -> Shopify theme asset (e.g. `assets/number-hunter-hub.css`).
- `assets/number-hunter/js/data.js` -> theme asset JS file.
- `assets/number-hunter/js/math-engine.js` -> theme asset JS file.
- `assets/number-hunter/js/progress.js` -> theme asset JS file.
- `assets/number-hunter/js/number-hunter-hub.js` -> theme asset JS file (load last).
- `assets/number-hunter/js/games/*.js` -> theme asset JS files.
- Matter.js 0.20.0 -> missing from this workspace; manually upload as local Shopify/static asset before production launch.

## Script order (must preserve)
1. `data.js`
2. `math-engine.js`
3. `progress.js`
4. `matter.min.js` (Matter must load before Treasure Merge module)
5. game modules (`key-locks`, `treasure-merge`, `guardian-dash`, `even-odd-sort`, `quest-generator`)
6. `number-hunter-hub.js` last

## CSS containment notes
- Keep selectors scoped under `.number-hunter-hub` where practical.
- Avoid broad global selectors that can leak into theme UI.
- Preserve existing IDs used by JS bindings.

## Trust + safety positioning
- Parent-facing trust copy should remain visible: no login, no ads, no downloads, quick math practice.
- Keep child area free from external-link distractions.

## localStorage caveat
- Progress is local-browser only via key: `numberHunterDeluxeQuestProgress`.
- Clearing browser storage or switching devices will reset progress.

## Matter.js launch blocker
- Current dev build still references CDN Matter.js.
- `shopify/assets/matter.min.js` is missing from this workspace.
- Before Shopify/QR launch, manually add Matter.js 0.20.0 as the local `matter.min.js` asset referenced by the Shopify section.
- Do not use a placeholder or stub; Treasure Merge in Shopify remains blocked until the real asset exists.

## Pre-QR launch checks
- Confirm wrapper/root exists and styles are scoped to hub root.
- Confirm script order is preserved in template output.
- Confirm the local Matter.js asset exists as `matter.min.js` before Shopify QR launch.
- Confirm print buttons are utility-only and do not change progress.
- Confirm no direct reward bypass controls are present.
- Confirm no framework/build artifacts are introduced.


## Scaffold handoff files
- `shopify/sections/number-hunter-quest-hub.liquid`
- `shopify/templates/page.number-hunter-quest-hub.json`
- `shopify/README.md`


## Section-safe initialization
- Runtime exposes `window.NumberHunterQuestHub.init(root)` and `window.NumberHunterQuestHub.destroy(root)`.
- Static `index.html` auto-initializes after DOM readiness.
- Shopify theme editor section load/unload events are supported defensively for the Quest Hub root.
- Use `destroy(root)` before removing/replacing the section to stop active game sessions.

## Shopify asset handoff bundle
- `shopify/assets/` contains flattened copies of the current Quest Hub CSS and JavaScript files using the filenames referenced by the Liquid section.
- Development source remains `assets/number-hunter/`; refresh `shopify/assets/` copies whenever source assets change.
- `matter.min.js` is intentionally absent in this workspace and must be supplied as a local Shopify/static asset before production QR launch.

## Asset sync helpers
After changing source files in `assets/number-hunter/`, refresh and verify the Shopify handoff copies with:

```sh
node scripts/sync-shopify-assets.js
node scripts/check-shopify-asset-sync.js
```

These manual helpers use only Node built-ins. Matter.js remains intentionally excluded from source-to-Shopify sync and must be supplied separately as a launch asset.

## Release candidate audit

See `docs/release-candidate-audit.md` for the current feature-complete MVP status and the Shopify QR launch blocker for missing `shopify/assets/matter.min.js`.
