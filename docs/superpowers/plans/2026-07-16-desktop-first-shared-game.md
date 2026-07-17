# Desktop-First Shared Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Start as an interactive desktop pet, persist and synchronize one game state across Electron windows, and restrict the current game to three gold-only PNG pet families.

**Architecture:** Extract a pure game-state reducer and roster definition that Electron main can persist and broadcast. Renderers consume snapshots through a small preload API; the management Zustand store becomes a view/cache that dispatches every existing game mutation through IPC, while the desktop overlay reads the same active team pet and dispatches interaction commands.

**Tech Stack:** Electron 43, React 19, Zustand 5, TypeScript, Vitest.

---

## File Structure

- Create: `src/core/roster.ts` — the three supported species, their classifications, and gold-only selection helpers.
- Create: `src/core/gameState.ts` — serializable state defaults, sanitization, and pure desktop/game actions.
- Create: `src/core/roster.test.ts` — supported roster, classification, and gold-only tests.
- Create: `src/core/gameState.test.ts` — sanitization, interaction, discard, and evolution protocol tests.
- Create: `electron/gameStateService.ts` — persisted authoritative-state service and change subscription.
- Create: `electron/gameStateService.test.ts` — isolated service broadcast and persistence tests where Electron-free seams permit it.
- Modify: `src/core/data/species.ts` — export only the three supported records through public lookup APIs.
- Modify: `src/core/gacha.ts` — generate only gold eggs from the supported roster.
- Modify: `src/core/evolution.ts` — allow normal Ultimate-to-Super Ultimate progression.
- Modify: `src/store/gameStore.ts` — hydrate from snapshots and route renderer mutations through the shared bridge while retaining browser fallback.
- Modify: `electron/main.ts` — lazy management window, hide-on-close lifecycle, IPC handlers, and snapshot broadcasts.
- Modify: `electron/preload.ts` — typed read, dispatch, subscribe, and Open-management APIs.
- Modify: `src/desktop/DesktopPet.tsx` — replace hard-coded starter with shared active pet and real actions.
- Modify: `src/pages/PokedexPage.tsx` — current roster filters.
- Modify: `src/pages/EggPage.tsx` — discard confirmation and hatching guard.
- Modify: `src/components/pet/PetDisplay.tsx` — explicitly map the three roster IDs to dragon/spirit/beast body folders.

### Task 1: Define the Three-Species Roster and Fix Evolution

**Files:**
- Create: `src/core/roster.ts`
- Create: `src/core/roster.test.ts`
- Modify: `src/core/data/species.ts`
- Modify: `src/core/evolution.ts`

- [ ] **Step 1: Write failing roster and evolution tests**

```ts
import { describe, expect, it } from 'vitest'
import { SUPPORTED_SPECIES_IDS, getRosterCategory, pickGoldSpecies } from './roster'
import { checkEvolution } from './evolution'

describe('current roster', () => {
  it('contains exactly dragon, spirit, and beast and always picks a gold species', () => {
    expect(SUPPORTED_SPECIES_IDS).toHaveLength(3)
    expect(getRosterCategory(SUPPORTED_SPECIES_IDS[0])).toBe('dragon')
    expect(new Set(Array.from({ length: 20 }, () => pickGoldSpecies(() => 0.5)))).toHaveLength(1)
  })

  it('allows ultimate to super ultimate at the normal maximum requirements', () => {
    const result = checkEvolution({ stage: 'ultimate', level: 99, affection: 200, growth: 100 } as any)
    expect(result).toEqual({ canEvolve: true, nextStage: 'superUltimate' })
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm.cmd test -- src/core/roster.test.ts`

Expected: FAIL because `./roster` does not exist and the Ultimate evolution remains blocked.

- [ ] **Step 3: Add the explicit roster and normal evolution rule**

Create `src/core/roster.ts` with the public contract:

