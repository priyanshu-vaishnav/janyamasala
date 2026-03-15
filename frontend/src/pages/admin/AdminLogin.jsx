import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [form, setForm] = useState({ email:'janyamasala@gmail.com', password:'admin123' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      if (user.role !== 'admin') { toast.error('Admin access only'); return }
      toast.success('Welcome back! 🌶️')
      navigate('/admin')
    } catch(err) { toast.error(err.response?.data?.message || 'Login failed') } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#1A0A00,#3D1A00,#D42B2B)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ width:'100%', maxWidth:440 }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ display:'inline-block', background:'#F5C518', border:'4px solid #C9960C', borderRadius:16, padding:'8px 28px', fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:900, color:'#D42B2B', marginBottom:12 }}>Janya</div>
          <div style={{ color:'rgba(255,255,255,0.8)', fontSize:14, letterSpacing:2 }}>ADMIN PANEL</div>
        </div>
        <div style={{ background:'white', borderRadius:24, padding:40, boxShadow:'0 30px 80px rgba(0,0,0,0.4)' }}>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:900, marginBottom:8 }}>Admin Login</h2>
          <p style={{ color:'#8B6A4A', marginBottom:28, fontSize:14 }}>Enter your credentials to access the dashboard</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Email</label><input className="form-control" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Password</label><input className="form-control" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /></div>
            <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:14, marginTop:8 }} disabled={loading}>{loading?'Logging in...':'Login to Dashboard →'}</button>
          </form>
          <div style={{ textAlign:'center', marginTop:20 }}>
            <Link to="/" style={{ color:'#8B6A4A', fontSize:13 }}>← Back to Website</Link>
          </div>
        </div>
        <p style={{ textAlign:'center', color:'rgba(255,255,255,0.4)', fontSize:12, marginTop:20 }}>Default: janyamasala@gmail.com / admin123</p>
      </div>
    </div>
  )
}
