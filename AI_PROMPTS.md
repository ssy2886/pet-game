# AI 绘图提示词 — 数码世界宠物图像生成指南

## 目录结构

所有图片放在 `public/assets/pets/` 下：

```
public/assets/pets/
├── bodies/                    ← 宠物身体（主体）
│   ├── dragon/
│   │   ├── baby.png           ← 幼体
│   │   ├── adult.png          ← 成体
│   │   ├── perfect.png        ← 完全体
│   │   ├── ultimate.png       ← 究极体
│   │   └── superUltimate.png  ← 终极体
│   ├── fox/           (同上)
│   ├── bird/          (同上)
│   ├── golem/         (同上)
│   ├── beast/         (同上)
│   ├── serpent/       (同上)
│   ├── spirit/        (同上)
│   └── crab/          (同上)
└── elements/                  ← 元素特效叠加层（半透明）
    ├── fire/
    │   ├── baby.png
    │   ├── adult.png
    │   ├── perfect.png
    │   ├── ultimate.png
    │   └── superUltimate.png
    ├── wind/          (同上)
    ├── earth/         (同上)
    ├── water/         (同上)
    └── light/         (同上)
```

## 生成规范

| 参数 | 值 |
|------|-----|
| **画幅** | 1:1 正方形 |
| **背景** | **纯透明 PNG**（无背景） |
| **构图** | 宠物居中，完整全身 |
| **视角** | 正面或 3/4 正面 |
| **风格** | 数码兽风格 / 日式奇幻生物 |
| **输出** | 1024×1024 PNG，**透明背景** |
| **工具** | Midjourney v6 / DALL-E 3 / Stable Diffusion |

**透明背景说明：**
- Midjourney：生成后需用 Photoshop/remove.bg 手动抠图
- DALL-E 3：提示 "white background" 后抠图
- SD：可使用 transparency 插件直接生成透明 PNG

---

## 基础艺术风格描述（可添加到每个 prompt 尾部）

```
-- 固定尾部，每个 prompt 都加上：
Polished Japanese fantasy game mascot illustration, warm cel-shaded rendering,
clean sharp silhouette, full body centered composition, perfectly flat solid #FF00FF chroma-key background,
no ground, no cast shadow, no text, no watermark, no frame --ar 1:1 --v 6 --stylize 100
```

---

# 一、身体类型 × 5 阶段提示词

每个 prompt 格式：`[形态描述] + 风格尾部`

---

## 1. 龙型 (Dragon) — `bodies/dragon/`

### baby.png — 幼体
> Cute original baby dragon mascot, chubby round body and oversized head, bright orange-red scales, creamy white segmented belly plates, huge glossy amber eyes, short orange snout, three warm tan horns (two swept back plus one small center horn), tiny folded wings, short legs and tail, happy open smile, friendly QQ-pet-like personality, clean whole-body silhouette, seated pose facing front with a slight 3/4 turn, no elemental effects

### adult.png — 成体
> The same original orange-red dragon grown into a young four-legged dragon, creamy white belly plates, glossy amber eyes, short orange snout, the same three warm tan horns, medium folded wings, tidy scale rows, athletic compact body, alert confident expression, standing 3/4 front view, no elemental effects

### perfect.png — 完全体
> The same original orange-red dragon evolved into a powerful mature dragon, creamy white armor-like belly plates, amber eyes now noticeably smaller than the baby stage, defined angular brow ridges, a longer orange muzzle and clearer jawline, the same three warm tan horns grown into a compact crown, large folded wings, layered scale armor, visible claws, heroic muscular but compact build, noble stern expression with no open baby smile, standing 3/4 front view, no elemental effects

### ultimate.png — 究极体
> The same original orange-red dragon evolved into a regal dragon emperor, creamy white armored belly plates, smaller sharp amber eyes set beneath pronounced brow ridges, an elongated orange muzzle with a strong defined jawline, three elegant warm tan crown horns, broad membrane wings held close to the body, refined ceremonial scales, restrained golden body markings only, tall four-legged royal stance, composed serious expression with no baby-face proportions, 3/4 front view, no elemental effects or floating particles

### superUltimate.png — 终极体
> The same original dragon transcended into a divine solar sovereign, a visibly new silhouette: tall ceremonial four-legged stance with a 25 percent longer neck and tail, white-gold celestial armor replacing most orange-red body scales while retaining orange-red accents, a radiant diamond-shaped solar core embedded in the chest armor, sharp adult amber eyes under strong brow ridges, longer orange muzzle and powerful jawline, exactly three main crown horns, enormous arching white-gold wing membranes with sun-rune patterns, a gold sun-blade tail tip, calm divine authority and no baby-face proportions, standing 3/4 front view, no cosmic background, no extra eyes, no elemental effects

