import type { Rarity, PetSpecies } from './types';
import { RARITY_ORDER } from './types';
import { ALL_SPECIES } from './data/species';

/** 蛋池各稀有度概率 */
const GACHA_RATES: Record<Rarity, number> = {
  green: 0.35,
  blue: 0.30,
  purple: 0.20,
  orange: 0.10,
  red: 0.04,
  gold: 0.01,
};

/** 保底计数 (100抽必出金) */
const PITY_THRESHOLD = 100;

/** 可用于抽奖的元素池（光辉系只从紫品开始出现） */
function getAvailableSpeciesForRarity(rarity: Rarity): PetSpecies[] {
  const rarityIndex = RARITY_ORDER.indexOf(rarity);
  return ALL_SPECIES.filter(s => {
    // Light 元素只在紫品及以上出现
    if (s.element === 'light' && rarityIndex < 2) return false;
    return true;
  });
}

/** 从稀有度分布中抽取一个品质 */
export function rollRarity(pityCount: number): Rarity {
  // 保底：达到阈值必出金
  if (pityCount >= PITY_THRESHOLD - 1) return 'gold';

  const rand = Math.random();
  let cumulative = 0;

  for (const rarity of RARITY_ORDER) {
    let rate = GACHA_RATES[rarity];

    // 软保底：超过 70 抽后逐步提升概率
    if (rarity === 'gold' && pityCount > 70) {
      rate += (pityCount - 70) * 0.003;
    }

    cumulative += rate;
    if (rand < cumulative) return rarity;
  }

  return 'green'; // fallback
}

/** 从指定品质中随机选一个物种 */
export function rollSpecies(rarity: Rarity): PetSpecies {
  const pool = getAvailableSpeciesForRarity(rarity);
  if (pool.length === 0) return ALL_SPECIES[0];
  return pool[Math.floor(Math.random() * pool.length)];
}

/** 根据品质计算个体值范围 */
export function generateIVs(rarity: Rarity): { hp: number; attack: number; defense: number; spAttack: number; spDefense: number; speed: number } {
  const ranges: Record<Rarity, { min: number; max: number }> = {
    green:  { min: 0, max: 15 },
    blue:   { min: 5, max: 20 },
    purple: { min: 10, max: 25 },
    orange: { min: 15, max: 28 },
    red:    { min: 20, max: 30 },
    gold:   { min: 25, max: 31 },
  };

  const range = ranges[rarity];
  const stats = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'] as const;
  const result: any = {};
  for (const stat of stats) {
    result[stat] = range.min + Math.floor(Math.random() * (range.max - range.min + 1));
  }
  return result;
}
