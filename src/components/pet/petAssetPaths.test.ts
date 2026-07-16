import { describe, expect, it } from 'vitest'
import { getBodyAssetCandidates, getRenderMode } from './petAssetPaths'

describe('getBodyAssetCandidates', () => {
  it('tries English then Chinese stage names for beast and spirit', () => {
    expect(getBodyAssetCandidates('beast', 'baby')).toEqual([
      '/assets/pets/bodies/beast/baby.png',
      '/assets/pets/bodies/beast/幼年.png',
    ])
    expect(getBodyAssetCandidates('spirit', 'superUltimate')).toEqual([
      '/assets/pets/bodies/spirit/superUltimate.png',
      '/assets/pets/bodies/spirit/终极.png',
    ])
  })
})

describe('getRenderMode', () => {
  it('keeps a PNG body when its element PNG is unavailable', () => {
    expect(getRenderMode(true, true)).toBe('body-and-element')
    expect(getRenderMode(true, false)).toBe('body-and-svg-element')
    expect(getRenderMode(false, false)).toBe('svg-fallback')
  })
})
