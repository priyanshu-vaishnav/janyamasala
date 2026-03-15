import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import api from '../../api'
import toast from 'react-hot-toast'

export default function RetailerPage() {
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', company:'', city:'', state:'' })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.email || !form.password) return toast.error('All fields required!')
    setSubmitting(true)
    try {
      await api.post('/auth/register-retailer', form)
      setDone(true)
      toast.success('Registration successful! Admin will approve soon.')
    } catch(err) { toast.error(err.response?.data?.message || 'Registration failed.') } finally { setSubmitting(false) }
  }

  return (
    <div><Navbar />
    <div style={{ paddingTop:70 }}>
      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg,#1A0A00,#D42B2B)', padding:'70px 24px', textAlign:'center' }}>
        <span className="section-label" style={{ color:'#F5C518' }}>For Retailers</span>
        <h1 className="section-title" style={{ color:'white', marginBottom:16 }}>Partner With <span style={{ color:'#F5C518' }}>Janya Masala</span></h1>
        <p style={{ color:'rgba(255,255,255,0.75)', maxWidth:560, margin:'0 auto', fontSize:17, lineHeight:1.85 }}>Join our growing retailer network. Enjoy exclusive margins, consistent supply and trusted brand value.</p>
      </div>

      {/* Benefits */}
      <section style={{ padding:'70px 24px', background:'#FFF8EE' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:50 }}>
            <span className="section-label">Benefits</span>
            <h2 className="section-title">Why Partner <span>With Us?</span></h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:24 }}>
            {[
              { icon:'💸', title:'Extra Margin', desc:'Higher margins than market standard. More profit per pack for you.' },
              { icon:'📦', title:'Reliable Supply', desc:'Consistent stock availability. Limited stock — act fast to secure your supply.' },
              { icon:'🏷️', title:'Trusted Brand', desc:'Janya Masala — Unjha\'s famous. Easy sell because customers already trust the name.' },
              { icon:'🤝', title:'Dedicated Support', desc:'Direct contact with our team for fast resolution of any issues.' },
            ].map(c => (
              <div key={c.title} style={{ background:'white', borderRadius:20, padding:32, boxShadow:'0 4px 20px rgba(0,0,0,0.06)', textAlign:'center', transition:'transform 0.3s' }}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-6px)'}
                onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                <div style={{ fontSize:48, marginBottom:16 }}>{c.icon}</div>
                <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:20, fontWeight:700, marginBottom:10 }}>{c.title}</h3>
                <p style={{ color:'#8B6A4A', fontSize:14, lineHeight:1.7 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Register + Login */}
      <section style={{ padding:'70px 24px' }}>
        <div className="container" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, maxWidth:1000, alignItems:'start' }}>
          {/* Register */}
          <div>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:32, fontWeight:900, marginBottom:8 }}>Register as <span style={{ color:'#D42B2B' }}>Retailer</span></h2>
            <p style={{ color:'#8B6A4A', marginBottom:28 }}>Fill the form and our team will approve your account within 24 hours.</p>
            {done ? (
              <div style={{ background:'#DCFCE7', border:'2px solid #22C55E', borderRadius:16, padding:32, textAlign:'center' }}>
                <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
                <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:22, marginBottom:8 }}>Registration Successful!</h3>
                <p style={{ color:'#166534' }}>Our team will review and approve your account within 24 hours. We'll contact you on your phone.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ background:'white', borderRadius:20, padding:36, boxShadow:'0 6px 30px rgba(0,0,0,0.08)' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <div className="form-group"><label className="form-label">Full Name *</label><input className="form-control" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" /></div>
                  <div className="form-group"><label className="form-label">Phone *</label><input className="form-control" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+91..." /></div>
                  <div className="form-group"><label className="form-label">Email *</label><input className="form-control" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="email@example.com" /></div>
                  <div className="form-group"><label className="form-label">Password *</label><input className="form-control" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Min 6 chars" /></div>
                  <div className="form-group"><label className="form-label">Shop/Company Name</label><input className="form-control" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} placeholder="Your shop name" /></div>
                  <div className="form-group"><label className="form-label">City</label><input className="form-control" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} placeholder="City" /></div>
                </div>
                <div className="form-group"><label className="form-label">State</label><input className="form-control" value={form.state} onChange={e=>setForm({...form,state:e.target.value})} placeholder="State" /></div>
                <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:14 }} disabled={submitting}>{submitting?'Registering...':'Register Now →'}</button>
              </form>
            )}
          </div>
          {/* Info + Login */}
          <div>
            <div style={{ background:'linear-gradient(135deg,#1A0A00,#3D1A00)', borderRadius:20, padding:36, color:'white', marginBottom:24 }}>
              <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:22, color:'#F5C518', marginBottom:16 }}>Already a Retailer?</h3>
              <p style={{ color:'rgba(255,255,255,0.7)', marginBottom:24, fontSize:14 }}>Login to your portal to place orders, track deliveries and manage your account.</p>
              <Link to="/retailer/login"><button className="btn btn-yellow" style={{ width:'100%', justifyContent:'center' }}>Login to Portal →</button></Link>
            </div>
            <div style={{ background:'white', borderRadius:20, padding:36, boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:20, marginBottom:16 }}>Contact Directly</h3>
              <a href="https://wa.me/919328454346?text=Hi, I want to become a Janya Masala retailer" target="_blank" rel="noreferrer">
                <button className="btn" style={{ width:'100%', justifyContent:'center', background:'#25D366', color:'white', border:'none', marginBottom:12 }}>💬 WhatsApp Us</button>
              </a>
              <a href="tel:+919328454346"><button className="btn btn-outline" style={{ width:'100%', justifyContent:'center' }}>📞 Call Now</button></a>
              <p style={{ color:'#8B6A4A', fontSize:13, textAlign:'center', marginTop:16 }}>+91 93284 54346 | janyamasala@gmail.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    <Footer /></div>
  )
}
