import { useState, useEffect } from 'react'
import type { EvolutionStage, Rarity, ElementType } from '../../core/types'
import { RARITY_COLORS } from '../../core/types'
import { getSpecies } from '../../core/data/species'
import { getBodyAssetCandidates, getRenderMode } from './petAssetPaths'

interface Props {
  speciesId: string
  stage: EvolutionStage
  rarity: Rarity
  size?: number
}

// ============ Body Plan Types (keep in sync with image folders) ============
const BODY_DRAGON = 0
const BODY_FOX = 1
const BODY_BIRD = 2
const BODY_GOLEM = 3
const BODY_BEAST = 4
const BODY_SERPENT = 5
const BODY_SPIRIT = 6
const BODY_CRAB = 7

const BODY_PLAN_NAMES: Record<number, string> = {
  [BODY_DRAGON]: 'dragon',
  [BODY_FOX]: 'fox',
  [BODY_BIRD]: 'bird',
  [BODY_GOLEM]: 'golem',
  [BODY_BEAST]: 'beast',
  [BODY_SERPENT]: 'serpent',
  [BODY_SPIRIT]: 'spirit',
  [BODY_CRAB]: 'crab',
}

const STAGE_KEYS: EvolutionStage[] = ['baby', 'adult', 'perfect', 'ultimate', 'superUltimate']

function hashId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h) + id.charCodeAt(i) | 0
  return Math.abs(h)
}

function getBodyPlan(speciesId: string): number {
  const id = speciesId.toLowerCase()
  if (/\b(fox|狐)\b/i.test(id) || id.endsWith('fox') || id.includes('foxfire') || id.includes('aurora_fox')) return BODY_FOX
  if (/\b(phoenix|凰|bird|griffin|gryphon|狮鹫|雕|鹰|隼|thunder_bird)\b/i.test(id)) return BODY_BIRD
  if (/\b(serpent|蛇|eel|鳗|sea_serpent)\b/i.test(id)) return BODY_SERPENT
  if (/\b(fish|鱼|whale|鲸|鲲|鲤|rainbow_fish)\b/i.test(id)) return BODY_SERPENT
  if (/\b(crab|蟹|kraken|触手|tidal_kraken)\b/i.test(id)) return BODY_CRAB
  if (/\b(golem|巨魔|巨人|titan|stone_titan|tortoise|岩龟|boulder)\b/i.test(id)) return BODY_GOLEM
  if (/\b(maiden|圣女|human|angel|天使|knight|骑士|姬|starlight_maiden)\b/i.test(id)) return BODY_SPIRIT
  if (/\b(spirit|灵|fairy|精灵|幻|zephyr|mirage|wind_serpent|霜灵)\b/i.test(id)) return BODY_SPIRIT
  if (/\b(wolf|狼|hound|犬|beast|兽|lion|狮|tiger|虎|ram|羊|mountain_ram|冰狼|地狱犬)\b/i.test(id)) return BODY_BEAST
  if (/\b(mole|钻地|鼠)\b/i.test(id)) return BODY_BEAST
  if (/\b(dragon|龙|drake|wyrm|羽龙|云龙|晶龙|圣光)\b/i.test(id)) return BODY_DRAGON
  if (id.startsWith('auto_')) {
    const plans = [BODY_DRAGON, BODY_FOX, BODY_BIRD, BODY_GOLEM, BODY_BEAST, BODY_SERPENT, BODY_SPIRIT, BODY_CRAB]
    return plans[hashId(id) % plans.length]
  }
  if (id.includes('fire') || id.includes('flame') || id.includes('blaze') || id.includes('salamander') || id.includes('magma')) return BODY_DRAGON
  if (id.includes('light') || id.includes('celestial') || id.includes('judgment') || id.includes('divine') || id.includes('holy') || id.includes('star')) return BODY_SPIRIT
  if (id.includes('water') || id.includes('frost') || id.includes('ice') || id.includes('tide')) return BODY_SERPENT
  if (id.includes('earth') || id.includes('stone') || id.includes('rock') || id.includes('crystal') || id.includes('forest') || id.includes('mountain')) return BODY_GOLEM
  if (id.includes('wind') || id.includes('storm') || id.includes('cloud') || id.includes('thunder') || id.includes('zephyr')) return BODY_BIRD
  return BODY_DRAGON
}

// ======================================================================
//  IMAGE-BASED RENDERING (PNG compositing)
// ======================================================================

const BODY_PLAN_DIRS = ['dragon', 'fox', 'bird', 'golem', 'beast', 'serpent', 'spirit', 'crab']

/** Returns the first loadable URL, null after every candidate fails, or undefined while checking. */
function useFirstAvailableImage(candidates: string[]): string | null | undefined {
  const candidateKey = candidates.join('|')
  const [result, setResult] = useState<string | null | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    let index = 0
    setResult(undefined)

    const tryNext = () => {
      const src = candidates[index]
      if (!src) {
        if (!cancelled) setResult(null)
        return
      }

      const image = new Image()
      image.onload = () => { if (!cancelled) setResult(src) }
      image.onerror = () => { index += 1; tryNext() }
      image.src = src
    }

    tryNext()
    return () => { cancelled = true }
  }, [candidateKey])

  return result
}

