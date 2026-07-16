import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import PetDisplay from '../components/pet/PetDisplay'
import { STAGE_LABELS, RARITY_LABELS, RARITY_COLORS } from '../core/types'

export default function HomePage() {
  const pets = useGameStore(s => s.pets)
  const team = useGameStore(s => s.team)
  const teamPets = pets.filter(p => team.includes(p.id))
  const [selectedPet, setSelectedPet] = useState<string | null>(null)
  const feedPet = useGameStore(s => s.feedPet)
  const petPet = useGameStore(s => s.petPet)
  const washPet = useGameStore(s => s.washPet)
  const playWithPet = useGameStore(s => s.playWithPet)

  const pet = selectedPet ? pets.find(p => p.id === selectedPet) : teamPets[0] || null

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 className="section-title">🏡 我的数码世界</h2>

      {teamPets.length === 0 ? (
        <div className="empty-state">
          <p style={{ fontSize: '3rem', marginBottom: 12 }}>🐣</p>
          <p>还没有宠物！先去抽蛋吧 🥚</p>
        </div>
      ) : (
        <>
          {/* 当前展示的宠物 */}
          {pet && (
            <div className="card card-glow" style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <PetDisplay
                  speciesId={pet.speciesId}
                  stage={pet.stage}
                  rarity={pet.rarity}
                  size={160}
                />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginTop: 8 }}>
                {pet.nickname || '未命名'}
                <span style={{
                  fontSize: '0.75rem', marginLeft: 8, padding: '2px 8px',
                  borderRadius: 4, background: RARITY_COLORS[pet.rarity] + '33',
                  color: RARITY_COLORS[pet.rarity],
                }}>
                  {RARITY_LABELS[pet.rarity]}品 · {STAGE_LABELS[pet.stage]}
                </span>
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Lv.{pet.level} | ❤️ {pet.affection} | 🧼 {pet.cleanliness} | 😊 {pet.mood}
              </p>

              {/* 互动按钮 */}
              <div className="interact-panel">
                <button className="btn btn-primary btn-sm" onClick={() => feedPet(pet.id, 'basic_feed')}>
                  🍖 喂食
                </button>
                <button className="btn btn-success btn-sm" onClick={() => petPet(pet.id)}>
                  👋 抚摸
                </button>
                <button className="btn btn-sm" style={{ background: '#3b82f6' }} onClick={() => washPet(pet.id)}>
                  🧼 洗澡
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => playWithPet(pet.id)}>
                  🎾 玩耍
                </button>
              </div>

              {/* 成长值进度 */}
              <div style={{ marginTop: 12 }}>
                <div className="stat-row">
                  <span className="label">📈 成长值</span>
                  <span>{pet.growth}%</span>
                </div>
                <div className="stat-bar-bg">
                  <div className="stat-bar-fill" style={{ width: `${pet.growth}%`, background: 'var(--accent)' }} />
                </div>
              </div>

              {/* 属性展示 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12, fontSize: '0.8rem' }}>
                <div>HP: {pet.stats.hp}</div>
                <div>攻击: {pet.stats.attack}</div>
                <div>防御: {pet.stats.defense}</div>
                <div>特攻: {pet.stats.spAttack}</div>
                <div>特防: {pet.stats.spDefense}</div>
                <div>速度: {pet.stats.speed}</div>
              </div>
            </div>
          )}

          {/* 队伍列表 */}
          <h3 className="section-title">👥 小队成员 ({teamPets.length}/6)</h3>
          <div className="pet-grid">
            {teamPets.map(p => (
              <div
                key={p.id}
                className={`card pet-card rarity-${p.rarity} ${pet?.id === p.id ? 'card-glow' : ''}`}
                onClick={() => setSelectedPet(p.id)}
              >
                <span className="rarity-badge" style={{ background: RARITY_COLORS[p.rarity] }}>
                  {RARITY_LABELS[p.rarity]}
                </span>
                <PetDisplay speciesId={p.speciesId} stage={p.stage} rarity={p.rarity} size={64} />
                <div className="pet-name">{p.nickname || '未知'}</div>
                <div className="pet-stage">{STAGE_LABELS[p.stage]}</div>
                <div className="pet-level">Lv.{p.level}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
