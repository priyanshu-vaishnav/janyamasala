import { useState, useEffect } from 'react'
import api from '../../api'
import toast from 'react-hot-toast'

const STATUS_COLORS = { new:'badge-blue', contacted:'badge-yellow', converted:'badge-green', closed:'badge-gray' }
const TYPES = [{ v:'', l:'All' },{ v:'new', l:'New' },{ v:'contacted', l:'Contacted' },{ v:'converted', l:'Converted' },{ v:'closed', l:'Closed' }]

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState(null)

  const load = () => {
    const q = filter ? `?status=${filter}` : ''
    api.get(`/inquiries${q}`).then(r=>setInquiries(r.data.data||[])).catch(()=>{}).finally(()=>setLoading(false))
  }
  useEffect(()=>{ load() },[filter])

  const updateStatus = async (id, status) => {
    try { await api.patch(`/inquiries/${id}`,{status}); toast.success('Status updated'); load() }
    catch { toast.error('Failed') }
  }

  const deleteInquiry = async (id) => {
    if (!confirm('Delete this inquiry?')) return
    try { await api.delete(`/inquiries/${id}`); toast.success('Deleted'); load() }
    catch { toast.error('Failed') }
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div><h2 style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:900 }}>Inquiries</h2><p style={{ color:'#8B6A4A', fontSize:14 }}>Manage customer and retailer enquiries</p></div>
        <div style={{ display:'flex', gap:10 }}>
          {TYPES.map(t=>(
            <button key={t.v} onClick={()=>setFilter(t.v)} className="btn btn-sm" style={{ background:filter===t.v?'#D42B2B':'transparent', color:filter===t.v?'white':'#8B6A4A', border:`2px solid ${filter===t.v?'#D42B2B':'#EDE0D0'}`, borderRadius:20 }}>{t.l}</button>
          ))}
        </div>
      </div>

      <div style={{ background:'white', borderRadius:18, boxShadow:'0 2px 16px rgba(0,0,0,0.06)', overflow:'hidden' }}>
        {loading ? <div style={{ textAlign:'center', padding:60, color:'#8B6A4A' }}>Loading...</div> :
        inquiries.length === 0 ? <div style={{ textAlign:'center', padding:60, color:'#8B6A4A' }}><div style={{ fontSize:48, marginBottom:12 }}>📩</div><p>No inquiries found.</p></div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Phone</th><th>Type</th><th>Message</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {inquiries.map(inq=>(
                  <tr key={inq._id}>
                    <td style={{ fontWeight:700 }}>{inq.name}</td>
                    <td>
                      <a href={`tel:${inq.phone}`} style={{ color:'#D42B2B', fontWeight:600 }}>{inq.phone}</a>
                      <br/>
                      <a href={`https://wa.me/${inq.phone.replace(/\D/g,'')}?text=Hi ${inq.name}, regarding your Janya Masala inquiry...`} target="_blank" rel="noreferrer" style={{ fontSize:12, color:'#25D366', fontWeight:600 }}>💬 WhatsApp</a>
                    </td>
                    <td><span className="badge badge-yellow">{inq.type}</span></td>
                    <td style={{ maxWidth:200, fontSize:13, color:'#8B6A4A', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{inq.message}</td>
                    <td>
                      <select value={inq.status} onChange={e=>updateStatus(inq._id,e.target.value)} style={{ padding:'6px 12px', borderRadius:10, border:'2px solid #EDE0D0', fontSize:13, cursor:'pointer', background:'white' }}>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td style={{ color:'#8B6A4A', fontSize:13 }}>{new Date(inq.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <button className="btn btn-sm" style={{ background:'#FEE2E2', color:'#D42B2B', border:'none', borderRadius:20 }} onClick={()=>deleteInquiry(inq._id)}>Delete</button>
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
