import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import type {
  Pet, Egg, Rarity, EvolutionStage, Stats,
  BattleState, BattleAction, ExpeditionMap, MapNode,
} from '../core/types';
import { getSpecies } from '../core/data/species';
import { ALL_FOODS, EVOLUTION_ITEMS, CONSUMABLE_ITEMS } from '../core/data/items';
import { rollRarity, rollSpecies, generateIVs } from '../core/gacha';
import { evolvePet, checkEvolution } from '../core/evolution';
import { createBattlePet, executeTurn, generateWildPet } from '../core/battle';
import { generateMap, advanceNode, getReachableNodes } from '../core/exploration';
import { toPersistedGameState, type PersistedGameState } from '../core/gameState';

interface InventoryItem {
  id: string;
  quantity: number;
}

interface GameState {
  // ====== 玩家资源 ======
  gold: number;

  // ====== 宠物管理 ======
  team: string[];          // 当前小队（宠物 ID 列表，上限 6）
  pets: Pet[];             // 所有宠物
  storage: Pet[];          // 仓库

  // ====== 蛋系统 ======
  eggs: Egg[];

  // ====== 图鉴 ======
  pokedex: Record<string, { speciesId: string; seen: boolean; owned: boolean; highestStage: EvolutionStage }>;

  // ====== 抽蛋 ======
  pityCount: number;

  // ====== 背包 ======
  inventory: {
    foods: InventoryItem[];
    evolutionItems: InventoryItem[];
    consumables: InventoryItem[];
  };

  // ====== 战斗 ======
  battle: BattleState | null;

  // ====== 探险 ======
  expedition: ExpeditionMap | null;

  // ============ Actions ============

  // 资源
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;

  // 抽蛋
  pullEgg: () => Egg | null;
  hatchEgg: (eggId: string) => Pet | null;
  discardEgg: (eggId: string) => void;

  // 宠物管理
  addPet: (pet: Pet) => void;
  removePet: (petId: string) => void;
  moveToTeam: (petId: string) => boolean;
  moveToStorage: (petId: string) => void;
  sellPet: (petId: string) => number;
  getTeamPets: () => Pet[];
  getRandomPetInTeam: () => Pet | null;

  // 互动
  feedPet: (petId: string, foodId: string) => void;
  petPet: (petId: string) => void;
  washPet: (petId: string) => void;
  playWithPet: (petId: string) => void;

  // 商店
  buyFood: (foodId: string) => boolean;
  buyItem: (itemId: string) => boolean;
  buyConsumable: (itemId: string) => boolean;
  useConsumable: (petId: string, consumableId: string) => boolean;

  // 进化
  tryEvolve: (petId: string) => { success: boolean; message: string };

  // 战斗
  startBattle: () => void;
  playerAction: (action: BattleAction) => void;
  fleeBattle: () => void;
  endBattle: () => void;

  // 探险
  startExpedition: (theme?: string) => void;
  moveToNode: (nodeId: string) => void;
  endExpedition: () => void;
  getReachable: () => MapNode[];

  // 经验
  addExp: (petId: string, amount: number) => void;
}

/** 计算等级所需经验 */
function expToLevel(level: number): number {
  return Math.floor(level * level * 10);
}

/** 根据种族值和个体值计算实际属性 */
function calculateStats(speciesId: string, level: number, stage: EvolutionStage, ivs: Stats, evs: Stats, rarity: Rarity): Stats {
  const species = getSpecies(speciesId);
  if (!species) return { hp: 50, attack: 50, defense: 50, spAttack: 50, spDefense: 50, speed: 50 };

  const stageMultipliers: Record<EvolutionStage, number> = {
    baby: 1.0, adult: 1.4, perfect: 1.9, ultimate: 2.5, superUltimate: 3.5,
  };
  const rarityMultipliers: Record<Rarity, number> = {
    green: 1.0, blue: 1.1, purple: 1.25, orange: 1.45, red: 1.7, gold: 2.0,
  };

  const sm = stageMultipliers[stage];
  const rm = rarityMultipliers[rarity];

  // 修复的公式：level 1 也有可观的数值
  const calcHP = (base: number, iv: number, ev: number) => {
    const raw = Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + level * 3 + 20;
    return Math.floor(Math.max(raw, 35) * sm * rm);
  };
  const calcOther = (base: number, iv: number, ev: number) => {
    const raw = Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + level * 1.5 + 10;
    return Math.floor(Math.max(raw, 18) * sm * rm);
  };

  return {
    hp: calcHP(species.baseStats.hp, ivs.hp, evs.hp),
    attack: calcOther(species.baseStats.attack, ivs.attack, evs.attack),
    defense: calcOther(species.baseStats.defense, ivs.defense, evs.defense),
    spAttack: calcOther(species.baseStats.spAttack, ivs.spAttack, evs.spAttack),
    spDefense: calcOther(species.baseStats.spDefense, ivs.spDefense, evs.spDefense),
    speed: calcOther(species.baseStats.speed, ivs.speed, evs.speed),
  };
}