function RarityGlowOverlay({ rarity, size }: { rarity: Rarity; size: number }) {
  const colors: Record<Rarity, string> = {
    green: 'rgba(74, 222, 128, 0.4)',
    blue: 'rgba(96, 165, 250, 0.4)',
    purple: 'rgba(167, 139, 250, 0.5)',
    orange: 'rgba(251, 146, 60, 0.5)',
    red: 'rgba(248, 113, 113, 0.6)',
    gold: 'rgba(250, 204, 21, 0.7)',
  }
  const color = rarity === 'gold' ? colors.gold
    : rarity === 'red' ? colors.red
    : rarity === 'orange' ? colors.orange
    : rarity === 'purple' ? colors.purple
    : rarity === 'blue' ? colors.blue
    : colors.green

  return (
    <div style={{
      position: 'absolute', inset: 0,
      borderRadius: '50%',
      boxShadow: `inset 0 0 ${size * 0.3}px ${size * 0.1}px ${color}`,
      pointerEvents: 'none',
      zIndex: 3,
    }} />
  )
}

function RarityBorder({ rarity, size }: { rarity: Rarity; size: number }) {
  const borderColor = RARITY_COLORS[rarity]
  const isGold = rarity === 'gold'
  return (
    <div style={{
      position: 'absolute', inset: 2,
      borderRadius: '50%',
      border: `2px solid ${borderColor}`,
      opacity: 0.4,
      borderStyle: isGold ? 'dashed' : 'solid',
      animation: isGold ? 'goldPulse 2s infinite' : undefined,
      pointerEvents: 'none',
      zIndex: 4,
    }} />
  )
}

function SparkleOverlay({ size }: { size: number }) {
  const s = Math.max(size * 0.15, 8)
  return (
    <svg width={size} height={size} style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' }}
      viewBox="0 0 100 100">
      <path d="M18 12 L20 18 L26 20 L20 22 L18 28 L16 22 L10 20 L16 18 Z" fill="#facc15" opacity={0.9} />
      <path d="M82 15 L84 20 L89 22 L84 24 L82 29 L80 24 L75 22 L80 20 Z" fill="#facc15" opacity={0.8} />
      <path d="M80 82 L81.5 85.5 L85 87 L81.5 88.5 L80 92 L78.5 88.5 L75 87 L78.5 85.5 Z" fill="#facc15" opacity={0.7} />
      <path d="M15 75 L16.5 78.5 L20 80 L16.5 81.5 L15 85 L13.5 81.5 L10 80 L13.5 78.5 Z" fill="#facc15" opacity={0.6} />
    </svg>
  )
}

/** PNG compositing pet renderer */
function ImagePet({ bodyUrl, elementUrl, rarity, size, element, stage, color }: {
  bodyUrl: string; elementUrl?: string; rarity: Rarity; size: number
  element: ElementType; stage: number; color: string
}) {
  return (
    <div style={{
      width: size, height: size,
      position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Layer 1: PNG element when present, otherwise the existing SVG effect */}
      {elementUrl ? <img src={elementUrl} alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'contain',
          zIndex: 1,
          opacity: 0.85,
          pointerEvents: 'none',
        }}
        draggable={false}
      /> : <svg width={size} height={size} viewBox="0 0 100 100"
        style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <ElementEffects element={element} stage={stage} color={color} cx={50} cy={50} />
      </svg>}

      {/* Layer 2: Pet body */}
      <img src={bodyUrl} alt="pet"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'contain',
          zIndex: 2,
          pointerEvents: 'none',
        }}
        draggable={false}
      />

      {/* Layer 3: Rarity effects (CSS, no PNG needed) */}
      <RarityGlowOverlay rarity={rarity} size={size} />
      <RarityBorder rarity={rarity} size={size} />

      {/* Layer 4: Gold sparkles (SVG overlay) */}
      {rarity === 'gold' && <SparkleOverlay size={size} />}
    </div>
  )
}

// ======================================================================
//  SVG-BASED RENDERING (fallback when images aren't available)
// ======================================================================

function RarityGlow({ color, stage, rarity }: { color: string; stage: number; rarity: Rarity }) {
  const s = 30 + stage * 8 + (rarity === 'gold' ? 8 : 0)
  const intensity = 0.15 + stage * 0.08 + (rarity === 'gold' ? 0.2 : rarity === 'red' ? 0.15 : rarity === 'orange' ? 0.08 : 0)
  const blur = 4 + stage * 2
  return (
    <circle cx="50" cy="50" r={s} fill={color} opacity={intensity} style={{ filter: `blur(${blur}px)` }} />
  )
}

function Eyes({ cx, cy, stage, color = '#111' }: { cx: number; cy: number; stage: number; color?: string }) {
  if (stage <= 1) {
    return (
      <g>
        <circle cx={cx - 8} cy={cy} r={5 + stage} fill="white" />
        <circle cx={cx + 8} cy={cy} r={5 + stage} fill="white" />
        <circle cx={cx - 8} cy={cy} r={3} fill={color} />
        <circle cx={cx + 8} cy={cy} r={3} fill={color} />
        <circle cx={cx - 9} cy={cy - 2} r={1.5} fill="white" />
        <circle cx={cx + 7} cy={cy - 2} r={1.5} fill="white" />
      </g>
    )
  }
  const w = 5 + stage
  return (
    <g>
      <path d={`M${cx - w - 2} ${cy - 2} Q${cx - w / 2} ${cy - 4 - stage} ${cx - 2} ${cy - 1} Q${cx - w / 2} ${cy + 2} ${cx - w - 2} ${cy - 2}`} fill={color} />
      <path d={`M${cx + w + 2} ${cy - 2} Q${cx + w / 2} ${cy - 4 - stage} ${cx + 2} ${cy - 1} Q${cx + w / 2} ${cy + 2} ${cx + w + 2} ${cy - 2}`} fill={color} />
      <circle cx={cx - w / 2 - 1} cy={cy - 1} r={1.5} fill="white" opacity={0.8} />
      <circle cx={cx + w / 2 + 1} cy={cy - 1} r={1.5} fill="white" opacity={0.8} />
    </g>
  )
}

