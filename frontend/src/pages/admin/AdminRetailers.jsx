import { useState, useEffect } from 'react'
import api from '../../api'
import toast from 'react-hot-toast'

export default function AdminRetailers() {
  const [retailers, setRetailers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const load = () => api.get('/retailers').then(r=>setRetailers(r.data.data||[])).catch(()=>{}).finally(()=>setLoading(false))
  useEffect(()=>{ load() },[])

  const toggleApprove = async (id, val) => {
    try { await api.patch(`/retailers/${id}`,{isApproved:val}); toast.success(val?'Retailer approved!':'Approval revoked'); load() }
    catch { toast.error('Failed') }
  }

  const toggleActive = async (id, val) => {
    try { await api.patch(`/retailers/${id}`,{isActive:val}); toast.success(val?'Account activated':'Account disabled'); load() }
    catch { toast.error('Failed') }
  }

  const filtered = retailers.filter(r => filter==='all' ? true : filter==='pending' ? !r.isApproved : r.isApproved)

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:900 }}>Retailers</h2>
          <p style={{ color:'#8B6A4A', fontSize:14 }}>Manage retailer accounts and approvals</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          {[['all','All'],['pending','Pending Approval'],['approved','Approved']].map(([v,l])=>(
            <button key={v} onClick={()=>setFilter(v)} className="btn btn-sm" style={{ background:filter===v?'#D42B2B':'transparent', color:filter===v?'white':'#8B6A4A', border:`2px solid ${filter===v?'#D42B2B':'#EDE0D0'}`, borderRadius:20 }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
        {[
          { label:'Total Retailers', val:retailers.length, color:'#3B82F6' },
          { label:'Pending Approval', val:retailers.filter(r=>!r.isApproved).length, color:'#F59E0B' },
          { label:'Approved', val:retailers.filter(r=>r.isApproved).length, color:'#22C55E' },
        ].map(s=>(
          <div key={s.label} style={{ background:'white', borderRadius:14, padding:20, boxShadow:'0 2px 12px rgba(0,0,0,0.06)', borderLeft:`4px solid ${s.color}` }}>
            <div style={{ fontSize:13, color:'#8B6A4A', marginBottom:6 }}>{s.label}</div>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:900 }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div style={{ background:'white', borderRadius:18, boxShadow:'0 2px 16px rgba(0,0,0,0.06)', overflow:'hidden' }}>
        {loading ? <div style={{ textAlign:'center', padding:60, color:'#8B6A4A' }}>Loading...</div> :
        filtered.length===0 ? <div style={{ textAlign:'center', padding:60, color:'#8B6A4A' }}><div style={{ fontSize:48, marginBottom:12 }}>🤝</div><p>No retailers found.</p></div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Contact</th><th>Shop/Company</th><th>Location</th><th>Approved</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(r=>(
                  <tr key={r._id}>
                    <td style={{ fontWeight:700 }}>{r.name}</td>
                    <td>
                      <a href={`tel:${r.phone}`} style={{ color:'#D42B2B', fontWeight:600, display:'block' }}>{r.phone}</a>
                      <a href={`mailto:${r.email}`} style={{ color:'#8B6A4A', fontSize:12 }}>{r.email}</a>
                    </td>
                    <td>{r.company||'—'}</td>
                    <td style={{ fontSize:13, color:'#8B6A4A' }}>{[r.city,r.state].filter(Boolean).join(', ')||'—'}</td>
                    <td>{r.isApproved?<span className="badge badge-green">✓ Approved</span>:<span className="badge badge-yellow">Pending</span>}</td>
                    <td>{r.isActive?<span className="badge badge-green">Active</span>:<span className="badge badge-gray">Disabled</span>}</td>
                    <td style={{ color:'#8B6A4A', fontSize:13 }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      {!r.isApproved
                        ? <button className="btn btn-sm" style={{ background:'#DCFCE7', color:'#166534', border:'none', borderRadius:20 }} onClick={()=>toggleApprove(r._id,true)}>Approve</button>
                        : <button className="btn btn-sm" style={{ background:'#FEF3C7', color:'#92400E', border:'none', borderRadius:20 }} onClick={()=>toggleApprove(r._id,false)}>Revoke</button>
                      }
                      <button className="btn btn-sm" style={{ background:r.isActive?'#FEE2E2':'#DCFCE7', color:r.isActive?'#D42B2B':'#166534', border:'none', borderRadius:20 }} onClick={()=>toggleActive(r._id,!r.isActive)}>{r.isActive?'Disable':'Enable'}</button>
                      <a href={`https://wa.me/${(r.phone||'').replace(/\D/g,'')}`} target="_blank" rel="noreferrer">
                        <button className="btn btn-sm" style={{ background:'#25D366', color:'white', border:'none', borderRadius:20 }}>💬</button>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
