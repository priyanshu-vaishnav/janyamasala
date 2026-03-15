// ─── RetailerLayout.jsx ─────────────────────────────────────────────────────
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function RetailerLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  const MENU = [
    { icon: '📊', label: 'Dashboard', to: '/retailer' },
    { icon: '🛒', label: 'My Orders', to: '/retailer/orders' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F8F4EF' }}>
      <nav style={{ background: 'var(--red)', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--yellow)', fontWeight: 900 }}>Janya Masala™</Link>
          <div style={{ display: 'flex', gap: 4 }}>
            {MENU.map(item => (
              <Link key={item.to} to={item.to}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, background: location.pathname === item.to ? 'rgba(255,255,255,0.15)' : 'transparent', color: 'white', fontSize: 14, fontWeight: 500 }}>
                {item.icon} {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>👤 {user?.name}</span>
          <button onClick={handleLogout} className="btn btn-yellow btn-sm">Logout</button>
        </div>
      </nav>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 24px' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default RetailerLayout;
