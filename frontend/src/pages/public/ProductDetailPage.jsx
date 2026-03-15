import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import api from '../../api'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [form, setForm] = useState({ name:'', phone:'', type:'product', message:'' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get(`/products/${slug}`).then(r => {
      setProduct(r.data.data)
      setForm(f => ({ ...f, message: `I am interested in ${r.data.data.name}.` }))
    }).catch(() => {})
  }, [slug])

  const handleEnquiry = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) return toast.error('Name & phone required!')
    setSubmitting(true)
    try {
      await api.post('/inquiries', { ...form, product: product._id })
      toast.success('Enquiry sent! 🙏')
      setForm({ name:'', phone:'', type:'product', message:'' })
    } catch { toast.error('Failed. Try again.') } finally { setSubmitting(false) }
  }

  if (!product) return (
    <div><Navbar /><div style={{ paddingTop:70, minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}><div style={{ fontSize:64 }}>🌶️</div><p style={{ color:'#8B6A4A', marginTop:16 }}>Loading product...</p></div>
    </div><Footer /></div>
  )

  return (
    <div><Navbar />
    <div style={{ paddingTop:70 }}>
      <div style={{ background:'linear-gradient(135deg,#1A0A00,#D42B2B)', padding:'40px 24px' }}>
        <div className="container">
          <div style={{ color:'rgba(255,255,255,0.6)', fontSize:13 }}><Link to="/" style={{ color:'rgba(255,255,255,0.6)' }}>Home</Link> / <Link to="/products" style={{ color:'rgba(255,255,255,0.6)' }}>Products</Link> / <span style={{ color:'#F5C518' }}>{product.name}</span></div>
        </div>
      </div>
      <div className="container" style={{ padding:'60px 24px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'start' }}>
        {/* Image/Visual */}
        <div style={{ background:'linear-gradient(135deg,#FFF8EE,#FFE8B0)', borderRadius:24, padding:60, display:'flex', alignItems:'center', justifyContent:'center', minHeight:380, position:'relative' }}>
          <div style={{ fontSize:160 }}>{product.category === 'whole-spice' ? '🌿' : product.name.toLowerCase().includes('haldi') ? '🟡' : '🌶️'}</div>
          {product.isFeatured && <span className="badge badge-red" style={{ position:'absolute', top:20, left:20, fontSize:13 }}>⭐ Featured</span>}
        </div>
        {/* Info */}
        <div>
          <div style={{ fontFamily:'Tiro Devanagari Hindi,serif', color:'#C9960C', fontSize:16, marginBottom:6 }}>{product.nameHindi}</div>
          <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:40, fontWeight:900, marginBottom:10 }}>{product.name}</h1>
          <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
            {product.features?.map(f => <span key={f} className="badge badge-gray">{f}</span>)}
          </div>
          <p style={{ color:'#8B6A4A', lineHeight:1.85, fontSize:16, marginBottom:28 }}>{product.description}</p>
          <div style={{ background:'#FFF8EE', borderRadius:16, padding:20, marginBottom:28 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#8B6A4A', textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>Choose Size</div>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              {product.variants?.map((v,i) => (
                <button key={i} onClick={() => setSelectedVariant(i)} style={{ padding:'10px 20px', borderRadius:12, border:`2px solid ${selectedVariant===i?'#D42B2B':'#EDE0D0'}`, background: selectedVariant===i?'#FEE2E2':'white', cursor:'pointer', fontWeight:700 }}>
                  <div style={{ fontSize:13, color:'#8B6A4A' }}>{v.weight}</div>
                  <div style={{ fontSize:18, color:'#D42B2B' }}>₹{v.price}</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', gap:16 }}>
            <a href={`https://wa.me/919328454346?text=Hi, I want to enquire about ${product.name} - ${product.variants?.[selectedVariant]?.weight}`} target="_blank" rel="noreferrer">
              <button className="btn" style={{ background:'#25D366', color:'white', border:'none', borderRadius:30 }}>💬 WhatsApp Order</button>
            </a>
            <Link to="/contact"><button className="btn btn-outline">📩 Send Enquiry</button></Link>
          </div>
          <div style={{ marginTop:28, padding:'16px 20px', background:'#FFF0D5', borderRadius:12, display:'flex', gap:10, alignItems:'center' }}>
            <span style={{ fontSize:20 }}>📍</span>
            <span style={{ fontSize:14, color:'#8B6A4A' }}>Origin: <strong>{product.origin || 'Unjha, Gujarat'}</strong></span>
          </div>
        </div>
      </div>
    </div>
    <Footer /></div>
  )
}
