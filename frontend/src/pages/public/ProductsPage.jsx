import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import api from '../../api'
import toast from 'react-hot-toast'

const FALLBACK = [
  { _id: '1', name: 'Jeera', nameHindi: 'जीरा', category: 'whole-spice', description: 'Premium whole cumin seeds from Unjha. Machine cleaned, rich aroma.', variants: [{ weight: '250g', price: 65 }, { weight: '500g', price: 125 }, { weight: '1kg', price: 250 }], features: ['Machine Cleaned', 'Rich Aroma', 'Premium Quality'], isFeatured: true },
  { _id: '2', name: 'Haldi Powder', nameHindi: 'हल्दी पाउडर', category: 'powder', description: 'Pure turmeric powder, high curcumin, vibrant yellow. Naturally processed.', variants: [{ weight: '200g', price: 45 }, { weight: '500g', price: 110 }, { weight: '1kg', price: 210 }], features: ['High Curcumin', 'Natural Process', 'Deep Yellow'], isFeatured: true },
  { _id: '3', name: 'Lal Mirch Powder', nameHindi: 'लाल मिर्च पाउडर', category: 'powder', description: 'Bold fiery red chilli powder. Perfect heat, deep red colour, machine cleaned.', variants: [{ weight: '200g', price: 55 }, { weight: '500g', price: 130 }, { weight: '1kg', price: 250 }], features: ['Bold Flavour', 'Deep Red', 'Machine Cleaned'], isFeatured: false },
]

const ICONS = { 'whole-spice': '🌿', powder: '🌶️', blend: '🍛' }
const CATS = [{ v: '', l: 'All' }, { v: 'whole-spice', l: 'Whole Spice' }, { v: 'powder', l: 'Powder' }, { v: 'blend', l: 'Blend' }]

export default function ProductsPage() {
  const [products, setProducts] = useState(FALLBACK)
  const [cat, setCat] = useState('')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', product: '', message: '', type: 'product' })
  const [modal, setModal] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const q = new URLSearchParams({ ...(cat && { category: cat }), ...(search && { search }) }).toString()
    api.get(`/products?${q}`).then(r => setProducts(r.data.data || FALLBACK)).catch(() => setProducts(FALLBACK))
  }, [cat, search])

  const openEnquiry = (p) => { setModal(p); setForm(f => ({ ...f, product: p.name, message: `I am interested in ${p.name}.` })) }

  const submitEnquiry = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) return toast.error('Name & phone required!')
    setSubmitting(true)
    try {
      await api.post('/inquiries', form)
      toast.success('Enquiry sent! We\'ll contact you soon 🙏')
      setModal(null)
    } catch { toast.error('Failed. Try again.') } finally { setSubmitting(false) }
  }

  const filtered = products.filter(p =>
    (!cat || p.category === cat) &&
    (!search || p.name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 70 }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#1A0A00,#D42B2B)', padding: '60px 24px', textAlign: 'center' }}>
          <span className="section-label" style={{ color: '#F5C518' }}>Our Products</span>
          <h1 className="section-title" style={{ color: 'white', marginBottom: 8 }}>Premium <span style={{ color: '#F5C518' }}>Spice</span> Range</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto' }}>Machine-cleaned, hygienically packed spices from Unjha, Gujarat</p>
        </div>

        {/* Filters */}
        <div style={{ background: 'white', padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
          <div className="container" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <input className="form-control" style={{ maxWidth: 280 }} placeholder="🔍 Search spices..." value={search} onChange={e => setSearch(e.target.value)} />
            <div style={{ display: 'flex', gap: 10 }}>
              {CATS.map(c => (
                <button key={c.v} onClick={() => setCat(c.v)} className="btn btn-sm" style={{ background: cat === c.v ? '#D42B2B' : 'transparent', color: cat === c.v ? 'white' : '#8B6A4A', border: `2px solid ${cat === c.v ? '#D42B2B' : '#EDE0D0'}`, borderRadius: 20 }}>{c.l}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container" style={{ padding: '48px 24px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#8B6A4A' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🌶️</div>
              <p>No products found. Try a different search.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 28 }}>
              {filtered.map(p => (
                <div key={p._id} className="card">
                  <div style={{ background: 'linear-gradient(135deg,#FFF8EE,#FFE8B0)', padding: '40px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 190, position: 'relative' }}>
                    <div style={{ fontSize: 88 }}>{ICONS[p.category] || '🌿'}</div>
                    {p.isFeatured && <span className="badge badge-red" style={{ position: 'absolute', top: 14, left: 14 }}>⭐ Featured</span>}
                    <span className="badge badge-yellow" style={{ position: 'absolute', top: 14, right: 14 }}>{CATS.find(c => c.v === p.category)?.l || p.category}</span>
                  </div>
                  <div style={{ padding: 24 }}>
                    <div style={{ fontFamily: 'Tiro Devanagari Hindi, serif', color: '#C9960C', fontSize: 13, marginBottom: 4 }}>{p.nameHindi}</div>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{p.name}</h3>
                    <p style={{ fontSize: 14, color: '#8B6A4A', lineHeight: 1.7, marginBottom: 14 }}>{p.description}</p>

                    {/* Features */}
                    {p.features?.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                        {p.features.map(f => <span key={f} className="badge badge-gray" style={{ fontSize: 11 }}>{f}</span>)}
                      </div>
                    )}

                    {/* Variants */}
                    <div style={{ background: '#FFF8EE', borderRadius: 10, padding: '10px 14px', marginBottom: 18 }}>
                      {p.variants?.map(v => (
                        <div key={v.weight} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 13, color: '#8B6A4A' }}>{v.weight}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#D42B2B' }}>₹{v.price}</span>
                        </div>
                      ))}
                    </div>

                    <button onClick={() => openEnquiry(p)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      Enquire Now →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* Enquiry Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setModal(null)}>
          <div style={{ background: 'white', borderRadius: 24, padding: 36, width: '100%', maxWidth: 480, maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700 }}>Enquire: {modal.name}</h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#8B6A4A' }}>✕</button>
            </div>
            <form onSubmit={submitEnquiry}>
              <div className="form-group"><label className="form-label">Name *</label><input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" /></div>
              <div className="form-group"><label className="form-label">Phone *</label><input className="form-control" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 98765 43210" /></div>
              <div className="form-group"><label className="form-label">Message</label><textarea className="form-control" rows={3} value={form.message} onChange={e => setForm({...form, message: e.target.value})} /></div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>{submitting ? 'Sending...' : 'Send Enquiry'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
