# Partial Pet PNG Rendering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render available dragon, beast, and spirit body PNGs even where their PNG element layer is not yet available.

**Architecture:** Extract asset-stage candidate selection into a small pure module. `PetDisplay` will load a body candidate and an element candidate independently; the presence of a body enables image mode, while a missing element retains the existing SVG element effects.

**Tech Stack:** React 19, TypeScript, Vite, Vitest.

---

### Task 1: Add a test runner and asset-path tests

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/components/pet/petAssetPaths.ts`
- Create: `src/components/pet/petAssetPaths.test.ts`

- [ ] **Step 1: Add Vitest**

Run: `npm.cmd install --save-dev vitest`

Add this script to `package.json`:

```json
"test": "vitest run"
```

- [ ] **Step 2: Write the failing stage-candidate test**

```ts
import { describe, expect, it } from 'vitest'
import { getBodyAssetCandidates } from './petAssetPaths'

describe('getBodyAssetCandidates', () => {
  it('tries English then Chinese stage names for beast and spirit', () => {
    expect(getBodyAssetCandidates('beast', 'baby')).toEqual([
      '/assets/pets/bodies/beast/baby.png',
      '/assets/pets/bodies/beast/幼年.png',
    ])
    expect(getBodyAssetCandidates('spirit', 'superUltimate')).toEqual([
      '/assets/pets/bodies/spirit/superUltimate.png',
      '/assets/pets/bodies/spirit/终极.png',
    ])
  })
})
```

- [ ] **Step 3: Run the test and verify RED**

Run: `npm.cmd test -- petAssetPaths.test.ts`

Expected: FAIL because `petAssetPaths.ts` does not yet exist.

- [ ] **Step 4: Implement the asset-path helper**

```ts
import type { EvolutionStage } from '../../core/types'

const CHINESE_STAGE_NAMES: Record<EvolutionStage, string> = {
  baby: '幼年', adult: '成年', perfect: '完全', ultimate: '究极', superUltimate: '终极',
}

export function getBodyAssetCandidates(bodyDir: string, stage: EvolutionStage): string[] {
  const english = `/assets/pets/bodies/${bodyDir}/${stage}.png`
  return bodyDir === 'beast' || bodyDir === 'spirit'
    ? [english, `/assets/pets/bodies/${bodyDir}/${CHINESE_STAGE_NAMES[stage]}.png`]
    : [english]
}
```

- [ ] **Step 5: Run the test and verify GREEN**

Run: `npm.cmd test -- petAssetPaths.test.ts`

Expected: PASS with one test.

### Task 2: Render body and element layers independently

**Files:**

- Modify: `src/components/pet/PetDisplay.tsx:71-206,559-626`
- Test: `src/components/pet/petAssetPaths.test.ts`

- [ ] **Step 1: Write the failing render-state tests**

Add a pure helper test for these states:

```ts
expect(getRenderMode(true, true)).toBe('body-and-element')
expect(getRenderMode(true, false)).toBe('body-and-svg-element')
expect(getRenderMode(false, false)).toBe('svg-fallback')
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm.cmd test -- petAssetPaths.test.ts`

Expected: FAIL because `getRenderMode` does not yet exist.

- [ ] **Step 3: Implement independent layer selection**

Add `getRenderMode` to `petAssetPaths.ts`. Update `PetDisplay` to resolve the first successful body candidate; when a body is available, render it as an image. Render the PNG element layer only when it is available; otherwise render the existing `ElementEffects` SVG above the PNG body. Preserve the existing all-SVG branch when no body candidate is available.

- [ ] **Step 4: Run the focused tests and verify GREEN**

Run: `npm.cmd test -- petAssetPaths.test.ts`

Expected: PASS with the candidate and render-state tests.

### Task 3: Verify assets and build

**Files:**

- Inspect: `public/assets/pets/bodies/dragon/`
- Inspect: `public/assets/pets/bodies/beast/`
- Inspect: `public/assets/pets/bodies/spirit/`

- [ ] **Step 1: Check all known body files**

Run:

```powershell
Get-ChildItem public\assets\pets\bodies\dragon, public\assets\pets\bodies\beast, public\assets\pets\bodies\spirit -File | Select-Object FullName
```

Expected: five stages are present for each of the three configured body plans.

- [ ] **Step 2: Run the full test suite**

Run: `npm.cmd test`

Expected: all tests pass.

- [ ] **Step 3: Run the production build**

Run: `npm.cmd run build`

Expected: Vite and the Electron TypeScript build both exit with code 0.

- [ ] **Step 4: Commit when Git is available**

Run: `git add package.json package-lock.json src/components/pet/petAssetPaths.ts src/components/pet/petAssetPaths.test.ts src/components/pet/PetDisplay.tsx`

Run: `git commit -m "feat: render available pet body PNGs independently"`

Expected: one focused commit. If Git reports no repository, retain the verified files and report that limitation.
