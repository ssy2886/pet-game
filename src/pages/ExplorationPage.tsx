import { useGameStore } from '../store/gameStore'
import { getThemeLabel, getCurrentNode, getReachableNodes } from '../core/exploration'
import { useState } from 'react'

const NODE_ICONS: Record<string, string> = {
  battle: '⚔️',
  chest: '🎁',
  heal: '💚',
  boss: '👑',
}

export default function ExplorationPage() {
  const expedition = useGameStore(s => s.expedition)
  const startExpedition = useGameStore(s => s.startExpedition)
  const moveToNode = useGameStore(s => s.moveToNode)
  const endExpedition = useGameStore(s => s.endExpedition)
  const team = useGameStore(s => s.team)
  const pets = useGameStore(s => s.pets)
  const teamPets = pets.filter(p => team.includes(p.id))
  const [message, setMessage] = useState('')

  const current = expedition ? getCurrentNode(expedition) : null
  const reachable = expedition ? getReachableNodes(expedition) : []

  const handleMove = (nodeId: string) => {
    const target = expedition?.nodes.find(n => n.id === nodeId)
    if (target?.type === 'battle') {
      setMessage('⚔️ 遭遇野生宠物！')
    } else if (target?.type === 'chest') {
      setMessage('🎁 发现宝箱！获得一些金币！')
    } else if (target?.type === 'heal') {
      setMessage('💚 回复点！宠物们恢复了体力！')
    } else if (target?.type === 'boss') {
      setMessage('👑 Boss 出现！击败它获得丰厚奖励！')
    }
    moveToNode(nodeId)
    setTimeout(() => setMessage(''), 2000)
  }

  if (!expedition) {
    return (
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', paddingTop: 48 }}>
        <h2 className="section-title">🗺️ 探险</h2>
        {teamPets.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: '3rem', marginBottom: 12 }}>🗺️</p>
            <p>队伍里没有宠物，无法探险！</p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: 400 }}>
              派出你的小队，探索随机生成的神秘地图。在未知中遭遇野生宠物、寻找宝藏、挑战强大的 Boss！
            </p>
            <button className="btn btn-gold" onClick={() => startExpedition()}>
              🚀 开始探险！
            </button>
          </>
        )}
      </div>
    )
  }

  const isComplete = expedition.completed

  return (
    <div className="fade-in expedition-map">
      <h2 className="section-title">🗺️ {getThemeLabel(expedition.theme)}</h2>

      {/* 消息提示 */}
      {message && (
        <div style={{
          background: 'var(--accent)', color: 'white', padding: '8px 16px',
          borderRadius: 8, fontSize: '0.9rem',
        }}>
          {message}
        </div>
      )}

      {/* 地图节点展示 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: 16 }}>
        {expedition.nodes.map((node, index) => (
          <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              className={`node-icon ${node.type} ${node.completed ? 'completed' : ''} ${current?.id === node.id ? 'current' : ''}`}
              onClick={() => !node.completed && reachable.some(r => r.id === node.id) && current?.id !== node.id && handleMove(node.id)}
              style={{
                cursor: reachable.some(r => r.id === node.id) && current?.id !== node.id ? 'pointer' : 'default',
              }}
              title={`节点 ${index + 1}: ${node.type}`}
            >
              {NODE_ICONS[node.type] || '•'}
            </div>
            {index < expedition.nodes.length - 1 && (
              <div className="node-connector" style={{
                opacity: node.completed ? 0.4 : 0.2,
              }} />
            )}
          </div>
        ))}
      </div>

      {/* 当前节点信息 */}
      {current && (
        <div className="card" style={{ textAlign: 'center', width: '100%', maxWidth: 400 }}>
          <p style={{ fontSize: '0.9rem' }}>
            当前位置: 节点 {expedition.nodes.indexOf(current) + 1}
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {current.type === 'battle' && '⚔️ 战斗节点'}
            {current.type === 'chest' && '🎁 宝箱节点'}
            {current.type === 'heal' && '💚 回复节点'}
            {current.type === 'boss' && '👑 Boss 节点'}
          </p>

          {reachable.length > 0 && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
              {reachable.map(node => (
                <button
                  key={node.id}
                  className="btn btn-primary btn-sm"
                  onClick={() => handleMove(node.id)}
                >
                  前往 {NODE_ICONS[node.type] || '•'}
                </button>
              ))}
            </div>
          )}

          {isComplete && (
            <button className="btn btn-gold" onClick={endExpedition} style={{ marginTop: 12 }}>
              🎉 探险完成！领取奖励
            </button>
          )}
        </div>
      )}

      <button className="btn btn-ghost btn-sm" onClick={endExpedition}>
        🏃 撤离
      </button>
    </div>
  )
}