/** 品种在品质下的可用技能 */
function getInitialSkills(speciesId: string, level: number): string[] {
  const species = getSpecies(speciesId);
  if (!species) return ['tackle'];
  const skills: string[] = [];
  for (const [lvl, skillId] of Object.entries(species.learnableSkills)) {
    if (level >= parseInt(lvl)) {
      skills.push(skillId);
    }
  }
  return skills.slice(-4); // 最多4个技能
}

export const useGameStore = create<GameState>((set, get) => ({
  gold: 999999, // 无限金币
  team: [],
  pets: [],
  storage: [],
  eggs: [],
  pokedex: {},
  pityCount: 0,
  inventory: {
    foods: [
      { id: 'basic_feed', quantity: 20 },
      { id: 'meat_meal', quantity: 10 },
      { id: 'sweet_dessert', quantity: 10 },
    ],
    evolutionItems: [],
    consumables: [{ id: 'level_candy', quantity: 3 }],
  },
  battle: null,
  expedition: null,

  addGold: (amount) => set(s => ({ gold: s.gold + amount })),
  spendGold: (amount) => {
    const state = get();
    if (state.gold < amount) return false;
    set({ gold: state.gold - amount });
    return true;
  },

  pullEgg: () => {
    const state = get();
    // 检查是否达到保底
    const rarity = rollRarity(state.pityCount);
    const species = rollSpecies(rarity);

    const newPity = rarity === 'gold' ? 0 : state.pityCount + 1;

    const egg: Egg = {
      id: uuid(),
      rarity,
      speciesId: species.id,
      hatchProgress: 0,
      obtainedAt: Date.now(),
    };

    set(s => ({
      eggs: [...s.eggs, egg],
      pityCount: newPity,
      pokedex: {
        ...s.pokedex,
        [species.id]: {
          speciesId: species.id,
          seen: true,
          owned: s.pokedex[species.id]?.owned || false,
          highestStage: s.pokedex[species.id]?.highestStage || 'baby',
        },
      },
    }));

    return egg;
  },

  hatchEgg: (eggId) => {
    const state = get();
    const eggIndex = state.eggs.findIndex(e => e.id === eggId);
    if (eggIndex === -1 || !state.eggs[eggIndex].speciesId) return null;

    const egg = state.eggs[eggIndex];
    const species = getSpecies(egg.speciesId!);
    if (!species) return null;

    const stage: EvolutionStage = 'baby';
    const ivs = generateIVs(egg.rarity);
    const evs = { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 };
    const level = 1;
    const stats = calculateStats(species.id, level, stage, ivs, evs, egg.rarity);
    const skills = getInitialSkills(species.id, level);

    const pet: Pet = {
      id: uuid(),
      speciesId: species.id,
      nickname: species.stageNames[stage],
      rarity: egg.rarity,
      element: species.element,
      stage,
      level,
      exp: 0,
      stats,
      ivs,
      evs,
      skills,
      affection: 50,
      cleanliness: 100,
      mood: 80,
      growth: 0,
      isHatched: true,
      obtainedAt: Date.now(),
    };

    set(s => ({
      eggs: s.eggs.filter(e => e.id !== eggId),
      pets: [...s.pets, pet],
      pokedex: {
        ...s.pokedex,
        [species.id]: {
          speciesId: species.id,
          seen: true,
          owned: true,
          highestStage: 'baby',
        },
      },
    }));

    return pet;
  },

  discardEgg: (eggId) => set(s => ({ eggs: s.eggs.filter(egg => egg.id !== eggId) })),

  addPet: (pet) => set(s => ({ pets: [...s.pets, pet] })),

  removePet: (petId) => set(s => ({
    pets: s.pets.filter(p => p.id !== petId),
    storage: s.storage.filter(p => p.id !== petId),
    team: s.team.filter(id => id !== petId),
  })),

  moveToTeam: (petId) => {
    const state = get();
    if (state.team.length >= 6) return false;
    if (state.team.includes(petId)) return false;

    // 从 storage 或 pets 中找到宠物
    const pet = state.pets.find(p => p.id === petId) || state.storage.find(p => p.id === petId);
    if (!pet) return false;

    set(s => ({
      team: [...s.team, petId],
      storage: s.storage.filter(p => p.id !== petId),
    }));
    return true;
  },

  moveToStorage: (petId) => set(s => ({
    team: s.team.filter(id => id !== petId),
    storage: [...s.storage, ...s.pets.filter(p => p.id === petId)],
    pets: s.pets.filter(p => p.id !== petId),
  })),

  sellPet: (petId) => {
    const state = get();
    const pet = state.pets.find(p => p.id === petId);
    if (!pet) return 0;

    const prices: Record<Rarity, number> = {
      green: 50, blue: 150, purple: 500, orange: 2000, red: 10000, gold: 50000,
    };
    const price = prices[pet.rarity];
    set(s => ({
      gold: s.gold + price,
      pets: s.pets.filter(p => p.id !== petId),
      team: s.team.filter(id => id !== petId),
    }));
    return price;
  },

  getTeamPets: () => {
    const state = get();
    return state.team.map(id => state.pets.find(p => p.id === id)).filter((p): p is Pet => !!p);
  },

  getRandomPetInTeam: () => {
    const team = get().getTeamPets();
    return team.length > 0 ? team[Math.floor(Math.random() * team.length)] : null;
  },

  feedPet: (petId, foodId) => {
    const food = ALL_FOODS[foodId];
    if (!food) return;

    const state = get();
    const pet = state.pets.find(p => p.id === petId);
    if (!pet) return;

    // 检查偏好
    const species = getSpecies(pet.speciesId);
    const isPreferred = species?.preferredFoodTag && food.tags.includes(species.preferredFoodTag);
    const preferenceMultiplier = isPreferred ? 2.0 : 1.0;

    set(s => ({
      pets: s.pets.map(p => {
        if (p.id !== petId) return p;
        return {
          ...p,
          growth: Math.min(100, p.growth + food.growthAmount * preferenceMultiplier),
          mood: Math.min(100, p.mood + food.moodAmount),
          affection: Math.min(200, p.affection + food.affectionAmount * preferenceMultiplier),
        };
      }),
      inventory: {
        ...s.inventory,
        foods: s.inventory.foods.map(f =>
          f.id === foodId ? { ...f, quantity: f.quantity - 1 } : f
        ).filter(f => f.quantity > 0),
      },
    }));
  },

  petPet: (petId) => set(s => ({
    pets: s.pets.map(p =>
      p.id === petId ? {
        ...p,
        affection: Math.min(200, p.affection + 3),
        mood: Math.min(100, p.mood + 5),
      } : p
    ),
  })),

  washPet: (petId) => set(s => ({
    pets: s.pets.map(p =>
      p.id === petId ? {
        ...p,
        cleanliness: 100,
        mood: Math.min(100, p.mood + 5),
      } : p
    ),
  })),

  playWithPet: (petId) => set(s => ({
    pets: s.pets.map(p =>
      p.id === petId ? {
        ...p,
        affection: Math.min(200, p.affection + 5),
        mood: Math.min(100, p.mood + 10),
        growth: Math.min(100, p.growth + 2),
      } : p
    ),
  })),

  buyFood: (foodId) => {
    const food = ALL_FOODS[foodId];
    if (!food) return false;
    const state = get();
    if (state.gold < food.price) return false;
    const existing = state.inventory.foods.find(f => f.id === foodId);
    set(s => ({
      gold: s.gold - food.price,
      inventory: {
        ...s.inventory,
        foods: existing
          ? s.inventory.foods.map(f => f.id === foodId ? { ...f, quantity: f.quantity + 1 } : f)
          : [...s.inventory.foods, { id: foodId, quantity: 1 }],
      },
    }));
    return true;
  },

  buyItem: (itemId) => {
    const item = EVOLUTION_ITEMS[itemId];
    if (!item) return false;
    const state = get();
    if (state.gold < item.price) return false;
    const existing = state.inventory.evolutionItems.find(i => i.id === itemId);
    set(s => ({
      gold: s.gold - item.price,
      inventory: {
        ...s.inventory,
        evolutionItems: existing
          ? s.inventory.evolutionItems.map(i => i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i)
          : [...s.inventory.evolutionItems, { id: itemId, quantity: 1 }],
      },
    }));
    return true;
  },

  buyConsumable: (itemId) => {
    const item = CONSUMABLE_ITEMS[itemId];
    if (!item) return false;
    const state = get();
    if (state.gold < item.price) return false;
    const existing = state.inventory.consumables.find(i => i.id === itemId);
    set(s => ({
      gold: s.gold - item.price,
      inventory: {
        ...s.inventory,
        consumables: existing
          ? s.inventory.consumables.map(i => i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i)
          : [...s.inventory.consumables, { id: itemId, quantity: 1 }],
      },
    }));
    return true;
  },

  useConsumable: (petId, consumableId) => {
    const item = CONSUMABLE_ITEMS[consumableId];
    if (!item) return false;
    const state = get();
    const pet = state.pets.find(p => p.id === petId);
    if (!pet) return false;
    const inv = state.inventory.consumables.find(i => i.id === consumableId);
    if (!inv || inv.quantity <= 0) return false;

    let levelUp = 0;
    if (item.effect === 'levelUp') levelUp = 1;
    else if (item.effect === 'levelUp5') levelUp = 5;

    if (levelUp <= 0) return false;
    if (pet.level + levelUp > 99) return false;

    // 消耗道具
    set(s => ({
      inventory: {
        ...s.inventory,
        consumables: s.inventory.consumables.map(i =>
          i.id === consumableId ? { ...i, quantity: i.quantity - 1 } : i
        ).filter(i => i.quantity > 0),
      },
    }));

    // 逐级升级
    for (let i = 0; i < levelUp; i++) {
      const currentPet = get().pets.find(p => p.id === petId);
      if (!currentPet || currentPet.level >= 99) break;
      get().addExp(petId, expToLevel(currentPet.level) * 2); // 给足够经验升一级
    }

    return true;
  },

  tryEvolve: (petId) => {
    const state = get();
    const pet = state.pets.find(p => p.id === petId);
    if (!pet) return { success: false, message: '宠物不存在' };

    const check = checkEvolution(pet);
    if (!check.canEvolve) {
      return { success: false, message: check.reason || '进化条件不满足' };
    }

    const evolved = evolvePet(pet);
    set(s => ({
      pets: s.pets.map(p => p.id === petId ? evolved : p),
      pokedex: {
        ...s.pokedex,
        [evolved.speciesId]: {
          speciesId: evolved.speciesId,
          seen: true,
          owned: true,
          highestStage: evolved.stage,
        },
      },
    }));

    const stageLabel: Record<EvolutionStage, string> = {
      baby: '幼体', adult: '成体', perfect: '完全体', ultimate: '究极体', superUltimate: '终极体',
    };
    return { success: true, message: `🎉 ${evolved.nickname} 进化到了${stageLabel[evolved.stage]}！` };
  },

  startBattle: () => {
    const team = get().getTeamPets();
    if (team.length === 0) return;

    const playerPet = team[0];
    const wildPet = generateWildPet(playerPet.level);
    const wildBattlePet = createBattlePet(wildPet);

    set({
      battle: {
        playerPets: [createBattlePet(playerPet)],
        enemyPet: wildBattlePet,
        turn: 1,
        phase: 'playerAction',
        log: [`⚔️ 野生 ${wildPet.nickname || wildPet.speciesId} 出现了！`],
      },
    });
  },

  playerAction: (action) => {
    const state = get();
    if (!state.battle || state.battle.phase !== 'playerAction') return;

    // 逃跑
    if (action.type === 'flee') {
      if (Math.random() < 0.7) {
        set(s => ({
          battle: s.battle ? { ...s.battle, phase: 'lost', log: [...s.battle.log, '🏃 成功逃跑！'] } : null,
        }));
        return;
      }
      // 逃跑失败，跳过回合
      const newState = executeTurn(state.battle, { type: 'defend' });
      set({ battle: newState });
      return;
    }

    const newState = executeTurn(state.battle, action);
    set({ battle: newState });

    // 战斗胜利 - 给宠物加经验
    if (newState.phase === 'won') {
      const team = get().getTeamPets();
      const expGain = 20 + Math.floor(Math.random() * 30);
      team.forEach(pet => {
        get().addExp(pet.id, expGain);
      });
      // 加金币
      get().addGold(50 + Math.floor(Math.random() * 100));
    }
  },

  fleeBattle: () => {
    set(s => ({
      battle: s.battle ? { ...s.battle, phase: 'lost', log: [...s.battle.log, '🏃 逃跑了！'] } : null,
    }));
  },

  endBattle: () => set({ battle: null }),

  startExpedition: (theme?) => {
    const map = generateMap(theme as any);
    set({ expedition: map });
  },

  moveToNode: (nodeId) => {
    const state = get();
    if (!state.expedition) return;

    const updated = advanceNode(state.expedition, nodeId);
    set({ expedition: updated });

    // 到达终点时奖励
    if (updated.completed) {
      get().addGold(200 + Math.floor(Math.random() * 300));
      const team = get().getTeamPets();
      team.forEach(pet => get().addExp(pet.id, 50 + Math.floor(Math.random() * 50)));
    }
  },

  endExpedition: () => set({ expedition: null }),

  getReachable: () => {
    const state = get();
    if (!state.expedition) return [];
    return getReachableNodes(state.expedition);
  },

  addExp: (petId, amount) => {
    set(s => ({
      pets: s.pets.map(p => {
        if (p.id !== petId) return p;
        let newExp = p.exp + amount;
        let newLevel = p.level;
        let newStats = p.stats;

        // 升级检查
        while (newExp >= expToLevel(newLevel) && newLevel < 99) {
          newExp -= expToLevel(newLevel);
          newLevel++;
          // 升级时重新计算属性
          newStats = calculateStats(p.speciesId, newLevel, p.stage, p.ivs, p.evs, p.rarity);

          // 学新技能
          const species = getSpecies(p.speciesId);
          if (species && species.learnableSkills[newLevel]) {
            const newSkill = species.learnableSkills[newLevel];
            const currentSkills = [...p.skills];
            if (!currentSkills.includes(newSkill)) {
              currentSkills.push(newSkill);
              if (currentSkills.length > 4) currentSkills.shift();
              return {
                ...p, level: newLevel, exp: newExp, stats: newStats, skills: currentSkills,
              };
            }
          }
        }

        return { ...p, level: newLevel, exp: newExp, stats: newStats };
      }),
    }));
  },
}));

let isApplyingElectronSnapshot = false

function applyElectronSnapshot(snapshot: unknown) {
  const next = toPersistedGameState(snapshot as Partial<PersistedGameState>)
  isApplyingElectronSnapshot = true
  useGameStore.setState(next)
  isApplyingElectronSnapshot = false
}

function initializeElectronGameSync() {
  if (typeof window === 'undefined') return
  const api = (window as any).electronAPI
  if (!api?.gameRead || !api?.gameReplace || !api?.onGameState) return

  void Promise.resolve(api.gameRead()).then((snapshot: unknown) => {
    if (snapshot && typeof snapshot === 'object' && Array.isArray((snapshot as any).pets)) {
      applyElectronSnapshot(snapshot)
    } else {
      void api.gameReplace(toPersistedGameState(useGameStore.getState()))
    }
  }).catch(() => undefined)

  api.onGameState((snapshot: unknown) => applyElectronSnapshot(snapshot))
  useGameStore.subscribe((state) => {
    if (!isApplyingElectronSnapshot) {
      void api.gameReplace(toPersistedGameState(state))
    }
  })
}

initializeElectronGameSync()