```ts
import type { PetSpecies, Rarity } from './types'

export const ROSTER_CATEGORIES = ['dragon', 'spirit', 'beast'] as const
export type RosterCategory = typeof ROSTER_CATEGORIES[number]
export const SUPPORTED_SPECIES_IDS = ['flame_drake', 'mirage_spirit', 'judgment_beast'] as const
export const FIXED_BIRTH_RARITY: Rarity = 'gold'

export function getRosterCategory(speciesId: string): RosterCategory | undefined { /* exact ID mapping */ }
export function isSupportedSpecies(speciesId: string): boolean { /* ID membership */ }
export function pickGoldSpecies(random: () => number = Math.random): string { /* index clamped to 0..2 */ }
export function sanitizeSpeciesList(species: PetSpecies[]): PetSpecies[] { /* only supported IDs */ }
```

Replace public `ALL_SPECIES` construction in `src/core/data/species.ts` with exactly the three manually defined records identified above; remove the auto-generated and SVG-only records from public exports without deleting source history. In `checkEvolution`, remove the `nextStage === 'superUltimate'` early return; the existing requirement record already defines `99 / 200 / 100`.

- [ ] **Step 4: Run focused tests**

Run: `npm.cmd test -- src/core/roster.test.ts`

Expected: PASS with roster and Ultimate evolution assertions green.

- [ ] **Step 5: Commit**

```powershell
git add src/core/roster.ts src/core/roster.test.ts src/core/data/species.ts src/core/evolution.ts
git commit -m "feat: restrict roster to three gold pet families"
```

### Task 2: Add Pure Persisted-State Actions

**Files:**
- Create: `src/core/gameState.ts`
- Create: `src/core/gameState.test.ts`
- Modify: `src/core/gacha.ts`

- [ ] **Step 1: Write failing pure-state tests**

```ts
import { describe, expect, it } from 'vitest'
import { createDefaultGameState, reduceGameAction, sanitizeGameState } from './gameState'

describe('shared game state', () => {
  it('sanitizes unsupported saved pets and eggs', () => {
    const state = sanitizeGameState({ ...createDefaultGameState(), pets: [{ id: 'old', speciesId: 'ice_wolf' }], eggs: [{ id: 'e', speciesId: 'ice_wolf', rarity: 'blue' }] })
    expect(state.pets).toEqual([])
    expect(state.eggs).toEqual([])
  })

  it('discards a requested egg without refund', () => {
    const initial = { ...createDefaultGameState(), eggs: [{ id: 'e1', rarity: 'gold', speciesId: 'flame_drake', hatchProgress: 0, obtainedAt: 1 }] }
    expect(reduceGameAction(initial, { type: 'discardEgg', eggId: 'e1' }).eggs).toEqual([])
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm.cmd test -- src/core/gameState.test.ts`

Expected: FAIL because the shared state module is absent.

- [ ] **Step 3: Implement a serializable action protocol**

Create `src/core/gameState.ts` with:

```ts
export type GameAction =
  | { type: 'pullEgg' }
  | { type: 'pet'; petId: string }
  | { type: 'wash'; petId: string }
  | { type: 'play'; petId: string }
  | { type: 'feed'; petId: string; foodId: 'basic_feed' }
  | { type: 'discardEgg'; eggId: string }
  | { type: 'hatchEgg'; eggId: string }
  | { type: 'tryEvolve'; petId: string }
  | { type: 'moveToTeam'; petId: string }
  | { type: 'moveToStorage'; petId: string }
  | { type: 'sellPet'; petId: string }
  | { type: 'buyFood'; foodId: string }
  | { type: 'buyItem'; itemId: string }
  | { type: 'buyConsumable'; itemId: string }
  | { type: 'useConsumable'; petId: string; consumableId: string }
  | { type: 'startBattle' }
  | { type: 'battleAction'; action: BattleAction }
  | { type: 'fleeBattle' }
  | { type: 'endBattle' }
  | { type: 'startExpedition'; theme?: string }
  | { type: 'moveToNode'; nodeId: string }
  | { type: 'endExpedition' }

export function createDefaultGameState(): PersistedGameState
export function sanitizeGameState(value: unknown): PersistedGameState
export function reduceGameAction(state: PersistedGameState, action: GameAction): PersistedGameState
```

