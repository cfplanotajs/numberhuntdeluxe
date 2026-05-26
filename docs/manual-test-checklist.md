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


## Progression integrity (no bypass controls)
- [ ] Confirm there are no visible **Earn Star** or **Earn Realm Key** buttons.
- [ ] Confirm stars cannot be directly farmed from child UI bypass controls.
- [ ] Confirm keys unlock through Key Lock completion.
- [ ] Confirm Cave progress remains tied to real gameplay.

## Volcano mixed skills
- [ ] Select **Volcano**.
- [ ] Generate several Quick Quests and confirm both additionWithin20 and subtractionWithin20 appear.
- [ ] Generate several Bonus Guardian Quests and confirm both addition and subtraction prompts appear.
- [ ] Confirm other realms still use their intended skill identity.


## Treasure Merge reward cap
- [ ] Start Treasure Merge.
- [ ] Reach the star threshold for the selected difficulty.
- [ ] Confirm exactly 1 star is awarded.
- [ ] Continue merging after threshold and confirm no extra stars are awarded in the same session.
- [ ] Click Play Again.
- [ ] Reach threshold again and confirm 1 new star can be awarded in the new session.
- [ ] Switch realm/difficulty after earning a star and confirm old session does not emit extra rewards.
- [ ] Reset progress and confirm stars reset.
- [ ] Confirm no Earn Star / Earn Realm Key bypass controls exist.


## Map and Cave progression
- [ ] Reset progress and confirm 0 / 6 keys.
- [ ] Confirm Treasure Cave shows locked state.
- [ ] Complete Key Lock in one realm.
- [ ] Confirm that realm card shows Key Earned.
- [ ] Confirm key count updates in Cave/progress summary.
- [ ] Confirm Cave remains locked until all 6 keys are earned.
- [ ] Earn a Treasure Merge star and confirm stars increase.
- [ ] Confirm stars alone do not unlock the Cave.
- [ ] Unlock all 6 realm keys and confirm Cave unlocks.
- [ ] Reset again and confirm Cave relocks and realm cards clear.

## Layout and constraints
- [ ] Verify mobile/tablet readability and touch-friendly button sizes.
- [ ] Confirm no framework/build artifacts were added.
