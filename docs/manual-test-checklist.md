# Manual Test Checklist — Commit 2+ Hotfix (Key Lock + Reset State)

## Core startup
- [ ] Open `index.html` directly in a browser.
- [ ] Confirm page loads without build tools or server requirements.

## Difficulty selection
- [ ] Select **Little Hunter** and verify puzzles stay easy.
- [ ] Select **Number Adventurer** and verify broader number range.
- [ ] Select **Master Hunter** and verify harder/more choices where applicable.

## Realm selection
- [ ] Select Jungle and verify addition-focused puzzle style.
- [ ] Select Frozen Land and verify subtraction-focused puzzle style.
- [ ] Select Ocean and verify even/odd puzzle style.
- [ ] Select Rainbow Mountains and verify make-10 puzzle style.
- [ ] Select Desert and verify missing-number puzzle style.
- [ ] Select Volcano and verify mixed addition/subtraction within 20.

## Key Lock gameplay
- [ ] Verify lock game shows realm name, lock title, prompt, answer choices, feedback, and round progress.
- [ ] Verify wrong answer shows gentle retry feedback.
- [ ] Verify repeated wrong attempts show explanation hint.
- [ ] Verify correct answer gives positive feedback and allows moving to next lock.
- [ ] Verify 3 correct locks unlock the selected realm key.

## Progress and cave
- [ ] Verify each correct lock awards one star.
- [ ] Verify progress summary updates after stars/keys.
- [ ] Verify cave status updates when enough keys are unlocked.
- [ ] Verify reset progress clears stars/keys and relocks cave.

## Reset hotfix checks
- [ ] Unlock at least one realm key.
- [ ] Click **Reset Progress**.
- [ ] Confirm all realm keys are locked again.
- [ ] Confirm stars reset to 0.
- [ ] Confirm Treasure Cave returns to locked state.
- [ ] Confirm selected difficulty and displayed highlighted difficulty match after reset.
- [ ] Confirm newly mounted Key Lock rounds use reset/default difficulty.


## Quick Quest reward regression
- [ ] Answer a Quick Quest correctly.
- [ ] Tap the same correct Quick Quest answer multiple times.
- [ ] Confirm stars increase only once for that solved problem.
- [ ] Generate/start a new Quick Quest problem.
- [ ] Confirm a new correct answer awards one new star.


## Storage-restricted behavior
- [ ] In a browser mode or setting that blocks localStorage (if available), attempt to solve a Quick Quest.
- [ ] Confirm interaction does not crash even if progress cannot persist.
- [ ] Confirm this scenario is treated as non-persistent progress after refresh.

## Reset difficulty sync regression
- [ ] Start from **Master Hunter** (or Number Adventurer), then click **Reset Progress**.
- [ ] Confirm displayed selected difficulty matches reset/default difficulty.
- [ ] Confirm Key Lock rounds use the reset/default difficulty.
- [ ] Confirm Quick Quest prompt/choices regenerate and match reset/default difficulty.


## Missing-value hint clarity
- [ ] Choose **Rainbow Mountains**.
- [ ] Answer a Key Lock puzzle incorrectly twice.
- [ ] Confirm the hint reveals the missing number for make-10 prompts.
- [ ] Choose **Desert**.
- [ ] Answer a Key Lock puzzle incorrectly twice.
- [ ] Confirm the hint reveals the missing number for missing-number prompts.


## Treasure Merge foundation
- [ ] Confirm Matter.js loads and Treasure Merge starts from the hub.
- [ ] Confirm selected realm name appears in Treasure Merge.
- [ ] Confirm selected difficulty changes starting drop values.
- [ ] Drop objects and confirm collisions occur in bounded play area.
- [ ] Confirm matching numbers merge into doubled value.
- [ ] Confirm merge math message appears (example: 4 + 4 = 8).
- [ ] Confirm score increases on merges.
- [ ] Confirm Play Again restarts the game.
- [ ] Confirm switching realm/difficulty and restarting does not leave duplicate canvases.
- [ ] Confirm game-over state appears when pile is full.
- [ ] Confirm Key Lock still works after playing Treasure Merge.


## Treasure Merge runtime stability
- [ ] Start Treasure Merge and perform several drops.
- [ ] Confirm game speed feels normal (no double-speed stepping).
- [ ] Click Play Again several times.
- [ ] Confirm only one Treasure Merge canvas/game is active at a time.
- [ ] After Play Again, switch realm/difficulty.
- [ ] Confirm the old session is cleaned and only the latest session remains active.
- [ ] Create a stack where three same-value bodies interact (if possible).
- [ ] Confirm one source body does not merge/score twice in the same collision cycle.
- [ ] Confirm score increases only once per valid merge.
- [ ] Confirm Key Lock still works after Treasure Merge restarts/switches.


## Treasure Merge mobile UX
- [ ] Play on a narrow mobile viewport.
- [ ] Play on a tablet-width viewport.
- [ ] Tap the play area/top area to set drop position.
- [ ] Confirm Drop button works reliably.
- [ ] Confirm rapid taps do not create accidental multi-drops.
- [ ] Confirm moving number labels stay readable.
- [ ] Confirm selected realm skin styling appears.
- [ ] Confirm difficulty changes starting values/spawn feel.
- [ ] Confirm Play Again still works repeatedly.
- [ ] Confirm realm/difficulty switching does not duplicate canvases.
- [ ] Confirm Key Lock still works after Treasure Merge.

## Layout and constraints
- [ ] Verify mobile/tablet readability and touch-friendly button sizes.
- [ ] Confirm no framework/build artifacts were added.