function ElementEffects({ element, stage, color, cx, cy }: { element: ElementType; stage: number; color: string; cx: number; cy: number }) {
  if (stage < 1) return null
  const count = Math.min(stage + 1, 6)
  const elements: React.ReactNode[] = []

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + stage * 0.3
    const r = 40 + stage * 5
    const x = cx + Math.cos(angle) * r
    const y = cy + Math.sin(angle) * r
    const size = 3 + stage * 1.5

    switch (element) {
      case 'fire':
        elements.push(
          <path key={i} d={`M${x} ${y + size} Q${x + size / 2} ${y} ${x} ${y - size} Q${x - size / 2} ${y} ${x} ${y + size}`}
            fill={color} opacity={0.5 + Math.sin(angle) * 0.3} />
        )
        break
      case 'wind':
        elements.push(
          <path key={i} d={`M${x - size} ${y} Q${x} ${y - size / 2} ${x + size} ${y} Q${x} ${y + size / 2} ${x - size} ${y}`}
            fill="none" stroke={color} strokeWidth={1.5} opacity={0.6} />
        )
        break
      case 'earth':
        elements.push(
          <rect key={i} x={x - size / 2} y={y - size / 2} width={size} height={size} rx={1}
            fill={color} opacity={0.5} transform={`rotate(${i * 45} ${x} ${y})`} />
        )
        break
      case 'water':
        elements.push(
          <circle key={i} cx={x} cy={y} r={size / 2} fill="none" stroke={color}
            strokeWidth={1.5} opacity={0.4 + Math.sin(angle) * 0.2} />
        )
        break
      case 'light':
        elements.push(
          <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={color}
            strokeWidth={1.5} opacity={0.2 + i * 0.08} style={{ filter: 'blur(1px)' }} />
        )
        break
    }
  }
  return <g>{elements}</g>
}

function Crown({ cx, cy, stage, color }: { cx: number; cy: number; stage: number; color: string }) {
  if (stage < 3) return null
  const text = stage >= 4 ? '✦' : '♦'
  return (
    <text x={cx} y={cy - 5} textAnchor="middle" fontSize={12 + stage * 3} fill={color} opacity={0.9}>
      {text}
    </text>
  )
}

function Sparkles({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g fill="#facc15" opacity={0.8}>
      <path d="M20 15 L22 20 L27 22 L22 24 L20 29 L18 24 L13 22 L18 20 Z" transform="scale(0.6) translate(10,5)" />
      <path d="M75 10 L77 15 L82 17 L77 19 L75 24 L73 19 L68 17 L73 15 Z" transform="scale(0.8) translate(5,-5)" />
      <path d="M80 80 L81.5 83.5 L85 85 L81.5 86.5 L80 90 L78.5 86.5 L75 85 L78.5 83.5 Z" transform="scale(0.5) translate(30,20)" />
    </g>
  )
}

interface RenderConfig { stage: number; element: ElementType; color: string; rarityColor: string }

function DragonSVG({ stage, element, color, rarityColor }: RenderConfig) {
  const bodyColor = color; const accentColor = rarityColor; const s = 0.7 + stage * 0.12
  return (
    <g transform={`scale(${s}) translate(${25 * (1 - s)} ${20 * (1 - s)})`}>
      <path d="M50 65 Q65 70 75 55 Q80 50 85 45" stroke={bodyColor} strokeWidth={4 + stage * 2} fill="none" strokeLinecap="round" />
      {stage >= 2 && <path d="M85 45 Q90 40 88 35 Q86 30 85 45" fill={bodyColor} />}
      {stage >= 3 && <path d="M75 55 L78 48 L80 54 L83 46 L85 52" stroke={accentColor} strokeWidth={1.5} fill="none" />}
      <ellipse cx={40 + stage * 3} cy={70} rx={6} ry={4 + stage} fill={bodyColor} />
      <ellipse cx={55 + stage * 2} cy={70} rx={6} ry={4 + stage} fill={bodyColor} />
      <ellipse cx={50} cy={52} rx={16 + stage * 3} ry={12 + stage * 2} fill={bodyColor} opacity={0.9} />
      {stage >= 2 && <ellipse cx={50} cy={52} rx={14 + stage * 2} ry={10 + stage * 1.5} fill="none" stroke={accentColor} strokeWidth={1} opacity={0.3} />}
      <ellipse cx={50} cy={58} rx={10 + stage * 2} ry={6 + stage} fill={bodyColor} opacity={0.5} />
      <ellipse cx={35} cy={62} rx={4} ry={3 + stage} fill={bodyColor} />
      <ellipse cx={65} cy={62} rx={4} ry={3 + stage} fill={bodyColor} />
      <path d="M38 42 Q35 30 42 22" stroke={bodyColor} strokeWidth={6 + stage * 2} fill="none" strokeLinecap="round" />
      <ellipse cx={45 + stage} cy={18} rx={11 + stage} ry={9 + stage} fill={bodyColor} />
      <Eyes cx={45 + stage} cy={16} stage={stage} />
      <ellipse cx={55 + stage * 1.5} cy={20} rx={6 + stage} ry={4} fill={bodyColor} opacity={0.8} />
      {stage >= 2 && <path d={`M${58 + stage * 1.5} 18 Q${62 + stage * 1.5} 18 ${60 + stage * 1.5} 21`} stroke="none" fill={accentColor} opacity={0.6} />}
      <path d={`M${38 + stage} 12 Q${32 - stage} ${2 - stage} ${36 - stage} ${-3}`} stroke={accentColor} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <path d={`M${48 + stage} 10 Q${48 - stage} ${0 - stage} ${52 - stage} ${-5}`} stroke={accentColor} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      {stage >= 3 && <path d={`M${42 + stage} 8 Q${40} ${-5} ${44} ${-10}`} stroke={accentColor} strokeWidth={2} fill="none" strokeLinecap="round" />}
      {stage >= 1 && (
        <g>
          <path d={`M28 35 Q${10 - stage * 3} ${15 - stage * 2} ${15 - stage} ${5} Q${20 - stage} ${10} ${28} ${28}`} fill={bodyColor} opacity={0.7} stroke={accentColor} strokeWidth={1} />
          <path d={`M72 35 Q${90 + stage * 3} ${15 - stage * 2} ${85 + stage} ${5} Q${80 + stage} ${10} ${72} ${28}`} fill={bodyColor} opacity={0.7} stroke={accentColor} strokeWidth={1} />
        </g>
      )}
      {stage >= 3 && (
        <g opacity={0.5}>
          <path d={`M20 30 Q${0 - stage} ${10 - stage} ${5 - stage} ${-5}`} stroke={accentColor} strokeWidth={1} fill="none" />
          <path d={`M80 30 Q${100 + stage} ${10 - stage} ${95 + stage} ${-5}`} stroke={accentColor} strokeWidth={1} fill="none" />
        </g>
      )}
    </g>
  )
}

