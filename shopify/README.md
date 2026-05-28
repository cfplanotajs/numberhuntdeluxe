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

## Matter.js production TODO
Before QR production launch, upload **Matter.js 0.20.0** as local `matter.min.js` and keep Treasure Merge dependent on this local asset only.

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
- Confirm Matter local asset is uploaded and loads.
- Confirm print actions do not modify progress.
- Confirm no reward bypass controls exist.
- Confirm no framework/build tooling files are introduced.

## Theme editor caveat
Use the JSON template on a dedicated page and avoid duplicating this section multiple times on the same page to prevent duplicate IDs/event bindings.
