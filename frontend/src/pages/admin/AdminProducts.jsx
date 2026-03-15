import { useState, useEffect } from 'react'
import api from '../../api'
import toast from 'react-hot-toast'

const empty = { name:'', nameHindi:'', category:'whole-spice', description:'', origin:'Unjha, Gujarat', isFeatured:false, isActive:true, variants:[{weight:'1kg',price:'',mrp:'',stock:'',sku:''}], features:['Machine Cleaned','Premium Quality'] }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  const load = () => api.get('/products/admin/all').then(r => setProducts(r.data.data || [])).catch(()=>{}).finally(()=>setLoading(false))
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(empty); setModal('add') }
  const openEdit = (p) => { setForm(p); setModal('edit') }

  const handleSave = async () => {
    if (!form.name || !form.description) return toast.error('Name & description required!')
    setSaving(true)
    try {
      if (modal === 'add') await api.post('/products', form)
      else await api.put(`/products/${form._id}`, form)
      toast.success(modal === 'add' ? 'Product added!' : 'Product updated!')
      setModal(null); load()
    } catch(err) { toast.error(err.response?.data?.message || 'Failed') } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try { await api.delete(`/products/${id}`); toast.success('Product deleted'); load() }
    catch { toast.error('Delete failed') }
  }

  const updateVariant = (i, field, val) => {
    const vars = [...(form.variants||[])]
    vars[i] = { ...vars[i], [field]: val }
    setForm({...form, variants: vars})
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
        <div><h2 style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:900 }}>Products</h2><p style={{ color:'#8B6A4A', fontSize:14 }}>Manage your spice product catalogue</p></div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      {loading ? <div style={{ textAlign:'center', padding:60, color:'#8B6A4A' }}>Loading products...</div> : (
        <div style={{ background:'white', borderRadius:18, boxShadow:'0 2px 16px rgba(0,0,0,0.06)', overflow:'hidden' }}>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Product</th><th>Category</th><th>Variants</th><th>Featured</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ fontWeight:700 }}>{p.name}</div>
                      {p.nameHindi && <div style={{ fontFamily:'Tiro Devanagari Hindi,serif', fontSize:12, color:'#C9960C' }}>{p.nameHindi}</div>}
                    </td>
                    <td><span className="badge badge-yellow">{p.category}</span></td>
                    <td>
                      {p.variants?.map(v => <div key={v.weight} style={{ fontSize:12, color:'#8B6A4A' }}>{v.weight}: <strong style={{ color:'#D42B2B' }}>₹{v.price}</strong></div>)}
                    </td>
                    <td>{p.isFeatured ? <span className="badge badge-red">⭐ Yes</span> : <span className="badge badge-gray">No</span>}</td>
                    <td><span className={`badge ${p.isActive?'badge-green':'badge-gray'}`}>{p.isActive?'Active':'Inactive'}</span></td>
                    <td>
                      <button className="btn btn-sm btn-outline" style={{ marginRight:8 }} onClick={()=>openEdit(p)}>Edit</button>
                      <button className="btn btn-sm" style={{ background:'#FEE2E2', color:'#D42B2B', border:'none', borderRadius:20 }} onClick={()=>handleDelete(p._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={()=>setModal(null)}>
          <div style={{ background:'white', borderRadius:24, padding:40, width:'100%', maxWidth:600, maxHeight:'90vh', overflow:'auto' }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:24, fontWeight:700 }}>{modal==='add'?'Add Product':'Edit Product'}</h3>
              <button onClick={()=>setModal(null)} style={{ background:'none', border:'none', fontSize:24, cursor:'pointer', color:'#8B6A4A' }}>✕</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div className="form-group" style={{ gridColumn:'1/-1' }}><label className="form-label">Product Name *</label><input className="form-control" value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Jeera" /></div>
              <div className="form-group"><label className="form-label">Hindi Name</label><input className="form-control" value={form.nameHindi||''} onChange={e=>setForm({...form,nameHindi:e.target.value})} placeholder="जीरा" /></div>
              <div className="form-group"><label className="form-label">Category</label>
                <select className="form-control" value={form.category||'whole-spice'} onChange={e=>setForm({...form,category:e.target.value})}>
                  <option value="whole-spice">Whole Spice</option><option value="powder">Powder</option><option value="blend">Blend</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn:'1/-1' }}><label className="form-label">Description *</label><textarea className="form-control" rows={3} value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})} /></div>
            </div>
            <div style={{ marginBottom:16 }}>
              <label className="form-label">Variants</label>
              {(form.variants||[]).map((v,i) => (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:10, marginBottom:10, padding:14, background:'#FFF8EE', borderRadius:12 }}>
                  <div><label className="form-label" style={{ fontSize:11 }}>Weight</label><input className="form-control" value={v.weight||''} onChange={e=>updateVariant(i,'weight',e.target.value)} placeholder="1kg" /></div>
                  <div><label className="form-label" style={{ fontSize:11 }}>Price ₹</label><input className="form-control" type="number" value={v.price||''} onChange={e=>updateVariant(i,'price',e.target.value)} placeholder="250" /></div>
                  <div><label className="form-label" style={{ fontSize:11 }}>MRP ₹</label><input className="form-control" type="number" value={v.mrp||''} onChange={e=>updateVariant(i,'mrp',e.target.value)} placeholder="280" /></div>
                  <div><label className="form-label" style={{ fontSize:11 }}>Stock</label><input className="form-control" type="number" value={v.stock||''} onChange={e=>updateVariant(i,'stock',e.target.value)} placeholder="100" /></div>
                </div>
              ))}
              <button className="btn btn-sm btn-outline" onClick={()=>setForm({...form,variants:[...(form.variants||[]),{weight:'',price:'',mrp:'',stock:'',sku:''}]})}>+ Add Variant</button>
            </div>
            <div style={{ display:'flex', gap:16, alignItems:'center', marginBottom:20 }}>
              <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                <input type="checkbox" checked={form.isFeatured||false} onChange={e=>setForm({...form,isFeatured:e.target.checked})} style={{ width:16, height:16 }} />
                <span style={{ fontSize:14, fontWeight:600 }}>Featured Product</span>
              </label>
              <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                <input type="checkbox" checked={form.isActive!==false} onChange={e=>setForm({...form,isActive:e.target.checked})} style={{ width:16, height:16 }} />
                <span style={{ fontSize:14, fontWeight:600 }}>Active</span>
              </label>
            </div>
            <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:14 }} onClick={handleSave} disabled={saving}>{saving?'Saving...':modal==='add'?'Add Product':'Save Changes'}</button>
          </div>
        </div>
      )}
    </div>
  )
}
