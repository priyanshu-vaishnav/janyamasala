import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function RetailerDashboard() {
  const { user } = useAuth();
  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, var(--dark), var(--red))', borderRadius: 'var(--radius-xl)', padding: '40px', marginBottom: 32, color: 'white' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🙏</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900, marginBottom: 8 }}>
          Jai Janya, {user?.name?.split(' ')[0]}!
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-hindi)', fontSize: 18 }}>स्वाद मिट्टी का, भरोसा सदियों का ।</p>
        {!user?.isApproved && (
          <div style={{ background: 'rgba(245,197,24,0.2)', border: '1px solid rgba(245,197,24,0.5)', borderRadius: 12, padding: '14px 18px', marginTop: 20, display: 'inline-block' }}>
            <span style={{ color: 'var(--yellow)', fontWeight: 700 }}>⏳ Account Pending Approval</span>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 }}>Our team will approve your account soon. WhatsApp us for faster access.</p>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 32 }}>
        {[
          { icon: '📦', label: 'Browse Products', desc: 'View our full spice catalog', to: '/products', btn: 'View Products' },
          { icon: '🛒', label: 'My Orders', desc: 'Track and manage your orders', to: '/retailer/orders', btn: 'View Orders' },
          { icon: '💬', label: 'WhatsApp Support', desc: 'Direct line to our team', href: 'https://wa.me/919328454346', btn: 'Chat Now' },
        ].map(card => (
          <div key={card.label} style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '28px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 40 }}>{card.icon}</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800 }}>{card.label}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, flex: 1 }}>{card.desc}</p>
            {card.to
              ? <Link to={card.to} className="btn btn-primary btn-sm">{card.btn} →</Link>
              : <a href={card.href} target="_blank" rel="noreferrer" className="btn btn-sm" style={{ background: '#25D366', color: 'white' }}>{card.btn}</a>
            }
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Your Account Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            ['Name', user?.name], ['Email', user?.email], ['Phone', user?.phone || '—'],
            ['Company', user?.company || '—'], ['City', user?.city || '—'], ['Status', user?.isApproved ? '✅ Approved' : '⏳ Pending']
          ].map(([k, v]) => (
            <div key={k} style={{ padding: '14px 16px', background: 'var(--light-cream)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{k}</div>
              <div style={{ fontWeight: 600, color: 'var(--dark)' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