---

## 2. 狐型 (Fox) — `bodies/fox/`

### baby.png — 幼体
> Fluffy baby fox cub, round chubby body, oversized triangular ears, big sparkling puppy eyes, tiny single fluffy tail curled around, soft fur texture, cute playful expression

### adult.png — 成体
> Elegant fox with sleek fur, pointed ears with inner fluff, two lush tails curling behind, sharp intelligent amber eyes, graceful standing pose, proud alert posture

### perfect.png — 完全体
> Mystical fox spirit with three flowing tails, ethereal fur markings glowing softly, elegant elongated body, piercing mystical eyes, floating slightly above ground, wisps of magical energy trailing from tails

### ultimate.png — 究极体
> Nine-tailed celestial fox, each tail flowing with magical flame-like energy, ornate golden markings across white/colored fur, floating in mid-air, multiple glowing tails fanning out like a peacock, divine serene expression

### superUltimate.png — 终极体
> Cosmic nine-tailed fox god, each tail containing a galaxy of stars, translucent ethereal body with celestial patterns, halo of light behind head, floating in cosmic void surrounded by aurora-like energy, transcendent divine being

---

## 3. 鸟型 (Bird) — `bodies/bird/`

### baby.png — 幼体
> Round fluffy baby bird chick, tiny beak, oversized eyes, small downy wings, tiny legs, adorable round shape, soft feathery texture

### adult.png — 成体
> Sleek bird of prey, sharp beak, keen eyes, folded wings with visible feather layers, long tail plumage, perched standing pose, proud alert posture

### perfect.png — 完全体
> Majestic raptor with wings spread wide, detailed layered feathers, sharp talons, fierce penetrating gaze, crest of feathers on head, dynamic powerful stance

### ultimate.png — 究极体
> Phoenix-like legendary bird, magnificent wings ablaze with elemental fire/light, long flowing tail feathers with golden tips, crown-like crest, radiant aura, regal majestic presence

### superUltimate.png — 终极体
> Cosmic phoenix god, wings made of galaxy nebulae, each feather containing stars, trails of cosmic dust from tail, sun-like corona radiating behind, transcendent being of pure light and creation

---

## 4. 岩石型 (Golem) — `bodies/golem/`

### baby.png — 幼体
> Small cute rock creature, round pebble-like body, stubby little arms and legs, a single glowing eye or two small eyes, smooth stone texture, adorable blocky proportions

### adult.png — 成体
> Humanoid stone golem, blocky muscular body, thick sturdy limbs, geometric patterns carved into stone surface, glowing core in chest, heavy solid stance

### perfect.png — 完全体
> Armored crystalline golem, body covered in plate armor formations, crystal shards protruding from shoulders and back, massive arms, intense glowing core, imposing immovable presence

### ultimate.png — 究极体
> Colossal elemental titan, body composed of rare minerals and crystals, mountain-like proportions, multiple crystal formations growing from body, inner magma/energy core visible through cracks, earth-shaking presence

### superUltimate.png — 终极体
> Primordial earth titan god, body containing visible mineral veins of precious gems, floating continent fragments orbiting, cosmic runes glowing across stone surface, galaxy-like energy core, transcendent divine construct

---

## 5. 野兽型 (Beast) — `bodies/beast/`

### baby.png — 幼体
> Cute fluffy cub, round puppy-like body, oversized paws, big innocent eyes, small tail wagging, soft fur, adorable playful stance

### adult.png — 成体
> Sleek powerful wolf/lion-like beast, muscular lean body, sharp fangs visible, keen predatory eyes, thick mane or fur ruff, alert hunting stance

### perfect.png — 完全体
> Armored war beast, body covered in natural armor plating and battle scars, elemental mane flowing like fire/lightning, massive muscular build, fierce intimidating roar pose

### ultimate.png — 绝体
> Legendary divine beast with ornate golden armor, flowing elemental mane reaching the ground, eyes glowing with ancient wisdom, surrounded by magical aura, regal dominating posture

### superUltimate.png — 终极体
> Cosmic divine beast, starry patterns covering celestial fur, mane made of nebula clouds, eyes containing galaxies, floating on cosmic energy, transcendent being of pure power

---

## 6. 蛇型 (Serpent) — `bodies/serpent/`

### baby.png — 幼体
> Small cute baby snake/eel, short wiggly body, big round eyes, smooth skin, tiny tail, adorable simple design

