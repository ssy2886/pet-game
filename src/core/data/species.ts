import type { PetSpecies, EvolutionStage, ElementType, Rarity } from '../types';

// ==================== 手工设计的核心宠物 ====================
// 每个都有独特名称、设定和配色

const CORE_SPECIES: PetSpecies[] = [
  // 🔥 火焰系
  {
    id: 'flame_drake', name: '焰龙兽',
    element: 'fire', color: '#f97316',
    stageNames: { baby: '焰苗兽', adult: '焰龙兽', perfect: '爆焰龙王', ultimate: '焚天焱帝', superUltimate: '灭世烬龙皇' },
    baseStats: { hp: 80, attack: 110, defense: 70, spAttack: 100, spDefense: 65, speed: 75 },
    learnableSkills: { 1: 'ember', 10: 'flame_slash', 25: 'fire_breath', 45: 'inferno', 70: 'judgment_fire' },
    preferredFoodTag: 'spicy', description: '栖息在火山深处的龙形宠物，体温高达千度。',
  },
  {
    id: 'foxfire', name: '灵狐',
    element: 'fire', color: '#fb923c',
    stageNames: { baby: '火绒狐', adult: '灵狐', perfect: '九尾焱狐', ultimate: '天照灵尊', superUltimate: '不灭金焰神' },
    baseStats: { hp: 65, attack: 75, defense: 55, spAttack: 120, spDefense: 80, speed: 105 },
    learnableSkills: { 1: 'ember', 12: 'will_o_wisp', 28: 'flame_dance', 48: 'inferno', 70: 'solar_flare' },
    preferredFoodTag: 'sweet', description: '传说中拥有九条尾巴的灵兽，每一条尾巴都蕴藏着烈焰之力。',
  },
  {
    id: 'magma_golem', name: '熔岩巨魔',
    element: 'fire', color: '#dc2626',
    stageNames: { baby: '熔岩仔', adult: '熔岩巨魔', perfect: '炙炎魔神', ultimate: '熔核暴君', superUltimate: '原始混沌之焱' },
    baseStats: { hp: 120, attack: 100, defense: 120, spAttack: 50, spDefense: 80, speed: 25 },
    learnableSkills: { 1: 'tackle', 10: 'ember', 25: 'rock_slide', 45: 'lava_eruption', 70: 'cataclysm' },
    preferredFoodTag: 'meat', description: '由火山核心的岩浆凝聚而成，行动缓慢但力量惊人。',
  },
  {
    id: 'blaze_phoenix', name: '焰凰',
    element: 'fire', color: '#fbbf24',
    stageNames: { baby: '雏焰雀', adult: '焰凰', perfect: '不灭炎凰', ultimate: '凤凰神', superUltimate: '涅槃始源凤凰' },
    baseStats: { hp: 90, attack: 80, defense: 60, spAttack: 130, spDefense: 85, speed: 110 },
    learnableSkills: { 1: 'gust', 12: 'ember', 28: 'flame_dance', 50: 'rebirth', 70: 'eternal_phoenix' },
    preferredFoodTag: 'sweet', description: '能从灰烬中重生的神鸟，浑身燃烧着永不熄灭的圣焰。',
  },
  {
    id: 'salamander', name: '火蜥',
    element: 'fire', color: '#ef4444',
    stageNames: { baby: '火蜥蜴', adult: '火蜥', perfect: '地狱火蜥', ultimate: '深渊炎魔', superUltimate: '末日焚天者' },
    baseStats: { hp: 75, attack: 95, defense: 65, spAttack: 95, spDefense: 60, speed: 85 },
    learnableSkills: { 1: 'scratch', 8: 'ember', 22: 'flame_slash', 42: 'inferno', 70: 'hellfire' },
    preferredFoodTag: 'meat', description: '生活在地底深处的蜥蜴型宠物，背上的火焰会随情绪变化颜色。',
  },

  // 🌪️ 狂风系
  {
    id: 'storm_gryphon', name: '风暴狮鹫',
    element: 'wind', color: '#60a5fa',
    stageNames: { baby: '风羽雉', adult: '风暴狮鹫', perfect: '雷霆翼王', ultimate: '九天雷帝', superUltimate: '永恒风暴之主' },
    baseStats: { hp: 85, attack: 90, defense: 70, spAttack: 105, spDefense: 75, speed: 115 },
    learnableSkills: { 1: 'gust', 10: 'wing_attack', 25: 'thunder_feather', 45: 'storm_call', 70: 'tempest_judgment' },
    preferredFoodTag: 'meat', description: '翱翔于九天之上的传说生物，双翼展开能掀起风暴。',
  },
  {
    id: 'cloud_dragon', name: '云龙',
    element: 'wind', color: '#93c5fd',
    stageNames: { baby: '云小蛟', adult: '云龙', perfect: '腾云苍龙', ultimate: '擎天应龙', superUltimate: '太虚原始龙' },
    baseStats: { hp: 95, attack: 85, defense: 75, spAttack: 115, spDefense: 80, speed: 95 },
    learnableSkills: { 1: 'gust', 12: 'dragon_breath', 28: 'storm_call', 48: 'typhoon', 70: 'celestial_wind' },
    preferredFoodTag: 'sweet', description: '以云霞为食的龙族，能在天空中隐形，只留下一道彩虹轨迹。',
  },
  {
    id: 'zephyr_fairy', name: '风灵',
    element: 'wind', color: '#bae6fd',
    stageNames: { baby: '风铃花', adult: '风灵', perfect: '幻风精灵', ultimate: '大气主宰', superUltimate: '创世之风' },
    baseStats: { hp: 60, attack: 55, defense: 50, spAttack: 130, spDefense: 95, speed: 120 },
    learnableSkills: { 1: 'gust', 8: 'heal_wind', 22: 'magic_breeze', 42: 'spirit_storm', 70: 'genesis_wind' },
    preferredFoodTag: 'sweet', description: '由纯净的风之精华凝聚而成的精灵，性情温和但力量不可小觑。',
  },
  {
    id: 'thunder_bird', name: '雷鸟',
    element: 'wind', color: '#818cf8',
    stageNames: { baby: '幼雷鸟', adult: '雷鸟', perfect: '轰雷战鸟', ultimate: '雷帝', superUltimate: '万雷主宰' },
    baseStats: { hp: 80, attack: 110, defense: 60, spAttack: 95, spDefense: 65, speed: 125 },
    learnableSkills: { 1: 'peck', 10: 'thunder_feather', 25: 'storm_call', 45: 'lightning_strike', 70: 'thunder_god' },
    preferredFoodTag: 'meat', description: '古代雷神的使者，每一次振翅都伴随着雷鸣电闪。',
  },
  {
    id: 'wind_serpent', name: '风蛇',
    element: 'wind', color: '#a5b4fc',
    stageNames: { baby: '风环蛇', adult: '风蛇', perfect: '暴风巨蟒', ultimate: '飓风之主', superUltimate: '吞天之风' },
    baseStats: { hp: 70, attack: 85, defense: 70, spAttack: 100, spDefense: 70, speed: 105 },
    learnableSkills: { 1: 'tail_slap', 10: 'gust', 25: 'whirlwind', 45: 'typhoon', 70: 'world_eater' },
    preferredFoodTag: 'meat', description: '能化身飓风在天地间穿梭的蛇形宠物，速度冠绝同类。',
  },

  // 🪨 大地系
  {
    id: 'stone_titan', name: '石巨人',
    element: 'earth', color: '#a8a29e',
    stageNames: { baby: '小石怪', adult: '石巨人', perfect: '山岭巨神', ultimate: '大地之铠', superUltimate: '创世磐岩' },
    baseStats: { hp: 130, attack: 100, defense: 130, spAttack: 40, spDefense: 90, speed: 20 },
    learnableSkills: { 1: 'tackle', 8: 'rock_slide', 22: 'iron_defense', 42: 'earthquake', 70: 'gaia_bash' },
    preferredFoodTag: 'meat', description: '由万年岩石凝聚而成的巨人，拥有无与伦比的防御力。',
  },
  {
    id: 'forest_guardian', name: '森之守护者',
    element: 'earth', color: '#4ade80',
    stageNames: { baby: '树苗精', adult: '森之守护者', perfect: '古树之王', ultimate: '世界之树', superUltimate: '翡翠梦境领主' },
    baseStats: { hp: 110, attack: 70, defense: 95, spAttack: 105, spDefense: 100, speed: 40 },
    learnableSkills: { 1: 'vine_whip', 10: 'heal_wind', 25: 'nature_blessing', 45: 'forest_domain', 70: 'eden_guardian' },
    preferredFoodTag: 'sweet', description: '古老森林的守护者，与大自然融为一体，拥有治愈一切的力量。',
  },
  {
    id: 'crystal_drake', name: '晶龙',
    element: 'earth', color: '#c084fc',
    stageNames: { baby: '小晶兽', adult: '晶龙', perfect: '钻石巨龙', ultimate: '永恒水晶龙', superUltimate: '星辉晶神' },
    baseStats: { hp: 95, attack: 90, defense: 110, spAttack: 90, spDefense: 100, speed: 55 },
    learnableSkills: { 1: 'tackle', 12: 'rock_slide', 28: 'crystal_shield', 48: 'diamond_storm', 70: 'stellar_prism' },
    preferredFoodTag: 'sweet', description: '全身覆盖着珍贵晶石的龙族，每一片鳞片都是一颗完美的宝石。',
  },
  {
    id: 'mole_king', name: '钻地王',
    element: 'earth', color: '#78716c',
    stageNames: { baby: '钻地鼠', adult: '钻地王', perfect: '遁地魔王', ultimate: '地心霸王', superUltimate: '深渊破坏神' },
    baseStats: { hp: 85, attack: 115, defense: 85, spAttack: 55, spDefense: 70, speed: 95 },
    learnableSkills: { 1: 'scratch', 8: 'dig', 22: 'rock_slide', 42: 'earthquake', 70: 'core_breaker' },
    preferredFoodTag: 'meat', description: '能在地底深处自由穿行的王者，对地心结构了如指掌。',
  },
  {
    id: 'mountain_ram', name: '岩羊',
    element: 'earth', color: '#d6d3d1',
    stageNames: { baby: '小岩羊', adult: '岩羊', perfect: '铁角战羊', ultimate: '崩山圣羊', superUltimate: '洪荒始祖羊' },
    baseStats: { hp: 90, attack: 105, defense: 95, spAttack: 60, spDefense: 75, speed: 70 },
    learnableSkills: { 1: 'headbutt', 10: 'rock_slide', 25: 'iron_defense', 45: 'mountain_crash', 70: 'continental_split' },
    preferredFoodTag: 'sweet', description: '栖息在最高山峰上的珍稀宠物，双角能撞碎整座山头。',
  },

  // 🌊 流水系
  {
    id: 'sea_serpent', name: '海龙兽',
    element: 'water', color: '#3b82f6',
    stageNames: { baby: '海幼龙', adult: '海龙兽', perfect: '深渊海龙', ultimate: '怒涛龙王', superUltimate: '无尽深渊之主' },
    baseStats: { hp: 100, attack: 85, defense: 80, spAttack: 110, spDefense: 85, speed: 65 },
    learnableSkills: { 1: 'water_gun', 10: 'tidal_wave', 25: 'ice_beam', 45: 'tsunami', 70: 'abyss_judgment' },
    preferredFoodTag: 'meat', description: '统御七海的龙族王者，掀起的巨浪能吞没整座城市。',
  },
  {
    id: 'frost_spirit', name: '霜灵',
    element: 'water', color: '#7dd3fc',
    stageNames: { baby: '冰晶仔', adult: '霜灵', perfect: '雪域精灵', ultimate: '永冻之母', superUltimate: '绝对零度神' },
    baseStats: { hp: 70, attack: 60, defense: 65, spAttack: 125, spDefense: 95, speed: 100 },
    learnableSkills: { 1: 'ice_shard', 10: 'frost_breath', 25: 'blizzard', 45: 'absolute_zero', 70: 'eternal_winter' },
    preferredFoodTag: 'sweet', description: '诞生于极寒之地的冰之精灵，触碰之物都会瞬间冰封。',
  },
  {
    id: 'tidal_kraken', name: '潮汐巨妖',
    element: 'water', color: '#1d4ed8',
    stageNames: { baby: '小触手', adult: '潮汐巨妖', perfect: '深渊之触', ultimate: '深海恐惧', superUltimate: '远古旧日支配者' },
    baseStats: { hp: 115, attack: 105, defense: 95, spAttack: 80, spDefense: 80, speed: 35 },
    learnableSkills: { 1: 'tentacle', 12: 'water_gun', 28: 'tidal_wave', 48: 'abyss_grip', 70: 'elder_horror' },
    preferredFoodTag: 'meat', description: '沉睡在深海沟壑中的远古巨兽，传说它醒来之日便是世界末日。',
  },
  {
    id: 'rainbow_fish', name: '虹鳞鱼',
    element: 'water', color: '#38bdf8',
    stageNames: { baby: '小彩鱼', adult: '虹鳞鱼', perfect: '七彩虹鲤', ultimate: '星河鲲', superUltimate: '宇宙鲲鹏' },
    baseStats: { hp: 75, attack: 70, defense: 60, spAttack: 110, spDefense: 75, speed: 95 },
    learnableSkills: { 1: 'water_gun', 8: 'rainbow_beam', 22: 'heal_wind', 42: 'tsunami', 70: 'galaxy_splash' },
    preferredFoodTag: 'sweet', description: '拥有七彩鳞片的神奇鱼类，传说见到它的人会有好运降临。',
  },
  {
    id: 'crab_king', name: '巨蟹王',
    element: 'water', color: '#2563eb',
    stageNames: { baby: '小蟹将', adult: '巨蟹王', perfect: '铁甲巨蟹', ultimate: '深渊战神蟹', superUltimate: '宇宙巨蟹神' },
    baseStats: { hp: 100, attack: 120, defense: 110, spAttack: 50, spDefense: 85, speed: 45 },
    learnableSkills: { 1: 'claw', 10: 'water_gun', 25: 'iron_defense', 45: 'tidal_wave', 70: 'crushing_claw' },
    preferredFoodTag: 'meat', description: '身披重甲的海中战神，一对巨钳能夹断最坚硬的珊瑚。',
  },

  // ✨ 光辉系（仅紫品及以上）
  {
    id: 'celestial_dragon', name: '圣光龙',
    element: 'light', color: '#fbbf24',
    stageNames: { baby: '光鳞龙', adult: '圣光龙', perfect: '天界圣龙', ultimate: '神王龙', superUltimate: '始源光明龙神' },
    baseStats: { hp: 105, attack: 90, defense: 85, spAttack: 125, spDefense: 100, speed: 85 },
    learnableSkills: { 1: 'light_beam', 12: 'holy_breath', 28: 'divine_shield', 48: 'judgment', 70: 'genesis_light' },
    preferredFoodTag: 'sweet', description: '来自天界的神圣之龙，象征着光明与希望，是黑暗的绝对克星。',
  },
  {
    id: 'mirage_spirit', name: '幻影',
    element: 'light', color: '#e879f9',
    stageNames: { baby: '小幻光', adult: '幻影', perfect: '幻梦境之主', ultimate: '虚实行者', superUltimate: '超维幻神' },
    baseStats: { hp: 70, attack: 80, defense: 55, spAttack: 120, spDefense: 70, speed: 130 },
    learnableSkills: { 1: 'confusion', 10: 'light_beam', 25: 'mirage', 45: 'dimension_tear', 70: 'reality_breaker' },
    preferredFoodTag: 'sweet', description: '游走于现实与幻境之间的神秘存在，没有人能看清它的真面目。',
  },
  {
    id: 'judgment_beast', name: '裁决圣兽',
    element: 'light', color: '#fde047',
    stageNames: { baby: '裁决小兽', adult: '裁决圣兽', perfect: '律法之兽', ultimate: '天罚圣王', superUltimate: '至高审判座' },
    baseStats: { hp: 100, attack: 115, defense: 90, spAttack: 100, spDefense: 95, speed: 80 },
    learnableSkills: { 1: 'light_beam', 10: 'holy_breath', 25: 'judgment', 45: 'divine_punishment', 70: 'last_judgment' },
    preferredFoodTag: 'meat', description: '执行天界律法的圣兽，对一切邪恶施以毫不留情的审判。',
  },
  {
    id: 'starlight_maiden', name: '星光圣女',
    element: 'light', color: '#c4b5fd',
    stageNames: { baby: '小星灵', adult: '星光圣女', perfect: '银河圣女', ultimate: '星海女神', superUltimate: '宇宙创世神' },
    baseStats: { hp: 85, attack: 50, defense: 65, spAttack: 135, spDefense: 110, speed: 95 },
    learnableSkills: { 1: 'light_beam', 8: 'heal_wind', 22: 'starlight', 42: 'galaxy_blessing', 70: 'big_bang' },
    preferredFoodTag: 'sweet', description: '从星辰中诞生的神圣存在，指尖流淌着银河的光芒。',
  },
];

