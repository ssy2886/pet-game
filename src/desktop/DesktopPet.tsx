import { useState, useEffect, useRef, useCallback } from 'react'
import { getSpecies } from '../core/data/species'
import type { Pet, EvolutionStage, Rarity } from '../core/types'
import { RARITY_COLORS, ELEMENT_LABELS } from '../core/types'
import { clampPetPosition, getDraggedPetPosition, isDragGesture, restorePetPosition, type Point } from './petDrag'

type PetState = 'idle' | 'walking' | 'sleeping' | 'interacting' | 'following'

const DEFAULT_POSITION = { x: 200, y: 200 }
const PET_STORAGE_KEY = 'desktop-pet-position.json'
const PET_BASE_SIZE = { width: 85, height: 85 }

// 初始化默认宠物数据
const DEFAULT_PET: Pet = {
  id: 'starter',
  speciesId: 'flame_drake',
  nickname: '焰苗兽',
  rarity: 'blue',
  stage: 'baby',
  element: 'fire',
  level: 5,
  exp: 0,
  stats: { hp: 100, attack: 50, defense: 40, spAttack: 50, spDefense: 40, speed: 40 },
  ivs: { hp: 15, attack: 15, defense: 15, spAttack: 15, spDefense: 15, speed: 15 },
  evs: { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
  skills: ['ember', 'tackle'],
  affection: 50,
  cleanliness: 100,
  mood: 80,
  growth: 20,
  isHatched: true,
  obtainedAt: Date.now(),
}

export default function DesktopPet() {
  const [pet, setPet] = useState<Pet | null>(null)
  const [state, setState] = useState<PetState>('idle')
  const [pos, setPos] = useState(DEFAULT_POSITION)
  const [targetPos, setTargetPos] = useState(DEFAULT_POSITION)
  const [isDragging, setIsDragging] = useState(false)
  const [hasManualPosition, setHasManualPosition] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })
  const [message, setMessage] = useState('')
  const animRef = useRef<number>(0)
  const frameRef = useRef(0)
  const prevTime = useRef(Date.now())
  const dragRef = useRef<{ start: Point; offset: Point; active: boolean } | null>(null)
  const suppressClickRef = useRef(false)
  const positionLoadedRef = useRef(false)
  const isPointerOverPetRef = useRef(false)
  const userPlacementVersionRef = useRef(0)
  const pendingRestoreRef = useRef<{ position: Point; hasManualPosition: boolean } | null>(null)

  useEffect(() => {
    const api = (window as any).electronAPI
    const selectActivePet = (snapshot: any): Pet | null => {
      const teamId = Array.isArray(snapshot?.team) ? snapshot.team[0] : undefined
      const pets = Array.isArray(snapshot?.pets) ? snapshot.pets : []
      return pets.find((candidate: Pet) => candidate.id === teamId) || null
    }

    void Promise.resolve(api?.gameRead?.()).then((snapshot) => setPet(selectActivePet(snapshot))).catch(() => setPet(null))
    return api?.onGameState?.((snapshot: unknown) => setPet(selectActivePet(snapshot)))
  }, [])

  const rarityColor = RARITY_COLORS[pet?.rarity ?? 'gold']
  const petSize = state === 'interacting' ? 100 : state === 'sleeping' ? 70 : 85
  const scale = state === 'sleeping' ? 0.8 : 1
  const renderedScale = state === 'walking' ? 1.05 : scale

  const clampToViewport = useCallback((position: Point) => {
    const renderedPetSize = petSize * renderedScale
    const overflow = (renderedPetSize - petSize) / 2
    const clamped = clampPetPosition(
      { x: position.x - overflow, y: position.y - overflow },
      { width: window.innerWidth, height: window.innerHeight },
      { width: renderedPetSize, height: renderedPetSize },
    )

    return { x: clamped.x + overflow, y: clamped.y + overflow }
  }, [petSize, renderedScale])

  const getDraggedPosition = useCallback((pointer: Point, offset: Point) => {
    const renderedPetSize = petSize * renderedScale
    const overflow = (renderedPetSize - petSize) / 2
    const clamped = getDraggedPetPosition(
      pointer,
      { x: offset.x + overflow, y: offset.y + overflow },
      { width: window.innerWidth, height: window.innerHeight },
      { width: renderedPetSize, height: renderedPetSize },
    )

    return { x: clamped.x + overflow, y: clamped.y + overflow }
  }, [petSize, renderedScale])

  const applyRestoredPosition = useCallback((position: Point, hasManualPosition: boolean) => {
    setPos(position)
    setTargetPos(position)
    setHasManualPosition(hasManualPosition)
  }, [])

  useEffect(() => {
    if (positionLoadedRef.current) return
    positionLoadedRef.current = true

    let cancelled = false
    const loadPosition = async () => {
      const restoreVersion = userPlacementVersionRef.current
      try {
        const saved = await (window as any).electronAPI?.storageRead?.(PET_STORAGE_KEY)
        if (cancelled || userPlacementVersionRef.current !== restoreVersion) return

        const restored = restorePetPosition(
          saved,
          DEFAULT_POSITION,
          { width: window.innerWidth, height: window.innerHeight },
          PET_BASE_SIZE,
        )
        const pendingRestore = { position: restored, hasManualPosition: isStoredPosition(saved) }
        if (dragRef.current?.active) return
        if (dragRef.current) {
          pendingRestoreRef.current = pendingRestore
          return
        }
        applyRestoredPosition(pendingRestore.position, pendingRestore.hasManualPosition)
      } catch {
        // The browser preview and storage failures both keep the default position.
      }
    }

    void loadPosition()
    return () => { cancelled = true }
  }, [applyRestoredPosition])

  useEffect(() => () => {
    dragRef.current = null
    pendingRestoreRef.current = null
    ;(window as any).electronAPI?.ignoreMouse(true)
  }, [])

  useEffect(() => {
    const clampPositions = () => {
      setPos(clampToViewport)
      setTargetPos(clampToViewport)
    }

    clampPositions()
    window.addEventListener('resize', clampPositions)
    return () => window.removeEventListener('resize', clampPositions)
  }, [clampToViewport])

  // 平滑移动到目标位置
  useEffect(() => {
    if (state !== 'following' && state !== 'walking') return

    const timer = setInterval(() => {
      setPos(prev => {
        const boundedTarget = clampToViewport(targetPos)
        const dx = boundedTarget.x - prev.x
        const dy = boundedTarget.y - prev.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist <= 5) {
          clearInterval(timer)
          setState('idle')
          return boundedTarget
        }

        const speed = 3
        return clampToViewport({
          x: prev.x + (dx / dist) * speed,
          y: prev.y + (dy / dist) * speed,
        })
      })
    }, 16)
    return () => clearInterval(timer)
  }, [targetPos, state, clampToViewport])

  // 随机散步 AI
  useEffect(() => {
    if (isDragging || hasManualPosition || (state !== 'idle' && state !== 'walking')) return

    const walkInterval = setInterval(() => {
      if (Math.random() < 0.6) {
        const maxX = window.innerWidth - 120
        const maxY = window.innerHeight - 140
        setTargetPos({
          x: 40 + Math.random() * (maxX - 40),
          y: 40 + Math.random() * (maxY - 40),
        })
        setState('walking')
        setTimeout(() => setState('idle'), 2000)
      } else if (Math.random() < 0.3) {
        setState('sleeping')
        setTimeout(() => setState('idle'), 3000 + Math.random() * 2000)
      }
    }, 3000 + Math.random() * 2000)

    return () => clearInterval(walkInterval)
  }, [state, isDragging, hasManualPosition])

  // 点击宠物
  const handlePetClick = useCallback(() => {
    if (pet) {
      void (window as any).electronAPI?.gameDispatch?.({ type: 'pet', petId: pet.id })
    }
    setIsHovered(true)
    setMessage('😊 摸摸~')
    setState('interacting')
    setTimeout(() => {
      setState('idle')
      setMessage('')
    }, 1500)
  }, [pet])

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return

    dragRef.current = {
      start: { x: event.clientX, y: event.clientY },
      offset: { x: event.clientX - pos.x, y: event.clientY - pos.y },
      active: false,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    ;(window as any).electronAPI?.ignoreMouse(false)
  }, [pos])

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || !event.isPrimary) return

    if (!drag.active && !isDragGesture(drag.start, { x: event.clientX, y: event.clientY })) return

    if (!drag.active) {
      drag.active = true
      userPlacementVersionRef.current++
      pendingRestoreRef.current = null
      setIsDragging(true)
      setState('idle')
    }

    const nextPosition = getDraggedPosition({ x: event.clientX, y: event.clientY }, drag.offset)
    setPos(nextPosition)
    setTargetPos(nextPosition)
  }, [getDraggedPosition])

  const finishPointerDrag = useCallback((event: React.PointerEvent<HTMLDivElement>, petOnClick: boolean) => {
    const drag = dragRef.current
    if (!drag || !event.isPrimary) return

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    dragRef.current = null
    const isPointerOverPet = event.currentTarget.matches(':hover')
    isPointerOverPetRef.current = isPointerOverPet

    ;(window as any).electronAPI?.ignoreMouse(!isPointerOverPet)

    if (drag.active) {
      const finalPosition = getDraggedPosition({ x: event.clientX, y: event.clientY }, drag.offset)
      setPos(finalPosition)
      setTargetPos(finalPosition)
      setIsDragging(false)
      setHasManualPosition(true)
      suppressClickRef.current = true
      const writePosition = (window as any).electronAPI?.storageWrite
      if (writePosition) {
        void Promise.resolve(writePosition(PET_STORAGE_KEY, finalPosition)).catch(() => undefined)
      }
      return
    }

    const pendingRestore = pendingRestoreRef.current
    pendingRestoreRef.current = null
    if (petOnClick && pendingRestore) {
      applyRestoredPosition(pendingRestore.position, pendingRestore.hasManualPosition)
    }

    if (petOnClick) {
      suppressClickRef.current = true
      handlePetClick()
    }
  }, [applyRestoredPosition, getDraggedPosition, handlePetClick])

  const handlePointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    finishPointerDrag(event, true)
  }, [finishPointerDrag])

  const handlePointerCancel = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    finishPointerDrag(event, false)
  }, [finishPointerDrag])

  // 右键菜单
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if (dragRef.current?.active) return
    setMenuPos({ x: e.clientX, y: e.clientY })
    setShowMenu(true)
  }, [])

  // 关闭菜单
  const closeMenu = () => setShowMenu(false)

  // 菜单操作
  const menuAction = useCallback((action: string) => {
    closeMenu()
    if (pet) {
      const gameAction = action === 'feed'
        ? { type: 'feed', petId: pet.id, foodId: 'basic_feed' }
        : { type: action, petId: pet.id }
      void (window as any).electronAPI?.gameDispatch?.(gameAction)
    }
    const messages: Record<string, string> = {
      feed: '🍖 吃饱了！',
      pet: '😊 好开心！',
      wash: '🧼 洗干净了！',
      play: '🎾 玩得很高兴！',
    }
    setMessage(messages[action] || '👋')
    setState('interacting')
    setTimeout(() => {
      setState('idle')
      setMessage('')
    }, 2000)
  }, [pet])

  // 跟随鼠标 (在附近区域)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (state === 'following') {
        setTargetPos({
          x: Math.max(40, Math.min(window.innerWidth - 120, e.clientX - 60)),
          y: Math.max(40, Math.min(window.innerHeight - 140, e.clientY - 70)),
        })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [state])

  // 点击空白处关闭菜单
  useEffect(() => {
    const handleClick = () => {
      if (showMenu) closeMenu()
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [showMenu])

  // 空闲动画帧 (呼吸效果)
  useEffect(() => {
    const breathe = () => {
      frameRef.current++
      prevTime.current = Date.now()
      animRef.current = requestAnimationFrame(breathe)
    }
    animRef.current = requestAnimationFrame(breathe)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  if (!pet) return null

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        cursor: 'default',
      }}
      onContextMenu={handleContextMenu}
      onClick={closeMenu}
    >
      {/* 宠物主体 */}
      <div
        className="pet-character"
        onMouseEnter={() => {
          isPointerOverPetRef.current = true
          setIsHovered(true);
          (window as any).electronAPI?.ignoreMouse(false)
        }}
        onMouseLeave={() => {
          isPointerOverPetRef.current = false
          setIsHovered(false);
          if (!dragRef.current?.active) {
            (window as any).electronAPI?.ignoreMouse(true)
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (suppressClickRef.current) {
            suppressClickRef.current = false
            return
          }
          handlePetClick()
        }}
        onContextMenu={(e) => { e.stopPropagation(); handleContextMenu(e) }}
        style={{
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          width: petSize,
          height: petSize,
          transform: `scale(${state === 'walking' ? 1.05 : scale}) scaleX(${state === 'following' && targetPos.x < pos.x ? -1 : 1})`,
          transition: 'transform 0.3s ease',
          cursor: isDragging ? 'grabbing' : 'pointer',
          zIndex: 10,
        }}
      >
        <ImprovedPetSVG
          speciesId={pet.speciesId}
          stage={pet.stage}
          rarity={pet.rarity}
          state={state}
        />

        {/* 交互气泡 */}
        {message && (
          <div
            style={{
              position: 'absolute',
              top: -30,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: 8,
              fontSize: 13,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              animation: 'fadeInUp 0.3s ease-out',
            }}
          >
            {message}
          </div>
        )}
      </div>

      {/* HUD 信息 - 鼠标移上时显示 */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            left: pos.x - 10,
            top: pos.y + petSize + 8,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: 8,
            fontSize: 11,
            lineHeight: 1.4,
            pointerEvents: 'none',
            zIndex: 20,
            border: `1px solid ${rarityColor}44`,
          }}
        >
          <div style={{ fontWeight: 700, color: rarityColor }}>{pet.nickname}</div>
          <div style={{ color: '#aaa' }}>{ELEMENT_LABELS[pet.element]} · Lv.{pet.level}</div>
          <div style={{ color: '#aaa' }}>❤️ {pet.affection} 😊 {pet.mood} 🧼 {pet.cleanliness}</div>
        </div>
      )}

      {/* 右键菜单 */}
      {showMenu && (
        <div
          style={{
            position: 'absolute',
            left: menuPos.x,
            top: menuPos.y,
            background: 'rgba(20,20,35,0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            padding: '4px 0',
            minWidth: 140,
            zIndex: 100,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          <MenuItem icon="🍖" label="喂食" onClick={() => menuAction('feed')} />
          <MenuItem icon="👋" label="抚摸" onClick={() => menuAction('pet')} />
          <MenuItem icon="🧼" label="洗澡" onClick={() => menuAction('wash')} />
          <MenuItem icon="🎾" label="玩耍" onClick={() => menuAction('play')} />
          <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '4px 8px' }} />
          <MenuItem icon="👥" label="宠物管理" onClick={() => void (window as any).electronAPI?.openManagement?.()} />
          <MenuItem icon="🚪" label="退出" onClick={() => window.close()} />
        </div>
      )}
    </div>
  )
}

