import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { ALL_FOODS, EVOLUTION_ITEMS, CONSUMABLE_ITEMS } from '../core/data/items'

export default function ShopPage() {
  const gold = useGameStore(s => s.gold)
  const inventory = useGameStore(s => s.inventory)
  const buyFood = useGameStore(s => s.buyFood)
  const buyItem = useGameStore(s => s.buyItem)
  const buyConsumable = useGameStore(s => s.buyConsumable)
  const [message, setMessage] = useState('')

  const foodItems = Object.values(ALL_FOODS)
  const evolutionItemList = Object.values(EVOLUTION_ITEMS)
  const consumableItems = Object.values(CONSUMABLE_ITEMS)
  const foodQty = (id: string) => inventory.foods.find(f => f.id === id)?.quantity || 0
  const itemQty = (id: string) => inventory.evolutionItems.find(i => i.id === id)?.quantity || 0
  const consumableQty = (id: string) => inventory.consumables.find(c => c.id === id)?.quantity || 0

  const handleBuyFood = (foodId: string) => {
    if (buyFood(foodId)) {
      setMessage(`✅ 购买成功！`)
    } else {
      setMessage('❌ 金币不足！')
    }
    setTimeout(() => setMessage(''), 2000)
  }

  const handleBuyItem = (itemId: string) => {
    if (buyItem(itemId)) {
      setMessage(`✅ 购买成功！`)
    } else {
      setMessage('❌ 金币不足！')
    }
    setTimeout(() => setMessage(''), 2000)
  }

  const handleBuyConsumable = (itemId: string) => {
    if (buyConsumable(itemId)) {
      setMessage(`✅ 购买成功！`)
    } else {
      setMessage('❌ 金币不足！')
    }
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 className="section-title">🏪 商店</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          💰 当前金币: {gold.toLocaleString()}
        </span>
        {message && (
          <span style={{ fontSize: '0.9rem', color: 'var(--success)', fontWeight: 600 }}>
            {message}
          </span>
        )}
      </div>

      <h3 className="section-title">🍖 食物</h3>
      <div className="inv-grid">
        {foodItems.map(food => (
          <div key={food.id} className="inv-item">
            <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>🍖</div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{food.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0' }}>
              {food.description}
            </div>
            <div style={{ fontSize: '0.75rem' }}>
              📈+{food.growthAmount} ❤️+{food.affectionAmount} 😊+{food.moodAmount}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: 4, color: 'var(--gold)' }}>
              💰 {food.price}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
              持有: {foodQty(food.id)}
            </div>
            <button
              className="btn btn-primary btn-sm"
              style={{ width: '100%', marginTop: 8 }}
              onClick={() => handleBuyFood(food.id)}
            >
              购买
            </button>
          </div>
        ))}
      </div>

      <h3 className="section-title" style={{ marginTop: 16 }}>💎 进化道具</h3>
      <div className="inv-grid">
        {evolutionItemList.map(item => (
          <div key={item.id} className="inv-item">
            <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>💎</div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0' }}>
              {item.description}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: 4, color: 'var(--gold)' }}>
              💰 {item.price}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
              持有: {itemQty(item.id)}
            </div>
            <button
              className="btn btn-primary btn-sm"
              style={{ width: '100%', marginTop: 8 }}
              onClick={() => handleBuyItem(item.id)}
            >
              购买
            </button>
          </div>
        ))}
      </div>

      <h3 className="section-title" style={{ marginTop: 16 }}>🍬 糖果消耗品</h3>
      <div className="inv-grid">
        {consumableItems.map(item => (
          <div key={item.id} className="inv-item">
            <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>🍬</div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0' }}>
              {item.description}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: 4, color: 'var(--gold)' }}>
              💰 {item.price}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
              持有: {consumableQty(item.id)}
            </div>
            <button
              className="btn btn-gold btn-sm"
              style={{ width: '100%', marginTop: 8 }}
              onClick={() => handleBuyConsumable(item.id)}
            >
              购买
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
