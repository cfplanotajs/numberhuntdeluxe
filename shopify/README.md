# Shopify Scaffold Handoff (Number Hunter Quest Hub)

This folder is an **additive scaffold** to help move the static Quest Hub into a Shopify theme later. It does not replace the static prototype.

## Files
- `shopify/sections/number-hunter-quest-hub.liquid`
- `shopify/templates/page.number-hunter-quest-hub.json`

## What to copy into Shopify theme
1. Copy the section file into `sections/`.
2. Copy the JSON template into `templates/`.
3. Upload CSS/JS files as theme assets using the expected filenames below.

## Asset mapping
| Current source file | Shopify asset filename |
|---|---|
| `assets/number-hunter/number-hunter-hub.css` | `number-hunter-hub.css` |
| `assets/number-hunter/js/data.js` | `number-hunter-data.js` |
| `assets/number-hunter/js/math-engine.js` | `number-hunter-math-engine.js` |
| `assets/number-hunter/js/progress.js` | `number-hunter-progress.js` |
| `assets/number-hunter/js/games/key-locks.js` | `number-hunter-key-locks.js` |
| `assets/number-hunter/js/games/treasure-merge.js` | `number-hunter-treasure-merge.js` |
| `assets/number-hunter/js/games/guardian-dash.js` | `number-hunter-guardian-dash.js` |
| `assets/number-hunter/js/games/even-odd-sort.js` | `number-hunter-even-odd-sort.js` |
| `assets/number-hunter/js/games/quest-generator.js` | `number-hunter-quest-generator.js` |
| `assets/number-hunter/js/number-hunter-hub.js` | `number-hunter-hub.js` |
| Matter.js 0.20.0 (external source) | `matter.min.js` |

## Script order (required)
1. data
2. math engine
3. progress
4. Matter.js
5. game modules
6. hub bootstrap last

## Matter.js launch blocker
`shopify/assets/matter.min.js` is missing from this workspace. Before QR production launch, manually add the real **Matter.js 0.20.0** asset as `matter.min.js` and keep Treasure Merge dependent on this local asset only. Do not use a placeholder or stub.

## localStorage and privacy note
- Progress uses local browser storage only (`numberHunterDeluxeQuestProgress`).
- No login, no account sync, no cloud storage.
- Clearing browser storage resets progress.

## Trust positioning reminder
Keep parent-facing trust note visible:
- no login
- no ads
- no downloads
- quick math practice sessions

## Manual QA before QR launch
- Confirm section renders with root wrapper `#numberHunterHub.number-hunter-hub`.
- Confirm script order is preserved.
- Confirm the real local Matter asset has been supplied and loads; until then, Shopify Treasure Merge is blocked.
- Confirm print actions do not modify progress.
- Confirm no reward bypass controls exist.
- Confirm no framework/build tooling files are introduced.

## Theme editor caveat
Use the JSON template on a dedicated page and avoid duplicating this section multiple times on the same page to prevent duplicate IDs/event bindings.


## Section-safe JavaScript API
- The hub exposes `window.NumberHunterQuestHub.init(root)` and `window.NumberHunterQuestHub.destroy(root)`.
- Static pages auto-initialize on `DOMContentLoaded`.
- Shopify theme editor `shopify:section:load` and `shopify:section:unload` events are handled defensively so preview reloads can init/destroy the section.
- Calling `init(root)` twice for the same root is safe and returns the existing instance.

## Shopify asset bundle
- `shopify/assets/` contains flattened copies of the current static source files for Shopify theme upload.
- Source-of-truth during development remains `assets/number-hunter/`; after changing those source files, refresh the copied files in `shopify/assets/`.
- `matter.min.js` is intentionally **missing in this workspace** and remains a QR launch blocker; manually supply Matter.js 0.20.0 before Shopify launch.
- Keep script order unchanged: data, math engine, progress, Matter.js, game modules, hub bootstrap last.

## Keeping Shopify assets in sync
Development source remains in `assets/number-hunter/`; Shopify handoff copies live in `shopify/assets/`.
After changing source assets, run these manual no-dependency helpers:

```sh
node scripts/sync-shopify-assets.js
node scripts/check-shopify-asset-sync.js
```

The sync scripts use only Node built-ins and intentionally do not create, overwrite, or require `shopify/assets/matter.min.js`; Matter.js remains a separately supplied launch asset.