function FoxSVG({ stage, element, color, rarityColor }: RenderConfig) {
  const bodyColor = color; const accentColor = rarityColor; const tailCount = [1, 1, 3, 6, 9][stage]
  return (
    <g>
      {Array.from({ length: tailCount }).map((_, i) => {
        const angle = -30 + (i / (tailCount - 1 || 1)) * 60 - 20; const rad = (angle * Math.PI) / 180
        const tx = 70 + Math.cos(rad) * (10 + stage * 3); const ty = 50 + Math.sin(rad) * (10 + stage * 2)
        return <path key={i} d={`M50 55 Q${60 + stage * 2} ${40 - stage + i * 2} ${tx} ${ty}`} stroke={bodyColor} strokeWidth={4 + stage * 1.5} fill="none" strokeLinecap="round" opacity={0.5 + (i / tailCount) * 0.5} />
      })}
      <ellipse cx={38} cy={68} rx={5} ry={4} fill={bodyColor} />
      <ellipse cx={58} cy={68} rx={5} ry={4} fill={bodyColor} />
      <ellipse cx={50} cy={52} rx={14 + stage * 2} ry={10 + stage} fill={bodyColor} />
      <ellipse cx={50} cy={58} rx={10} ry={5} fill={bodyColor} opacity={0.5} />
      {stage >= 2 && <ellipse cx={50} cy={50} rx={12} ry={8} fill="none" stroke={accentColor} strokeWidth={1} opacity={0.3} />}
      <ellipse cx={35} cy={60} rx={4} ry={3} fill={bodyColor} />
      <ellipse cx={65} cy={60} rx={4} ry={3} fill={bodyColor} />
      <ellipse cx={50} cy={30} rx={12 + stage} ry={10 + stage} fill={bodyColor} />
      <path d={`M40 24 L35 ${12 - stage} L45 22`} fill={bodyColor} />
      <path d={`M60 24 L65 ${12 - stage} L55 22`} fill={bodyColor} />
      {stage >= 1 && (<><path d={`M40 24 L37 ${14 - stage} L43 22`} fill={accentColor} opacity={0.4} /><path d={`M60 24 L63 ${14 - stage} L57 22`} fill={accentColor} opacity={0.4} /></>)}
      <Eyes cx={50} cy={28} stage={stage} />
      <circle cx={50} cy={34} r={3 + stage * 0.5} fill={bodyColor} opacity={0.8} />
      <circle cx={44} cy={32} r={2} fill={bodyColor} opacity={0.6} />
      <circle cx={56} cy={32} r={2} fill={bodyColor} opacity={0.6} />
      {stage >= 3 && <path d={`M48 20 L50 17 L52 20 L50 23 Z`} fill={accentColor} opacity={0.8} />}
      {stage >= 4 && <g opacity={0.6}><circle cx={50} cy={18} r={8} fill="none" stroke={accentColor} strokeWidth={1} /><circle cx={50} cy={18} r={12} fill="none" stroke={accentColor} strokeWidth={0.5} /></g>}
    </g>
  )
}

