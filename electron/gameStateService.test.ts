import { describe, expect, it, vi } from 'vitest'
import { createGameStateService } from './gameStateService.js'

describe('game state service', () => {
  it('persists and broadcasts an accepted action snapshot', () => {
    const write = vi.fn()
    const publish = vi.fn()
    const service = createGameStateService({
      read: () => ({
        gold: 999999,
        team: [],
        pets: [],
        storage: [],
        pokedex: {},
        pityCount: 0,
        inventory: { foods: [], evolutionItems: [], consumables: [] },
        battle: null,
        expedition: null,
        eggs: [{ id: 'egg', rarity: 'gold', speciesId: 'flame_drake', hatchProgress: 0, obtainedAt: 1 }],
      }),
      write,
      publish,
    })

    service.dispatch({ type: 'discardEgg', eggId: 'egg' })

    expect(service.snapshot().eggs).toEqual([])
    expect(write).toHaveBeenCalledWith(service.snapshot())
    expect(publish).toHaveBeenCalledWith(service.snapshot())
  })
})
