import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MENU = [
  { icon: '📊', label: 'Dashboard', to: '/admin' },
  { icon: '📦', label: 'Products', to: '/admin/products' },
  { icon: '💬', label: 'Inquiries', to: '/admin/inquiries' },
  { icon: '🛒', label: 'Orders', to: '/admin/orders' },
  { icon: '🤝', label: 'Retailers', to: '/admin/retailers' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F4EF' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, background: 'var(--dark)', position: 'fixed', top: 0, left: 0, height: '100vh',
        display: 'flex', flexDirection: 'column', zIndex: 100, boxShadow: '4px 0 20px rgba(0,0,0,0.15)'
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--yellow)', fontWeight: 900 }}>Janya Masala</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 2 }}>Admin Panel</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {MENU.map(item => {
            const active = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 10,
                background: active ? 'var(--red)' : 'transparent',
                color: active ? 'white' : 'rgba(255,255,255,0.65)',
                fontWeight: active ? 600 : 400, fontSize: 14,
                transition: 'all 0.2s', textDecoration: 'none'
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'white'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; } }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding: '20px 16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
              {user?.name?.[0] || 'A'}
            </div>
            <div>
              <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Administrator</div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-sm" style={{ width: '100%', background: 'rgba(212,43,43,0.2)', color: 'var(--red)', border: '1px solid rgba(212,43,43,0.3)' }}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 240, flex: 1, minHeight: '100vh' }}>
        {/* Top bar */}
        <div style={{ background: 'white', padding: '16px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50, boxShadow: 'var(--shadow-sm)' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--dark)' }}>
              {MENU.find(m => m.to === location.pathname)?.label || 'Dashboard'}
            </h2>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <Link to="/" style={{ fontSize: 13, color: 'var(--red)', fontWeight: 600 }}>← View Website</Link>
        </div>
        <div style={{ padding: '32px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
