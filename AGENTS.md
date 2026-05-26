# AGENTS.md — Number Hunter Deluxe Quest Hub

## Mission

Build a lightweight, mobile-first QR landing experience for **Number Hunter Deluxe**, a kindergarten through 3rd grade math board game. The experience should extend the physical board game into a short, replayable, parent-approved digital companion.

This is **not** a generic math app, not a full edtech platform, and not a React/Next.js project.

The strategic objective is to make the Deluxe product feel bigger, more valuable, and more replayable by giving families:

- quick math mini-games,
- bonus Guardian Quests for the physical board game,
- light parent resources,
- a safe, ad-free, no-login experience,
- a branded continuation of the Number Hunter adventure.

The customer promise is:

> Scan to unlock bonus math adventures, quick quests, and parent resources that keep the Number Hunter fun going.

The child promise is:

> Choose a realm, solve math quests, earn stars and keys, and unlock the treasure cave.

---

## Hard Technical Constraints

### Do not create a React app

Do **not** use or introduce:

- React
- Next.js
- Vue
- Svelte
- Angular
- Remix
- Astro
- Vite
- TypeScript
- JSX/TSX
- npm build pipelines
- server-side rendering
- client-side SPA routing frameworks
- component libraries
- state management libraries
- authentication systems
- databases
- backend APIs unless explicitly requested

If a future task appears to require one of these, stop and propose a lightweight alternative first.

### Approved frontend stack

Use only:

- HTML / Liquid if embedded in Shopify
- vanilla JavaScript
- Alpine.js for simple state, modals, and UI toggles
- Tailwind CSS if already available or explicitly included
- regular CSS when simpler
- Matter.js only for the physics-based merge game
- JSON files or plain JS objects for content data
- `localStorage` for simple progress persistence

The default delivery target is a **Shopify landing page/custom page section**, not a standalone web app.

### Dependency policy

Do not add dependencies unless the dependency is clearly justified and approved.

Allowed by default:

- Alpine.js
- Tailwind CSS
- Matter.js for the Treasure Merge game only

Do not add analytics, tracking, animation, audio, routing, or UI libraries without approval.

### No app shell bloat

Do not scaffold a project. Do not create a full app architecture. Do not introduce package managers, compilers, bundlers, or CI unless explicitly asked.

Prefer:

```txt
/assets/number-hunter/
  number-hunter-hub.css
  number-hunter-hub.js
  data.js
  math-engine.js
  progress.js
  games/
    treasure-merge.js
    guardian-dash.js
    key-locks.js
    quest-generator.js
```

If this is implemented inside Shopify, prefer theme assets and one custom page/section template.

---

## Product Context

Number Hunter Deluxe has a physical adventure map with six main areas:

1. Jungle
2. Frozen Land
3. Ocean
4. Rainbow Mountains
5. Desert
6. Volcano

The board also includes a final Cave / Finish / Treasure area.

The QR experience must mirror this map-based structure. Do not build the hub as a generic menu of unrelated games.

Correct product structure:

```txt
Choose a Realm → Play a Quick Quest → Earn Stars / Keys / Gems → Unlock the Treasure Cave
```

Incorrect structure:

```txt
Arcade Games → Math Games → Logic Games → Random Resources
```

The digital experience should feel like the same Number Hunter world continues beyond the box.

---

## Audience

Primary users:

- children ages 5–8,
- kindergarten through 3rd grade,
- parents who bought the physical Number Hunter Deluxe board game.

Secondary users:

- teachers,
- homeschool parents,
- grandparents,
- gift buyers.

The child UX must assume:

- limited reading ability,
- short attention span,
- touch-first interaction,
- mobile/tablet usage,
- need for immediate feedback,
- preference for motion, characters, rewards, and replay.

The parent UX must communicate:

- educational value,
- no ads,
- no login,
- no downloads,
- short sessions,
- math confidence,
- safe screen time,
- connection to the physical game.

---

## Core Positioning

