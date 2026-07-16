import { describe, expect, it } from 'vitest'
import { clampPetPosition, getDraggedPetPosition, isDragGesture, restorePetPosition } from './petDrag'

describe('pet drag helpers', () => {
  const viewport = { width: 300, height: 200 }
  const pet = { width: 80, height: 90 }

  it('keeps a small pointer move as a click', () => {
    expect(isDragGesture({ x: 10, y: 10 }, { x: 13, y: 12 })).toBe(false)
    expect(isDragGesture({ x: 10, y: 10 }, { x: 13, y: 14 })).toBe(true)
    expect(isDragGesture({ x: 10, y: 10 }, { x: 16, y: 10 })).toBe(true)
  })

  it('clamps the dragged pet to every viewport edge', () => {
    expect(clampPetPosition({ x: 145, y: 72 }, viewport, pet)).toEqual({ x: 145, y: 72 })
    expect(clampPetPosition({ x: -5, y: -2 }, viewport, pet)).toEqual({ x: 0, y: 0 })
    expect(clampPetPosition({ x: 280, y: 160 }, viewport, pet)).toEqual({ x: 220, y: 110 })
  })

  it('preserves the grabbed point while calculating a dragged position', () => {
    expect(getDraggedPetPosition({ x: 165, y: 102 }, { x: 20, y: 30 }, viewport, pet)).toEqual({ x: 145, y: 72 })
  })

  it('restores valid coordinates and falls back for malformed data', () => {
    expect(restorePetPosition({ x: 999, y: 999 }, { x: 20, y: 30 }, viewport, pet)).toEqual({ x: 220, y: 110 })
    expect(restorePetPosition({ x: 'bad', y: 1 }, { x: 20, y: 30 }, viewport, pet)).toEqual({ x: 20, y: 30 })
    expect(restorePetPosition({ x: 'bad', y: 1 }, { x: 999, y: -5 }, viewport, pet)).toEqual({ x: 220, y: 0 })
  })
})
