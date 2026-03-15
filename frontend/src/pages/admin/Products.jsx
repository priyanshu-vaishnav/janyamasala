import { useState, useEffect } from 'react';
import { productsAPI } from '../../api';
import toast from 'react-hot-toast';

const EMPTY = {
  name: '', nameHindi: '', category: 'whole-spice', description: '',
  origin: 'Unjha, Gujarat', isFeatured: false,
  variants: [{ weight: '1kg', price: 0, mrp: 0, stock: 0, sku: '' }],
  features: ['Machine Cleaned', 'Premium Quality', 'Hygienically Packed'],
  tags: []
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    productsAPI.getAllAdmin()
      .then(r => setProducts(r.data.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({ ...p, variants: p.variants || [{ weight: '', price: 0, mrp: 0, stock: 0, sku: '' }], features: p.features || [], tags: p.tags || [] });
    setEditing(p._id); setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description) return toast.error('Name and description required');
    setSaving(true);
    try {
      if (editing) { await productsAPI.update(editing, form); toast.success('Product updated!'); }
      else { await productsAPI.create(form); toast.success('Product created!'); }
      setShowForm(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving product'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await productsAPI.delete(id); toast.success('Product deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const updateVariant = (idx, field, val) => {
    const variants = [...form.variants];
    variants[idx] = { ...variants[idx], [field]: field === 'price' || field === 'mrp' || field === 'stock' ? Number(val) : val };
    setForm(p => ({ ...p, variants }));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900 }}>Products</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{products.length} products total</p>
        </div>
        <button onClick={openNew} className="btn btn-primary">+ Add Product</button>
      </div>

      {/* Products Table */}
      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        {loading ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead style={{ background: 'var(--light-cream)' }}>
              <tr>
                {['Product', 'Category', 'Variants & Price', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p._id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'white' : 'rgba(255,248,238,0.3)' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 700, marginBottom: 2 }}>{p.name}</div>
                    {p.nameHindi && <div style={{ fontFamily: 'var(--font-hindi)', fontSize: 12, color: 'var(--text-muted)' }}>{p.nameHindi}</div>}
                    {p.isFeatured && <span className="badge badge-yellow" style={{ marginTop: 4 }}>⭐ Featured</span>}
                  </td>
                  <td style={{ padding: '16px 20px' }}><span className="badge badge-red">{p.category}</span></td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {p.variants?.map(v => (
                        <span key={v.weight} style={{ background: 'var(--light-cream)', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 8px', fontSize: 12, fontWeight: 600 }}>
                          {v.weight} – ₹{v.price}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span className={`badge ${p.isActive ? 'badge-green' : 'badge-gray'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEdit(p)} className="btn btn-sm btn-outline">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="btn btn-sm" style={{ background: 'rgba(212,43,43,0.1)', color: 'var(--red)', border: '1px solid rgba(212,43,43,0.2)' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '36px', width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 900 }}>{editing ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--text-muted)' }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Jeera" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Hindi Name</label>
                  <input className="form-input" value={form.nameHindi} onChange={e => setForm(p => ({ ...p, nameHindi: e.target.value }))} placeholder="e.g. जीरा" />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                    <option value="whole-spice">Whole Spice</option>
                    <option value="powder">Powder</option>
                    <option value="blend">Blend</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Origin</label>
                  <input className="form-input" value={form.origin} onChange={e => setForm(p => ({ ...p, origin: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-textarea" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Product description..." required />
              </div>
              <div className="form-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e => setForm(p => ({ ...p, isFeatured: e.target.checked }))} />
                  <label htmlFor="featured" style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--text)' }}>Featured Product ⭐</label>
                </div>
              </div>

              {/* Variants */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Variants</label>
                  <button type="button" className="btn btn-sm btn-outline"
                    onClick={() => setForm(p => ({ ...p, variants: [...p.variants, { weight: '', price: 0, mrp: 0, stock: 0, sku: '' }] }))}>
                    + Add Variant
                  </button>
                </div>
                {form.variants.map((v, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr auto', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                    <input className="form-input" placeholder="Weight (e.g. 1kg)" value={v.weight} onChange={e => updateVariant(idx, 'weight', e.target.value)} style={{ padding: '9px 12px' }} />
                    <input className="form-input" type="number" placeholder="Price ₹" value={v.price} onChange={e => updateVariant(idx, 'price', e.target.value)} style={{ padding: '9px 12px' }} />
                    <input className="form-input" type="number" placeholder="MRP ₹" value={v.mrp} onChange={e => updateVariant(idx, 'mrp', e.target.value)} style={{ padding: '9px 12px' }} />
                    <input className="form-input" type="number" placeholder="Stock" value={v.stock} onChange={e => updateVariant(idx, 'stock', e.target.value)} style={{ padding: '9px 12px' }} />
                    {form.variants.length > 1 && (
                      <button type="button" onClick={() => setForm(p => ({ ...p, variants: p.variants.filter((_, i) => i !== idx) }))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', fontSize: 20, padding: '4px' }}>×</button>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : (editing ? 'Update Product' : 'Create Product')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
