// ============ 枚举 / 常量类型 ============

export type ElementType = 'fire' | 'wind' | 'earth' | 'water' | 'light';

export const ELEMENTS: ElementType[] = ['fire', 'wind', 'earth', 'water', 'light'];

export const ELEMENT_LABELS: Record<ElementType, string> = {
  fire: '🔥 火焰',
  wind: '🌪️ 狂风',
  earth: '🪨 大地',
  water: '🌊 流水',
  light: '✨ 光辉',
};

export type Rarity = 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'gold';

export const RARITY_ORDER: Rarity[] = ['green', 'blue', 'purple', 'orange', 'red', 'gold'];

export const RARITY_LABELS: Record<Rarity, string> = {
  green: '绿',
  blue: '蓝',
  purple: '紫',
  orange: '橙',
  red: '红',
  gold: '金',
};

export const RARITY_COLORS: Record<Rarity, string> = {
  green: '#4ade80',
  blue: '#60a5fa',
  purple: '#a78bfa',
  orange: '#fb923c',
  red: '#f87171',
  gold: '#facc15',
};

export type EvolutionStage = 'baby' | 'adult' | 'perfect' | 'ultimate' | 'superUltimate';

export const STAGE_ORDER: EvolutionStage[] = ['baby', 'adult', 'perfect', 'ultimate', 'superUltimate'];

export const STAGE_LABELS: Record<EvolutionStage, string> = {
  baby: '幼体',
  adult: '成体',
  perfect: '完全体',
  ultimate: '究极体',
  superUltimate: '终极体',
};

// ============ 核心数据模型 ============

/** 宠物品种的静态定义（类似图鉴条目） */
export interface PetSpecies {
  id: string;
  name: string;
  element: ElementType;
  /** 每个形态的名称（进化后名字会变） */
  stageNames: Record<EvolutionStage, string>;
  /** 基础种族值，品质会在此基础上乘系数 */
  baseStats: Stats;
  /** 可学会的技能 (等级 -> 技能ID) */
  learnableSkills: Record<number, string>;
  /** 偏好食物标签 */
  preferredFoodTag?: string;
  color: string; // 主色调，用于 CSS Art
  description: string;
}

/** 个体宠物实例 */
export interface Pet {
  id: string;
  speciesId: string;
  nickname?: string;
  rarity: Rarity;
  stage: EvolutionStage;
  element: ElementType;
  level: number;
  exp: number;
  stats: Stats;
  ivs: Stats;       // 个体值 (0-31)
  evs: Stats;       // 努力值
  skills: string[];
  /** 互动状态 */
  affection: number;    // 亲密度 0-200
  cleanliness: number;  // 清洁度 0-100
  mood: number;         // 心情 0-100
  growth: number;       // 成长值 0-100
  isHatched: boolean;
  obtainedAt: number;   // 获得时间戳
}

export interface Stats {
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
}

// ============ 技能 ============

export interface Skill {
  id: string;
  name: string;
  element: ElementType;
  power: number;
  accuracy: number;
  description: string;
  /** 特殊效果 */
  effect?: SkillEffect;
  pp: number; // 使用次数
}

export interface SkillEffect {
  type: 'dot' | 'debuff' | 'buff' | 'heal' | 'recoil';
  target: 'self' | 'enemy';
  stat?: keyof Stats | 'accuracy';
  amount: number;
  chance: number;
  duration: number;
}

// ============ 道具 ============

export interface Food {
  id: string;
  name: string;
  description: string;
  growthAmount: number;   // 增加成长值
  moodAmount: number;     // 增加心情
  affectionAmount: number;// 增加亲密度
  tags: string[];         // 风味标签
  price: number;
}

export interface EvolutionItem {
  id: string;
  name: string;
  description: string;
  requiredStage: EvolutionStage;
  price: number;
}

export interface ConsumableItem {
  id: string;
  name: string;
  description: string;
  price: number;
  effect: 'levelUp' | 'levelUp5';
}

// ============ 蛋 ============

export interface Egg {
  id: string;
  rarity: Rarity;
  speciesId: string | null;  // null = 未确定，抽到才知道
  /** 孵化进度 (0-100)，通过互动/时间累积 */
  hatchProgress: number;
  obtainedAt: number;
}

// ============ 战斗 ============

export type BattleActionType = 'skill' | 'defend' | 'item' | 'flee';

export interface BattleAction {
  type: BattleActionType;
  skillIndex?: number;
}

export interface BattlePet {
  pet: Pet;
  currentHp: number;
  currentPp: Record<string, number>; // skillId -> remaining PP
  buffs: Buff[];
}

export interface Buff {
  id: string;
  stat: keyof Stats | 'accuracy';
  amount: number;
  duration: number;
  target: 'self' | 'enemy';
}

export interface BattleState {
  playerPets: BattlePet[];
  enemyPet: BattlePet;
  turn: number;
  phase: 'playerAction' | 'executing' | 'won' | 'lost';
  log: string[];
}

// ============ 探险 ============

export type MapTheme = 'volcano' | 'forest' | 'cave' | 'ocean' | 'ruins';

export interface MapNode {
  id: string;
  type: 'battle' | 'chest' | 'heal' | 'boss';
  completed: boolean;
  connections: string[];  // 相连节点ID
}

export interface ExpeditionMap {
  id: string;
  theme: MapTheme;
  nodes: MapNode[];
  currentPosition: string;
  completed: boolean;
}