### adult.png — 成体
> Medium serpent with coiled body, visible scale pattern, developing hood or frills, sharp eyes, elegant S-curve posture, sleek dangerous beauty

### perfect.png — 完全体
> Large majestic sea serpent or dragon-serpent, thick powerful coils, elaborate fin/hood frills, horned head, scales with iridescent sheen, floating waterly presence

### ultimate.png — 究极体
> Massive leviathan serpent, body long enough to form multiple loops, grand horns like a dragon king, glowing patterns along body, fins resembling sails, awe-inspiring colossal presence

### superUltimate.png — 终极体
> World serpent of cosmic scale, body wrapping around celestial objects, star patterns across scales, cosmic energy radiating from body, transcendent primordial being older than time

---

## 7. 灵体型 (Spirit) — `bodies/spirit/`

### baby.png — 幼体
> Small floating ball of light with tiny wings, cute simple face in the light, small sparkle particles around, soft pastel colors, pure innocent presence

### adult.png — 成体
> Ethereal humanoid figure, translucent elegant body, flowing robe-like lower half, soft glowing aura, delicate wings forming from light, serene mysterious expression

### perfect.png — 完全体
> Angelic being with luminous wings, ornate halo behind head, flowing celestial robes, gentle radiant light emanating, graceful floating pose, divine calm expression

### ultimate.png — 究极体
> Cosmic entity with multiple layered halos, wings spanning wide made of pure light, starry patterns within translucent body, ethereal crown, surrounded by orbiting light motes, awe-inspiring divine presence

### superUltimate.png — 终极体
> God-like cosmic creator being, body composed of galaxy nebula and starlight, impossible geometry halo structures, wings containing entire constellations, transcendent being of pure consciousness and light

---

## 8. 蟹型 (Crab) — `bodies/crab/`

### baby.png — 幼体
> Tiny cute baby crab, small round body, tiny little claws raised up, stubby legs, beady little eyes on stalks, cute defensive pose

### adult.png — 成体
> Medium crustacean with hardened shell, larger asymmetrical claws (one bigger), articulated legs set wide, eyes on stalks, sturdy side-walking stance

### perfect.png — 完全体
> Armored shell-crab with spiked carapace, massive crushing claws, thick armored legs, shell patterns and barnacle-like growths, intimidating tank-like presence

### ultimate.png — 究极体
> Colossal crustacean leviathan, shell covered in crystal formations and ancient runes, claws large enough to crush boulders, multiple eyes, deep sea abyssal presence, primal ancient aura

### superUltimate.png — 终极体
> Deep space cosmic crustacean god, shell containing constellations, claws holding cosmic energy, bioluminescent patterns across body, floating in void with planetary scale, eldritch cosmic horror beauty

---

# 二、元素特效叠加层 × 5 阶段提示词

这些是**半透明叠加层 PNG**，叠加在身体图片上方。需要半透明效果（opacity 60-80%）。

格式：`[元素效果] + 确保透明背景`

---

## 火 (Fire) — `elements/fire/`

### baby.png
> Separate fire-element overlay for the baby dragon only: a small ring of orange-red flame wisps attached near the lower sides and behind the body, six to ten tiny warm ember sparks, all effects kept outside the central face and chest area, gentle and playful rather than explosive, no dragon or other character, no floor, no smoke, perfectly flat solid #00FF00 chroma-key background, clean isolated effect silhouette, full canvas composition

### adult.png
> Separate fire-element overlay for the adult dragon only: compact orange-red and gold flames rising at both lower outer sides, ten to fourteen ember sparks, central body area kept empty, no dragon or other character, no floor, no smoke, perfectly flat solid #00FF00 chroma-key background, clean isolated effect silhouette, full canvas composition

### perfect.png
> Medium-sized flames surrounding the body, transparent layers of orange and red fire, smoke wisps, intense heat shimmer effect, floating fire particles, transparent background

### ultimate.png
> Large inferno aura, multi-layered transparent flames in red orange and gold, fire whirls and vortex patterns, massive radiant heat glow, exploding ember particles, transparent background

### superUltimate.png
> Colossal cosmic fire aura, blue-white core transitioning to gold-red outer flames, galaxy-fire mix with star-like embers, sun-like corona effect, plasma patterns, transcendent flame energy, transparent background

---

## 风 (Wind) — `elements/wind/`

### baby.png
> Gentle soft breeze effect, very faint transparent blue-white swirls around edges, tiny floating feather/leaf particles, subtle wind lines, transparent background

