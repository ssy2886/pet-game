import { useGameStore } from '../store/gameStore'
import { ALL_SPECIES } from '../core/data/species'
import { ELEMENT_LABELS, STAGE_LABELS } from '../core/types'
import PetDisplay from '../components/pet/PetDisplay'
import { useState } from 'react'
import { getRosterCategory } from '../core/roster'

export default function PokedexPage() {
  const pokedex = useGameStore(s => s.pokedex)
  const [filter, setFilter] = useState<'all' | 'dragon' | 'spirit' | 'beast' | 'owned' | 'unknown'>('all')

  const entries = ALL_SPECIES.map(species => {
    const entry = pokedex[species.id]
    return {
      species,
      status: entry?.owned ? 'owned' as const : entry?.seen ? 'seen' as const : 'unknown' as const,
    }
  })

  const filtered = entries.filter(e => {
    if (filter === 'dragon' || filter === 'spirit' || filter === 'beast') return getRosterCategory(e.species.id) === filter
    if (filter === 'owned') return e.status === 'owned'
    if (filter === 'unknown') return e.status === 'unknown'
    return true
  })

  const ownedCount = entries.filter(e => e.status === 'owned').length
  const seenCount = entries.filter(e => e.status === 'seen' || e.status === 'owned').length

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 className="section-title">📖 数码图鉴</h2>

      {/* 进度 */}
      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        已捕获 {ownedCount} / {ALL_SPECIES.length} | 已遇见 {seenCount} / {ALL_SPECIES.length}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {(['all', 'dragon', 'spirit', 'beast', 'owned', 'unknown'] as const).map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? '全部' : f === 'dragon' ? '龙类' : f === 'spirit' ? '灵体' : f === 'beast' ? '兽类' : f === 'owned' ? '已拥有' : '未发现'}
          </button>
        ))}
      </div>

      <div className="pokedex-grid">
        {filtered.map(({ species, status }) => (
          <div key={species.id} className={`pokedex-entry ${status}`}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
              {status !== 'unknown' ? (
                <PetDisplay speciesId={species.id} stage="baby" rarity={status === 'owned' ? 'gold' : 'blue'} size={48} />
              ) : (
                <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                  ❓
                </div>
              )}
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
              {status !== 'unknown' ? species.name : '???'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {status !== 'unknown' ? ELEMENT_LABELS[species.element] : '???'}
            </div>
            {status === 'owned' && pokedex[species.id]?.highestStage && (
              <div style={{ fontSize: '0.7rem', color: 'var(--success)' }}>
                {STAGE_LABELS[pokedex[species.id].highestStage]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