Use this positioning across UX and copy:

**Number Hunter Deluxe Quest Hub**  
A safe, ad-free bonus math adventure with quick mini-games, extra Guardian Quests, and parent resources that extend the physical board game.

Do not frame it as:

- an app,
- a video game platform,
- a learning management system,
- a worksheet library,
- a screen-time replacement,
- a general kids arcade.

Good CTA language:

- Scan for Bonus Math Adventures
- Unlock Extra Guardian Quests
- Play Quick Math Challenges
- Continue the Number Hunter Adventure
- Earn Keys and Unlock the Treasure Cave

Avoid CTA language like:

- Download the app
- Play free games online
- Get unlimited screen time
- Join now
- Create an account

---

## MVP Scope

The MVP should include:

1. Realm map landing screen
2. Difficulty selector
3. Treasure Merge game
4. Key Lock Puzzles game
5. Bonus Guardian Quest Generator
6. Parent Resources page
7. Local progress tracking with `localStorage`

Do not build more than this for the MVP unless requested.

### Phase 2 candidates

After MVP stability:

1. Guardian Dash game
2. Daily Quest
3. Badge collection
4. Printable certificate
5. More realm skins
6. More quest packs

### Phase 3 candidates

Later expansion:

1. seasonal quests
2. downloadable challenge cards
3. “play with the board” mode
4. product cross-sells on parent-only pages
5. optional email capture on parent-only pages

---

## Realm Structure

Each realm should have a learning identity. This keeps the hub educationally coherent while still feeling like an adventure.

| Realm | Main Skill | Gameplay Tone |
| --- | --- | --- |
| Jungle | Counting, number recognition, simple addition | friendly starter zone |
| Frozen Land | Subtraction | ice melting / taking away |
| Ocean | Even / odd, sorting, visual grouping | bubbles, sea creatures, grouping |
| Rainbow Mountains | Make 10, doubles, number bonds | colorful patterns and bridges |
| Desert | Missing numbers, equations, comparison | puzzle gates and ancient locks |
| Volcano | Mixed addition/subtraction, speed challenges | high-energy final challenge |
| Cave / Treasure | Rewards, badges, bonus quests | completion payoff |

The Cave is not a normal realm. It is the reward zone.

---

## Hub UX

Default flow:

1. Child scans QR code.
2. Landing page opens with a simple branded hero.
3. Child or parent taps **Start Quest**.
4. Child selects difficulty.
5. Child sees the six-realm map.
6. Child taps a realm.
7. Child chooses one available activity.
8. Child earns stars, keys, gems, or badges.
9. Progress unlocks the Treasure Cave.

Keep copy extremely short in the child-facing area.

Good child-facing labels:

- Start
- Choose a Realm
- Play Quest
- Earn a Key
- Try Again
- Great Job!
- Unlock Cave
- Parent Zone

Avoid long paragraphs in the child UI.

---

## Difficulty Levels

Use three clear levels:

### Little Hunter

For younger players and kindergarten-level practice.

Skills:

- counting 1–10,
- number recognition,
- bigger / smaller,
- simple addition within 10,
- even / odd exposure.

### Number Adventurer

For 1st grade and confident kindergarten players.

Skills:

- addition within 20,
- subtraction within 20,
- make 10,
- doubles,
- simple missing numbers.

### Master Hunter

For advanced 1st grade through 3rd grade.

Skills:

- mixed addition and subtraction,
- missing numbers,
- true/false equations,
- skip counting,
- simple groups / arrays,
- faster challenge pacing.

The selected level should influence all games through the shared math engine.

---

## Math Engine Requirements

Create one shared math generator. Do not hardcode separate problem logic inside every game.

The math engine should support:

- counting,
- number recognition,
- bigger / smaller,
- addition within 10,
- subtraction within 10,
- addition within 20,
- subtraction within 20,
- make 10,
- doubles,
- even / odd,
- missing numbers,
- true / false equations,
- skip counting,
- early multiplication as groups / arrays.