`sanitizeGameState` keeps only supported species, forces every retained egg and newly hatched pet to gold, removes obsolete Pokédex keys, and preserves valid resources. `reduceGameAction` performs no side effects and returns an unchanged state for invalid action arguments. It delegates the existing mechanics for gacha, shop, team, storage, battle, expedition, experience, consumables, and evolution so their current gameplay rules survive the migration. Route egg creation in `src/core/gacha.ts` through `FIXED_BIRTH_RARITY` and `pickGoldSpecies`.

- [ ] **Step 4: Run the focused test**

Run: `npm.cmd test -- src/core/gameState.test.ts`

Expected: PASS, including unsupported-save cleanup, discard, interaction mutation, and gold-only egg assertions.

- [ ] **Step 5: Commit**

```powershell
git add src/core/gameState.ts src/core/gameState.test.ts src/core/gacha.ts
git commit -m "feat: add persistent shared game state actions"
```

### Task 3: Add Main-Process State Service and Desktop-First Window Lifecycle

**Files:**
- Create: `electron/gameStateService.ts`
- Modify: `electron/main.ts`
- Modify: `electron/preload.ts`

- [ ] **Step 1: Write a failing service test**

```ts
import { expect, it, vi } from 'vitest'
import { createGameStateService } from './gameStateService'

it('persists each accepted action and broadcasts the new snapshot', () => {
  const write = vi.fn()
  const publish = vi.fn()
  const service = createGameStateService({ read: () => undefined, write, publish })
  service.dispatch({ type: 'discardEgg', eggId: 'missing' })
  expect(write).toHaveBeenCalledTimes(1)
  expect(publish).toHaveBeenCalledWith(service.snapshot())
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm.cmd test -- electron/gameStateService.test.ts`

Expected: FAIL because `gameStateService` is absent.

- [ ] **Step 3: Implement service, preload bridge, and lifecycle**

`electron/gameStateService.ts` must wrap `readJSON('game-state.json')`, `writeJSON`, `sanitizeGameState`, and `reduceGameAction`. It exposes `snapshot()` and `dispatch(action)`, writes only after an accepted action, and calls the injected publisher with the latest snapshot.

Expose these safe preload methods:

```ts
gameRead: () => ipcRenderer.invoke('game:read'),
gameDispatch: (action: GameAction) => ipcRenderer.invoke('game:dispatch', action),
onGameState: (callback: (state: PersistedGameState) => void) => {
  const listener = (_: Electron.IpcRendererEvent, state: PersistedGameState) => callback(state)
  ipcRenderer.on('game:state', listener)
  return () => ipcRenderer.removeListener('game:state', listener)
},
openManagement: () => ipcRenderer.invoke('window:open-management'),
```

In `electron/main.ts`, replace eager `createMainWindow()` startup with `showManagementWindow()`: create on first call, show/focus thereafter, and intercept `close` to `preventDefault()` plus `hide()` unless app quit is in progress. Remove auto-opening DevTools. Call only `createPetOverlay()` and `createTray()` when ready. Tray double-click and its Open-management item call `showManagementWindow`; add `window:open-management` IPC. Register `game:read` and `game:dispatch`; publisher sends `game:state` to both non-destroyed webContents.

- [ ] **Step 4: Run focused service tests**

Run: `npm.cmd test -- electron/gameStateService.test.ts`

Expected: PASS with persistence and broadcast assertions.

- [ ] **Step 5: Commit**

```powershell
git add electron/gameStateService.ts electron/gameStateService.test.ts electron/main.ts electron/preload.ts
git commit -m "feat: add desktop-first shared game service"
```

### Task 4: Hydrate the Management Store and Connect the Desktop Pet

**Files:**
- Modify: `src/store/gameStore.ts`
- Modify: `src/desktop/DesktopPet.tsx`
- Modify: `src/components/pet/PetDisplay.tsx`

- [ ] **Step 1: Write failing store synchronization tests**

```ts
import { expect, it } from 'vitest'
import { getActiveTeamPet, replaceGameState } from './gameState'

it('uses the first team pet as the active desktop pet', () => {
  const state = replaceGameState({ team: ['p1'], pets: [{ id: 'p1', speciesId: 'flame_drake', rarity: 'gold' }] } as any)
  expect(getActiveTeamPet(state)?.id).toBe('p1')
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm.cmd test -- src/core/gameState.test.ts`

Expected: FAIL because `getActiveTeamPet` or snapshot replacement is absent.

