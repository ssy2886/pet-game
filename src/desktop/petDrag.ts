export type Point = { x: number; y: number }
export type Size = { width: number; height: number }

const DRAG_THRESHOLD = 5

export function isDragGesture(start: Point, current: Point): boolean {
  return Math.hypot(current.x - start.x, current.y - start.y) >= DRAG_THRESHOLD
}

export function clampPetPosition(position: Point, viewport: Size, pet: Size): Point {
  const maximumX = Math.max(0, viewport.width - pet.width)
  const maximumY = Math.max(0, viewport.height - pet.height)

  return {
    x: Math.min(Math.max(position.x, 0), maximumX),
    y: Math.min(Math.max(position.y, 0), maximumY),
  }
}

export function restorePetPosition(saved: unknown, fallback: Point, viewport: Size, pet: Size): Point {
  if (!isPoint(saved)) {
    return clampPetPosition(fallback, viewport, pet)
  }

  return clampPetPosition(saved, viewport, pet)
}

function isPoint(value: unknown): value is Point {
  if (value === null || typeof value !== 'object' || !('x' in value) || !('y' in value)) {
    return false
  }

  const { x, y } = value
  return typeof x === 'number' && typeof y === 'number' && Number.isFinite(x) && Number.isFinite(y)
}