Preferred API shape:

```js
const problem = MathEngine.generate({
  skill: "additionWithin20",
  difficulty: "numberAdventurer",
  format: "multipleChoice",
  choices: 3
});
```

Example output:

```js
{
  prompt: "9 + 4 = ?",
  answer: 13,
  choices: [11, 13, 15],
  explanation: "9 + 4 makes 13.",
  skill: "additionWithin20"
}
```

Keep it data-driven and testable.

---

## Game Engine 1: Treasure Merge

This is the flagship replay game.

### Concept

A Suika-style merge game where numbered realm objects drop into a play area. Compatible numbers merge into bigger treasures.

### Realm skins

Use the same mechanic with different assets:

- Jungle: fruit merge
- Frozen Land: snowball merge
- Ocean: bubble merge
- Rainbow Mountains: crystal merge
- Desert: gem merge
- Volcano: lava rock merge

### Modes

Support simple modes first:

1. Match Mode  
   Same number merges with same number.

2. Doubles Mode  
   Example: 4 + 4 = 8.

3. Make 10 Mode  
   Example: 7 and 3 merge into 10.

4. Make 20 Mode  
   Later expansion for older kids.

5. Even/Odd Bonus  
   Optional feedback layer where even and odd results trigger different visual effects.

### Implementation constraints

Use Matter.js only for this game.

Do not overbuild physics. Keep it stable and mobile-friendly.

Hard limits:

- short sessions,
- clear restart button,
- large touch targets,
- simple collision logic,
- no complex particle systems,
- no heavy canvas effects,
- no leaderboard.

---

## Game Engine 2: Key Lock Puzzles

This is the parent-approved learning anchor.

### Concept

The child drags number tiles into a lock to make an equation true.

Examples:

```txt
8 + __ = 13
14 - __ = 9
6 + 4 = __
7 + 2 = 2 + __
12 is even / odd
```

### Realm skins

- Jungle: temple door
- Frozen Land: frozen lock
- Ocean: treasure chest
- Rainbow Mountains: rainbow bridge
- Desert: pyramid gate
- Volcano: stone door

### Implementation constraints

Use vanilla drag/tap interactions. Make sure it works on touch devices.

Provide feedback:

- correct: key unlocks,
- incorrect: gentle shake and hint,
- after repeated errors: show visual support or reduce choices.

Do not make failure punitive.

---

## Game Engine 3: Guardian Dash

This is Phase 2 unless specifically requested for MVP.

### Concept

The character runs toward multiple answer gates. The child taps the correct answer before reaching the gate.

Example:

```txt
9 + 4 = ?
Gates: 11 / 13 / 15
```

### Realm skins

- Jungle: jump across logs
- Frozen Land: hop across ice blocks
- Ocean: swim through bubbles
- Rainbow Mountains: climb color paths
- Desert: choose canyon paths
- Volcano: dodge lava

### Implementation constraints

This should be a simple DOM/canvas game. Do not use a platformer engine.

Keep rounds short: 30–90 seconds.

---

## Bonus Guardian Quest Generator

This is a high-priority feature because it extends the physical board game.

### Concept

A parent or child can generate extra physical-game challenges using the Number Hunter world.

Inputs:

- difficulty level,
- skill,
- realm,
- calm or silly challenge style.

Output:

- one short challenge card,
- one math task,
- one physical/silly action,
- one reward instruction.

Example:

```txt
Ice Guardian Quest

Solve 11 - 4.
Then freeze like an ice statue for 5 seconds.
If you solve it correctly, earn the key!
```

Another example:

```txt
Jungle Guardian Quest

Find two numbers that make 10.
Then roar like a tiny tiger.
If you solve it correctly, move ahead 2 spaces!
```

The generator should be template-driven. Do not call AI APIs in production.

Use local arrays of templates, skills, realm names, and action prompts.

---

## Parent Resources

The parent area should be clearly separate from the child play area.

