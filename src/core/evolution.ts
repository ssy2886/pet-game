import type { Pet, EvolutionStage, Stats } from './types';
import { STAGE_ORDER } from './types';
import { getSpecies } from './data/species';

export interface EvolutionResult {
  canEvolve: boolean;
  nextStage: EvolutionStage | null;
  reason?: string;
}

const EVOLUTION_REQUIREMENTS: Record<EvolutionStage, { level: number; affection: number; growth: number; needItem: boolean }> = {
  baby:          { level: 10,  affection: 30,  growth: 50,  needItem: false },
  adult:         { level: 25,  affection: 60,  growth: 70,  needItem: false },
  perfect:       { level: 45,  affection: 100, growth: 90,  needItem: true },
  ultimate:      { level: 70,  affection: 150, growth: 100, needItem: false },
  superUltimate: { level: 99,  affection: 200, growth: 100, needItem: false }, // 不可通过常规进化达成
};

/** 检查宠物是否能进化 */
export function checkEvolution(pet: Pet): EvolutionResult {
  const currentIndex = STAGE_ORDER.indexOf(pet.stage);
  if (currentIndex >= STAGE_ORDER.length - 1) {
    return { canEvolve: false, nextStage: null, reason: '已达到最高形态' };
  }

  const nextStage = STAGE_ORDER[currentIndex + 1];
  const req = EVOLUTION_REQUIREMENTS[nextStage];

  // 终极体需要额外条件，不在此检查
  if (nextStage === 'superUltimate') {
    return { canEvolve: false, nextStage: null, reason: '终极体需要完成特殊挑战' };
  }

  if (pet.level < req.level) {
    return { canEvolve: false, nextStage, reason: `需要等级 ${req.level}，当前 ${pet.level}` };
  }
  if (pet.affection < req.affection) {
    return { canEvolve: false, nextStage, reason: `需要亲密度 ${req.affection}，当前 ${pet.affection}` };
  }
  if (pet.growth < req.growth) {
    return { canEvolve: false, nextStage, reason: `需要成长值 ${req.growth}%，当前 ${pet.growth}%` };
  }

  return { canEvolve: true, nextStage };
}

/** 执行进化 */
export function evolvePet(pet: Pet): Pet {
  const check = checkEvolution(pet);
  if (!check.canEvolve || !check.nextStage) return pet;

  const species = getSpecies(pet.speciesId);
  if (!species) return pet;

  const newStage = check.nextStage;
  const oldStage = pet.stage;

  // 计算新形态下的属性提升
  const stageMultiplier = getStageMultiplier(newStage);
  const oldMultiplier = getStageMultiplier(oldStage);
  const factor = stageMultiplier / oldMultiplier;

  const oldStats = pet.stats;
  const newStats: Stats = {
    hp: Math.floor(oldStats.hp * factor + 10),
    attack: Math.floor(oldStats.attack * factor + 5),
    defense: Math.floor(oldStats.defense * factor + 5),
    spAttack: Math.floor(oldStats.spAttack * factor + 5),
    spDefense: Math.floor(oldStats.spDefense * factor + 5),
    speed: Math.floor(oldStats.speed * factor + 5),
  };

  // 进化时恢复满亲密度和心情
  return {
    ...pet,
    stage: newStage,
    stats: newStats,
    nickname: species.stageNames[newStage],
    affection: Math.min(pet.affection + 10, 200),
    mood: 100,
  };
}

/** 不同阶段的属性倍率 */
function getStageMultiplier(stage: EvolutionStage): number {
  switch (stage) {
    case 'baby': return 1.0;
    case 'adult': return 1.4;
    case 'perfect': return 1.9;
    case 'ultimate': return 2.5;
    case 'superUltimate': return 3.5;
  }
}