function BirdSVG({ stage, element, color, rarityColor }: RenderConfig) {
  const bodyColor = color; const accentColor = rarityColor
  return (
    <g>
      {Array.from({ length: 3 + stage * 2 }).map((_, i) => {
        const x = 45 + (i / (2 + stage * 2)) * 10
        return <path key={i} d={`M${x} 60 Q${x + (i % 2 ? -5 : 5)} ${70 + stage * 5} ${x + (i % 2 ? -10 : 10)} ${80 + stage * 5}`} stroke={bodyColor} strokeWidth={2 + stage * 0.5} fill="none" strokeLinecap="round" opacity={0.4 + (i / (3 + stage * 2)) * 0.6} />
      })}
      <line x1={42} y1={65} x2={40} y2={75} stroke={bodyColor} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={58} y1={65} x2={60} y2={75} stroke={bodyColor} strokeWidth={2.5} strokeLinecap="round" />
      <ellipse cx={50} cy={48} rx={14 + stage * 2} ry={12 + stage * 2} fill={bodyColor} />
      <ellipse cx={50} cy={52} rx={10 + stage} ry={8 + stage} fill={bodyColor} opacity={0.4} />
      {stage >= 2 && <ellipse cx={50} cy={46} rx={6} ry={8} fill={accentColor} opacity={0.2} />}
      <path d={`M30 42 Q${15 - stage} ${30 - stage * 2} ${20 - stage} ${15 - stage} Q${28} ${25} ${35} ${38}`} fill={bodyColor} opacity={0.8} stroke={accentColor} strokeWidth={1} />
      <path d={`M70 42 Q${85 + stage} ${30 - stage * 2} ${80 + stage} ${15 - stage} Q${72} ${25} ${65} ${38}`} fill={bodyColor} opacity={0.8} stroke={accentColor} strokeWidth={1} />
      {stage >= 3 && (<>{Array.from({ length: stage }).map((_, i) => (<path key={i} d={`M${18 - i * 3} ${25 + i * 5} L${25 - i * 2} ${20 + i * 5}`} stroke={accentColor} strokeWidth={1} fill="none" opacity={0.5} />))}{Array.from({ length: stage }).map((_, i) => (<path key={i} d={`M${82 + i * 3} ${25 + i * 5} L${75 + i * 2} ${20 + i * 5}`} stroke={accentColor} strokeWidth={1} fill="none" opacity={0.5} />))}</>)}
      <path d="M43 38 Q40 28 45 22" stroke={bodyColor} strokeWidth={5 + stage} fill="none" strokeLinecap="round" />
      <path d="M57 38 Q60 28 55 22" stroke={bodyColor} strokeWidth={5 + stage} fill="none" strokeLinecap="round" />
      <ellipse cx={50} cy={20} rx={10 + stage} ry={8 + stage} fill={bodyColor} />
      {stage >= 1 && <path d={`M46 14 Q${50 - stage * 2} ${6 - stage * 2} ${50} ${4 - stage} Q${50 + stage * 2} ${6 - stage * 2} ${54} 14`} fill={accentColor} opacity={0.7} />}
      <path d="M47 22 L50 28 L53 22" fill={bodyColor} opacity={0.7} stroke={accentColor} strokeWidth={0.5} />
      <Eyes cx={50} cy={18} stage={stage} />
      {stage >= 3 && element === 'fire' && <ellipse cx={50} cy={50} rx={30 + stage * 3} ry={25 + stage * 2} fill="none" stroke={accentColor} strokeWidth={1.5} style={{ filter: 'blur(2px)' }} />}
    </g>
  )
}

function GolemSVG({ stage, element, color, rarityColor }: RenderConfig) {
  const bodyColor = color; const accentColor = rarityColor
  return (
    <g>
      <ellipse cx={50} cy={78} rx={20 + stage * 3} ry={4} fill="#000" opacity={0.2} />
      <rect x={35} y={62} width={10} height={16} rx={3} fill={bodyColor} />
      <rect x={55} y={62} width={10} height={16} rx={3} fill={bodyColor} />
      {stage >= 1 && (<><rect x={33} y={60} width={14} height={6} rx={2} fill={accentColor} opacity={0.3} /><rect x={53} y={60} width={14} height={6} rx={2} fill={accentColor} opacity={0.3} /></>)}
      <rect x={30} y={35} width={40 + stage * 2} height={30 + stage * 3} rx={6} fill={bodyColor} />
      {stage >= 1 && (<><rect x={34} y={39} width={32 + stage * 2} height={22 + stage * 2} rx={4} fill="none" stroke={accentColor} strokeWidth={1.5} opacity={0.4} /><line x1={50} y1={39} x2={50} y2={57 + stage * 2} stroke={accentColor} strokeWidth={1} opacity={0.3} /></>)}
      <circle cx={50} cy={50} r={5 + stage} fill={accentColor} opacity={0.3 + stage * 0.1} />
      {stage >= 3 && <circle cx={50} cy={50} r={3} fill={accentColor} opacity={0.8} style={{ filter: 'blur(1px)' }} />}
      <rect x={22} y={40} width={8} height={20} rx={3} fill={bodyColor} />
      <rect x={70} y={40} width={8} height={20} rx={3} fill={bodyColor} />
      {stage >= 2 && (<><rect x={18 - stage} y={38} width={12} height={8} rx={2} fill={accentColor} opacity={0.4} /><rect x={70 + stage} y={38} width={12} height={8} rx={2} fill={accentColor} opacity={0.4} /></>)}
      <rect x={26} y={33} width={14} height={8} rx={3} fill={bodyColor} />
      <rect x={60} y={33} width={14} height={8} rx={3} fill={bodyColor} />
      <rect x={40} y={26} width={20} height={10} rx={3} fill={bodyColor} />
      <rect x={32} y={10} width={36 + stage * 2} height={20} rx={6} fill={bodyColor} />
      <rect x={38} y={16} width={6 + stage} height={4} rx={2} fill={accentColor} opacity={0.7} />
      <rect x={56 - stage} y={16} width={6 + stage} height={4} rx={2} fill={accentColor} opacity={0.7} />
      {stage >= 2 && <rect x={38} y={16} width={24} height={4} rx={2} fill={accentColor} opacity={0.5} />}
      {stage >= 1 && (<><path d={`M34 10 L28 ${0 - stage} L38 8`} stroke={accentColor} strokeWidth={2} fill="none" strokeLinecap="round" /><path d={`M66 10 L72 ${0 - stage} L62 8`} stroke={accentColor} strokeWidth={2} fill="none" strokeLinecap="round" /></>)}
      {stage >= 3 && <path d={`M42 8 L44 -2 L50 4 L56 -2 L58 8`} stroke={accentColor} strokeWidth={2} fill="none" />}
      {stage >= 2 && element === 'earth' && (<>{Array.from({ length: stage + 1 }).map((_, i) => (<path key={i} d={`M${25 + i * 12} 35 L${22 + i * 12} ${25 - i * 3} L${28 + i * 12} ${30 - i * 2} Z`} fill={accentColor} opacity={0.3 + i * 0.1} />))}</>)}
    </g>
  )
}

