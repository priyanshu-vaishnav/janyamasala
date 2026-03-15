import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function RetailerLogin() {
  const [form, setForm] = useState({ email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      if (user.role !== 'retailer') { toast.error('Retailer account only'); return }
      if (!user.isApproved) { toast.error('Your account is pending admin approval'); return }
      toast.success('Welcome! 🌶️')
      navigate('/retailer')
    } catch(err) { toast.error(err.response?.data?.message || 'Login failed') } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#1A0A00,#3D1A00,#D42B2B)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ width:'100%', maxWidth:440 }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ display:'inline-block', background:'#F5C518', border:'4px solid #C9960C', borderRadius:16, padding:'8px 28px', fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:900, color:'#D42B2B', marginBottom:12 }}>Janya</div>
          <div style={{ color:'rgba(255,255,255,0.8)', fontSize:14, letterSpacing:2 }}>RETAILER PORTAL</div>
        </div>
        <div style={{ background:'white', borderRadius:24, padding:40, boxShadow:'0 30px 80px rgba(0,0,0,0.4)' }}>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:900, marginBottom:8 }}>Retailer Login</h2>
          <p style={{ color:'#8B6A4A', marginBottom:28, fontSize:14 }}>Access your retailer dashboard</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Email</label><input className="form-control" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com" /></div>
            <div className="form-group"><label className="form-label">Password</label><input className="form-control" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Your password" /></div>
            <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:14 }} disabled={loading}>{loading?'Logging in...':'Login →'}</button>
          </form>
          <div style={{ textAlign:'center', marginTop:20, fontSize:14, color:'#8B6A4A' }}>
            New retailer? <Link to="/retailers" style={{ color:'#D42B2B', fontWeight:700 }}>Register here →</Link>
          </div>
          <div style={{ textAlign:'center', marginTop:12 }}>
            <Link to="/" style={{ color:'#8B6A4A', fontSize:13 }}>← Back to Website</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
