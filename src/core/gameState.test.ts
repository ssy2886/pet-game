import { describe, expect, it } from 'vitest'
import { createDefaultGameState, getActiveTeamPet, reduceGameAction, sanitizeGameState, toPersistedGameState } from './gameState'

describe('persisted game state', () => {
  it('removes legacy SVG-only pets, eggs, and Pokédex entries from a saved state', () => {
    const state = sanitizeGameState({
      ...createDefaultGameState(),
      pets: [{ id: 'old', speciesId: 'ice_wolf' }],
      eggs: [{ id: 'egg', speciesId: 'ice_wolf', rarity: 'blue' }],
      pokedex: { ice_wolf: { speciesId: 'ice_wolf', seen: true, owned: true, highestStage: 'baby' } },
    })

    expect(state.pets).toEqual([])
    expect(state.eggs).toEqual([])
    expect(state.pokedex).toEqual({})
  })

  it('discards an egg without modifying gold', () => {
    const initial = {
      ...createDefaultGameState(),
      gold: 321,
      eggs: [{ id: 'egg', rarity: 'gold', speciesId: 'flame_drake', hatchProgress: 0, obtainedAt: 1 }],
    }

    const next = reduceGameAction(initial, { type: 'discardEgg', eggId: 'egg' })
    expect(next.eggs).toEqual([])
    expect(next.gold).toBe(321)
  })

  it('uses the first team pet as the active desktop pet', () => {
    const state = {
      ...createDefaultGameState(),
      team: ['pet-1'],
      pets: [{ id: 'pet-1', speciesId: 'flame_drake', rarity: 'gold' }],
    }

    expect(getActiveTeamPet(state as any)?.id).toBe('pet-1')
  })

  it('strips renderer action functions before sending a state snapshot to Electron', () => {
    const snapshot = toPersistedGameState({ ...createDefaultGameState(), pullEgg: () => null })
    expect(snapshot).toEqual(createDefaultGameState())
  })
})