function BeastSVG({ stage, element, color, rarityColor }: RenderConfig) {
  const bodyColor = color; const accentColor = rarityColor
  return (
    <g>
      <path d={`M65 52 Q${75 + stage * 2} ${45 - stage} ${72 + stage * 3} ${35 - stage}`} stroke={bodyColor} strokeWidth={3 + stage * 1.5} fill="none" strokeLinecap="round" />
      {stage >= 3 && <ellipse cx={72 + stage * 3} cy={33 - stage} rx={4} ry={3} fill={accentColor} opacity={0.6} />}
      <ellipse cx={40 + stage} cy={64} rx={6} ry={5} fill={bodyColor} />
      <ellipse cx={58 + stage} cy={64} rx={6} ry={5} fill={bodyColor} />
      <ellipse cx={50} cy={48} rx={18 + stage * 2} ry={12 + stage} fill={bodyColor} />
      <ellipse cx={50} cy={54} rx={14 + stage} ry={7} fill={bodyColor} opacity={0.4} />
      {stage >= 2 && (<><path d={`M38 42 Q42 48 38 54`} stroke={accentColor} strokeWidth={1} fill="none" opacity={0.3} /><path d={`M62 42 Q58 48 62 54`} stroke={accentColor} strokeWidth={1} fill="none" opacity={0.3} /></>)}
      <ellipse cx={33} cy={58} rx={5} ry={4 + stage} fill={bodyColor} />
      <ellipse cx={67} cy={58} rx={5} ry={4 + stage} fill={bodyColor} />
      {stage >= 2 && (<><ellipse cx={31} cy={60} rx={3} ry={2} fill={accentColor} opacity={0.3} /><ellipse cx={69} cy={60} rx={3} ry={2} fill={accentColor} opacity={0.3} /></>)}
      <path d="M38 40 Q35 30 40 20" stroke={bodyColor} strokeWidth={6 + stage * 1.5} fill="none" strokeLinecap="round" />
      <path d="M62 40 Q65 30 60 20" stroke={bodyColor} strokeWidth={6 + stage * 1.5} fill="none" strokeLinecap="round" />
      {stage >= 2 && <g opacity={0.5}><ellipse cx={44 - stage} cy={26} rx={6} ry={10 + stage} fill={accentColor} opacity={0.2} /><ellipse cx={56 + stage} cy={26} rx={6} ry={10 + stage} fill={accentColor} opacity={0.2} /></g>}
      <ellipse cx={50} cy={18} rx={12 + stage} ry={9 + stage} fill={bodyColor} />
      <path d={`M40 14 L36 ${4 - stage} L46 12`} fill={bodyColor} />
      <path d={`M60 14 L64 ${4 - stage} L54 12`} fill={bodyColor} />
      <ellipse cx={50} cy={24} rx={7 + stage} ry={4 + stage * 0.5} fill={bodyColor} />
      <ellipse cx={46} cy={23} rx={2} ry={1.5} fill={bodyColor} opacity={0.6} />
      <ellipse cx={54} cy={23} rx={2} ry={1.5} fill={bodyColor} opacity={0.6} />
      {stage >= 3 && <path d="M48 26 L50 24 L52 26" stroke={accentColor} strokeWidth={1} fill="none" />}
      {stage <= 1 ? <Eyes cx={50} cy={16} stage={stage} /> : <Eyes cx={50} cy={15} stage={3} />}
      {stage >= 3 && <path d={`M47 10 L50 7 L53 10 L50 13 Z`} fill={accentColor} opacity={0.7} />}
    </g>
  )
}

function SerpentSVG({ stage, element, color, rarityColor }: RenderConfig) {
  const bodyColor = color; const accentColor = rarityColor; const coils = 2 + stage
  return (
    <g>
      {Array.from({ length: coils }).map((_, i) => {
        const yOff = 55 + i * 3; const xOff = 20 + (i % 2) * 12; const w = 25 - i * 2 + stage * 3; const h = 8 + stage * 1.5 - i
        return <ellipse key={i} cx={50 + xOff - 12 * (i % 2)} cy={yOff} rx={w} ry={h} fill={bodyColor} opacity={0.6 + (i / coils) * 0.3} transform={`rotate(${i % 2 ? 10 : -10} ${50 + xOff - 12 * (i % 2)} ${yOff})`} />
      })}
      {stage >= 1 && (<>{Array.from({ length: stage + 2 }).map((_, i) => (<ellipse key={i} cx={40 + i * 5} cy={55 + i * 2} rx={3} ry={1.5} fill={accentColor} opacity={0.3 + i * 0.05} />))}</>)}
      <path d={`M${30 - stage * 2} 58 Q${20 - stage * 3} ${55 + stage} ${15 - stage * 3} ${50 + stage}`} stroke={bodyColor} strokeWidth={4 + stage} fill="none" strokeLinecap="round" />
      {stage >= 2 && <path d={`M18 52 L${8 - stage} ${45 - stage} L${12 - stage} ${55 + stage} Z`} fill={accentColor} opacity={0.5} />}
      <path d="M52 38 Q58 28 55 18" stroke={bodyColor} strokeWidth={6 + stage * 1.5} fill="none" strokeLinecap="round" />
      <ellipse cx={54 + stage} cy={12} rx={8 + stage} ry={6 + stage} fill={bodyColor} />
      {stage >= 2 && (<><path d={`M44 ${12 - stage} Q${48} ${6 - stage} ${52} ${10 - stage}`} stroke={accentColor} strokeWidth={1.5} fill={accentColor} opacity={0.3} /><path d={`M${62 + stage * 2} ${12 - stage} Q${58 + stage} ${6 - stage} ${54 + stage} ${10 - stage}`} stroke={accentColor} strokeWidth={1.5} fill={accentColor} opacity={0.3} /></>)}
      <Eyes cx={54 + stage} cy={10} stage={stage} />
      <path d={`M${60 + stage * 2} 14 L${66 + stage * 2} 12 L${68 + stage * 2} 10 M${66 + stage * 2} 12 L${68 + stage * 2} 14`} stroke={accentColor} strokeWidth={1} fill="none" opacity={0.7} />
      <path d={`M${48 + stage} 5 L${44 - stage} ${-2 - stage}`} stroke={accentColor} strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d={`M${58 + stage} 5 L${62 + stage} ${-2 - stage}`} stroke={accentColor} strokeWidth={2} fill="none" strokeLinecap="round" />
      {element === 'water' && stage >= 1 && (<><path d={`M45 40 Q${35 - stage} ${30} ${40 - stage} ${20}`} stroke={accentColor} strokeWidth={1.5} fill="none" opacity={0.4} /><path d={`M55 40 Q${65 + stage} ${30} ${60 + stage} ${20}`} stroke={accentColor} strokeWidth={1.5} fill="none" opacity={0.4} /></>)}
    </g>
  )
}

