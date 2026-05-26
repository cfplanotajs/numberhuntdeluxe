# Number Hunter Deluxe Quest Hub

Lightweight, mobile-first QR landing prototype for **Number Hunter Deluxe**. It extends the physical board game with short digital math quests, bonus Guardian Quests, and parent resources.

## Purpose

Build a safe, ad-free, no-login companion flow:

**Choose a Realm → Play a Quick Quest → Earn Stars / Keys / Gems → Unlock the Treasure Cave**

This repository intentionally focuses on a static architecture-first MVP scaffold.

## MVP Scope (Current + Next)

Current commit includes:
- Realm hub structure and mobile-first UI shell
- Difficulty selector
- Shared math engine scaffold
- Local progress tracking with `localStorage`
- Key Lock puzzle placeholder module
- Guardian Quest generator placeholder module
- Parent Zone content section

Planned MVP additions include fully playable Treasure Merge and richer puzzle interactions.

## Tech Constraints

- Plain HTML, CSS, and vanilla JavaScript
- No React / Next.js / Vue / Svelte / Angular
- No TypeScript
- No Vite / build pipeline / bundlers
- No backend, database, auth, or accounts
- No analytics or child data collection

## Run Locally

No install needed.

1. Open `index.html` directly in a browser, or
2. Serve this folder with any static server.

## File Structure

```txt
/AGENTS.md
/README.md
/index.html
/assets/number-hunter/number-hunter-hub.css
/assets/number-hunter/js/data.js
/assets/number-hunter/js/math-engine.js
/assets/number-hunter/js/progress.js
/assets/number-hunter/js/number-hunter-hub.js
/assets/number-hunter/js/games/key-locks.js
/assets/number-hunter/js/games/quest-generator.js
```

## Future Phases

- **Phase 2:** Guardian Dash, Daily Quest, badges, certificates
- **Phase 3:** Seasonal quests, board-play variants, optional parent-only growth features

## Notes

This project is intentionally **not** a React/Next/Vite application. It is a lightweight static prototype aligned to Shopify-friendly constraints.