// ==================== 自动生成批量种族 ====================

// 名称生成组件
const PREFIXES: Record<ElementType, string[]> = {
  fire:  ['焰', '炎', '燃', '灼', '烈', '爆', '炙', '燎', '焚'],
  wind:  ['风', '雷', '云', '闪', '疾', '迅', '飘', '岚', '霆'],
  earth: ['岩', '山', '石', '矿', '沙', '土', '铁', '钢', '磐'],
  water: ['水', '冰', '霜', '雪', '海', '潮', '泉', '汐', '渊'],
  light: ['光', '圣', '辉', '星', '天', '白', '耀', '煌', '晶'],
};

const SUFFIXES: Record<ElementType, string[]> = {
  fire:  ['兽', '龙', '鸟', '蛇', '狼', '狮', '犬', '蜥', '蝠', '鸦', '豹', '虎', '隼'],
  wind:  ['鸟', '隼', '龙', '雕', '燕', '蝶', '鹤', '莺', '鹰', '鸢', '鹏', '枭'],
  earth: ['兽', '龙', '龟', '甲', '王', '盾', '像', '熊', '牛', '猿', '甲虫', '蝎'],
  water: ['兽', '龙', '蛇', '龟', '鱼', '鲸', '豚', '鲨', '蟹', '贝', '鳗', '鳄', '水母'],
  light: ['兽', '龙', '使', '灵', '女', '子', '士', '骑士', '天使', '神', '童', '姬'],
};

