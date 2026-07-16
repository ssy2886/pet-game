# Desktop Pet Drag Design

## Goal

Make the desktop pet behave like a classic QQ Pet: the user can drag the pet itself to a new desktop position and it remains there after release, while the transparent part of the overlay continues to let desktop mouse input pass through.

## Scope

- Retain the existing transparent, full-screen Electron overlay window.
- Treat only the pet character as an interactive target.
- Keep ordinary left-click as the existing petting interaction and retain the right-click menu.
- Persist the final dragged position and restore it when the overlay opens again.
- Pause autonomous movement while dragging and when the pet has been manually placed.

The work does not turn the pet into a separate native Electron window, add multi-monitor placement, or change the existing gameplay systems.

## Interaction Model

1. Pointer down on the pet records the pointer and pet positions.
2. The interaction becomes a drag only after a small movement threshold; this preserves a normal click for petting.
3. During a drag, the pet position follows the pointer using the initial pointer-to-pet offset. The position is clamped so the full pet remains visible in the overlay viewport.
4. Pointer release ends the drag, stores the clamped position through the existing Electron storage bridge, and returns the pet to idle.
5. A normal click triggers the current petting feedback. A right-click never starts a drag.
6. On first launch, the pet uses the current default position. On later launches, a valid stored position is restored and clamped to the current viewport.

## Mouse Pass-Through

The renderer asks Electron to disable mouse pass-through when the pointer enters the pet character and enables pass-through when it leaves. While dragging, pass-through remains disabled even if the cursor moves beyond the visible sprite until pointer release. The rest of the full-screen transparent overlay remains non-interfering.

## State and Boundaries

- Add a focused drag controller / pure helper for movement threshold, viewport clamping, and restored-position validation.
- Keep rendering and game-facing pet state in `DesktopPet`; drag calculations are isolated from UI effects.
- Persist `{ x, y }` under a dedicated overlay-position storage key through `electronAPI.storageRead` and `storageWrite`.
- Store numerical coordinates only. Reject malformed, non-finite, or stale values and fall back to the default location.

## Error Handling

- If Electron APIs are unavailable (for example, running the overlay in a browser), dragging still works in-memory and persistence is skipped.
- If stored data is invalid or out of bounds, clamp valid coordinates or use the default position.
- A drag cannot create coordinates outside the visible viewport, including after a viewport resize.

## Testing

Unit tests cover:

- movement below the drag threshold remains a click;
- dragging preserves the grabbed point relative to the pet;
- clamping at each viewport edge;
- valid restored positions are clamped and invalid positions fall back to the default.

Build verification runs the existing Vitest suite and production build.
