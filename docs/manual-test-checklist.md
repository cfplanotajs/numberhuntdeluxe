# Manual Test Checklist

## MVP Readiness Quick Order
- Smoke Test
- Reward Rules
- Activity Lifecycle
- Game-by-game Checks
- Treasure Cave
- Reset & Storage
- Mobile
- No-Framework Checks


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


## Quest style + quick answer feedback
- [ ] Confirm Guardian Quest style selector appears with Silly and Calm options.
- [ ] Confirm Silly style generates silly/active action prompts.
- [ ] Confirm Calm style generates calmer action prompts.
- [ ] Confirm wrong Quick Quest answers show immediate feedback.
- [ ] Confirm wrong Quick Quest answers do not award stars.
- [ ] Confirm correct Quick Quest answer still awards only one star.
- [ ] Confirm repeated taps after a correct answer do not award extra stars.


## Guardian Quest Generator polish
- [ ] Generate a silly quest and confirm active/silly action wording.
- [ ] Generate a calm quest and confirm calmer action wording.
- [ ] Confirm style difference is clearly visible.
- [ ] Generate a quest for each realm and confirm realm flavor appears.
- [ ] Generate quests at each difficulty and confirm math challenge changes by difficulty.
- [ ] Generate a 3-quest pack and confirm three readable quest cards render.
- [ ] Confirm generating quests does not award digital stars.
- [ ] Confirm generating quests does not unlock digital keys.
- [ ] Confirm Cave progress does not change from generated quests.
- [ ] Confirm reward bypass controls remain absent.


## MathEngine bounds (additionWithin10)
- [ ] Generate/play Jungle Quick Quests on Little Hunter.
- [ ] Generate/play Jungle Quick Quests on Number Adventurer.
- [ ] Generate/play Jungle Quick Quests on Master Hunter.
- [ ] Confirm additionWithin10 sums stay at 10 or below.
- [ ] Confirm choices still include the correct answer.
- [ ] Confirm explanations still render clearly.


## Guardian Dash MVP
- [ ] Start Guardian Dash from hub.
- [ ] Confirm selected realm appears in Guardian Dash.
- [ ] Confirm selected difficulty affects problem generation.
- [ ] Confirm answer gates display with tap-friendly size.
- [ ] Confirm correct answer advances and increments local score once.
- [ ] Confirm repeated taps after correct do not increment score again.
- [ ] Confirm incorrect answer shows feedback and no score increase.
- [ ] Confirm repeated wrong answers show explanation hint.
- [ ] Confirm run ends after 5 questions.
- [ ] Confirm Play Again starts a fresh run.
- [ ] Confirm switching realm/difficulty cleans active run.
- [ ] Confirm Treasure Merge still works afterward.
- [ ] Confirm Key Lock still works afterward.
- [ ] Confirm Guardian Dash awards no digital stars/keys.


## Timer cleanup regressions (Key Lock + Dash)
- [ ] Complete Key Lock or trigger a round transition.
- [ ] Immediately switch realm/difficulty/reset.
- [ ] Confirm stale Key Lock completion UI does not overwrite the new session.
- [ ] Confirm newly selected realm/difficulty remains visible.
- [ ] Confirm keys/stars still award normally through Key Lock.
- [ ] Start Guardian Dash and do not answer until runner reaches the end.
- [ ] Confirm the question is treated as missed with no score award.
- [ ] Confirm miss feedback appears and next question loads.
- [ ] Confirm final run still ends after 5 questions.
- [ ] Answer correctly before runner reaches end and confirm score increments once.
- [ ] Confirm repeated taps do not increase score.

## Layout and constraints
- [ ] Verify mobile/tablet readability and touch-friendly button sizes.
- [ ] Confirm no framework/build artifacts were added.


## Lazy-start active game sessions
- [ ] Load the page fresh.
- [ ] Confirm Treasure Merge mount is idle and no merge game is visibly running.
- [ ] Confirm Guardian Dash mount is idle and no dash timer is visibly running.
- [ ] Click **Start Treasure Merge** and confirm it starts only then.
- [ ] Click **Start Guardian Dash** and confirm it starts only then.
- [ ] Switch realm/difficulty during active Treasure Merge and confirm it stops and returns to idle placeholder.
- [ ] Switch realm/difficulty during active Guardian Dash and confirm it stops and returns to idle placeholder.
- [ ] Reset progress during active Treasure Merge/Guardian Dash and confirm both stop and return to idle placeholders.
- [ ] Confirm Key Lock still works after realm/difficulty changes and reset.
- [ ] Confirm Treasure Merge still awards capped stars only.
- [ ] Confirm Guardian Dash still awards no digital progress.


## One active looped game at a time
- [ ] Load page and confirm both looped games are idle.
- [ ] Start Guardian Dash.
- [ ] Then start Treasure Merge and confirm Guardian Dash stops/returns idle.
- [ ] Start Guardian Dash again and confirm Treasure Merge stops/returns idle.
- [ ] Repeat starts several times and confirm no duplicate canvases appear.
- [ ] Confirm no background Dash timer continues after switching.
- [ ] Reset progress and confirm both looped games return idle.
- [ ] Confirm Key Lock still works.