function SpiritSVG({ stage, element, color, rarityColor }: RenderConfig) {
  const bodyColor = color; const accentColor = rarityColor
  return (
    <g>
      <ellipse cx={50} cy={72} rx={12 + stage * 4} ry={4 + stage} fill={accentColor} opacity={0.2 + stage * 0.05} style={{ filter: 'blur(3px)' }} />
      {Array.from({ length: stage + 2 }).map((_, i) => (<ellipse key={i} cx={50 + (i % 2 ? -3 : 3) * (stage + 1)} cy={62 + i * 5} rx={8 - i} ry={3} fill={accentColor} opacity={0.1 + i * 0.05} style={{ filter: 'blur(2px)' }} />))}
      <path d={`M35 50 Q30 ${60 + stage * 2} ${35 - stage} ${70 + stage * 2} Q50 ${75 + stage * 3} ${65 + stage} ${70 + stage * 2} Q70 ${60 + stage * 2} 65 50`} fill={bodyColor} opacity={0.7} />
      <ellipse cx={50} cy={42} rx={14 + stage * 1.5} ry={12 + stage * 2} fill={bodyColor} opacity={0.8} />
      <ellipse cx={50} cy={42} rx={6 + stage} ry={5 + stage} fill={accentColor} opacity={0.2 + stage * 0.05} style={{ filter: 'blur(3px)' }} />
      <path d={`M34 38 Q${24 - stage} ${28 - stage * 2} ${28 - stage} ${20 - stage}`} stroke={bodyColor} strokeWidth={3 + stage} fill="none" strokeLinecap="round" opacity={0.7} />
      <path d={`M66 38 Q${76 + stage} ${28 - stage * 2} ${72 + stage} ${20 - stage}`} stroke={bodyColor} strokeWidth={3 + stage} fill="none" strokeLinecap="round" opacity={0.7} />
      {stage >= 2 && (<>{Array.from({ length: stage + 1 }).map((_, i) => (<path key={i} d={`M30 35 Q${15 - i * 5} ${20 - i * 3} ${20 - i * 3} ${5 - i * 2}`} stroke={accentColor} strokeWidth={1.5} fill="none" opacity={0.3 + i * 0.1} />))}{Array.from({ length: stage + 1 }).map((_, i) => (<path key={i} d={`M70 35 Q${85 + i * 5} ${20 - i * 3} ${80 + i * 3} ${5 - i * 2}`} stroke={accentColor} strokeWidth={1.5} fill="none" opacity={0.3 + i * 0.1} />))}</>)}
      <circle cx={50} cy={20} r={9 + stage} fill={bodyColor} />
      <Eyes cx={50} cy={18} stage={stage} color={stage >= 3 ? accentColor : '#111'} />
      {stage >= 1 && <ellipse cx={50} cy={20 - stage * 2} rx={10 + stage * 2} ry={3 + stage} fill="none" stroke={accentColor} strokeWidth={1.5} opacity={0.5 + stage * 0.08} />}
      {stage >= 3 && (<><ellipse cx={50} cy={16 - stage * 2} rx={14 + stage * 2} ry={4 + stage} fill="none" stroke={accentColor} strokeWidth={1} opacity={0.3} /><ellipse cx={50} cy={12 - stage * 2} rx={18 + stage * 2} ry={5 + stage} fill="none" stroke={accentColor} strokeWidth={0.5} opacity={0.2} /></>)}
      {stage >= 3 && <path d={`M42 ${10 - stage} L46 ${5 - stage * 2} L50 ${8 - stage * 2} L54 ${5 - stage * 2} L58 ${10 - stage}`} stroke={accentColor} strokeWidth={1.5} fill="none" />}
      {stage >= 2 && (<>{Array.from({ length: stage * 2 }).map((_, i) => (<circle key={i} cx={25 + Math.sin(i * 1.5) * 15 + stage * 5} cy={15 + Math.cos(i * 2) * 10 + i * 4} r={1 + Math.random() * 1.5} fill={accentColor} opacity={0.3 + Math.random() * 0.4} />))}</>)}
    </g>
  )
}

