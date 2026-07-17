import type { BattleState, Egg, EvolutionStage, Pet } from './types'
import { isSupportedSpecies } from './roster'

export interface InventoryItem {
  id: string
  quantity: number
}

export interface PersistedGameState {
  gold: number
  team: string[]
  pets: Pet[]
  storage: Pet[]
  eggs: Egg[]
  pokedex: Record<string, { speciesId: string; seen: boolean; owned: boolean; highestStage: EvolutionStage }>
  pityCount: number
  inventory: {
    foods: InventoryItem[]
    evolutionItems: InventoryItem[]
    consumables: InventoryItem[]
  }
  battle: BattleState | null
  expedition: null
}

export type GameAction =
  | { type: 'discardEgg'; eggId: string }

export function createDefaultGameState(): PersistedGameState {
  return {
    gold: 999999,
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
  }
}

export function toPersistedGameState(value: Partial<PersistedGameState>): PersistedGameState {
  const defaults = createDefaultGameState()
  return {
    gold: value.gold ?? defaults.gold,
    team: value.team ?? defaults.team,
    pets: value.pets ?? defaults.pets,
    storage: value.storage ?? defaults.storage,
    eggs: value.eggs ?? defaults.eggs,
    pokedex: value.pokedex ?? defaults.pokedex,
    pityCount: value.pityCount ?? defaults.pityCount,
    inventory: value.inventory ?? defaults.inventory,
    battle: value.battle ?? defaults.battle,
    expedition: value.expedition ?? defaults.expedition,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object'
}

function isSupportedPet(value: unknown): value is Pet {
  return isRecord(value) && typeof value.id === 'string' && typeof value.speciesId === 'string' && isSupportedSpecies(value.speciesId)
}

function isSupportedEgg(value: unknown): value is Egg {
  return isRecord(value) && typeof value.id === 'string' && typeof value.speciesId === 'string' && isSupportedSpecies(value.speciesId)
}

export function sanitizeGameState(value: unknown): PersistedGameState {
  const defaults = createDefaultGameState()
  if (!isRecord(value)) return defaults

  const pets = Array.isArray(value.pets) ? value.pets.filter(isSupportedPet).map(pet => ({ ...pet, rarity: 'gold' as const })) : []
  const storage = Array.isArray(value.storage) ? value.storage.filter(isSupportedPet).map(pet => ({ ...pet, rarity: 'gold' as const })) : []
  const petIds = new Set([...pets, ...storage].map(pet => pet.id))
  const eggs = Array.isArray(value.eggs) ? value.eggs.filter(isSupportedEgg).map(egg => ({ ...egg, rarity: 'gold' as const })) : []
  const rawPokedex = isRecord(value.pokedex) ? value.pokedex : {}
  const pokedex = Object.fromEntries(Object.entries(rawPokedex).filter(([speciesId]) => isSupportedSpecies(speciesId))) as PersistedGameState['pokedex']

  return {
    ...defaults,
    gold: typeof value.gold === 'number' && Number.isFinite(value.gold) ? value.gold : defaults.gold,
    pets,
    storage,
    eggs,
    pokedex,
    team: Array.isArray(value.team) ? value.team.filter((id): id is string => typeof id === 'string' && petIds.has(id)) : [],
    pityCount: typeof value.pityCount === 'number' && Number.isFinite(value.pityCount) ? value.pityCount : 0,
    inventory: isRecord(value.inventory) ? {
      foods: Array.isArray(value.inventory.foods) ? value.inventory.foods.filter(isInventoryItem) : defaults.inventory.foods,
      evolutionItems: Array.isArray(value.inventory.evolutionItems) ? value.inventory.evolutionItems.filter(isInventoryItem) : [],
      consumables: Array.isArray(value.inventory.consumables) ? value.inventory.consumables.filter(isInventoryItem) : defaults.inventory.consumables,
    } : defaults.inventory,
  }
}

function isInventoryItem(value: unknown): value is InventoryItem {
  return isRecord(value) && typeof value.id === 'string' && typeof value.quantity === 'number' && Number.isFinite(value.quantity) && value.quantity >= 0
}

export function reduceGameAction(state: PersistedGameState, action: GameAction): PersistedGameState {
  if (action.type === 'discardEgg') {
    return { ...state, eggs: state.eggs.filter(egg => egg.id !== action.eggId) }
  }
  return state
}

export function getActiveTeamPet(state: PersistedGameState): Pet | undefined {
  const petId = state.team[0]
  return state.pets.find(pet => pet.id === petId)
}
