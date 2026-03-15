import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

export default function RetailerRegister() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', company: '', city: '', state: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const f = (field) => ({ value: form[field], onChange: e => setForm(p => ({ ...p, [field]: e.target.value })) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.phone) return toast.error('Please fill required fields');
    setLoading(true);
    try {
      await authAPI.registerRetailer(form);
      setDone(true);
      toast.success('Registration successful! Admin will contact you soon. 🙏');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  if (done) return (
    <div>
      <Navbar />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px', background: 'var(--cream)' }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: 80, marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 900, marginBottom: 12 }}>Registration Successful!</h2>
          <p style={{ color: 'var(--text-light)', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
            Thank you for registering as a Janya Masala retailer. Our team will review your application and contact you within 24 hours.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://wa.me/919328454346" target="_blank" rel="noreferrer" className="btn btn-primary btn-lg">💬 WhatsApp Us Now</a>
            <Link to="/" className="btn btn-outline btn-lg">Back to Home</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 68 }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, var(--dark), var(--red))', padding: '60px 24px', textAlign: 'center' }}>
          <div className="section-eyebrow" style={{ color: 'var(--yellow)' }}>Partner With Us</div>
          <h1 className="section-title" style={{ color: 'white' }}>Become a <span>Retailer</span></h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
            Join our network of retailers and enjoy exclusive margins, reliable supply, and premium brand value.
          </p>
        </div>

        <section className="section-pad">
          <div className="container" style={{ maxWidth: 700 }}>
            {/* Benefits */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 48 }}>
              {[
                { icon: '💸', title: 'Extra Margin', desc: 'Higher profits for your business' },
                { icon: '📦', title: 'Reliable Supply', desc: 'Consistent stock availability' },
                { icon: '🏆', title: 'Premium Brand', desc: "Unjha's trusted name" },
              ].map(b => (
                <div key={b.title} style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '20px', textAlign: 'center', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{b.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{b.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{b.desc}</div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '44px', boxShadow: 'var(--shadow-md)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, marginBottom: 28 }}>Retailer Registration</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" placeholder="e.g. Ramesh Patel" {...f('name')} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input className="form-input" placeholder="+91 98765 43210" {...f('phone')} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input className="form-input" type="email" placeholder="your@email.com" {...f('email')} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input className="form-input" type="password" placeholder="Create a password (min 6 chars)" {...f('password')} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Shop / Company Name</label>
                  <input className="form-input" placeholder="e.g. Patel General Store" {...f('company')} />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input className="form-input" placeholder="e.g. Ahmedabad" {...f('city')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input className="form-input" placeholder="e.g. Gujarat" {...f('state')} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Registering…' : 'Register as Retailer →'}
                </button>
                <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 16 }}>
                  Already registered? <Link to="/login" style={{ color: 'var(--red)', fontWeight: 600 }}>Login here</Link>
                </p>
              </form>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
