# Desktop-First Shared Game Design

## Goal

Make the application behave as a desktop-pet application first: launch only the interactive pet overlay, open the management window on demand, and keep game data consistent between both windows while limiting the current product to the three completed PNG pet families.

## Scope

This design delivers five connected changes:

1. desktop-first window lifecycle;
2. one persisted game state shared by Electron windows;
3. real desktop-pet interactions;
4. a three-species, gold-only current roster with a filterable 图鉴 and egg discard;
5. regular Ultimate-to-Super Ultimate evolution.

## Window Lifecycle

- Application startup creates the pet overlay and tray only. The management window is not created until requested.
- Tray double-click and the pet context-menu item **Open management** create the management window on first use or show and focus it afterward.
- Closing the management window hides it instead of quitting the application.
- The tray Quit command remains the explicit application exit path.
- Development mode does not automatically open the management window or DevTools. The same on-demand behavior is used in development and production.

## Shared Persistent Game State

Electron main owns the authoritative serializable game state and persists it as `game-state.json` with the existing desktop data storage utility. It exposes IPC operations to:

- read a snapshot during renderer startup;
- dispatch a named game action with validated arguments;
- subscribe to state-change snapshots.

The management renderer initializes its store from the snapshot and sends mutations through IPC. The pet renderer reads the same snapshot and receives every state update. Main broadcasts each accepted update to every live renderer, including the sender, so both windows converge on the same data.

Every existing management feature uses this same protocol: eggs and hatching, shop purchases, team and storage changes, pet sale, consumables, evolution, battle, expedition, and experience. No management-page action keeps a separate Electron-only Zustand mutation path. Browser-only development retains the existing local in-memory behavior.

If Electron APIs are absent while rendering in a browser, the management app retains an in-memory fallback. The overlay handles absent or malformed state by showing a harmless empty-pet message instead of crashing.

## Desktop Pet Behavior

- The overlay uses the first valid team pet as its active pet; it no longer creates a hard-coded starter pet.
- The pet context menu contains feed, pet, wash, play, and Open management.
- Pet, wash, and play dispatch the existing real game actions for the active pet.
- Feed dispatches the existing food action using `basic_feed` when available. If it is unavailable, the overlay shows an explanatory feedback message and does not alter state.
- Each successful action immediately updates the overlay HUD and the management window through the shared-state broadcast.

## Current Species Roster and Rarity

Only these completed body families are currently playable and listed in the 图鉴:

- Dragon
- Spirit
- Beast

Their catalog definitions are explicit, stable records rather than generated species. Each has `gold` as its only allowed birth rarity. The egg draw system creates only gold eggs and selects one of these three species. Hatching preserves the egg's gold rarity. The product does not show, generate, or draw any legacy SVG-only and auto-generated species. Existing incompatible legacy saves are sanitized on load: unsupported pets, eggs, and Pokédex entries are removed; valid inventory and resources remain.

## 图鉴 and Eggs

The 图鉴 renders only the three allowed species and offers these mutually exclusive filters:

- All
- Dragon
- Spirit
- Beast
- Owned
- Unknown

Egg cards gain a Discard action. Selecting it opens a native confirmation dialog or an equivalent in-app confirmation. Confirming deletes the egg without refund; cancelling leaves it unchanged. A hatching egg cannot be discarded until the hatch action completes or is cancelled.

## Evolution

The `ultimate` stage progresses to `superUltimate` through the normal evolution check: level 99, affection 200, and growth 100. No special challenge or item is required. A `superUltimate` pet remains the final state.

## Validation and Testing

Tests cover:

- eligibility and stat result for Ultimate-to-Super Ultimate evolution;
- roster filtering and gold-only egg selection;
- egg discard confirmation semantics;
- state sanitization for unsupported persisted roster entries;
- the pure shared-state action protocol and a renderer-facing snapshot update;
- window lifecycle helpers for hidden-on-start management behavior.

Build verification runs Vitest and the production Electron build. Manual verification covers startup with no visible management window, opening it through both authorized entry points, closing to hide, persistent state across restart, and desktop interaction synchronization.
