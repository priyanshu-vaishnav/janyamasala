import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/retailers', label: 'Retailers' },
    { to: '/contact', label: 'Contact' },
  ]

  const isActive = (to) => location.pathname === to

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 1000,
        background: scrolled ? 'rgba(212,43,43,0.98)' : '#D42B2B',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.25)' : 'none',
        transition: 'all 0.3s ease',
        padding: '0 40px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{
              background: '#F5C518', border: '3px solid #C9960C', borderRadius: 10,
              padding: '4px 16px', fontFamily: 'Playfair Display, serif',
              fontSize: 22, fontWeight: 900, color: '#D42B2B', lineHeight: 1
            }}>Janya</div>
            <div>
              <div style={{ color: 'white', fontSize: 13, fontWeight: 300, opacity: 0.9, letterSpacing: 1 }}>Masala ™</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, letterSpacing: 2 }}>UNJHA'S FAMOUS</div>
            </div>
          </Link>

          {/* Desktop Links */}
          <ul style={{ display: 'flex', gap: 32, listStyle: 'none', alignItems: 'center' }} className="nav-links-desktop">
            {links.map(l => (
              <li key={l.to}>
                <Link to={l.to} style={{
                  color: isActive(l.to) ? '#F5C518' : 'rgba(255,255,255,0.9)',
                  fontWeight: isActive(l.to) ? 700 : 500, fontSize: 14,
                  transition: 'color 0.2s', letterSpacing: 0.5,
                  borderBottom: isActive(l.to) ? '2px solid #F5C518' : '2px solid transparent',
                  paddingBottom: 2
                }}>{l.label}</Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link to="/contact">
              <button className="btn btn-yellow btn-sm">Enquire Now</button>
            </Link>
            {/* Hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              display: 'none', background: 'none', border: 'none', color: 'white', fontSize: 24
            }} className="hamburger">☰</button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 70, left: 0, right: 0, zIndex: 999,
          background: '#A01E1E', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16
        }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} style={{
              color: 'white', fontSize: 18, fontWeight: 600, padding: '8px 0',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>{l.label}</Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </>
  )
}
