import type { Rarity } from './types'

export const ROSTER_CATEGORIES = ['dragon', 'spirit', 'beast'] as const
export type RosterCategory = typeof ROSTER_CATEGORIES[number]

export const SUPPORTED_SPECIES_IDS = ['flame_drake', 'mirage_spirit', 'judgment_beast'] as const
export type SupportedSpeciesId = typeof SUPPORTED_SPECIES_IDS[number]

export const FIXED_BIRTH_RARITY: Rarity = 'gold'

const CATEGORY_BY_SPECIES: Record<SupportedSpeciesId, RosterCategory> = {
  flame_drake: 'dragon',
  mirage_spirit: 'spirit',
  judgment_beast: 'beast',
}

export function getRosterCategory(speciesId: string): RosterCategory | undefined {
  return CATEGORY_BY_SPECIES[speciesId as SupportedSpeciesId]
}

export function isSupportedSpecies(speciesId: string): speciesId is SupportedSpeciesId {
  return speciesId in CATEGORY_BY_SPECIES
}

export function pickGoldSpecies(random: () => number = Math.random): SupportedSpeciesId {
  const index = Math.min(SUPPORTED_SPECIES_IDS.length - 1, Math.max(0, Math.floor(random() * SUPPORTED_SPECIES_IDS.length)))
  return SUPPORTED_SPECIES_IDS[index]
}
