import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}! 🙏`);
      navigate(user.role === 'admin' ? '/admin' : '/retailer');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark-red) 60%, var(--red) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      {/* BG dots */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, #F5C518 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-block', background: 'white', border: '3px solid var(--yellow)', borderRadius: 14, padding: '8px 24px', marginBottom: 12 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900, color: 'var(--red)' }}>Janya</div>
            <div style={{ fontSize: 11, color: 'var(--dark-gold)', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>masala™</div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-hindi)', fontSize: 16 }}>स्वाद मिट्टी का, भरोसा सदियों का।</div>
        </div>

        {/* Card */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '44px 40px', boxShadow: '0 30px 80px rgba(0,0,0,0.4)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, marginBottom: 6, textAlign: 'center' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', marginBottom: 32 }}>Sign in to your account</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="janyamasala@gmail.com"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} autoComplete="email" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Enter your password"
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} autoComplete="current-password" />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <div style={{ marginTop: 24, padding: '16px', background: 'var(--light-cream)', borderRadius: 10, fontSize: 12, color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text)' }}>Demo Credentials:</strong><br />
            Admin: janyamasala@gmail.com / admin123
          </div>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>New retailer? </span>
            <Link to="/retailer-register" style={{ color: 'var(--red)', fontWeight: 700, fontSize: 14 }}>Register here →</Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>← Back to Website</Link>
        </div>
      </div>
    </div>
  );
}
