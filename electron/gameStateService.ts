export type GameSnapshot = Record<string, unknown>

export type DesktopGameAction =
  | { type: 'discardEgg'; eggId: string }
  | { type: 'pet'; petId: string }
  | { type: 'wash'; petId: string }
  | { type: 'play'; petId: string }
  | { type: 'feed'; petId: string; foodId: 'basic_feed' }

export interface GameStateServiceDependencies {
  read: () => unknown
  write: (state: GameSnapshot) => void
  publish: (state: GameSnapshot) => void
}

export interface GameStateService {
  snapshot: () => GameSnapshot
  dispatch: (action: DesktopGameAction) => GameSnapshot
  replace: (state: unknown) => GameSnapshot
}

function isRecord(value: unknown): value is GameSnapshot {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function cloneSnapshot(value: unknown): GameSnapshot {
  return isRecord(value) ? structuredClone(value) : {}
}

function updatePet(snapshot: GameSnapshot, petId: string, update: (pet: GameSnapshot) => GameSnapshot): GameSnapshot {
  const pets = Array.isArray(snapshot.pets) ? snapshot.pets : []
  return {
    ...snapshot,
    pets: pets.map((pet) => isRecord(pet) && pet.id === petId ? update(pet) : pet),
  }
}

function boundedNumber(value: unknown, increase: number, maximum: number): number {
  return Math.min(maximum, Math.max(0, (typeof value === 'number' ? value : 0) + increase))
}

function reduceDesktopAction(snapshot: GameSnapshot, action: DesktopGameAction): GameSnapshot {
  if (action.type === 'discardEgg') {
    const eggs = Array.isArray(snapshot.eggs) ? snapshot.eggs : []
    return { ...snapshot, eggs: eggs.filter((egg) => !isRecord(egg) || egg.id !== action.eggId) }
  }

  if (action.type === 'pet') {
    return updatePet(snapshot, action.petId, pet => ({ ...pet, affection: boundedNumber(pet.affection, 3, 200), mood: boundedNumber(pet.mood, 5, 100) }))
  }
  if (action.type === 'wash') {
    return updatePet(snapshot, action.petId, pet => ({ ...pet, cleanliness: 100, mood: boundedNumber(pet.mood, 5, 100) }))
  }
  if (action.type === 'play') {
    return updatePet(snapshot, action.petId, pet => ({ ...pet, affection: boundedNumber(pet.affection, 5, 200), mood: boundedNumber(pet.mood, 10, 100), growth: boundedNumber(pet.growth, 2, 100) }))
  }
  if (action.type === 'feed') {
    const inventory = isRecord(snapshot.inventory) ? snapshot.inventory : {}
    const foods = Array.isArray(inventory.foods) ? inventory.foods : []
    const food = foods.find((entry) => isRecord(entry) && entry.id === action.foodId && typeof entry.quantity === 'number' && entry.quantity > 0)
    if (!food) return snapshot
    return {
      ...updatePet(snapshot, action.petId, pet => ({ ...pet, affection: boundedNumber(pet.affection, 2, 200), mood: boundedNumber(pet.mood, 5, 100), growth: boundedNumber(pet.growth, 5, 100) })),
      inventory: {
        ...inventory,
        foods: foods.map((entry) => entry === food ? { ...entry, quantity: (entry.quantity as number) - 1 } : entry).filter((entry) => !isRecord(entry) || entry.quantity !== 0),
      },
    }
  }

  return snapshot
}

export function createGameStateService(dependencies: GameStateServiceDependencies): GameStateService {
  let state = cloneSnapshot(dependencies.read())

  const persistAndPublish = () => {
    dependencies.write(state)
    dependencies.publish(state)
    return state
  }

  return {
    snapshot: () => state,
    dispatch: (action) => {
      state = reduceDesktopAction(state, action)
      return persistAndPublish()
    },
    replace: (nextState) => {
      state = cloneSnapshot(nextState)
      return persistAndPublish()
    },
  }
}