## MathEngine contract hardening
- [ ] Confirm active realms still generate valid Quick Quests.
- [ ] Confirm Key Lock still works for every realm.
- [ ] Confirm Guardian Dash still works for every realm.
- [ ] Confirm Guardian Quest Generator still works for every realm.
- [ ] Confirm unsupported skills are not silently converted to addition.
- [ ] In browser console, run `MathEngine.generateProblem({ skill: "counting", difficulty: "littleHunter" })` and confirm it throws `Unsupported MathEngine skill`.


## Guardian Dash reward cap
- [ ] Start Guardian Dash.
- [ ] Complete a run below the star goal and confirm no star is awarded.
- [ ] Complete a run at/above the star goal and confirm exactly 1 star is awarded.
- [ ] After earning a star, repeated taps or stale callbacks do not award more stars.
- [ ] Play Again starts a new reward-eligible run.
- [ ] Switch realm/difficulty during a run and confirm no stale reward is emitted.
- [ ] Reset progress during a run and confirm no stale reward is emitted.
- [ ] Start Treasure Merge while Dash is active and confirm Dash stops.
- [ ] Confirm Guardian Dash does not unlock realm keys.
- [ ] Confirm Cave remains key-based.
- [ ] Confirm Treasure Merge still awards stars only.
- [ ] Confirm reward bypass controls remain absent.

## Activity navigation flow
- [ ] Choose each realm and confirm activity cards stay visible for the selected realm.
- [ ] Select Quick Quest and answer a question.
- [ ] Select Key Lock and complete a key flow.
- [ ] Select Treasure Merge and confirm it stays idle until Start.
- [ ] Start Treasure Merge and confirm stars-only rewards.
- [ ] Select Guardian Dash and confirm Treasure Merge stops.
- [ ] Start Guardian Dash and confirm stars-only rewards.
- [ ] Select Guardian Quest and confirm Dash/Merge stop.
- [ ] Generate a quest and confirm no digital progress changes.
- [ ] Switch realm/difficulty and confirm looped games stop.
- [ ] Reset progress and confirm looped games stop.
- [ ] Confirm Cave remains key-based.
- [ ] Confirm no reward bypass controls are present.


## Activity-switch loop cleanup
- [ ] Start Treasure Merge, then select Guardian Dash activity card; confirm Treasure Merge stops and returns idle.
- [ ] Start Guardian Dash, then select Treasure Merge activity card; confirm Guardian Dash stops and returns idle.
- [ ] Start Guardian Dash, then select Quick Quest; confirm Dash stops and no delayed star is awarded.
- [ ] Start Treasure Merge, then select Guardian Quest; confirm Merge stops.
- [ ] Selecting Treasure Merge card does not auto-start the Matter loop.
- [ ] Selecting Guardian Dash card does not auto-start the Dash timer.
- [ ] Start buttons still work for both looped games.
- [ ] Only one looped game can run at a time.


## Treasure Cave reward room
- [ ] Reset progress and confirm Cave is locked at 0 / 6 keys.
- [ ] Confirm missing key checklist appears.
- [ ] Unlock one realm key via Key Lock and confirm checklist updates while Cave remains locked.
- [ ] Earn stars via Treasure Merge or Guardian Dash and confirm stars display but Cave remains locked.
- [ ] Unlock all 6 realm keys and confirm Cave unlocks.
- [ ] Confirm all six keys display as earned.
- [ ] Confirm total stars display in the reward room.
- [ ] Confirm certificate/reward message appears.
- [ ] Confirm Cave does not award any digital progress.
- [ ] Reset again and confirm Cave relocks.


## Little Hunter missing-number bounds
- [ ] Choose **Little Hunter** difficulty.
- [ ] Choose **Desert** and generate several Quick Quests.
- [ ] Confirm missing-number prompts stay within 10.
- [ ] Play Key Lock in Desert and confirm prompts stay within 10.
- [ ] Confirm answer choices include the correct answer.
- [ ] Confirm hints/explanations still reveal the missing number.


## Treasure Merge shared math-rule check
- [ ] Start Treasure Merge on Little Hunter and confirm small values (1/2/4) appear.
- [ ] Start Treasure Merge on Number Adventurer and confirm medium values (2/4/8) appear.
- [ ] Start Treasure Merge on Master Hunter and confirm higher values (including 16) can appear.
- [ ] Confirm matching numbers still merge correctly.
- [ ] Confirm score/star behavior did not change.


## Even/Odd Sort MVP
- [ ] Select Even/Odd Sort activity.
- [ ] Confirm selected realm appears.
- [ ] Confirm difficulty affects number range.
- [ ] Sort an even number correctly.
- [ ] Sort an odd number correctly.
- [ ] Wrong choice shows feedback and does not score.
- [ ] Repeated taps after correct do not double-score.
- [ ] Run ends after 10 items.
- [ ] Play Again starts fresh run.
- [ ] Switch activity during feedback and confirm no stale UI overwrite.
- [ ] Switch realm/difficulty and confirm current sort session stops/resets safely.
- [ ] Confirm no digital stars are awarded.
- [ ] Confirm no realm keys are unlocked.
- [ ] Confirm Cave progress does not change.
