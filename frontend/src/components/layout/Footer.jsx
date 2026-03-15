import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: '#1A0A00', color: 'rgba(255,255,255,0.7)', padding: '60px 40px 30px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, paddingBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 30 }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, color: '#F5C518', fontWeight: 900, marginBottom: 8 }}>Janya Masala™</div>
            <div style={{ fontFamily: 'Tiro Devanagari Hindi, serif', fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>स्वाद मिट्टी का, भरोसा सदियों का।</div>
            <p style={{ fontSize: 14, lineHeight: 1.8 }}>Premium quality machine-cleaned spices from the heart of Unjha, Gujarat — India's spice capital.</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {['📍 Unjha, Gujarat', '✉️ janyamasala@gmail.com', '📞 +91 93284 54346'].map(c => (
                <div key={c} style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}></div>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: '#F5C518', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16, fontFamily: 'DM Sans, sans-serif' }}>Quick Links</h4>
            {[['/', 'Home'], ['/products', 'Products'], ['/retailers', 'For Retailers'], ['/contact', 'Contact']].map(([to, label]) => (
              <div key={to} style={{ marginBottom: 10 }}>
                <Link to={to} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#F5C518'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>{label}</Link>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ color: '#F5C518', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16, fontFamily: 'DM Sans, sans-serif' }}>Products</h4>
            {['Jeera (Cumin)', 'Haldi Powder', 'Lal Mirch', 'All Spices'].map(p => (
              <div key={p} style={{ marginBottom: 10 }}>
                <Link to="/products" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}
                  onMouseEnter={e => e.target.style.color = '#F5C518'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>{p}</Link>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ color: '#F5C518', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16, fontFamily: 'DM Sans, sans-serif' }}>Contact</h4>
            <div style={{ fontSize: 14, lineHeight: 2 }}>
              <div>📍 Unjha, Gujarat</div>
              <div>✉️ janyamasala@gmail.com</div>
              <div>📞 +91 93284 54346</div>
            </div>
            <a href="https://wa.me/919328454346" target="_blank" rel="noreferrer">
              <button className="btn btn-sm" style={{ marginTop: 16, background: '#25D366', color: 'white', border: 'none', borderRadius: 20 }}>💬 WhatsApp Us</button>
            </a>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 13 }}>© 2025 Janya Masala™. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link to="/admin/login" style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Admin</Link>
            <Link to="/retailer/login" style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Retailer Login</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
