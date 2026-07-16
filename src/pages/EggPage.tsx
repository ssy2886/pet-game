import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { RARITY_LABELS, RARITY_COLORS } from '../core/types'
import type { Pet } from '../core/types'
import PetDisplay from '../components/pet/PetDisplay'

export default function EggPage() {
  const eggs = useGameStore(s => s.eggs)
  const hatchEgg = useGameStore(s => s.hatchEgg)
  const [hatching, setHatching] = useState<string | null>(null)
  const [hatchedPet, setHatchedPet] = useState<Pet | null>(null)

  const handleHatch = (eggId: string) => {
    setHatching(eggId)
    setHatchedPet(null)

    // 模拟孵化动画
    setTimeout(() => {
      const pet = hatchEgg(eggId)
      if (pet) {
        setHatchedPet(pet)
      }
      setHatching(null)
    }, 2000)
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 className="section-title">🥚 孵化室</h2>

      {eggs.length === 0 && !hatchedPet && (
        <div className="empty-state">
          <p style={{ fontSize: '3rem', marginBottom: 12 }}>🥚</p>
          <p>还没有蛋，去扭蛋机抽一些吧！</p>
        </div>
      )}

      {/* 孵化结果展示 */}
      {hatchedPet && (
        <div className="card card-glow" style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: 12, fontSize: '1.4rem' }}>🎉 孵化成功！</h3>
          <PetDisplay speciesId={hatchedPet.speciesId} stage={hatchedPet.stage} rarity={hatchedPet.rarity} size={120} />
          <p style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 8 }}>
            {hatchedPet.nickname} 出生了！
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {RARITY_LABELS[hatchedPet.rarity]}品 · Lv.{hatchedPet.level}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, marginTop: 8, fontSize: '0.8rem', maxWidth: 300, margin: '8px auto 0' }}>
            <div>HP: {hatchedPet.stats.hp}</div>
            <div>攻击: {hatchedPet.stats.attack}</div>
            <div>防御: {hatchedPet.stats.defense}</div>
            <div>特攻: {hatchedPet.stats.spAttack}</div>
            <div>特防: {hatchedPet.stats.spDefense}</div>
            <div>速度: {hatchedPet.stats.speed}</div>
          </div>
        </div>
      )}

      {/* 蛋列表 */}
      <div className="pet-grid">
        {eggs.map(egg => (
          <div key={egg.id} className={`card pet-card rarity-${egg.rarity}`}>
            <span className="rarity-badge" style={{ background: RARITY_COLORS[egg.rarity] }}>
              {RARITY_LABELS[egg.rarity]}
            </span>
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: '4rem' }}>🥚</div>
            </div>
            <div className="pet-name">{RARITY_LABELS[egg.rarity]}品蛋</div>
            <div className="pet-stage" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>
              获得时间: {new Date(egg.obtainedAt).toLocaleDateString()}
            </div>
            <button
              className={`btn ${hatching === egg.id ? 'btn-ghost' : 'btn-gold'} btn-sm`}
              style={{ width: '100%' }}
              onClick={() => handleHatch(egg.id)}
              disabled={hatching === egg.id}
            >
              {hatching === egg.id ? '⏳ 孵化中...' : '🐣 孵化'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
