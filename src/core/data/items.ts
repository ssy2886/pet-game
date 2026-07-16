import type { Food, EvolutionItem, ConsumableItem } from '../types';

export const ALL_FOODS: Record<string, Food> = {
  basic_feed: {
    id: 'basic_feed', name: '基础饲料', description: '最基本的宠物饲料，能填饱肚子。',
    growthAmount: 5, moodAmount: 5, affectionAmount: 2,
    tags: ['fill'], price: 10,
  },
  meat_meal: {
    id: 'meat_meal', name: '肉食大餐', description: '香喷喷的烤肉大餐，肉食宠物最爱。',
    growthAmount: 15, moodAmount: 12, affectionAmount: 5,
    tags: ['meat', 'spicy'], price: 50,
  },
  sweet_dessert: {
    id: 'sweet_dessert', name: '甜蜜点心', description: '精致可口的甜品，甜食宠物超喜欢。',
    growthAmount: 12, moodAmount: 15, affectionAmount: 8,
    tags: ['sweet'], price: 50,
  },
  mixed_salad: {
    id: 'mixed_salad', name: '缤纷沙拉', description: '新鲜蔬果混合沙拉，营养均衡。',
    growthAmount: 10, moodAmount: 10, affectionAmount: 5,
    tags: ['sweet', 'fill'], price: 40,
  },
  spicy_stew: {
    id: 'spicy_stew', name: '麻辣炖菜', description: '火辣辣的炖菜，嗜辣宠物的最爱。',
    growthAmount: 18, moodAmount: 10, affectionAmount: 6,
    tags: ['spicy', 'meat'], price: 60,
  },
  golden_apple: {
    id: 'golden_apple', name: '黄金苹果', description: '传说中的黄金果实，效果拔群。',
    growthAmount: 30, moodAmount: 25, affectionAmount: 15,
    tags: ['sweet'], price: 200,
  },
  star_fruit: {
    id: 'star_fruit', name: '星之果实', description: '蕴含星辰之力的神奇果实。',
    growthAmount: 25, moodAmount: 30, affectionAmount: 15,
    tags: ['sweet', 'fill'], price: 180,
  },
  flame_berry: {
    id: 'flame_berry', name: '焰火果', description: '生长在火山口的稀有果实，火系宠物最爱。',
    growthAmount: 20, moodAmount: 15, affectionAmount: 10,
    tags: ['spicy'], price: 100,
  },
  frost_melon: {
    id: 'frost_melon', name: '冰霜瓜', description: '在极寒之地生长的清甜瓜果。',
    growthAmount: 20, moodAmount: 15, affectionAmount: 10,
    tags: ['sweet'], price: 100,
  },
  supreme_feast: {
    id: 'supreme_feast', name: '至尊盛宴', description: '汇聚天下美味的终极料理。',
    growthAmount: 50, moodAmount: 40, affectionAmount: 25,
    tags: ['meat', 'sweet', 'spicy'], price: 500,
  },
};

/** 进化道具 */
export const EVOLUTION_ITEMS: Record<string, EvolutionItem> = {
  fire_stone: { id: 'fire_stone', name: '火焰石', description: '蕴含烈焰之力的奇石，用于完全体→究极体进化。', requiredStage: 'ultimate', price: 1000 },
  wind_feather: { id: 'wind_feather', name: '风神之羽', description: '蕴含风暴之力的神羽，用于完全体→究极体进化。', requiredStage: 'ultimate', price: 1000 },
  earth_core: { id: 'earth_core', name: '大地核心', description: '蕴含大地之力的晶核，用于完全体→究极体进化。', requiredStage: 'ultimate', price: 1000 },
  water_gem: { id: 'water_gem', name: '深海宝石', description: '蕴含深海之力的宝石，用于完全体→究极体进化。', requiredStage: 'ultimate', price: 1000 },
  light_crystal: { id: 'light_crystal', name: '光辉水晶', description: '蕴含神圣之力的水晶，用于完全体→究极体进化。', requiredStage: 'ultimate', price: 1000 },
};

/** 消耗品道具（糖果等） */
export const CONSUMABLE_ITEMS: Record<string, ConsumableItem> = {
  level_candy: {
    id: 'level_candy', name: '升级糖果', description: '神奇的糖果，使用后宠物直接升1级！',
    price: 200, effect: 'levelUp',
  },
  super_level_candy: {
    id: 'super_level_candy', name: '超级升级糖果', description: '闪耀着金光的糖果，使用后宠物直接升5级！',
    price: 800, effect: 'levelUp5',
  },
};
