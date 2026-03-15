import { useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import api from '../../api'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', phone:'', email:'', city:'', type:'general', message:'' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) return toast.error('Name & phone required!')
    setSubmitting(true)
    try {
      await api.post('/inquiries', form)
      toast.success('Enquiry sent! We will contact you soon 🙏')
      setForm({ name:'', phone:'', email:'', city:'', type:'general', message:'' })
    } catch { toast.error('Something went wrong.') } finally { setSubmitting(false) }
  }

  return (
    <div><Navbar />
    <div style={{ paddingTop:70 }}>
      <div style={{ background:'linear-gradient(135deg,#1A0A00,#D42B2B)', padding:'60px 24px', textAlign:'center' }}>
        <span className="section-label" style={{ color:'#F5C518' }}>Contact</span>
        <h1 className="section-title" style={{ color:'white' }}>Get In <span style={{ color:'#F5C518' }}>Touch</span></h1>
      </div>
      <div className="container" style={{ padding:'70px 24px', display:'grid', gridTemplateColumns:'1fr 1.3fr', gap:60, alignItems:'start', maxWidth:1050 }}>
        <div>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:34, fontWeight:900, marginBottom:16 }}>Contact <span style={{ color:'#D42B2B' }}>Janya Masala</span></h2>
          <p style={{ color:'#8B6A4A', lineHeight:1.85, marginBottom:32 }}>For enquiries, retailer partnerships or bulk orders — reach out directly!</p>
          {[['📍','Location','Unjha, Gujarat'],['📞','Phone','+91 93284 54346'],['✉️','Email','janyamasala@gmail.com']].map(([ic,lbl,val]) => (
            <div key={lbl} style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16, padding:'18px 20px', background:'white', borderRadius:14, boxShadow:'0 2px 14px rgba(0,0,0,0.06)', borderLeft:'4px solid #D42B2B' }}>
              <span style={{ fontSize:24 }}>{ic}</span>
              <div><div style={{ fontSize:12, color:'#8B6A4A', fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>{lbl}</div><div style={{ fontWeight:600 }}>{val}</div></div>
            </div>
          ))}
          <a href="https://wa.me/919328454346" target="_blank" rel="noreferrer"><button className="btn" style={{ marginTop:16, background:'#25D366', color:'white', border:'none', borderRadius:30 }}>💬 WhatsApp Us</button></a>
        </div>
        <form onSubmit={handleSubmit} style={{ background:'white', borderRadius:24, padding:40, boxShadow:'0 10px 50px rgba(0,0,0,0.09)' }}>
          <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:26, fontWeight:700, marginBottom:24 }}>Send Enquiry</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div className="form-group"><label className="form-label">Name *</label><input className="form-control" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" /></div>
            <div className="form-group"><label className="form-label">Phone *</label><input className="form-control" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+91..." /></div>
          </div>
          <div className="form-group"><label className="form-label">Enquiry Type</label>
            <select className="form-control" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
              <option value="general">General</option><option value="product">Product</option><option value="retailer">Retailer</option><option value="bulk">Bulk Order</option>
            </select>
          </div>
          <div className="form-group"><label className="form-label">Message</label><textarea className="form-control" rows={4} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Your message..." /></div>
          <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:14 }} disabled={submitting}>{submitting?'Sending...':'Send Enquiry →'}</button>
        </form>
      </div>
    </div>
    <Footer /></div>
  )
}