- [ ] **Step 3: Implement renderer synchronization**

Add `replaceGameState(snapshot)` and `getActiveTeamPet(snapshot)` pure helpers. In `gameStore`, initialize from `gameRead()` when the Electron bridge exists, subscribe once with the returned unsubscribe function, and replace state on each snapshot. Every public mutation action — gacha, team, storage, interactions, shopping, consumables, evolution, battle, expedition, and experience — dispatches its matching `GameAction` when the bridge exists and retains its existing direct Zustand implementation only when it does not.

In `DesktopPet`, remove `DEFAULT_PET`; subscribe to snapshots and derive the active pet from the first valid team entry. Render a compact “add a pet to your team” feedback state when none exists. Update menu actions to dispatch feed/pet/wash/play to the active pet, and update Open management to call `electronAPI.openManagement()` instead of `window.open`. Keep drag behavior unchanged. In `PetDisplay`, replace heuristic body selection for these exact IDs with explicit mapping: `flame_drake -> dragon`, `mirage_spirit -> spirit`, `judgment_beast -> beast`.

- [ ] **Step 4: Run unit tests and production build**

Run: `npm.cmd test; npm.cmd run build`

Expected: all tests pass and Electron plus Vite compilation exits with code 0.

- [ ] **Step 5: Commit**

```powershell
git add src/core/gameState.ts src/core/gameState.test.ts src/store/gameStore.ts src/desktop/DesktopPet.tsx src/components/pet/PetDisplay.tsx
git commit -m "feat: synchronize real pets with desktop overlay"
```

### Task 5: Update Pokédex and Egg Discard UI

**Files:**
- Modify: `src/pages/PokedexPage.tsx`
- Modify: `src/pages/EggPage.tsx`

- [ ] **Step 1: Write failing filter and discard helper tests**

```ts
import { expect, it } from 'vitest'
import { filterPokedexEntries } from '../core/roster'

it('filters the catalog by the beast classification', () => {
  expect(filterPokedexEntries('beast').map(entry => entry.id)).toEqual(['judgment_beast'])
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm.cmd test -- src/core/roster.test.ts`

Expected: FAIL because the filter helper is absent.

- [ ] **Step 3: Implement UI behavior**

Add `filterPokedexEntries(filter)` to the roster module with filters `all | dragon | spirit | beast | owned | unknown`; UI status filters use the given Pokédex map. Update `PokedexPage` to render exactly those six options and only supported species.

In `EggPage`, add a Discard button next to Hatch. Its handler must return early while `hatching === eggId`, call `window.confirm('确定要丢弃这枚宠物蛋吗？此操作不会返还资源。')`, and dispatch the `discardEgg` store action only on confirmation. The card must disappear after the authoritative snapshot update.

- [ ] **Step 4: Run full verification**

Run: `npm.cmd test; npm.cmd run build`

Expected: all tests pass and production build succeeds.

- [ ] **Step 5: Manually verify Electron behavior**

Run: `npm.cmd run dev`

Expected: only the desktop pet is visible initially; tray double-click and desktop menu open management; closing management hides it; a desktop interaction updates the management HUD; a gold egg can hatch only the three roster species; discard requires confirmation; Ultimate evolves at the stated maximum requirements.

- [ ] **Step 6: Commit**

```powershell
git add src/core/roster.ts src/core/roster.test.ts src/pages/PokedexPage.tsx src/pages/EggPage.tsx
git commit -m "feat: add three-species pokedex and egg discard"
```

### Task 6: Release Verification and Publish

**Files:**
- Verify: `electron/main.ts`
- Verify: `electron/gameStateService.ts`
- Verify: `src/core/gameState.ts`
- Verify: `src/desktop/DesktopPet.tsx`

- [ ] **Step 1: Run final repository checks**

Run: `npm.cmd test; npm.cmd run build; git diff --check; git status -sb`

Expected: all tests green, build exits 0, no whitespace errors, and only intentional commits are ahead of `origin/main`.

- [ ] **Step 2: Push the verified main branch**

Run: `git push origin main`

Expected: the repository at `https://github.com/ssy2886/pet-game` contains the completed desktop-first workflow.