const QUALITY_NAMES: Record<EvolutionStage, string[]> = {
  baby: ['小', '幼', '雏', '仔', '宝', '萌'],
  adult: ['', '', '', '', '', ''],
  perfect: ['大', '巨', '战', '铁', '重', '玄'],
  ultimate: ['王', '皇', '帝', '圣', '神', '尊', '霸', '天'],
  superUltimate: ['创世', '原始', '至高', '永恒', '无限', '超', '始源', '灭世', '混沌', '太初'],
};

function randFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}


let autoIdCounter = 1000;

/** 生成一批自动命名的宠物 */
export function generateAutoSpecies(count: number): PetSpecies[] {
  const result: PetSpecies[] = [];

  for (let i = 0; i < count; i++) {
    const element = randFrom(['fire', 'wind', 'earth', 'water'] as ElementType[]);
    const prefix = randFrom(PREFIXES[element]);
    const suffix = randFrom(SUFFIXES[element]);
    const baseName = `${prefix}${suffix}`;
    const id = `auto_${autoIdCounter++}`;

    // 为每个阶段生成名字
    const babyName = `${randFrom(QUALITY_NAMES.baby)}${baseName}`;
    const adultName = baseName;
    const perfectName = `${randFrom(QUALITY_NAMES.perfect)}${baseName}`;
    const ultimateName = `${randFrom(QUALITY_NAMES.ultimate)}${baseName}`;
    const superUltimateName = `${randFrom(QUALITY_NAMES.superUltimate)}${randFrom(QUALITY_NAMES.ultimate)}${baseName}`;

    // 随机基础属性（总和 450-500）
    const totalStats = 450 + Math.floor(Math.random() * 50);
    const hp = 60 + Math.floor(Math.random() * 60);
    const remaining = totalStats - hp;
    const atk = 45 + Math.floor(Math.random() * 50);
    const def = 45 + Math.floor(Math.random() * 50);
    const spa = 45 + Math.floor(Math.random() * 50);
    const spd = 45 + Math.floor(Math.random() * 50);
    const spe = remaining - (atk + def + spa + spd - 180);

    // 基础颜色
    const colors: Record<ElementType, string> = {
      fire: '#f97316', wind: '#60a5fa', earth: '#a8a29e', water: '#3b82f6', light: '#fbbf24',
    };

    // 随机技能
    const elementSkills: Record<ElementType, string[]> = {
      fire: ['ember', 'flame_slash', 'fire_breath', 'inferno'],
      wind: ['gust', 'wing_attack', 'storm_call', 'typhoon'],
      earth: ['tackle', 'rock_slide', 'earthquake', 'iron_defense'],
      water: ['water_gun', 'tidal_wave', 'ice_beam', 'tsunami'],
      light: ['light_beam', 'holy_breath', 'judgment', 'heal_wind'],
    };

    const skills = elementSkills[element];
    const learnableSkills: Record<number, string> = {
      1: skills[0],
      12: skills[1],
      28: skills[2],
      48: skills[3],
    };

    result.push({
      id,
      name: adultName,
      element,
      color: colors[element],
      stageNames: {
        baby: babyName,
        adult: adultName,
        perfect: perfectName,
        ultimate: ultimateName,
        superUltimate: superUltimateName,
      },
      baseStats: { hp, attack: atk, defense: def, spAttack: spa, spDefense: spd, speed: Math.max(20, spe) },
      learnableSkills,
      preferredFoodTag: Math.random() > 0.5 ? 'meat' : 'sweet',
      description: `栖息在${['火山', '森林', '洞穴', '深海', '云层'][Math.floor(Math.random() * 5)]}的神秘${suffix}型宠物。`,
    });
  }

  return result;
}

