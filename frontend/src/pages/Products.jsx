import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { productsAPI } from '../api';

const CATEGORIES = [
  { value: '', label: 'All Products' },
  { value: 'whole-spice', label: 'Whole Spices' },
  { value: 'powder', label: 'Powders' },
  { value: 'blend', label: 'Blends' },
];

const EMOJIS = { 'whole-spice': '🌿', 'powder': '🟡', 'blend': '🌶️' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    productsAPI.getAll({ category: category || undefined, search: search || undefined })
      .then(r => setProducts(r.data.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 68 }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, var(--dark), var(--dark-red))', padding: '60px 24px', textAlign: 'center' }}>
          <div className="section-eyebrow" style={{ color: 'var(--yellow)' }}>Our Collection</div>
          <h1 className="section-title" style={{ color: 'white' }}>Premium <span>Spice</span> Collection</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-hindi)', fontSize: 18 }}>स्वाद मिट्टी का, भरोसा सदियों का ।</p>
        </div>

        {/* Filters */}
        <div style={{ background: 'white', padding: '24px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 68, zIndex: 100, boxShadow: 'var(--shadow-sm)' }}>
          <div className="container" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <input className="form-input" style={{ flex: 1, minWidth: 200, maxWidth: 320 }}
              placeholder="🔍 Search spices..." value={search} onChange={e => setSearch(e.target.value)} />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORIES.map(c => (
                <button key={c.value} onClick={() => setCategory(c.value)}
                  className="btn btn-sm" style={{
                    background: category === c.value ? 'var(--red)' : 'var(--light-cream)',
                    color: category === c.value ? 'white' : 'var(--text)',
                    border: `1px solid ${category === c.value ? 'var(--red)' : 'var(--border)'}`
                  }}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <section className="section-pad">
          <div className="container">
            {loading ? (
              <div className="grid-3">
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'white' }}>
                    <div className="skeleton" style={{ height: 200 }} />
                    <div style={{ padding: 24 }}>
                      <div className="skeleton" style={{ height: 16, marginBottom: 12 }} />
                      <div className="skeleton" style={{ height: 12, width: '70%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 64 }}>🌶️</div>
                <h3 style={{ marginTop: 16 }}>No products found</h3>
                <p>Try a different search or category</p>
              </div>
            ) : (
              <div className="grid-3">
                {products.map(p => (
                  <Link to={`/products/${p.slug}`} key={p._id} className="card" style={{ display: 'block' }}>
                    <div style={{ background: 'linear-gradient(135deg, #FFF0D5, #FFE4B5)', padding: '40px 24px', textAlign: 'center', fontSize: 72, position: 'relative' }}>
                      {EMOJIS[p.category] || '🌿'}
                      {p.isFeatured && (
                        <span className="badge badge-yellow" style={{ position: 'absolute', top: 12, right: 12 }}>Featured ⭐</span>
                      )}
                    </div>
                    <div style={{ padding: 24 }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                        <span className="badge badge-red">{p.category}</span>
                        <span className="badge badge-gray">{p.origin}</span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 4 }}>{p.name}</h3>
                      {p.nameHindi && <p style={{ fontFamily: 'var(--font-hindi)', fontSize: 14, color: 'var(--text-muted)', marginBottom: 10 }}>{p.nameHindi}</p>}
                      <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 20, lineHeight: 1.7 }}>{p.description.slice(0, 100)}…</p>
                      {/* Variants */}
                      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
                        {p.variants.map(v => (
                          <span key={v.weight} style={{ background: 'var(--light-cream)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
                            {v.weight} — ₹{v.price}
                          </span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 900, color: 'var(--red)' }}>
                          ₹{p.variants[0]?.price}
                        </span>
                        <span className="btn btn-primary btn-sm">Details →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