Include lightweight content such as:

- How to use Number Hunter Deluxe for 5-minute math practice
- How to choose the right difficulty
- Addition and subtraction tips
- Even/odd explanation
- Printable-style bonus challenge ideas
- “Play with the board” variants
- Screen-time positioning: short, purposeful, ad-free practice

The parent area may contain product links or email capture later, but the child play area must not.

---

## Progress and Rewards

Use `localStorage`.

Track only lightweight, non-sensitive state.

Allowed:

```js
{
  selectedDifficulty: "numberAdventurer",
  stars: 12,
  keys: {
    jungle: true,
    frozen: false,
    ocean: false,
    rainbow: false,
    desert: false,
    volcano: false
  },
  badges: ["jungle-starter", "make-10-master"],
  lastPlayedAt: "2026-05-26"
}
```

Do not collect:

- child name,
- age,
- email,
- location,
- school,
- photos,
- voice,
- account credentials,
- personal data.

Do not create login or cloud sync.

---

## Safety and Trust Requirements

The product must feel parent-safe.

Requirements:

- no ads,
- no account creation,
- no public leaderboard,
- no chat,
- no user-generated content,
- no autoplaying endless feed,
- no dark-pattern streak pressure,
- no in-app purchases,
- no external links inside the child play area,
- no child data collection,
- no social sharing from the child area.

Session design:

- default games should be short,
- encourage “play again” without aggressive addiction patterns,
- parent resources should explain the educational value.

---

## Visual Direction

The hub should feel like the physical Number Hunter Deluxe board.

Creative principles:

- bright,
- adventurous,
- playful,
- high-energy,
- readable on tablet,
- simple child-facing UI,
- chunky buttons,
- large tap areas,
- realm-based colors,
- stars, keys, gems, and treasure as rewards.

Do not introduce a new visual universe. The digital hub should feel like a continuation of the board.

If final artwork is unavailable, use temporary simple shapes and labels instead of overbuilding placeholder art.

---

## Copy Guidelines

Child-facing copy:

- short,
- direct,
- energetic,
- easy to read,
- minimal sentence length,
- concrete verbs.

Good:

```txt
Choose a Realm
Earn a Key
Solve to Unlock
Great Job!
Try Again
```

Avoid:

```txt
Select from the following educational activities to improve your arithmetic fluency.
```

Parent-facing copy:

- practical,
- benefit-led,
- clear educational value,
- no exaggerated claims.

Good:

```txt
Use these quick quests for 5-minute addition and subtraction practice between full board game sessions.
```

Avoid:

```txt
This revolutionary platform will transform your child's mathematical future.
```

---

## Accessibility and UX Requirements

Design for mobile and tablet first.

Minimum requirements:

- large touch targets,
- high contrast text,
- readable font sizes,
- no tiny draggable elements,
- reduced-motion friendly where practical,
- clear visual feedback,
- keyboard support where easy,
- simple fallback when audio is off,
- instructions visible without relying only on sound.

Do not make the experience dependent on sound.

---

## Performance Requirements

Keep the page light.

Targets:

- fast load on mobile,
- avoid large image bundles,
- lazy-load game assets where possible,
- avoid heavy animations,
- avoid unnecessary JS,
- do not ship unused frameworks,
- keep Matter.js isolated to Treasure Merge.

If implementing in Shopify, avoid breaking theme performance.

---

## Data Organization

Prefer data-driven content.

Example structure:

```js
const REALMS = [
  {
    id: "jungle",
    name: "Jungle",
    skillFocus: ["counting", "numberRecognition", "additionWithin10"],
    reward: "Jungle Key"
  },
  {
    id: "frozen",
    name: "Frozen Land",
    skillFocus: ["subtractionWithin10", "subtractionWithin20"],
    reward: "Ice Key"
  }
];
```

Store quest templates separately from game logic.

Do not hardcode copy directly inside interaction handlers unless it is purely UI feedback.

---

## Suggested File Responsibilities

