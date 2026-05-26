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

## Layout and constraints
- [ ] Verify mobile/tablet readability and touch-friendly button sizes.
- [ ] Confirm no framework/build artifacts were added.
