# 虚拟宠物形象提示词 v2

这份文档只定义 **8 种身体类型 × 5 个进化阶段** 的角色主体，不包含元素特效层。每条均可单独发送给 Midjourney、Niji、Flux 或其他生图模型。

## 使用原则

1. 每个物种先生成 `baby` 并选定一张；后续阶段把上一阶段图作为角色参考，而不是要求完全复刻脸部。
2. 每次进化只保留 2–3 个身份锚点（基础配色、角/耳/眼型之一），其余部分必须允许脸型、体态、轮廓和材质发生跃迁。
3. `baby → adult → perfect → ultimate → superUltimate` 的轮廓、姿势和构图必须明显不同。高阶段允许飞翔、悬浮、神性光环、翼展和动态透视。
4. 如需透明 PNG，先在纯色背景生成后再去背。提示词使用 `flat solid #00FF00 background`；绿色主体请改成 `#FF00FF`。

所有提示词默认带有：`--ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body`。可按模型语法调整参数。

---

## 1. 龙型 Dragon

身份锚点：琥珀眼、暖色鳞片、角的冠冕感。进化目标：宠物幼龙 → 战龙 → 龙王 → 天穹龙神。

### baby

```text
Cute hatchling dragon companion, round pear-shaped body, oversized bright amber eyes, soft coral-orange scales, creamy belly plates, two small swept horns and one tiny center horn, short muzzle, tiny folded wings, sitting with a playful open smile and curled tail; polished Japanese fantasy game mascot illustration, full body centered, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### adult

```text
Young orange dragon scout, the same amber eyes and three-horn identity but now with smaller eyes, longer muzzle, athletic four-legged body, medium leathery wings, defined shoulder scales, long balancing tail and alert confident stance; a wind-swept three-quarter pose on a flat solid #00FF00 background, polished Japanese fantasy game creature illustration --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### perfect

```text
Mature crimson dragon knight, recognizable amber eyes beneath angular brow ridges, crowned three-horn head, armored chest and forelimbs, broad battle wings, plated tail, powerful diagonal takeoff pose with claws leaving the ground; heroic Japanese fantasy creature design, sharply different silhouette from a young dragon, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### ultimate

```text
Ancient dragon emperor in flight, long regal neck, narrow amber eyes, strong jawline, three immense crown horns, scarlet and gold ceremonial armor, huge wings fully spread across the composition, serpentine tail curling through the air, looking downward with calm authority; cinematic Japanese fantasy illustration, full body visible, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### superUltimate

```text
Divine solar dragon sovereign, transformed into a white-gold celestial dragon with orange-red accents, sharp adult amber eyes, three radiant crown horns, elongated neck and tail, a glowing diamond sun core in its chest, enormous cathedral-like rune wings arched high, floating in a commanding vertical pose; awe-inspiring Japanese fantasy god-beast illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

---

## 2. 狐型 Fox

身份锚点：金色眼、尖耳、尾巴。进化目标：幼狐 → 猎手 → 灵狐 → 九尾神祇。

### baby

```text
Tiny fluffy fox kit companion, oversized golden eyes, creamy white muzzle and chest, russet-orange fur, one very large curled tail, huge triangular ears, tiny paws, playful pouncing pose; premium Japanese fantasy game mascot illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### adult

```text
Elegant young fox runner, same golden eyes and russet-white palette, leaner body, two long tails streaming behind, sharp ears, wind-swept fur, mid-stride leap over an invisible path, intelligent focused expression; Japanese fantasy creature illustration, full body on flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### perfect

```text
Mystic three-tailed fox spirit, mature narrow golden eyes, long elegant legs, three ribbon-like tails orbiting around its body, luminous rune markings in the fur, hovering sideways in a graceful arc; sophisticated Japanese fantasy illustration, strong airy silhouette, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### ultimate

```text
Nine-tailed celestial fox monarch, white and gold fur with russet accents, long refined muzzle, nine enormous flame-like tails fanned like a royal cloak, floating above a small halo of foxfire, serene severe expression; majestic Japanese fantasy god-beast illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### superUltimate

```text
Transcendent fox deity, slender humanoid-animal silhouette with nine translucent aurora tails forming a circular gateway, porcelain-white fur, gold mask-like facial markings, glowing gold eyes, long sleeves of fur flowing behind, levitating in an elegant vertical pose; divine Japanese fantasy illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

---

## 3. 鸟型 Bird