function isStoredPosition(value: unknown): value is Point {
  if (value === null || typeof value !== 'object' || !('x' in value) || !('y' in value)) {
    return false
  }

  const { x, y } = value
  return typeof x === 'number' && typeof y === 'number' && Number.isFinite(x) && Number.isFinite(y)
}

function MenuItem({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick() }}
      style={{
        padding: '6px 16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        color: '#ccc',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(124,92,252,0.3)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  )
}

// ====== 改进版宠物 SVG ======

function ImprovedPetSVG({ speciesId, stage, rarity, state }: {
  speciesId: string
  stage: EvolutionStage
  rarity: Rarity
  state: PetState
}) {
  const species = getSpecies(speciesId)
  if (!species) return <div>❓</div>

  const color = species.color
  const accent = RARITY_COLORS[rarity]
  const stageIndex = ['baby', 'adult', 'perfect', 'ultimate', 'superUltimate'].indexOf(stage)
  const isSleeping = state === 'sleeping'
  const bobY = isSleeping ? 0 : Math.sin(Date.now() / 400) * 1.5
  const eyeY = isSleeping ? 4 : 0

  // 元素主题背景辉光
  const glowColor = state === 'interacting' ? accent : color

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100">
      <defs>
        <radialGradient id={`glow-${speciesId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glowColor} stopOpacity={0.3}>
            <animate attributeName="stopOpacity" values="0.3;0.5;0.3" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`body-${speciesId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity={0.9} />
          <stop offset="100%" stopColor={darkenColor(color, 30)} stopOpacity={0.9} />
        </linearGradient>
      </defs>

      {/* 光晕 */}
      <circle cx="50" cy="50" r="48" fill={`url(#glow-${speciesId})`} />

      <g transform={`translate(0, ${bobY})`}>
        {renderPetBody(species.element, stageIndex, color, accent, isSleeping, eyeY)}
      </g>

      {/* 品质星级 */}
      {[...Array(stageIndex + 1)].map((_, i) => (
        <text
          key={i}
          x={30 + i * 10}
          y={90}
          fontSize="6"
          fill={accent}
          opacity={0.8}
        >
          ★
        </text>
      ))}
    </svg>
  )
}

function renderPetBody(
  element: string,
  stageIndex: number,
  color: string,
  accent: string,
  isSleeping: boolean,
  eyeOffset: number,
) {
  const s = 1 + stageIndex * 0.12

  switch (element) {
    case 'fire': return renderFirePet(s, color, accent, isSleeping, eyeOffset)
    case 'wind': return renderWindPet(s, color, accent, isSleeping, eyeOffset)
    case 'earth': return renderEarthPet(s, color, accent, isSleeping, eyeOffset)
    case 'water': return renderWaterPet(s, color, accent, isSleeping, eyeOffset)
    case 'light': return renderLightPet(s, color, accent, isSleeping, eyeOffset)
    default: return <circle cx="50" cy="50" r="20" fill="#888" />
  }
}

function renderEyes(cx: number, cy: number, isSleeping: boolean, eyeOffset: number = 0) {
  if (isSleeping) {
    return (
      <g>
        <path d={`M${cx - 8} ${cy + eyeOffset} Q${cx - 4} ${cy + 5} ${cx} ${cy + eyeOffset}`}
          stroke="#333" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d={`M${cx + 8} ${cy + eyeOffset} Q${cx + 12} ${cy + 5} ${cx + 16} ${cy + eyeOffset}`}
          stroke="#333" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </g>
    )
  }
  return (
    <g>
      <ellipse cx={cx - 6} cy={cy + 2} rx="4.5" ry="5" fill="white" />
      <ellipse cx={cx + 6} cy={cy + 2} rx="4.5" ry="5" fill="white" />
      <circle cx={cx - 5} cy={cy + 3} r="2.5" fill="#222" />
      <circle cx={cx + 7} cy={cy + 3} r="2.5" fill="#222" />
      <circle cx={cx - 4} cy={cy + 1.5} r="1" fill="white" />
      <circle cx={cx + 8} cy={cy + 1.5} r="1" fill="white" />
    </g>
  )
}

function renderFirePet(s: number, color: string, accent: string, isSleeping: boolean, eyeY: number) {
  return (
    <g transform={`scale(${s}) translate(${-50 * (s - 1) / s}, ${-50 * (s - 1) / s})`}>
      {/* 身体 */}
      <ellipse cx="50" cy="58" rx="22" ry="16" fill={`url(#body-${color})`} />
      {/* 头 */}
      <circle cx="50" cy="38" r="16" fill={color} />
      {/* 火焰头冠 */}
      {[0, 1, 2, 3, 4].map(i => (
        <path key={i}
          d={`M${38 + i * 6} 25 Q${40 + i * 6} ${10 + Math.sin(i) * 5} ${42 + i * 6} 22`}
          fill={accent} opacity={0.7 + Math.sin(Date.now() / 300 + i) * 0.15}
        >
          <animate attributeName="d"
            values={`M${38 + i * 6} 25 Q${40 + i * 6} ${10 + Math.sin(i) * 5} ${42 + i * 6} 22;M${38 + i * 6} 25 Q${40 + i * 6} ${8 + Math.sin(i + 1) * 5} ${42 + i * 6} 22;M${38 + i * 6} 25 Q${40 + i * 6} ${10 + Math.sin(i) * 5} ${42 + i * 6} 22`}
            dur="0.8s" repeatCount="indefinite" />
        </path>
      ))}
      {/* 眼睛 */}
      {renderEyes(50, 35, isSleeping, eyeY)}
      {/* 嘴巴 */}
      <path d="M46 42 Q50 45 54 42" stroke="#333" strokeWidth="1" fill="none" />
      {/* 尾巴火焰 */}
      <path d="M28 55 Q18 50 15 40" stroke={accent} strokeWidth="2.5" fill="none" opacity="0.7">
        <animate attributeName="d"
          values="M28 55 Q18 50 15 40;M28 55 Q16 48 12 38;M28 55 Q18 50 15 40"
          dur="0.6s" repeatCount="indefinite" />
      </path>
      {/* 小爪 */}
      <ellipse cx="38" cy="72" rx="5" ry="3" fill={darkenColor(color, 20)} />
      <ellipse cx="62" cy="72" rx="5" ry="3" fill={darkenColor(color, 20)} />
    </g>
  )
}

function renderWindPet(s: number, color: string, accent: string, isSleeping: boolean, eyeY: number) {
  return (
    <g transform={`scale(${s}) translate(${-50 * (s - 1) / s}, ${-50 * (s - 1) / s})`}>
      <ellipse cx="50" cy="56" rx="18" ry="14" fill={color} />
      <circle cx="50" cy="38" r="14" fill={color} />
      {/* 翅膀 */}
      {[0, 1, 2].map(i => (
        <path key={i}
          d={`M36 45 Q${20 - i * 5} ${30 - i * 5} ${30 - i * 3} 20`}
          stroke={accent} strokeWidth="2" fill={accent + '33'}
        >
          <animate attributeName="d"
            values={`M36 45 Q${20 - i * 5} ${30 - i * 5} ${30 - i * 3} 20;M36 45 Q${18 - i * 5} ${28 - i * 5} ${28 - i * 3} 18;M36 45 Q${20 - i * 5} ${30 - i * 5} ${30 - i * 3} 20`}
            dur="0.4s" repeatCount="indefinite" />
        </path>
      ))}
      {renderEyes(50, 36, isSleeping, eyeY)}
      <path d="M46 43 Q50 46 54 43" stroke="#333" strokeWidth="1" fill="none" />
      {/* 尾羽 */}
      <path d="M32 54 Q20 58 18 52" stroke={color} strokeWidth="2" fill="none" />
    </g>
  )
}

function renderEarthPet(s: number, color: string, accent: string, isSleeping: boolean, eyeY: number) {
  return (
    <g transform={`scale(${s}) translate(${-50 * (s - 1) / s}, ${-50 * (s - 1) / s})`}>
      <rect x="32" y="50" rx="8" width="36" height="20" fill={`url(#body-${color})`} />
      <rect x="35" y="34" rx="8" width="30" height="18" fill={color} />
      {/* 头角 */}
      <rect x="42" y="26" width="6" height="8" rx="2" fill={accent} />
      <rect x="52" y="26" width="6" height="8" rx="2" fill={accent} />
      {renderEyes(50, 42, isSleeping, eyeY)}
      <path d="M46 48 Q50 51 54 48" stroke="#333" strokeWidth="1" fill="none" />
      {/* 铠甲纹理 */}
      {[0, 1, 2].map(i => (
        <rect key={i} x={36 + i * 10} y="62" width="5" height="4" rx="1" fill={accent} opacity="0.5" />
      ))}
    </g>
  )
}

function renderWaterPet(s: number, color: string, accent: string, isSleeping: boolean, eyeY: number) {
  return (
    <g transform={`scale(${s}) translate(${-50 * (s - 1) / s}, ${-50 * (s - 1) / s})`}>
      <ellipse cx="50" cy="56" rx="20" ry="14" fill={color} opacity={0.85} />
      <ellipse cx="50" cy="40" rx="14" ry="12" fill={color} />
      {renderEyes(50, 38, isSleeping, eyeY)}
      <path d="M46 44 Q50 47 54 44" stroke="#333" strokeWidth="0.8" fill="none" />
      {/* 鱼鳍 */}
      <path d="M50 28 Q45 20 50 22 Q55 20 50 28" fill={accent} opacity="0.6">
        <animate attributeName="d"
          values="M50 28 Q45 20 50 22 Q55 20 50 28;M50 28 Q43 18 50 20 Q57 18 50 28;M50 28 Q45 20 50 22 Q55 20 50 28"
          dur="0.7s" repeatCount="indefinite" />
      </path>
      {/* 泡泡 */}
      <circle cx="65" cy="35" r="2.5" fill="none" stroke="white" opacity="0.4">
        <animate attributeName="cy" values="35;25;15" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0;0" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* 尾巴 */}
      <path d="M30 52 Q18 48 22 56" fill={darkenColor(color, 20)} />
    </g>
  )
}

function renderLightPet(s: number, color: string, accent: string, isSleeping: boolean, eyeY: number) {
  return (
    <g transform={`scale(${s}) translate(${-50 * (s - 1) / s}, ${-50 * (s - 1) / s})`}>
      <circle cx="50" cy="46" r="16" fill={color} />
      {/* 光之翼 */}
      {[0, 1, 2, 3].map(i => (
        <path key={i}
          d={`M50 40 Q${65 + i * 10} ${20 - i * 5} ${55 + i * 8} 45`}
          fill={accent + '55'} stroke={accent} strokeWidth="0.5"
        >
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
        </path>
      ))}
      {/* 光环 */}
      <circle cx="50" cy="46" r="22" fill="none" stroke={accent} strokeWidth="1" opacity="0.4">
        <animate attributeName="r" values="22;26;22" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.6;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
      {renderEyes(50, 43, isSleeping, eyeY)}
      <path d="M46 49 Q50 52 54 49" stroke="#333" strokeWidth="0.8" fill="none" />
    </g>
  )
}

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, (num >> 16) - amount)
  const g = Math.max(0, ((num >> 8) & 0xff) - amount)
  const b = Math.max(0, (num & 0xff) - amount)
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
}
