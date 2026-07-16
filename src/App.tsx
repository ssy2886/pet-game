import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useGameStore } from './store/gameStore'
import HomePage from './pages/HomePage'
import GachaPage from './pages/GachaPage'
import TeamPage from './pages/TeamPage'
import BattlePage from './pages/BattlePage'
import ExplorationPage from './pages/ExplorationPage'
import PokedexPage from './pages/PokedexPage'
import ShopPage from './pages/ShopPage'
import EggPage from './pages/EggPage'

const NAV_ITEMS = [
  { path: '/', label: '🏠 首页' },
  { path: '/gacha', label: '🥚 抽蛋' },
  { path: '/eggs', label: '🥚 孵化' },
  { path: '/team', label: '👥 队伍' },
  { path: '/battle', label: '⚔️ 战斗' },
  { path: '/explore', label: '🗺️ 探险' },
  { path: '/pokedex', label: '📖 图鉴' },
  { path: '/shop', label: '🏪 商店' },
]

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const gold = useGameStore(s => s.gold)
  const pets = useGameStore(s => s.pets)
  const eggs = useGameStore(s => s.eggs)
  const teamCount = useGameStore(s => s.team.length)

  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>🐾 数码世界</h1>
        <div className="stats-bar">
          <span className="stat">💰 {gold.toLocaleString()}</span>
          <span className="stat">🐕 宠物 {pets.length}</span>
          <span className="stat">🥚 {eggs.length}</span>
          <span className="stat">👥 {teamCount}/6</span>
        </div>
      </header>

      <nav className="app-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.path}
            className={location.pathname === item.path ? 'active' : ''}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gacha" element={<GachaPage />} />
          <Route path="/eggs" element={<EggPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/battle" element={<BattlePage />} />
          <Route path="/explore" element={<ExplorationPage />} />
          <Route path="/pokedex" element={<PokedexPage />} />
          <Route path="/shop" element={<ShopPage />} />
        </Routes>
      </main>
    </div>
  )
}