### adult.png
> Wind swirls and currents around the body, transparent blue-cyan spiral patterns, floating cloud wisps, soft flowing motion lines, transparent background

### perfect.png
> Strong wind vortex, layered transparent swirls, cloud formations wrapping around, lightning spark traces between clouds, dynamic flowing energy, transparent background

### ultimate.png
> Massive storm aura, cyclone patterns of wind and clouds, visible lightning bolts within, fast motion blur lines, intense pressure effect, transparent background

### superUltimate.png
> Cosmic storm god aura, galaxy-wind nebula swirls, starry cloud formations, lightning connecting to cosmic energy, space-time distortion effect, transcendent wind energy, transparent background

---

## 地 (Earth) — `elements/earth/`

### baby.png
> Small floating earth particles, tiny pebbles and dust motes orbiting, subtle brown-green glow, very gentle earthy aura, transparent background

### adult.png
> Floating rock shards and crystals orbiting, earthy brown-green transparent aura, small stone fragments, subtle green nature energy particles, transparent background

### perfect.png
> Large crystal formations floating around, rock shards orbiting in ring pattern, green nature energy vines, earthy magnetic field effect, transparent background

### ultimate.png
> Massive crystal array floating and rotating, continent fragment pieces, deep green nature aura with golden veins, ancient rune patterns in stone, transparent background

### superUltimate.png
> Cosmic earth titan aura, floating planetary fragments, crystal galaxies, mineral veins of starlight, nature energy in cosmic scale, primordial earth force, transparent background

---

## 水 (Water) — `elements/water/`

### baby.png
> Small water droplets floating, gentle ripples in the air, very faint blue transparent wave patterns, tiny bubble particles, transparent background

### adult.png
> Flowing water currents wrapping around, transparent wave forms, floating bubbles of various sizes, gentle splash effects, cool blue aura, transparent background

### perfect.png
> Large water vortex or whirlpool patterns, cascading waterfall effect, mist and foam, intricate wave formations, deep blue-cyan gradient transparency, transparent background

### ultimate.png
> Massive tsunami-like water aura, ocean vortex with deep blue layers, ice crystal formations within, stormy sea energy, overwhelming pressure effect, transparent background

### superUltimate.png
> Cosmic ocean nebula aura, galaxy-water mix with star reflections, primordial sea of creation, aurora-like water currents, transcendent liquid light, transparent background

---

## 光 (Light) — `elements/light/`

### baby.png
> Soft warm glow aura, very faint golden-white light radiating, tiny sparkle particles, gentle holy light shimmer, transparent background

### adult.png
> Radiant light rays shooting outward, warm golden-white transparent glow, soft halo effect, floating light motes, gentle holy presence, transparent background

### perfect.png
> Strong holy light rays in geometric patterns, layered golden-white radiance, multiple halo rings, intense but warm glow, celestial light particles, transparent background

### ultimate.png
> Massive divine light aura, prismatic rainbow light rays, multiple ornate halo rings with sacred geometry, blinding radiant core, angelic feather-light particles, transparent background

### superUltimate.png
> Cosmic divine light of creation, galaxy-prism light spectrum, infinitely layered halo structures, pure radiant transcendent energy, starlight and aurora combined, source of all light, transparent background

---

# 三、使用工作流

1. **生成身体 PNG**：把 bodies 目录下的 prompt 复制到 Midjourney/DALL-E
2. **生成元素 PNG**：把 elements 目录下的 prompt 复制到 AI 工具
3. **抠图**：如果 AI 没有透明背景输出，用 remove.bg 或其他工具抠图
4. **重命名**：按目录结构命名（`baby.png`, `adult.png`, ...）
5. **放入项目**：放到对应目录
6. **重启应用**：图片会自动生效，SVG 降级为后备方案

## 推荐工作顺序

建议先做**最常用的组合**，按优先级：

```
第一波（最快见效）：
  bodies/dragon/baby.png + elements/fire/baby.png
  bodies/fox/baby.png + elements/wind/baby.png
  bodies/bird/baby.png + elements/wind/baby.png
  
第二波：
  补全 8 种身体的 adult 和 perfect 阶段
  
第三波：
  ultimate 和 superUltimate 阶段 + 所有元素特效
```

---

> 提示词中的 "transparent background" 对 Midjourney 不会自动生成透明 PNG，需要用工具抠图。
> DALL-E 3 可以在 prompt 中强调 "white background" 然后自动抠图相对容易。
> 推荐用 Midjourney 生成 → remove.bg 去背景 → 存为 PNG。
