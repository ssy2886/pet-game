# Dragon Pet Assets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the first production-ready dragon evolution asset (`baby.png`) and an improved, reusable Midjourney prompt set for all five dragon stages.

**Architecture:** `AI_PROMPTS.md` is the source of truth for human-run Midjourney prompts. The generated raster is first created on a uniform #FF00FF chroma-key backdrop, then converted to an alpha PNG and stored under the existing `public/assets/pets/bodies/dragon/` path consumed by `PetDisplay`.

**Tech Stack:** Midjourney v6 prompt syntax, PNG, local chroma-key cleanup, React image compositing already implemented in `src/components/pet/PetDisplay.tsx`.

---

### Task 1: Replace the Dragon Prompt Family

**Files:**

- Modify: `AI_PROMPTS.md:72-89`

- [x] **Step 1: Replace the shared art-style tail and the five Dragon prompts**

Use this common suffix for every dragon stage:

```text
same original creature character across the evolution line: orange-red scales, creamy-white belly plates, huge amber eyes, a short orange muzzle, three warm tan horns (two swept back plus one small center horn), compact four-legged silhouette; polished Japanese fantasy game mascot illustration, warm cel shading, crisp outer contour, full body centered, at least 12 percent empty padding on all sides; perfectly flat solid #FF00FF background, no ground, no shadow, no glow, no text, no watermark, no frame --ar 1:1 --v 6 --stylize 100
```

Use the stage-specific lead-in clauses:

```text
baby: adorable baby dragon, chubby round torso, oversized head, large friendly amber eyes, the same three small horns, folded miniature wings, short legs and tail, cheerful open smile, seated front pose with a slight 3/4 turn
adult: young dragon standing on four legs, slightly longer athletic body, formed swept-back horns, medium folded wings, neat scale rows, alert confident expression
perfect: powerful mature dragon, compact heroic musculature, large folded wings, layered armor-like scales, pronounced crown-like horns, visible claws, stern but noble expression
ultimate: dragon emperor, tall regal four-legged stance, broad membrane wings held close to the body, refined ceremonial scale armor, elegant horn crown, restrained luminous markings contained on the body
superUltimate: divine dragon sovereign, same four-legged character, grand but compact silhouette, detailed translucent-looking wing membranes without transparency, ornate celestial scale patterns and restrained body markings, majestic calm expression
```

- [x] **Step 2: Verify the prompt document**

Run: `rg -n "#FF00FF|same original creature|Dragon" AI_PROMPTS.md`

Expected: the dragon section contains all five stages and every stage is tied to the same orange-red, white-belly, amber-eyed character anchor.

### Task 2: Generate and Process the Baby Dragon

**Files:**

- Create: `public/assets/pets/bodies/dragon/baby.png`
- Temporary: `tmp/imagegen/dragon-baby-source.png`

- [x] **Step 1: Generate one 1024x1024 source image**

Generate from the `baby` clause and the common suffix in Task 1. Do not include an element, particle effect, environmental lighting, background scene, card frame, or floor.

- [x] **Step 2: Convert the chroma key to alpha**

Run:

```powershell
python "$env:USERPROFILE\.codex\skills\.system\imagegen\scripts\remove_chroma_key.py" --input tmp\imagegen\dragon-baby-source.png --out public\assets\pets\bodies\dragon\baby.png --auto-key border --soft-matte --transparent-threshold 12 --opaque-threshold 220 --despill
```

Expected: `baby.png` has transparent corners and no remaining #FF00FF halo around the dragon.

- [x] **Step 3: Inspect the 80px rendering**

Open `public/assets/pets/bodies/dragon/baby.png` at native size and at an 80px preview. Reject the image if the horns, eyes, four legs, or blue-and-white coloring cannot be identified at 80px.

- [x] **Step 4: Check asset compatibility**

Run: `Get-Item public\assets\pets\bodies\dragon\baby.png | Select-Object Name,Length`

Expected: the file exists at the exact location returned by `getImageUrls(BODY_DRAGON, 'baby', element)` in `PetDisplay.tsx`.

### Task 3: Verify Runtime Fallback Behavior

**Files:**

- Inspect: `src/components/pet/PetDisplay.tsx:74-80,559-626`
- Inspect: `public/assets/pets/elements/fire/baby.png`

- [ ] **Step 1: Run the application**

  2026-07-15 execution note: Vite started successfully at `http://localhost:3000`; Electron then exited in this restricted environment because Windows cryptography, cache creation, and GPU-process initialization were unavailable. `npm.cmd run build` completed successfully.

Run: `npm run dev`

Expected: Vite starts without a TypeScript compile error.

- [x] **Step 2: Confirm the intended temporary state**

With only `bodies/dragon/baby.png` present and no matching element image, render a dragon pet. Expected: `PetDisplay` retains its SVG fallback because it requires both body and element image loads to succeed.

- [x] **Step 3: Record the next asset dependency**

The first visible PNG composite requires `public/assets/pets/elements/fire/baby.png`; generate that independent effect layer before treating the body asset as a rendered in-app replacement.

### Task 4: Persist the Work

**Files:**

- Modify: `AI_PROMPTS.md`
- Create: `public/assets/pets/bodies/dragon/baby.png`

- [x] **Step 1: Check workspace changes**

Run: `git status --short`

Expected: if this directory is a Git repository, only the prompt document and selected asset should be staged for this task. If Git still reports no repository, retain the files without committing and report that limitation.

- [ ] **Step 2: Commit when a repository is available**

Run:

```powershell
git add AI_PROMPTS.md public/assets/pets/bodies/dragon/baby.png
git commit -m "feat: add dragon baby pet asset"
```

Expected: one focused commit containing the prompt update and baby dragon asset.
