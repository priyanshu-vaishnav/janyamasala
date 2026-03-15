import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RetailerLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: '#F8F5F0' }}>
      <header style={{ background: '#D42B2B', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#F5C518', fontWeight: 900 }}>Janya Masala™</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ color: 'white', fontSize: 14 }}>Welcome, {user?.name}</span>
          <button className="btn btn-sm btn-ghost" onClick={() => { logout(); navigate('/') }}>Logout</button>
        </div>
      </header>
      <main style={{ padding: 32, maxWidth: 1100, margin: '0 auto' }}><Outlet /></main>
    </div>
  )
}
