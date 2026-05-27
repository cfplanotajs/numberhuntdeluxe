# Number Hunter Deluxe Quest Hub

Lightweight, mobile-first QR landing prototype for **Number Hunter Deluxe**. It extends the physical board game with short digital math quests, bonus Guardian Quests, and parent resources.

## Purpose

Build a safe, ad-free, no-login companion flow:

**Choose a Realm → Play a Quick Quest → Earn Stars / Keys / Gems → Unlock the Treasure Cave**

This repository intentionally focuses on a static architecture-first MVP scaffold.

## MVP Scope (Active)

Current scope includes:
- Activity Cards + focused Quest Stage layout (choose activity, then play)
- Realm hub structure and mobile-first UI shell
- Difficulty selector
- Shared math engine
- Local progress tracking with `localStorage`
- Key Lock Puzzles (realm-key activity)
- Treasure Merge (Matter.js, lazy-started, capped star rewards only)
- Guardian Dash (lightweight DOM/CSS/vanilla JS, lazy-started, capped star rewards only)
- Bonus Guardian Quest Generator
- Parent Zone content section

Guardian Dash and Treasure Merge award stars only (capped per run/session), do not unlock realm keys, and use no backend/framework tooling.

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
/assets/number-hunter/js/games/treasure-merge.js
/assets/number-hunter/js/games/guardian-dash.js
/assets/number-hunter/js/games/quest-generator.js
```

## Future Phases

- **Phase 2:** Even/Odd Critter Sort, Daily Quest, badges, certificates, Pattern Path
- **Phase 3:** Seasonal quests, board-play variants, optional parent-only growth features

## Notes

This project is intentionally **not** a React/Next/Vite application. It is a lightweight static prototype aligned to Shopify-friendly constraints.
