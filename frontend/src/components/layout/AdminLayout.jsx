import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'

const navItems = [
  { to: '/admin', icon: '📊', label: 'Dashboard' },
  { to: '/admin/products', icon: '🌶️', label: 'Products' },
  { to: '/admin/inquiries', icon: '📩', label: 'Inquiries' },
  { to: '/admin/orders', icon: '📦', label: 'Orders' },
  { to: '/admin/retailers', icon: '🤝', label: 'Retailers' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => { logout(); navigate('/admin/login') }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F5F0' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 72 : 240, flexShrink: 0,
        background: '#1A0A00', display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s ease', position: 'fixed', top: 0, bottom: 0, zIndex: 100,
        boxShadow: '4px 0 20px rgba(0,0,0,0.3)'
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          {!collapsed ? (
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#F5C518', fontWeight: 900 }}>Janya Masala</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 2 }}>ADMIN PANEL</div>
            </div>
          ) : (
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#F5C518', fontWeight: 900, textAlign: 'center' }}>J</div>
          )}
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {navItems.map(item => {
            const active = item.to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.to)
            return (
              <Link key={item.to} to={item.to} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 20px', margin: '2px 10px', borderRadius: 12,
                color: active ? '#1A0A00' : 'rgba(255,255,255,0.7)',
                background: active ? '#F5C518' : 'transparent',
                fontWeight: active ? 700 : 500, fontSize: 14,
                transition: 'all 0.2s', textDecoration: 'none',
                justifyContent: collapsed ? 'center' : 'flex-start'
              }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '16px 10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={() => setCollapsed(!collapsed)} style={{
            width: '100%', padding: '10px', background: 'rgba(255,255,255,0.06)',
            border: 'none', borderRadius: 10, color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer', fontSize: 18, marginBottom: 8
          }}>{collapsed ? '→' : '←'}</button>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '10px', background: 'rgba(212,43,43,0.2)',
            border: '1px solid rgba(212,43,43,0.4)', borderRadius: 10,
            color: '#FF8A80', cursor: 'pointer', fontSize: 13, fontWeight: 600
          }}>{collapsed ? '🚪' : '🚪 Logout'}</button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: collapsed ? 72 : 240, transition: 'margin-left 0.3s ease', minHeight: '100vh' }}>
        {/* Top Bar */}
        <header style={{
          background: 'white', padding: '0 32px', height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 50
        }}>
          <div style={{ fontSize: 20, fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>
            {navItems.find(n => n.to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(n.to))?.label || 'Dashboard'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href="https://wa.me/919328454346" target="_blank" rel="noreferrer">
              <button className="btn btn-sm" style={{ background: '#25D366', color: 'white', border: 'none' }}>💬 WhatsApp</button>
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, background: '#D42B2B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                {user?.name?.[0] || 'A'}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{user?.name || 'Admin'}</div>
                <div style={{ fontSize: 11, color: '#8B6A4A' }}>Administrator</div>
              </div>
            </div>
          </div>
        </header>
        <main style={{ padding: 32 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