// ==================== 导出所有物种 ====================

/** 所有物种的完整列表（手动 + 自动生成） */
const LEGACY_SPECIES: PetSpecies[] = [
  ...CORE_SPECIES,
  ...generateAutoSpecies(180), // 补充到约 200 种
  {
    id: 'hell_hound', name: '地狱犬',
    element: 'fire', color: '#dc2626',
    stageNames: { baby: '小火犬', adult: '地狱犬', perfect: '三头地狱犬', ultimate: '深渊守门者', superUltimate: '冥界之主' },
    baseStats: { hp: 85, attack: 105, defense: 75, spAttack: 90, spDefense: 70, speed: 95 },
    learnableSkills: { 1: 'ember', 12: 'flame_slash', 28: 'inferno', 48: 'hellfire' },
    preferredFoodTag: 'meat', description: '来自地狱深处的三头恶犬。',
  },
  {
    id: 'feather_drake', name: '羽龙',
    element: 'wind', color: '#93c5fd',
    stageNames: { baby: '绒羽龙', adult: '羽龙', perfect: '天翔龙', ultimate: '苍穹龙王', superUltimate: '无限大空之神' },
    baseStats: { hp: 80, attack: 75, defense: 65, spAttack: 105, spDefense: 75, speed: 120 },
    learnableSkills: { 1: 'gust', 10: 'wing_attack', 25: 'storm_call', 45: 'typhoon' },
    preferredFoodTag: 'sweet', description: '浑身覆盖着洁白羽毛的龙族。',
  },
  {
    id: 'boulder_tortoise', name: '岩龟',
    element: 'earth', color: '#78716c',
    stageNames: { baby: '小岩龟', adult: '岩龟', perfect: '铁甲巨龟', ultimate: '不动明王龟', superUltimate: '世界之龟' },
    baseStats: { hp: 140, attack: 80, defense: 140, spAttack: 45, spDefense: 100, speed: 15 },
    learnableSkills: { 1: 'tackle', 8: 'rock_slide', 22: 'iron_defense', 42: 'earthquake' },
    preferredFoodTag: 'sweet', description: '背负岩石巨壳的古龟。',
  },
  {
    id: 'ice_wolf', name: '冰狼',
    element: 'water', color: '#60a5fa',
    stageNames: { baby: '冰牙狼', adult: '冰狼', perfect: '极寒狼王', ultimate: '永冻天狼', superUltimate: '噬星冰兽' },
    baseStats: { hp: 95, attack: 110, defense: 75, spAttack: 85, spDefense: 75, speed: 90 },
    learnableSkills: { 1: 'ice_shard', 10: 'frost_breath', 25: 'blizzard', 45: 'absolute_zero' },
    preferredFoodTag: 'meat', description: '漫步在极地冰原的狼族王者。',
  },
  {
    id: 'aurora_fox', name: '极光狐',
    element: 'light', color: '#c084fc',
    stageNames: { baby: '小光狐', adult: '极光狐', perfect: '天狐', ultimate: '九尾天狐', superUltimate: '创世灵狐' },
    baseStats: { hp: 80, attack: 70, defense: 60, spAttack: 125, spDefense: 85, speed: 115 },
    learnableSkills: { 1: 'light_beam', 10: 'mirage', 25: 'starlight', 45: 'galaxy_blessing' },
    preferredFoodTag: 'sweet', description: '拖曳着极光般绚烂尾巴的灵狐。',
  },
];

/** 按 ID 查找物种 */
const SUPPORTED_SPECIES_ID_SET = new Set(['flame_drake', 'mirage_spirit', 'judgment_beast'])

/** Currently playable species are limited to completed PNG body families. */
export const ALL_SPECIES: PetSpecies[] = LEGACY_SPECIES.filter(species => SUPPORTED_SPECIES_ID_SET.has(species.id))

export function getSpecies(id: string): PetSpecies | undefined {
  return ALL_SPECIES.find(s => s.id === id);
}

/** 按元素分类 */
export function getSpeciesByElement(element: ElementType): PetSpecies[] {
  return ALL_SPECIES.filter(s => s.element === element);
}

/** 按稀有度区间获取可用物种 */
export function getSpeciesByRarity(rarity: Rarity): PetSpecies[] {
  const rarityPool: Record<Rarity, number> = {
    green: 0,
    blue: 1,
    purple: 2,
    orange: 3,
    red: 4,
    gold: 5,
  };

  return ALL_SPECIES.filter(s => {
    // light 元素只在紫品及以上出现
    if (s.element === 'light' && rarityPool[rarity] < 2) return false;
    return true;
  });
}