身份锚点：锐利眼、头冠、尾羽。进化目标：圆鸟 → 猛禽 → 凤凰 → 日轮神鸟。

### baby

```text
Round baby bird companion, fluffy down feathers, huge curious eyes, tiny hooked beak, small feather crest, stubby wings and feet, bouncing happily with one foot raised; colorful Japanese fantasy game mascot illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### adult

```text
Young raptor gliding in a shallow dive, same bright eyes and recognizable head crest, sleek feathered body, sharp beak, layered folded wing feathers opening into flight, long tail feathers trailing behind; dynamic Japanese fantasy creature illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### perfect

```text
Armored thunder raptor, mature piercing eyes, metallic feather plates, talons extended, huge wings spread in a diagonal airborne attack pose, crown-like crest and segmented tail feathers; bold Japanese fantasy game illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### ultimate

```text
Legendary phoenix king, long streamlined body floating upright, blazing gold-red wings expanded into a giant circular fan, long flame-tail feathers cascading below, regal narrow eyes and a sun-crown crest; majestic Japanese fantasy illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### superUltimate

```text
Solar phoenix deity reborn from light, white-gold avian body, wings shaped like radiant stained-glass sun rays, a long comet tail, halo integrated behind its crown crest, soaring vertically with wings spanning the frame; transcendent Japanese fantasy god-beast illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

---

## 4. 岩石型 Golem

身份锚点：胸口核心、石质纹理、几何符文。进化目标：石团 → 守卫 → 巨像 → 浮岛神像。

### baby

```text
Cute pebble golem companion, round mossy stone body, small glowing teal core in its chest, tiny square arms and legs, two friendly rune-like eyes, a little crystal sprout on its head, sitting with feet forward; Japanese fantasy game mascot illustration, full body, flat solid #FF00FF background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### adult

```text
Young stone guardian, same teal chest core and crystal sprout identity, blocky humanoid build, carved geometric plates, thick limbs, one arm raised as if shielding a friend, fragments of moss around its joints; Japanese fantasy creature illustration, full body, flat solid #FF00FF background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### perfect

```text
Crystalline fortress golem, towering broad silhouette, bright core protected by faceted chest armor, giant crystal shoulders and forearms, glowing runes across dark basalt, stepping forward through floating stone fragments; heroic Japanese fantasy game illustration, full body, flat solid #FF00FF background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### ultimate

```text
Mountain titan awakened, colossal humanoid rock body with a magma-gold core, cliff-like shoulders, ancient monolith crown, one hand planted below and the other reaching upward, broken boulders orbiting its body; epic Japanese fantasy illustration, full body visible, flat solid #FF00FF background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### superUltimate

```text
Primordial world-golem deity, a floating island-sized stone guardian with luminous mineral veins, a massive geometric core like a tiny sun, floating land fragments forming a halo, ancient rune slabs as wings, suspended in a solemn vertical pose; divine Japanese fantasy illustration, full body, flat solid #FF00FF background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

---

## 5. 野兽型 Beast

身份锚点：眼色、鬃毛/毛领、四足掠食者体态。进化目标：幼兽 → 狼狮猎手 → 战兽 → 神兽。

### baby

```text
Adorable fluffy beast cub, round puppy-like body, oversized paws, bright determined eyes, soft mane tuft, short wagging tail, ears perked forward, play-bowing pose; Japanese fantasy game mascot illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### adult

```text
Young wolf-lion hunter, same eye color and mane tuft identity, lean muscular four-legged body, longer muzzle, thick fur collar, tail extended for balance, sprinting low across the frame with a focused expression; Japanese fantasy creature illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### perfect

```text
Armored war beast, broad lion-wolf silhouette, mature narrow eyes, massive mane flowing backward like layered armor, plated shoulders, saber fangs, powerful leap with forepaws forward, scars and natural markings; heroic Japanese fantasy game illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### ultimate

```text
Legendary guardian beast king, enormous white-and-gold lion-wolf with a long celestial mane, antler-like crown horns, ornate armor on chest and legs, standing on a raised invisible ledge in a proud roaring side profile; majestic Japanese fantasy illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### superUltimate

```text
Divine chimera sovereign, a towering four-legged sacred beast with radiant mane shaped like sun rays, long feathered tail, crystalline crown antlers, white-gold armor and a glowing heart core, levitating in a regal descending pose; transcendent Japanese fantasy god-beast illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

---

## 6. 蛇型 Serpent

身份锚点：眼色、额角/冠、鳞片图案。进化目标：小蛇 → 水蛇 → 蛟龙 → 世界蛇神。

### baby

```text
Cute baby water serpent companion, short chubby coiled body, large curious eyes, tiny fin ears, a small forehead jewel, smooth aqua scales and a rounded tail, peeking up from a loose coil; Japanese fantasy game mascot illustration, full body, flat solid #FF00FF background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### adult

