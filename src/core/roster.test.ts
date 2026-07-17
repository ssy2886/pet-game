import { describe, expect, it } from 'vitest'
import { checkEvolution } from './evolution'
import { rollRarity, rollSpecies } from './gacha'
import { FIXED_BIRTH_RARITY, SUPPORTED_SPECIES_IDS, getRosterCategory, pickGoldSpecies } from './roster'

describe('current pet roster', () => {
  it('contains exactly the three completed body families', () => {
    expect(SUPPORTED_SPECIES_IDS).toEqual(['flame_drake', 'mirage_spirit', 'judgment_beast'])
    expect(getRosterCategory('flame_drake')).toBe('dragon')
    expect(getRosterCategory('mirage_spirit')).toBe('spirit')
    expect(getRosterCategory('judgment_beast')).toBe('beast')
    expect(FIXED_BIRTH_RARITY).toBe('gold')
  })

  it('selects a supported species from a deterministic gold pool', () => {
    expect(pickGoldSpecies(() => 0)).toBe('flame_drake')
    expect(pickGoldSpecies(() => 0.5)).toBe('mirage_spirit')
    expect(pickGoldSpecies(() => 0.999)).toBe('judgment_beast')
  })

  it('creates only gold eggs from supported species', () => {
    expect(rollRarity(0)).toBe('gold')
    expect(SUPPORTED_SPECIES_IDS).toContain(rollSpecies('gold').id)
  })

  it('allows an ultimate pet to reach super ultimate at maximum requirements', () => {
    const result = checkEvolution({ stage: 'ultimate', level: 99, affection: 200, growth: 100 } as any)
    expect(result).toEqual({ canEvolve: true, nextStage: 'superUltimate' })
  })
})
