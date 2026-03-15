import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import api from '../../api'
import toast from 'react-hot-toast'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ name: '', phone: '', message: '', type: 'general' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/products?featured=true').then(r => setProducts(r.data.data?.slice(0, 3) || [])).catch(() => {})
  }, [])

  const handleInquiry = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) return toast.error('Name and phone required!')
    setSubmitting(true)
    try {
      await api.post('/inquiries', form)
      toast.success('Inquiry sent! We will contact you soon. 🙏')
      setForm({ name: '', phone: '', message: '', type: 'general' })
    } catch { toast.error('Something went wrong. Please try again.') }
    finally { setSubmitting(false) }
  }

  return (
    <div>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', paddingTop: 70,
        background: 'linear-gradient(135deg, #1A0A00 0%, #3D1A00 35%, #8B1515 70%, #D42B2B 100%)',
        display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden'
      }}>
        {/* BG Pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(245,197,24,0.08) 0%, transparent 45%), radial-gradient(circle at 85% 25%, rgba(212,43,43,0.12) 0%, transparent 40%)' }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', padding: '60px 24px' }}>
          {/* Text */}
          <div style={{ animation: 'fadeUp 0.8s ease forwards' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,197,24,0.12)', border: '1px solid rgba(245,197,24,0.35)', borderRadius: 20, padding: '6px 16px', marginBottom: 24 }}>
              <span style={{ fontSize: 14 }}>⭐</span>
              <span style={{ color: '#F5C518', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Unjha's Most Trusted Spice Brand</span>
            </div>

            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(42px, 5.5vw, 74px)', fontWeight: 900, color: 'white', lineHeight: 1.05, marginBottom: 16 }}>
              Pure Spices.<br/>
              <span style={{ color: '#F5C518' }}>Real Flavour.</span><br/>
              Always Fresh.
            </h1>

            <p style={{ fontFamily: 'Tiro Devanagari Hindi, serif', fontSize: 19, color: 'rgba(255,255,255,0.65)', marginBottom: 20, fontStyle: 'italic' }}>
              स्वाद मिट्टी का, भरोसा सदियों का।
            </p>

            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.72)', lineHeight: 1.85, marginBottom: 36, maxWidth: 460 }}>
              From the heart of Unjha, Gujarat — India's spice capital — Janya Masala brings you machine-cleaned, premium quality spices packed with natural aroma.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
              <Link to="/products"><button className="btn btn-yellow btn-lg">Explore Products →</button></Link>
              <Link to="/retailers"><button className="btn btn-ghost btn-lg">Retailer Enquiry</button></Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 40 }}>
              {[['100%', 'Pure & Natural'], ['1kg', 'Pack Size'], ['✓', 'Premium Sealed']].map(([n, l]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 30, color: '#F5C518', fontWeight: 900 }}>{n}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: 1.5, textTransform: 'uppercase' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Visual */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{ animation: 'float 4s ease-in-out infinite', position: 'relative' }}>
              {/* Glow */}
              <div style={{ position: 'absolute', inset: -60, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,197,24,0.18) 0%, transparent 65%)', animation: 'pulse 3s ease-in-out infinite' }} />
              {/* Bag */}
              <div style={{
                width: 260, minHeight: 360, background: 'linear-gradient(180deg,#F5C518 0%,#F5C518 38%,#D42B2B 72%,#D42B2B 100%)',
                borderRadius: '18px 18px 8px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: 20, boxShadow: '0 50px 100px rgba(0,0,0,0.55)', position: 'relative', overflow: 'hidden',
                border: '3px solid rgba(255,255,255,0.15)'
              }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', letterSpacing: 2, textTransform: 'uppercase', background: 'rgba(255,255,255,0.12)', width: '100%', textAlign: 'center', padding: 6, borderRadius: 8, marginBottom: 14 }}>Unjha's Famous</div>
                <div style={{ background: '#8B1515', border: '3px solid #F5C518', borderRadius: 12, padding: '8px 18px', marginBottom: 10, textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 34, fontWeight: 900, color: 'white', lineHeight: 1 }}>Janya</div>
                  <div style={{ background: '#D42B2B', borderRadius: 4, padding: '3px 10px', marginTop: 4 }}>
                    <span style={{ color: 'white', fontSize: 13, fontWeight: 700, letterSpacing: 3 }}>masala</span>
                  </div>
                </div>
                <div style={{ fontFamily: 'Tiro Devanagari Hindi, serif', fontSize: 11, color: 'rgba(255,255,255,0.8)', marginBottom: 14, textAlign: 'center' }}>स्वाद मिट्टी का, भरोसा सदियों का ।</div>
                <div style={{ flex: 1, width: '100%', background: 'rgba(0,0,0,0.3)', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, letterSpacing: 2 }}>MACHINE CLEAN</div>
                  <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 24, fontWeight: 700 }}>SPICES</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 6 }}>1kg</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
                  <div style={{ background: '#F5C518', border: '2px solid #C9960C', borderRadius: '50%', width: 48, height: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: '#3D1A00', textAlign: 'center', lineHeight: 1.2 }}>PREMIUM<br/>QUALITY</div>
                </div>
              </div>
              {/* Floating spice emojis */}
              <div style={{ position: 'absolute', top: '0%', left: '-20%', fontSize: 36, animation: 'float 6s ease-in-out infinite' }}>🌿</div>
              <div style={{ position: 'absolute', bottom: '10%', right: '-18%', fontSize: 32, animation: 'float 5s ease-in-out infinite reverse' }}>⭐</div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#FFF8EE"/>
          </svg>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────── */}
      <section style={{ background: '#F5C518', padding: '18px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16 }}>
          {[['🏭','Machine Cleaned'], ['🌱','100% Natural'], ['📦','Hygienically Packed'], ['🏆','Premium Quality'], ['📍','Unjha, Gujarat']].map(([ic, txt]) => (
            <div key={txt} style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 14, color: '#1A0A00' }}>
              <span style={{ fontSize: 22 }}>{ic}</span>{txt}
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────── */}
      <section style={{ padding: '90px 24px', background: 'linear-gradient(180deg, #FFF8EE 0%, #FFF0D5 100%)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="section-label">Our Products</span>
            <h2 className="section-title">Premium <span>Spice</span> Collection</h2>
            <p style={{ color: '#8B6A4A', maxWidth: 480, margin: '12px auto 0', lineHeight: 1.85 }}>Every spice machine-cleaned and packed to deliver Unjha's finest authentic flavour.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
            {(products.length ? products : [
              { _id: '1', name: 'Jeera (Cumin)', nameHindi: 'जीरा', description: 'Premium quality whole cumin seeds from Unjha, machine cleaned for superior purity.', variants: [{ price: 250, weight: '1kg' }], category: 'whole-spice' },
              { _id: '2', name: 'Haldi Powder', nameHindi: 'हल्दी', description: 'Pure turmeric powder with high curcumin content, vibrant yellow colour.', variants: [{ price: 210, weight: '1kg' }], category: 'powder' },
              { _id: '3', name: 'Lal Mirch', nameHindi: 'लाल मिर्च', description: 'Bold fiery red chilli powder, perfect heat, deep red colour.', variants: [{ price: 250, weight: '1kg' }], category: 'powder' }
            ]).map(p => (
              <div key={p._id} className="card" style={{ background: 'white' }}>
                <div style={{ background: 'linear-gradient(135deg,#FFF8EE,#FFE8B0)', padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180, position: 'relative' }}>
                  <div style={{ fontSize: 80 }}>
                    {p.category === 'whole-spice' ? '🌿' : p.name.toLowerCase().includes('haldi') ? '🟡' : '🌶️'}
                  </div>
                  <span className="badge badge-yellow" style={{ position: 'absolute', top: 14, right: 14 }}>
                    {p.category === 'whole-spice' ? 'Whole Spice' : 'Powder'}
                  </span>
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ fontFamily: 'Tiro Devanagari Hindi, serif', color: '#C9960C', fontSize: 13, marginBottom: 4 }}>{p.nameHindi}</div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{p.name}</h3>
                  <p style={{ fontSize: 14, color: '#8B6A4A', lineHeight: 1.7, marginBottom: 18 }}>{p.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: 24, fontWeight: 800, color: '#D42B2B' }}>₹{p.variants?.[0]?.price || '—'}</span>
                      <span style={{ fontSize: 13, color: '#8B6A4A' }}> / {p.variants?.[0]?.weight || '1kg'}</span>
                    </div>
                    <Link to="/contact"><button className="btn btn-primary btn-sm">Enquire</button></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/products"><button className="btn btn-outline btn-lg">View All Products →</button></Link>
          </div>
        </div>
      </section>

      {/* ── WHY JANYA ─────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg,#1A0A00,#3D1A00)', padding: '90px 24px', textAlign: 'center' }}>
        <div className="container">
          <span className="section-label" style={{ color: '#F5C518' }}>Why Choose Us</span>
          <h2 className="section-title" style={{ color: 'white' }}>What Makes <span style={{ color: '#F5C518' }}>Janya Masala</span> Special</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginTop: 52 }}>
            {[
              { icon: '🏭', title: 'Machine Cleaned', desc: 'State-of-the-art cleaning removes all impurities — only the finest spices reach you.' },
              { icon: '📍', title: 'Unjha Origin', desc: "Sourced directly from Unjha — India's premier spice hub — guaranteeing authenticity." },
              { icon: '💰', title: 'Retailer Margins', desc: 'Extra margins for retailers with bulk orders. Partner with us for profitable business.' },
              { icon: '🌟', title: 'Premium Sealed', desc: 'Each pack carries our Premium Quality seal — assured best product every time.' },
            ].map(c => (
              <div key={c.title} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(245,197,24,0.18)', borderRadius: 20, padding: '36px 24px', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,197,24,0.08)'; e.currentTarget.style.borderColor = 'rgba(245,197,24,0.45)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(245,197,24,0.18)' }}>
                <div style={{ fontSize: 46, marginBottom: 16 }}>{c.icon}</div>
                <div style={{ color: '#F5C518', fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{c.title}</div>
                <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 14, lineHeight: 1.75 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RETAILER CTA ──────────────────────────────────── */}
      <section style={{ background: '#D42B2B', padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z'/%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,4vw,46px)', fontWeight: 900, color: 'white', marginBottom: 16 }}>
            Partner With <span style={{ color: '#F5C518' }}>Janya Masala</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, marginBottom: 36, lineHeight: 1.85 }}>
            Join our growing retailer network. Enjoy exclusive margins, consistent supply and the trusted Janya Masala brand value from Unjha's finest.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/retailers"><button className="btn btn-yellow btn-lg">Become a Retailer →</button></Link>
            <a href="https://wa.me/919328454346?text=Hi, I want to inquire about Janya Masala retailer partnership" target="_blank" rel="noreferrer">
              <button className="btn btn-ghost btn-lg">💬 WhatsApp Us</button>
            </a>
          </div>
        </div>
      </section>

      {/* ── CONTACT / INQUIRY FORM ───────────────────────── */}
      <section id="contact" style={{ padding: '90px 24px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 70, alignItems: 'start', maxWidth: 1000 }}>
          <div>
            <span className="section-label">Get In Touch</span>
            <h2 className="section-title">Send Us an <span>Enquiry</span></h2>
            <p style={{ color: '#8B6A4A', lineHeight: 1.85, marginBottom: 32 }}>
              For product enquiries, retailer partnerships, or bulk orders — contact us directly!
            </p>
            {[['📍', 'Unjha, Gujarat, India'], ['📞', '+91 93284 54346'], ['✉️', 'janyamasala@gmail.com']].map(([ic, txt]) => (
              <div key={txt} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18, padding: '16px 20px', background: 'white', borderRadius: 14, boxShadow: '0 2px 14px rgba(0,0,0,0.06)', borderLeft: '4px solid #D42B2B' }}>
                <span style={{ fontSize: 22 }}>{ic}</span>
                <span style={{ fontSize: 15, fontWeight: 600 }}>{txt}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleInquiry} style={{ background: 'white', borderRadius: 24, padding: 40, boxShadow: '0 10px 50px rgba(0,0,0,0.09)' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Quick Enquiry</h3>
            <div className="form-group">
              <label className="form-label">Your Name *</label>
              <input className="form-control" placeholder="Ramesh Patel" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input className="form-control" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Enquiry Type</label>
              <select className="form-control" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="general">General</option>
                <option value="product">Product Enquiry</option>
                <option value="retailer">Retailer / Distributor</option>
                <option value="bulk">Bulk Order</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-control" rows={3} placeholder="Tell us what you need..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }} disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Enquiry →'}
            </button>
          </form>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          section > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
