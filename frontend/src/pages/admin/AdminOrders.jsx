import { useState, useEffect } from 'react'
import api from '../../api'
import toast from 'react-hot-toast'

const STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled']
const STATUS_COLORS = { pending:'badge-yellow', confirmed:'badge-green', processing:'badge-blue', shipped:'badge-blue', delivered:'badge-green', cancelled:'badge-red' }

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [expanded, setExpanded] = useState(null)

  const load = () => {
    const q = filter ? `?status=${filter}` : ''
    api.get(`/orders${q}`).then(r=>setOrders(r.data.data||[])).catch(()=>{}).finally(()=>setLoading(false))
  }
  useEffect(()=>{ load() },[filter])

  const updateStatus = async (id, status) => {
    try { await api.patch(`/orders/${id}`,{status}); toast.success('Order updated!'); load() }
    catch { toast.error('Failed') }
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div><h2 style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:900 }}>Orders</h2><p style={{ color:'#8B6A4A', fontSize:14 }}>Track and manage all retailer orders</p></div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {['',...STATUSES].map(s=>(
            <button key={s} onClick={()=>setFilter(s)} className="btn btn-sm" style={{ background:filter===s?'#D42B2B':'transparent', color:filter===s?'white':'#8B6A4A', border:`2px solid ${filter===s?'#D42B2B':'#EDE0D0'}`, borderRadius:20, textTransform:'capitalize' }}>{s||'All'}</button>
          ))}
        </div>
      </div>

      <div style={{ background:'white', borderRadius:18, boxShadow:'0 2px 16px rgba(0,0,0,0.06)', overflow:'hidden' }}>
        {loading ? <div style={{ textAlign:'center', padding:60, color:'#8B6A4A' }}>Loading orders...</div> :
        orders.length === 0 ? <div style={{ textAlign:'center', padding:60, color:'#8B6A4A' }}><div style={{ fontSize:48, marginBottom:12 }}>📦</div><p>No orders yet.</p></div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Order #</th><th>Retailer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {orders.map(o=>(
                  <>
                    <tr key={o._id} style={{ cursor:'pointer' }} onClick={()=>setExpanded(expanded===o._id?null:o._id)}>
                      <td style={{ fontWeight:700, color:'#D42B2B' }}>{o.orderNumber}</td>
                      <td>
                        <div style={{ fontWeight:600 }}>{o.retailer?.name||'—'}</div>
                        <div style={{ fontSize:12, color:'#8B6A4A' }}>{o.retailer?.phone}</div>
                      </td>
                      <td style={{ fontSize:13 }}>{o.items?.length} item(s)</td>
                      <td style={{ fontWeight:700, fontSize:16 }}>₹{o.total?.toLocaleString()}</td>
                      <td><span className={`badge ${o.paymentStatus==='paid'?'badge-green':'badge-yellow'}`}>{o.paymentStatus}</span></td>
                      <td>
                        <select value={o.status} onChange={e=>{e.stopPropagation();updateStatus(o._id,e.target.value)}} onClick={e=>e.stopPropagation()} style={{ padding:'6px 12px', borderRadius:10, border:'2px solid #EDE0D0', fontSize:13, cursor:'pointer', background:'white' }}>
                          {STATUSES.map(s=><option key={s} value={s} style={{ textTransform:'capitalize' }}>{s}</option>)}
                        </select>
                      </td>
                      <td style={{ color:'#8B6A4A', fontSize:13 }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      <td><span style={{ fontSize:16 }}>{expanded===o._id?'▲':'▼'}</span></td>
                    </tr>
                    {expanded===o._id && (
                      <tr key={`${o._id}-detail`}>
                        <td colSpan={8}>
                          <div style={{ background:'#FFF8EE', padding:20, borderRadius:12, margin:'0 8px 8px' }}>
                            <h4 style={{ fontFamily:'Playfair Display,serif', marginBottom:12 }}>Order Items</h4>
                            {o.items?.map((item,i)=>(
                              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #EDE0D0', fontSize:14 }}>
                                <span>{item.product?.name||'Product'} — {item.variant}</span>
                                <span>Qty: {item.quantity} × ₹{item.price} = <strong>₹{item.total}</strong></span>
                              </div>
                            ))}
                            {o.shippingAddress?.name && (
                              <div style={{ marginTop:12, fontSize:13, color:'#8B6A4A' }}>
                                <strong>Ship to:</strong> {o.shippingAddress.name}, {o.shippingAddress.address}, {o.shippingAddress.city} - {o.shippingAddress.pincode}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
