import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { STAGE_LABELS, RARITY_LABELS, RARITY_COLORS } from '../core/types'
import { CONSUMABLE_ITEMS } from '../core/data/items'
import PetDisplay from '../components/pet/PetDisplay'

export default function TeamPage() {
  const pets = useGameStore(s => s.pets)
  const storage = useGameStore(s => s.storage)
  const team = useGameStore(s => s.team)
  const inventory = useGameStore(s => s.inventory)
  const moveToTeam = useGameStore(s => s.moveToTeam)
  const moveToStorage = useGameStore(s => s.moveToStorage)
  const sellPet = useGameStore(s => s.sellPet)
  const tryEvolve = useGameStore(s => s.tryEvolve)
  const useConsumable = useGameStore(s => s.useConsumable)
  const [tab, setTab] = useState<'team' | 'storage'>('team')
  const [selectedPet, setSelectedPet] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const teamPets = pets.filter(p => team.includes(p.id))
  const storagePets = [...pets.filter(p => !team.includes(p.id)), ...storage]
  const currentList = tab === 'team' ? teamPets : storagePets
  const selected = pets.find(p => p.id === selectedPet) || storage.find(p => p.id === selectedPet)

  const handleSell = (id: string) => {
    const price = sellPet(id)
    setMessage(`💰 出售成功！获得 ${price} 金币`)
    setSelectedPet(null)
    setTimeout(() => setMessage(''), 2000)
  }

  const handleEvolve = (id: string) => {
    const result = tryEvolve(id)
    setMessage(result.message)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleUseCandy = (petId: string, candyId: string) => {
    const ok = useConsumable(petId, candyId)
    const candy = CONSUMABLE_ITEMS[candyId]
    if (ok) {
      setMessage(`🍬 使用了 ${candy.name}！`)
    } else {
      setMessage('❌ 使用失败！（等级已满或道具不足）')
    }
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 className="section-title">👥 宠物管理</h2>

      {message && (
        <div style={{
          background: 'var(--accent)', color: 'white', padding: '8px 16px',
          borderRadius: 8, textAlign: 'center', fontSize: '0.9rem',
        }}>
          {message}
        </div>
      )}

      <div className="tabs">
        <button className={`tab ${tab === 'team' ? 'active' : ''}`} onClick={() => setTab('team')}>
          👥 小队 ({teamPets.length}/6)
        </button>
        <button className={`tab ${tab === 'storage' ? 'active' : ''}`} onClick={() => setTab('storage')}>
          📦 仓库 ({storagePets.length})
        </button>
      </div>

      {/* 宠物详情 */}
      {selected && (
        <div className="card card-glow" style={{ textAlign: 'center' }}>
          <PetDisplay speciesId={selected.speciesId} stage={selected.stage} rarity={selected.rarity} size={100} />
          <h3 style={{ margin: '8px 0 4px' }}>{selected.nickname}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {RARITY_LABELS[selected.rarity]}品 · {STAGE_LABELS[selected.stage]} · Lv.{selected.level}
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8, flexWrap: 'wrap' }}>
            {tab === 'storage' && (
              <button className="btn btn-primary btn-sm" onClick={() => {
                moveToTeam(selected.id)
                setSelectedPet(null)
              }}>➡️ 编入队伍</button>
            )}
            {tab === 'team' && (
              <button className="btn btn-ghost btn-sm" onClick={() => {
                moveToStorage(selected.id)
                setSelectedPet(null)
              }}>📦 存入仓库</button>
            )}
            <button className="btn btn-success btn-sm" onClick={() => handleEvolve(selected.id)}>
              ⬆️ 进化
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => handleSell(selected.id)}>
              💰 出售
            </button>
            {/* 糖果使用 */}
            {inventory.consumables.filter(c => c.quantity > 0).length > 0 && (
              <div style={{ width: '100%', marginTop: 8, display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                {inventory.consumables.filter(c => c.quantity > 0).map(c => {
                  const info = CONSUMABLE_ITEMS[c.id]
                  if (!info) return null
                  return (
                    <button
                      key={c.id}
                      className="btn btn-gold btn-sm"
                      onClick={() => handleUseCandy(selected.id, c.id)}
                    >
                      🍬 {info.name} ×{c.quantity}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, fontSize: '0.8rem' }}>
            <div>HP: {selected.stats.hp}</div>
            <div>攻击: {selected.stats.attack}</div>
            <div>防御: {selected.stats.defense}</div>
            <div>特攻: {selected.stats.spAttack}</div>
            <div>特防: {selected.stats.spDefense}</div>
            <div>速度: {selected.stats.speed}</div>
          </div>
          <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            ❤️ 亲密度 {selected.affection} · 🧼 {selected.cleanliness} · 😊 {selected.mood} · 📈 {selected.growth}%
          </div>
        </div>
      )}

      {/* 宠物列表 */}
      {currentList.length === 0 ? (
        <div className="empty-state">
          <p style={{ fontSize: '3rem', marginBottom: 12 }}>{tab === 'team' ? '👥' : '📦'}</p>
          <p>{tab === 'team' ? '队伍是空的，去仓库添加宠物吧' : '仓库是空的，去抽蛋吧！'}</p>
        </div>
      ) : (
        <div className="pet-grid">
          {currentList.map(p => (
            <div
              key={p.id}
              className={`card pet-card rarity-${p.rarity} ${selectedPet === p.id ? 'card-glow' : ''}`}
              onClick={() => setSelectedPet(selectedPet === p.id ? null : p.id)}
            >
              <span className="rarity-badge" style={{ background: RARITY_COLORS[p.rarity] }}>
                {RARITY_LABELS[p.rarity]}
              </span>
              <PetDisplay speciesId={p.speciesId} stage={p.stage} rarity={p.rarity} size={64} />
              <div className="pet-name">{p.nickname}</div>
              <div className="pet-stage">{STAGE_LABELS[p.stage]}</div>
              <div className="pet-level">Lv.{p.level}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
