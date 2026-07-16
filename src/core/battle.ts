import type { Pet, Skill, BattlePet, BattleState, BattleAction, Stats } from './types';
import { getSkill } from './data/skills';
import { getEffectiveness } from './data/elements';

/** 创建战斗用宠物实例 */
export function createBattlePet(pet: Pet): BattlePet {
  const pp: Record<string, number> = {};
  for (const skillId of pet.skills) {
    const skill = getSkill(skillId);
    pp[skillId] = skill ? skill.pp : 20;
  }
  return {
    pet,
    currentHp: pet.stats.hp,
    currentPp: pp,
    buffs: [],
  };
}

/** 计算伤害 */
function calculateDamage(
  attacker: BattlePet,
  defender: BattlePet,
  skill: Skill,
): number {
  const atkStat = skill.element === 'fire' || skill.element === 'wind'
    ? attacker.pet.stats.spAttack
    : attacker.pet.stats.attack;

  const defStat = skill.element === 'fire' || skill.element === 'wind'
    ? defender.pet.stats.spDefense
    : defender.pet.stats.defense;

  // 基础伤害公式
  const level = attacker.pet.level;
  const baseDamage = ((2 * level / 5 + 2) * skill.power * atkStat / defStat) / 50 + 2;

  // 属性克制
  const effectiveness = getEffectiveness(skill.element, defender.pet.element);

  // 随机浮动 (0.85-1.0)
  const random = 0.85 + Math.random() * 0.15;

  // 亲密度暴击加成 (亲密度 > 100 时 10% 暴击率)
  const crit = attacker.pet.affection > 100 && Math.random() < 0.1 ? 1.5 : 1.0;

  const totalDamage = Math.floor(baseDamage * effectiveness * random * crit);
  return Math.max(1, totalDamage);
}

/** 处理技能效果 */
function applySkillEffect(battlePet: BattlePet, skill: Skill, isPlayer: boolean): string[] {
  const logs: string[] = [];
  if (!skill.effect) return logs;

  const { effect } = skill;
  const target = effect.target === 'self' ? battlePet
    : isPlayer ? battlePet // simplified - in real battle would affect enemy
    : battlePet;

  if (effect.type === 'heal') {
    const healAmount = Math.floor(target.pet.stats.hp * (effect.amount / 100));
    target.currentHp = Math.min(target.pet.stats.hp, target.currentHp + healAmount);
    logs.push(`${target.pet.nickname || target.pet.speciesId} 回复了 ${healAmount} 点生命！`);
  }

  if (effect.type === 'buff' && effect.stat) {
    target.buffs.push({
      id: `${skill.id}_${Date.now()}`,
      stat: effect.stat,
      amount: effect.amount,
      duration: effect.duration,
      target: 'self',
    });
    logs.push(`${target.pet.nickname || target.pet.speciesId} 的${effect.stat}提升了！`);
  }

  return logs;
}

/** 执行战斗回合 */
export function executeTurn(state: BattleState, playerAction: BattleAction): BattleState {
  const player = state.playerPets[0]; // 当前只支持单宠出战
  const enemy = state.enemyPet;
  const logs: string[] = [...state.log];

  // 玩家行动
  if (playerAction.type === 'skill' && playerAction.skillIndex !== undefined) {
    const skillId = player.pet.skills[playerAction.skillIndex];
    const skill = getSkill(skillId);
    if (skill && player.currentPp[skillId] > 0) {
      player.currentPp[skillId]--;

      // 命中判定
      if (Math.random() * 100 < skill.accuracy) {
        const damage = calculateDamage(player, enemy, skill);
        enemy.currentHp = Math.max(0, enemy.currentHp - damage);

        // 属性克制文字
        const eff = getEffectiveness(skill.element, enemy.pet.element);
        const effText = eff >= 2 ? '💥 效果拔群！' : eff <= 0.5 ? '🔽 效果不佳...' : '';
        logs.push(`${player.pet.nickname || player.pet.speciesId} 使用了 ${skill.name}！${effText}`);
        logs.push(`造成 ${damage} 点伤害！`);

        // 技能特效
        const effectLogs = applySkillEffect(player, skill, true);
        logs.push(...effectLogs);
      } else {
        logs.push(`${skill.name} 没有命中！`);
      }
    } else {
      logs.push('技能无法使用！');
    }
  } else if (playerAction.type === 'defend') {
    logs.push(`${player.pet.nickname || player.pet.speciesId} 进入防御状态！`);
  }

  // 检查敌人是否被击败
  if (enemy.currentHp <= 0) {
    return { ...state, enemyPet: { ...enemy, currentHp: 0 }, phase: 'won', log: logs };
  }

  // 敌人反击（简单 AI：使用第一个可用技能）
  const enemySkillId = enemy.pet.skills[0];
  const enemySkill = getSkill(enemySkillId);
  if (enemySkill && enemy.currentPp[enemySkillId] > 0) {
    enemy.currentPp[enemySkillId]--;
    if (Math.random() * 100 < enemySkill.accuracy) {
      const damage = calculateDamage(enemy, player, enemySkill);
      player.currentHp = Math.max(0, player.currentHp - damage);

      const eff = getEffectiveness(enemySkill.element, player.pet.element);
      const effText = eff >= 2 ? '💥 效果拔群！' : eff <= 0.5 ? '🔽 效果不佳...' : '';
      logs.push(`敌方 ${enemy.pet.nickname || enemy.pet.speciesId} 使用了 ${enemySkill.name}！${effText}`);
      logs.push(`受到 ${damage} 点伤害！`);
    } else {
      logs.push(`敌方的 ${enemySkill.name} 没有命中！`);
    }
  }

  // 检查玩家是否被击败
  if (player.currentHp <= 0) {
    return { ...state, playerPets: state.playerPets.map(p => p === player ? { ...player, currentHp: 0 } : p), phase: 'lost', log: logs };
  }

  return {
    ...state,
    playerPets: state.playerPets.map(p => p === player ? player : p),
    enemyPet: enemy,
    turn: state.turn + 1,
    phase: 'playerAction',
    log: logs,
  };
}

/** 生成野怪（比玩家弱一些） */
export function generateWildPet(playerLevel: number): Pet {
  const level = Math.max(1, playerLevel - 1 + Math.floor(Math.random() * 2));

  // 用通用低种族值生成
  const baseHp = 50 + Math.floor(Math.random() * 20);
  const baseAtk = 35 + Math.floor(Math.random() * 15);

  const stats: Stats = {
    hp: Math.floor((2 * baseHp + 5) * level / 100 + level * 2 + 15),
    attack: Math.floor((2 * baseAtk + 5) * level / 100 + level + 8),
    defense: Math.floor((2 * 30 + 5) * level / 100 + level + 8),
    spAttack: Math.floor((2 * baseAtk + 5) * level / 100 + level + 8),
    spDefense: Math.floor((2 * 30 + 5) * level / 100 + level + 8),
    speed: Math.floor((2 * 25 + 5) * level / 100 + level + 8),
  };

  return {
    id: `wild_${Date.now()}`,
    speciesId: 'flame_drake',
    rarity: 'green',
    stage: 'baby',
    element: 'fire',
    level,
    exp: 0,
    stats,
    ivs: { hp: 5, attack: 5, defense: 5, spAttack: 5, spDefense: 5, speed: 5 },
    evs: { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
    skills: ['tackle'],
    affection: 0,
    cleanliness: 50,
    mood: 50,
    growth: 0,
    isHatched: true,
    obtainedAt: Date.now(),
  };
}
