import type { EvolutionStage } from '../../core/types'

const CHINESE_STAGE_NAMES: Record<EvolutionStage, string> = {
  baby: '幼年',
  adult: '成年',
  perfect: '完全',
  ultimate: '究极',
  superUltimate: '终极',
}

export type PetRenderMode = 'body-and-element' | 'body-and-svg-element' | 'svg-fallback'

export function getBodyAssetCandidates(bodyDir: string, stage: EvolutionStage): string[] {
  const english = `/assets/pets/bodies/${bodyDir}/${stage}.png`
  if (bodyDir !== 'beast' && bodyDir !== 'spirit') return [english]

  return [english, `/assets/pets/bodies/${bodyDir}/${CHINESE_STAGE_NAMES[stage]}.png`]
}

export function getRenderMode(bodyAvailable: boolean, elementAvailable: boolean): PetRenderMode {
  if (!bodyAvailable) return 'svg-fallback'
  return elementAvailable ? 'body-and-element' : 'body-and-svg-element'
}
