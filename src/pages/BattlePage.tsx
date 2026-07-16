import { useGameStore } from '../store/gameStore'
import { getSkill } from '../core/data/skills'
import PetDisplay from '../components/pet/PetDisplay'

export default function BattlePage() {
  const battle = useGameStore(s => s.battle)
  const startBattle = useGameStore(s => s.startBattle)
  const playerAction = useGameStore(s => s.playerAction)
  const endBattle = useGameStore(s => s.endBattle)
  const team = useGameStore(s => s.team)
  const pets = useGameStore(s => s.pets)
  const teamPets = pets.filter(p => team.includes(p.id))
  const battleLogRef = (el: HTMLDivElement | null) => {
    if (el) el.scrollTop = el.scrollHeight
  }

  // 未进入战斗 - 显示开始界面
  if (!battle) {
    return (
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', paddingTop: 48 }}>
        <h2 className="section-title">⚔️ 战斗</h2>

        {teamPets.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: '3rem', marginBottom: 12 }}>⚔️</p>
            <p>队伍里没有宠物，先去招募一些吧！</p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                派出首发宠物
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
                {teamPets.slice(0, 1).map(p => (
                  <div key={p.id} className="rarity-green" style={{
                    border: '1px solid', borderRadius: 8, padding: 8, background: 'var(--bg-card)',
                    display: 'inline-block',
                  }}>
                    <PetDisplay speciesId={p.speciesId} stage={p.stage} rarity={p.rarity} size={64} />
                    <div style={{ fontSize: '0.8rem', textAlign: 'center' }}>Lv.{p.level} {p.nickname}</div>
                  </div>
                ))}
              </div>
            </div>
            <button className="btn btn-danger" onClick={startBattle}>
              ⚔️ 遇到野生宠物！
            </button>
          </>
        )}
      </div>
    )
  }

  const player = battle.playerPets[0]
  const enemy = battle.enemyPet
  const isOver = battle.phase === 'won' || battle.phase === 'lost'

  // 战斗进行中
  return (
    <div className="battle-scene fade-in">
      <h2 className="section-title">⚔️ 战斗</h2>

      <div className="battle-field">
        {/* 玩家 */}
        <div className="battle-pet-box player">
          <PetDisplay speciesId={player.pet.speciesId} stage={player.pet.stage} rarity={player.pet.rarity} size={80} />
          <div style={{ fontWeight: 600 }}>{player.pet.nickname}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lv.{player.pet.level}</div>
          <div className="hp-bar">
            <div className="fill" style={{ width: `${(player.currentHp / player.pet.stats.hp) * 100}%` }} />
          </div>
          <div style={{ fontSize: '0.8rem' }}>{player.currentHp}/{player.pet.stats.hp}</div>
        </div>

        {/* 敌人 */}
        <div className="battle-pet-box enemy">
          <PetDisplay speciesId={enemy.pet.speciesId} stage={enemy.pet.stage} rarity={enemy.pet.rarity} size={80} />
          <div style={{ fontWeight: 600 }}>{enemy.pet.nickname}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lv.{enemy.pet.level}</div>
          <div className="hp-bar">
            <div className="fill" style={{ width: `${(enemy.currentHp / enemy.pet.stats.hp) * 100}%` }} />
          </div>
          <div style={{ fontSize: '0.8rem' }}>{enemy.currentHp}/{enemy.pet.stats.hp}</div>
        </div>
      </div>

      {/* 战斗日志 */}
      <div className="battle-log" ref={battleLogRef}>
        {battle.log.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        {isOver && (
          <div style={{
            textAlign: 'center', fontWeight: 700, fontSize: '1.1rem', marginTop: 8,
            color: battle.phase === 'won' ? 'var(--success)' : 'var(--danger)',
          }}>
            {battle.phase === 'won' ? '🎉 胜利！' : '💀 战败...'}
          </div>
        )}
      </div>

      {/* 操作栏 */}
      {battle.phase === 'playerAction' && (
        <div className="skill-bar">
          {player.pet.skills.map((skillId, index) => {
            const skill = getSkill(skillId)
            if (!skill) return null
            const ppLeft = player.currentPp[skillId] || 0
            return (
              <button
                key={skillId}
                className="btn btn-primary btn-sm"
                onClick={() => playerAction({ type: 'skill', skillIndex: index })}
                disabled={ppLeft <= 0}
                title={`${skill.description} (PP: ${ppLeft}/${skill.pp})`}
              >
                {skill.name} (PP:{ppLeft})
              </button>
            )
          })}
          <button className="btn btn-ghost btn-sm" onClick={() => playerAction({ type: 'defend' })}>
            🛡️ 防御
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => playerAction({ type: 'flee' })}>
            🏃 逃跑
          </button>
        </div>
      )}

      {/* 战斗结束 */}
      {isOver && (
        <button className="btn btn-primary" onClick={endBattle}>
          {battle.phase === 'won' ? '🎉 领取奖励' : '💀 返回'}
        </button>
      )}
    </div>
  )
}
