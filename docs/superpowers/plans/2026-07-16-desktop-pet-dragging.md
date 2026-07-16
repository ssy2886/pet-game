# Desktop Pet Dragging Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the transparent desktop-overlay pet be dragged within the viewport, preserve ordinary clicks and right-clicks, and restore its last valid position.

**Architecture:** Put drag math and persisted-position validation in a pure helper so it can be tested without Electron or React. `DesktopPet` owns pointer lifecycle, mouse pass-through calls, position persistence, and temporary animation suppression; it delegates position calculations to the helper.

**Tech Stack:** Electron, React 19, TypeScript, Vitest.

---

## File Structure

- Create: `src/desktop/petDrag.ts` — pure drag threshold, position clamp, and restored-position helpers.
- Create: `src/desktop/petDrag.test.ts` — Vitest coverage for the pure helper.
- Modify: `src/desktop/DesktopPet.tsx` — pointer handlers, saved-position lifecycle, drag state, and autonomous-movement guard.

### Task 1: Create the Tested Drag Helper

**Files:**
- Create: `src/desktop/petDrag.ts`
- Test: `src/desktop/petDrag.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest'
import { clampPetPosition, isDragGesture, restorePetPosition } from './petDrag'

describe('pet drag helpers', () => {
  const viewport = { width: 300, height: 200 }
  const pet = { width: 80, height: 90 }

  it('keeps a small pointer move as a click', () => {
    expect(isDragGesture({ x: 10, y: 10 }, { x: 13, y: 12 })).toBe(false)
    expect(isDragGesture({ x: 10, y: 10 }, { x: 16, y: 10 })).toBe(true)
  })

  it('clamps the dragged pet to every viewport edge', () => {
    expect(clampPetPosition({ x: -5, y: -2 }, viewport, pet)).toEqual({ x: 0, y: 0 })
    expect(clampPetPosition({ x: 280, y: 160 }, viewport, pet)).toEqual({ x: 220, y: 110 })
  })

  it('restores valid coordinates and falls back for malformed data', () => {
    expect(restorePetPosition({ x: 999, y: 999 }, { x: 20, y: 30 }, viewport, pet)).toEqual({ x: 220, y: 110 })
    expect(restorePetPosition({ x: 'bad', y: 1 }, { x: 20, y: 30 }, viewport, pet)).toEqual({ x: 20, y: 30 })
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm.cmd test -- src/desktop/petDrag.test.ts`

Expected: FAIL because `./petDrag` does not exist.

- [ ] **Step 3: Add the minimal helper implementation**

```ts
export type Point = { x: number; y: number }
export type Size = { width: number; height: number }

const DRAG_THRESHOLD = 5

export function isDragGesture(start: Point, current: Point): boolean {
  return Math.hypot(current.x - start.x, current.y - start.y) >= DRAG_THRESHOLD
}

export function clampPetPosition(position: Point, viewport: Size, pet: Size): Point {
  return {
    x: Math.min(Math.max(0, position.x), Math.max(0, viewport.width - pet.width)),
    y: Math.min(Math.max(0, position.y), Math.max(0, viewport.height - pet.height)),
  }
}

export function restorePetPosition(saved: unknown, fallback: Point, viewport: Size, pet: Size): Point {
  if (!saved || typeof saved !== 'object') return fallback
  const { x, y } = saved as Partial<Point>
  if (!Number.isFinite(x) || !Number.isFinite(y)) return fallback
  return clampPetPosition({ x: x!, y: y! }, viewport, pet)
}
```

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm.cmd test -- src/desktop/petDrag.test.ts`

Expected: PASS with 3 tests.

- [ ] **Step 5: Commit the helper**

```powershell
git add src/desktop/petDrag.ts src/desktop/petDrag.test.ts
git commit -m "feat: add desktop pet drag helpers"
```

### Task 2: Wire Pointer Dragging and Position Persistence

**Files:**
- Modify: `src/desktop/DesktopPet.tsx`
- Test: `src/desktop/petDrag.test.ts`

- [ ] **Step 1: Extend the test with pointer-offset behavior**

Add this assertion to the clamp test before implementation:

```ts
expect(clampPetPosition({ x: 145, y: 72 }, viewport, pet)).toEqual({ x: 145, y: 72 })
```

- [ ] **Step 2: Run the focused test**

Run: `npm.cmd test -- src/desktop/petDrag.test.ts`

Expected: PASS; the pure helper already supports in-range pointer-offset results.

- [ ] **Step 3: Add drag state and pointer lifecycle in `DesktopPet`**

At the imports, add:

```ts
import { clampPetPosition, isDragGesture, restorePetPosition, type Point } from './petDrag'
```

Inside `DesktopPet`, use a stable default and a ref that records pointer-to-pet offset:

```ts
const DEFAULT_POSITION = { x: 200, y: 200 }
const PET_STORAGE_KEY = 'desktop-pet-position.json'
const dragRef = useRef<{ start: Point; offset: Point; active: boolean } | null>(null)
const [isDragging, setIsDragging] = useState(false)
const [hasManualPosition, setHasManualPosition] = useState(false)
```

Load `PET_STORAGE_KEY` once after mount using `electronAPI.storageRead`, validate it with `restorePetPosition`, and use `window.innerWidth`, `window.innerHeight`, and the current `petSize`. On pointer down, record `{ start, offset, active: false }`, call `setPointerCapture`, and disable mouse pass-through. On pointer move, activate after `isDragGesture`, then calculate `event.clientX - offset.x` and `event.clientY - offset.y`, clamp the result, and call `setPos`. On pointer up, release capture; if active, persist the final position with `storageWrite`, set `hasManualPosition(true)`, and do not call the click handler. If not active, invoke the existing petting click handler.

Render the pet character with these handlers:

```tsx
onPointerDown={handlePointerDown}
onPointerMove={handlePointerMove}
onPointerUp={handlePointerUp}
onPointerCancel={handlePointerCancel}
onClick={(event) => event.preventDefault()}
```

Disable or pause the random-walk effect whenever `isDragging` or `hasManualPosition` is true. Include both values in the effect dependency list. Keep the existing context-menu handler and make it ignore an active drag.

- [ ] **Step 4: Build and run the complete test suite**

Run: `npm.cmd test; npm.cmd run build`

Expected: all Vitest tests pass and Vite plus Electron TypeScript compilation exits with code 0.

- [ ] **Step 5: Manually check the Electron overlay**

Run: `npm.cmd run dev`

Expected: clicking pets them, right-click opens the existing menu, dragging keeps the pet within the screen, and restarting restores the dropped position. Transparent regions remain mouse-through.

- [ ] **Step 6: Commit the renderer integration**

```powershell
git add src/desktop/DesktopPet.tsx src/desktop/petDrag.test.ts
git commit -m "feat: make desktop pet draggable"
```

### Task 3: Final Verification and Publish

**Files:**
- Verify: `src/desktop/petDrag.ts`
- Verify: `src/desktop/DesktopPet.tsx`

- [ ] **Step 1: Check the final diff and repository state**

Run: `git diff HEAD~2..HEAD --check; git status -sb`

Expected: no whitespace errors and a clean `main` branch ahead of `origin/main`.

- [ ] **Step 2: Push confirmed commits**

Run: `git push origin main`

Expected: `main` updates at `https://github.com/ssy2886/pet-game`.