function CrabSVG({ stage, element, color, rarityColor }: RenderConfig) {
  const bodyColor = color; const accentColor = rarityColor
  return (
    <g>
      <ellipse cx={50} cy={75} rx={18 + stage * 3} ry={4} fill="#000" opacity={0.2} />
      {Array.from({ length: 6 }).map((_, i) => {
        const side = i < 3 ? -1 : 1; const idx = i < 3 ? i : i - 3; const lx = 35 + idx * 5; const ly = 55 + idx * 3; const dirX = side * (10 + idx * 3 + stage * 2); const dirY = 5 + idx * 3
        return <path key={i} d={`M${lx} ${ly} L${lx + dirX} ${ly + dirY}`} stroke={bodyColor} strokeWidth={2 + stage * 0.5} fill="none" strokeLinecap="round" />
      })}
      <path d={`M28 45 Q${16 - stage * 2} ${30 - stage * 2} ${10 - stage} ${38} Q${8 - stage} ${42} ${14 - stage} ${44}`} stroke={bodyColor} strokeWidth={3 + stage} fill="none" strokeLinecap="round" />
      <path d={`M72 45 Q${84 + stage * 2} ${30 - stage * 2} ${90 + stage} ${38} Q${92 + stage} ${42} ${86 + stage} ${44}`} stroke={bodyColor} strokeWidth={3 + stage} fill="none" strokeLinecap="round" />
      <path d={`M${12 - stage} 44 L${6 - stage} 40 L${10 - stage} 48`} stroke={bodyColor} strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d={`M${88 + stage} 44 L${94 + stage} 40 L${90 + stage} 48`} stroke={bodyColor} strokeWidth={2} fill="none" strokeLinecap="round" />
      <ellipse cx={50} cy={48} rx={16 + stage * 2} ry={12 + stage * 1.5} fill={bodyColor} />
      <ellipse cx={50} cy={52} rx={14 + stage * 2} ry={8 + stage} fill={bodyColor} opacity={0.4} />
      {stage >= 2 && (<><path d={`M40 45 Q50 40 60 45`} stroke={accentColor} strokeWidth={1.5} fill="none" opacity={0.4} /><path d={`M38 50 Q50 45 62 50`} stroke={accentColor} strokeWidth={1.5} fill="none" opacity={0.4} /><path d={`M42 55 Q50 52 58 55`} stroke={accentColor} strokeWidth={1.5} fill="none" opacity={0.3} /></>)}
      {stage >= 3 && (<>{Array.from({ length: stage + 1 }).map((_, i) => (<path key={i} d={`M${40 + i * 5} 38 L${42 + i * 5} ${30 - i} L${44 + i * 5} 38`} fill={accentColor} opacity={0.4} />))}</>)}
      <line x1={44} y1={42} x2={42} y2={36} stroke={bodyColor} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={56} y1={42} x2={58} y2={36} stroke={bodyColor} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={42} cy={35} r={3} fill="white" /> <circle cx={58} cy={35} r={3} fill="white" />
      <circle cx={42} cy={35} r={1.5} fill="#111" /> <circle cx={58} cy={35} r={1.5} fill="#111" />
    </g>
  )
}

// ======================================================================
//  MAIN COMPONENT — chooses between image compositing and SVG fallback
// ======================================================================

export default function PetDisplay({ speciesId, stage, rarity, size = 80 }: Props) {
  const species = getSpecies(speciesId)
  if (!species) return <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>❓</div>

  const stageIndex = STAGE_KEYS.indexOf(stage)
  const rarityColor = RARITY_COLORS[rarity]
  const elementColor = species.color
  const bodyPlan = getBodyPlan(speciesId)

  const config: RenderConfig = { stage: stageIndex, element: species.element, color: elementColor, rarityColor }

  const bodyUrl = useFirstAvailableImage(getBodyAssetCandidates(BODY_PLAN_DIRS[bodyPlan], stage))
  const elementUrl = useFirstAvailableImage([`/assets/pets/elements/${species.element}/${stage}.png`])

  if (bodyUrl !== undefined) {
    const renderMode = getRenderMode(bodyUrl !== null, typeof elementUrl === 'string')
    if (renderMode !== 'svg-fallback' && bodyUrl) {
      return <ImagePet bodyUrl={bodyUrl} elementUrl={elementUrl ?? undefined} rarity={rarity} size={size}
        element={species.element} stage={stageIndex} color={elementColor} />
    }
  }

  // Still checking body image candidates
  if (bodyUrl === undefined) {
    return (
      <div style={{
        width: size, height: size,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.3,
      }}>
        🥚
      </div>
    )
  }

  // Fallback: SVG rendering
  return (
    <div style={{
      width: size, height: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <radialGradient id={`glow-${speciesId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={rarityColor} stopOpacity={0.3} />
            <stop offset="100%" stopColor={rarityColor} stopOpacity={0} />
          </radialGradient>
        </defs>
        <RarityGlow color={rarityColor} stage={stageIndex} rarity={rarity} />
        <circle cx="50" cy="50" r="45" fill={`url(#glow-${speciesId})`} />
        <ElementEffects element={config.element} stage={stageIndex} color={elementColor} cx={50} cy={50} />
        <Crown cx={50} cy={50} stage={stageIndex} color={rarityColor} />
        {bodyPlan === BODY_DRAGON && <DragonSVG {...config} />}
        {bodyPlan === BODY_FOX && <FoxSVG {...config} />}
        {bodyPlan === BODY_BIRD && <BirdSVG {...config} />}
        {bodyPlan === BODY_GOLEM && <GolemSVG {...config} />}
        {bodyPlan === BODY_BEAST && <BeastSVG {...config} />}
        {bodyPlan === BODY_SERPENT && <SerpentSVG {...config} />}
        {bodyPlan === BODY_SPIRIT && <SpiritSVG {...config} />}
        {bodyPlan === BODY_CRAB && <CrabSVG {...config} />}
        {rarity === 'gold' && <Sparkles cx={50} cy={50} />}
        <circle cx="50" cy="50" r="42" fill="none" stroke={rarityColor}
          strokeWidth="2" opacity={0.3 + stageIndex * 0.08}
          strokeDasharray={rarity === 'gold' ? '4 4' : 'none'} />
      </svg>
    </div>
  )
}