### `number-hunter-hub.js`

Owns:

- Alpine initialization,
- hub state,
- realm selection,
- modal visibility,
- game launch routing,
- parent/child section toggles.

Should not contain heavy game logic.

### `math-engine.js`

Owns:

- problem generation,
- answer choice generation,
- difficulty settings,
- skill configuration,
- simple validation helpers.

### `progress.js`

Owns:

- `localStorage` read/write,
- default progress state,
- reset progress function,
- reward unlock helpers.

### `data.js`

Owns:

- realm configuration,
- reward labels,
- quest templates,
- silly action prompts,
- parent resource links/copy.

### `games/treasure-merge.js`

Owns:

- Matter.js setup,
- merge rules,
- scoring,
- restart logic,
- game cleanup.

### `games/key-locks.js`

Owns:

- lock puzzle rendering,
- answer tile interactions,
- validation,
- feedback.

### `games/guardian-dash.js`

Phase 2.

Owns:

- moving challenge loop,
- answer gates,
- round timing,
- scoring.

### `games/quest-generator.js`

Owns:

- template selection,
- difficulty mapping,
- random challenge generation,
- optional print-friendly output.

---

## Implementation Rules for Codex

When modifying code:

1. Prefer the smallest useful change.
2. Preserve the lightweight architecture.
3. Do not introduce frameworks.
4. Do not scaffold a new app.
5. Do not rewrite working modules without a clear reason.
6. Keep game logic separate from UI shell logic.
7. Keep math generation centralized.
8. Keep parent and child flows separate.
9. Keep data collection at zero unless explicitly approved.
10. Keep the experience mobile-first.

Before adding any dependency, explain why vanilla JS / Alpine.js is insufficient.

Before expanding scope, check whether the feature belongs in MVP, Phase 2, or Phase 3.

---

## Anti-Scope-Creep Guardrails

Do not build:

- accounts,
- profiles,
- avatars requiring login,
- online multiplayer,
- backend saves,
- admin panels,
- dashboards,
- public leaderboards,
- AI-generated quests,
- payment flows,
- video streaming,
- complex cutscenes,
- full curriculum management,
- teacher classroom tools,
- app-store wrappers,
- push notifications,
- service-worker offline app shell,
- real-time analytics dashboards.

These can be discussed later but are out of scope for MVP.

---

## Definition of Done for MVP

MVP is done when:

- user can open the hub page on mobile,
- user can choose difficulty,
- user can choose a realm,
- user can play Treasure Merge,
- user can play Key Lock Puzzles,
- user can generate a Bonus Guardian Quest,
- progress saves locally,
- the Cave/Treasure area unlocks after defined progress,
- parent resources are available in a clearly separated section,
- no React/Next/Vite/build system is present,
- no account, backend, or child data collection exists,
- code is readable and modular,
- the experience feels like Number Hunter Deluxe, not a generic math app.

---

## Review Checklist

Before finalizing any implementation, verify:

- [ ] No React, Next.js, Vue, Svelte, Angular, Remix, Astro, or Vite was added.
- [ ] No npm build system was introduced unless explicitly approved.
- [ ] All games use the shared math engine.
- [ ] The six realms match the physical board.
- [ ] The Cave acts as a reward zone.
- [ ] The child area has no external links.
- [ ] The parent area is separate.
- [ ] Progress uses only `localStorage`.
- [ ] No child personal data is collected.
- [ ] UI is mobile-first.
- [ ] Buttons are large and touch-friendly.
- [ ] The MVP does not include Phase 2/3 scope unless requested.
- [ ] Copy is short and child-friendly.
- [ ] Parent copy explains educational value clearly.
- [ ] The project still feels lightweight and maintainable.

---

## North Star

This project should make parents think:

> “This game gives us more value than expected.”

It should make kids think:

> “I want to unlock one more key.”

It should make the Deluxe version feel like a complete adventure system without creating technical debt or turning a Shopify QR page into an unnecessary app.