```text
Young river serpent, same forehead jewel and eye color, longer sleek scaled body forming a dramatic S curve, small fins along its neck, alert head raised high, tail sweeping across the composition; Japanese fantasy creature illustration, full body, flat solid #FF00FF background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### perfect

```text
Horned sea-dragon serpent, long muscular coils floating through the air, mature narrow eyes, elaborate fin mane, two elegant horns, iridescent armored scales, body looping into a powerful spiral around the composition; Japanese fantasy game illustration, full body, flat solid #FF00FF background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### ultimate

```text
Leviathan dragon king, massive serpentine body with several huge loops, long whiskers, sail-like fins and a crown of horns, stern godlike face, rising vertically from the lower frame with its tail coiling below; epic Japanese fantasy illustration, full body, flat solid #FF00FF background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### superUltimate

```text
World-serpent deity, immense white-blue celestial dragon body wrapping into a sacred infinity loop, radiant crown horns, constellation-like scale patterns, an ancient wise face and long flowing mane, floating in a vertical cosmic-serpent pose without a scene; divine Japanese fantasy illustration, full body, flat solid #FF00FF background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

---

## 7. 灵体型 Spirit

身份锚点：光核、眼色、羽翼/光环。进化目标：光球 → 灵使 → 天使 → 创世灵体。

### baby

```text
Tiny floating spirit companion, round glowing pearl body, two large gentle eyes, tiny leaf-like light wings, a soft halo ring, three little sparkle motes, innocent curious expression; cute Japanese fantasy game mascot illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### adult

```text
Young spirit messenger, same eye color and pearl light core, small floating humanoid silhouette with a robe-like tail, graceful light wings, delicate halo and hands extended forward, drifting diagonally through the air; Japanese fantasy creature illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### perfect

```text
Angelic guardian spirit, mature serene face, luminous armored robes, two large feather-light wings, a detailed halo behind the head, long flowing lower body made of light, hovering with one hand raised in blessing; elegant Japanese fantasy game illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### ultimate

```text
High seraph entity, tall celestial humanoid silhouette, six distinct wings arranged in an arch, layered halos, star-like core in the chest, long radiant robes, calm adult face and open arms, floating upright in a monumental pose; majestic Japanese fantasy illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### superUltimate

```text
Creator spirit deity, an abstract but readable white-gold celestial figure with an enormous geometric halo behind it, constellation wings forming a symmetric crown, a blazing heart core, flowing robe made of light ribbons, hovering vertically with divine authority; transcendent Japanese fantasy illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

---

## 8. 蟹型 Crab

身份锚点：眼柄、钳子、甲壳图案。进化目标：萌蟹 → 重甲蟹 → 海堡蟹 → 深海神蟹。

### baby

```text
Tiny cute crab companion, round glossy shell, two big eyes on short stalks, miniature raised claws, stubby legs, a small shell spiral marking, cheerful sideways shuffle pose; Japanese fantasy game mascot illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### adult

```text
Young armored crab, same eye stalk shape and shell spiral identity, wider body, one enlarged crushing claw, segmented legs in a confident sideways stance, layered shell plates, stern focused eyes; Japanese fantasy creature illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### perfect

```text
Fortress shell crab warrior, huge spiked carapace like a castle bastion, two asymmetrical weapon-like claws, six armored legs, glowing shell runes, rearing up with claws framing the body; bold Japanese fantasy game illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### ultimate

```text
Abyssal crab leviathan, colossal wide silhouette, ancient coral-and-crystal shell, multiple raised eye stalks, massive gold-edged claws spread outward, long articulated legs lifting it above the ground, deep-sea king authority; epic Japanese fantasy illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```

### superUltimate

```text
Celestial ocean-crab deity, enormous white-blue and gold carapace shaped like a sacred temple, sun-and-tide rune patterns, crown-like eye stalks, enormous crescent claws, trailing fin ribbons, floating in a dramatic diagonal god-beast pose; transcendent Japanese fantasy illustration, full body, flat solid #00FF00 background --ar 1:1 --stylize 150 --no text, watermark, logo, frame, card border, duplicate creature, cropped body
```
