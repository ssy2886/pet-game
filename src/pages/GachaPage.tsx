import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { RARITY_LABELS, RARITY_COLORS } from '../core/types'

export default function GachaPage() {
  const pullEgg = useGameStore(s => s.pullEgg)
  const eggs = useGameStore(s => s.eggs)
  const pityCount = useGameStore(s => s.pityCount)
  const [isShaking, setIsShaking] = useState(false)
  const [lastEgg, setLastEgg] = useState<{ rarity: string; speciesId: string } | null>(null)

  const handlePull = () => {
    setIsShaking(true)
    setLastEgg(null)

    setTimeout(() => {
      const egg = pullEgg()
      if (egg) {
        setLastEgg({ rarity: egg.rarity, speciesId: egg.speciesId || '' })
      }
      setIsShaking(false)
    }, 1500)
  }

  const handleMultiPull = () => {
    setIsShaking(true)
    setLastEgg(null)

    setTimeout(() => {
      let last: any = null
      for (let i = 0; i < 10; i++) {
        const egg = pullEgg()
        if (egg) last = { rarity: egg.rarity, speciesId: egg.speciesId || '' }
      }
      setLastEgg(last)
      setIsShaking(false)
    }, 2500)
  }

  const pityProgress = (pityCount / 100) * 100

  return (
    <div className="fade-in gacha-container">
      <h2 className="section-title">🥚 扭蛋机</h2>

      {/* 保底进度 */}
      <div className="pity-bar">
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
          <span>保底进度</span>
          <span style={{ color: 'var(--gold)' }}>{100 - pityCount} 抽保底</span>
        </div>
        <div className="track">
          <div className="fill" style={{ width: `${pityProgress}%` }} />
        </div>
      </div>

      {/* 蛋 */}
      <div className={`gacha-egg ${isShaking ? 'shaking' : ''}`} onClick={!isShaking ? handlePull : undefined}>
        <div style={{
          width: 120, height: 150,
          background: 'linear-gradient(135deg, #f5f5f5, #ddd)',
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '3rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3), inset 0 -4px 8px rgba(0,0,0,0.1)',
          border: '3px solid #ccc',
          position: 'relative',
          overflow: 'hidden',
        }}>
          🥚
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '50% 50% 0 0 / 60% 60% 0 0',
          }} />
        </div>
        <p style={{ textAlign: 'center', marginTop: 8, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          点击抽取
        </p>
      </div>

      {/* 抽蛋按钮 */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-gold" onClick={handlePull} disabled={isShaking}>
          🎲 单抽
        </button>
        <button className="btn btn-primary" onClick={handleMultiPull} disabled={isShaking}>
          🎲🎲 十连抽
        </button>
      </div>

      {/* 抽蛋结果 */}
      {lastEgg && !isShaking && (
        <div className="gacha-result" style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: 12 }}>✨ 获得了新蛋！</h3>
          <div style={{
            display: 'inline-block',
            border: `2px solid ${RARITY_COLORS[lastEgg.rarity as keyof typeof RARITY_COLORS]}`,
            borderRadius: 16, padding: 16,
            background: RARITY_COLORS[lastEgg.rarity as keyof typeof RARITY_COLORS] + '22',
          }}>
            <span style={{
              fontSize: '2.5rem',
              color: RARITY_COLORS[lastEgg.rarity as keyof typeof RARITY_COLORS],
              fontWeight: 700,
            }}>
              {RARITY_LABELS[lastEgg.rarity as keyof typeof RARITY_COLORS]}品级蛋
            </span>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 8 }}>
              前往孵化页查看并孵化！
            </div>
          </div>

          {/* 历史蛋列表 */}
          <h3 style={{ marginTop: 24, marginBottom: 12 }}>📋 未孵化蛋 ({eggs.length})</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {eggs.slice(-10).reverse().map(egg => (
              <div key={egg.id} style={{
                padding: '8px 16px',
                border: `1px solid ${RARITY_COLORS[egg.rarity]}`,
                borderRadius: 8,
                background: RARITY_COLORS[egg.rarity] + '11',
                fontSize: '0.85rem',
              }}>
                {RARITY_LABELS[egg.rarity]}品蛋
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
