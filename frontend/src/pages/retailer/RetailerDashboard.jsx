import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api'
import toast from 'react-hot-toast'

export default function RetailerDashboard() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [tab, setTab] = useState('products')
  const [orderForm, setOrderForm] = useState({ shippingAddress:{ name:user?.name||'', phone:user?.phone||'', address:'', city:'', state:'', pincode:'' }, paymentMethod:'cod', notes:'' })
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    api.get('/products').then(r=>setProducts(r.data.data||[])).catch(()=>{})
    api.get('/orders').then(r=>setOrders(r.data.data||[])).catch(()=>{})
  },[])

  const addToCart = (product, variantIdx) => {
    const variant = product.variants?.[variantIdx]
    if (!variant) return
    const existing = cart.findIndex(c=>c.productId===product._id && c.variantIdx===variantIdx)
    if (existing>=0) {
      const updated=[...cart]; updated[existing].quantity+=1; setCart(updated)
    } else {
      setCart([...cart,{ productId:product._id, product, variantIdx, variant, quantity:1, price:variant.price, total:variant.price }])
    }
    toast.success(`${product.name} (${variant.weight}) added to cart!`)
  }

  const removeFromCart = (i) => { const c=[...cart]; c.splice(i,1); setCart(c) }
  const updateQty = (i, qty) => { const c=[...cart]; c[i].quantity=qty; c[i].total=c[i].price*qty; setCart(c) }
  const cartTotal = cart.reduce((s,c)=>s+c.total, 0)

  const placeOrder = async () => {
    if (cart.length===0) return toast.error('Cart is empty!')
    setPlacing(true)
    try {
      await api.post('/orders',{
        items: cart.map(c=>({ product:c.productId, variant:c.variant.weight, quantity:c.quantity, price:c.price, total:c.total })),
        subtotal:cartTotal, total:cartTotal, ...orderForm
      })
      toast.success('Order placed! 🎉')
      setCart([])
      api.get('/orders').then(r=>setOrders(r.data.data||[])).catch(()=>{})
      setTab('orders')
    } catch(err) { toast.error(err.response?.data?.message || 'Failed to place order') } finally { setPlacing(false) }
  }

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:900 }}>Welcome, {user?.name}! 🌶️</h2>
        <p style={{ color:'#8B6A4A' }}>{user?.company || 'Retailer Portal'} · {user?.city}</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:28 }}>
        {[
          { label:'My Orders', val:orders.length, icon:'📦', color:'#D42B2B' },
          { label:'Cart Items', val:cart.length, icon:'🛒', color:'#F59E0B' },
          { label:'Cart Total', val:`₹${cartTotal.toLocaleString()}`, icon:'💰', color:'#22C55E' },
        ].map(s=>(
          <div key={s.label} style={{ background:'white', borderRadius:14, padding:20, boxShadow:'0 2px 12px rgba(0,0,0,0.06)', borderLeft:`4px solid ${s.color}` }}>
            <div style={{ fontSize:13, color:'#8B6A4A', marginBottom:6 }}>{s.label}</div>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:900 }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:0, marginBottom:24, background:'white', borderRadius:14, padding:6, boxShadow:'0 2px 12px rgba(0,0,0,0.06)', width:'fit-content' }}>
        {[['products','🌶️ Products'],['cart',`🛒 Cart (${cart.length})`],['orders','📦 My Orders']].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:'10px 24px', borderRadius:10, border:'none', background:tab===t?'#D42B2B':'transparent', color:tab===t?'white':'#8B6A4A', fontWeight:tab===t?700:500, cursor:'pointer', fontSize:14 }}>{l}</button>
        ))}
      </div>

      {/* Products Tab */}
      {tab==='products' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
          {products.map(p=>(
            <div key={p._id} style={{ background:'white', borderRadius:18, overflow:'hidden', boxShadow:'0 2px 16px rgba(0,0,0,0.07)' }}>
              <div style={{ background:'linear-gradient(135deg,#FFF8EE,#FFE8B0)', padding:'30px', textAlign:'center', fontSize:72 }}>{p.category==='whole-spice'?'🌿':p.name.toLowerCase().includes('haldi')?'🟡':'🌶️'}</div>
              <div style={{ padding:20 }}>
                <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:20, fontWeight:700, marginBottom:4 }}>{p.name}</h3>
                <p style={{ fontSize:13, color:'#8B6A4A', marginBottom:14, lineHeight:1.6 }}>{p.description}</p>
                {p.variants?.map((v,i)=>(
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid #EDE0D0' }}>
                    <span style={{ fontSize:13 }}>{v.weight} — <strong style={{ color:'#D42B2B' }}>₹{v.price}</strong></span>
                    <button className="btn btn-sm btn-primary" onClick={()=>addToCart(p,i)}>+ Add</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart Tab */}
      {tab==='cart' && (
        <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:24, alignItems:'start' }}>
          <div style={{ background:'white', borderRadius:18, padding:28, boxShadow:'0 2px 16px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:700, marginBottom:20 }}>Cart Items</h3>
            {cart.length===0 ? <div style={{ textAlign:'center', padding:'30px 0', color:'#8B6A4A' }}><div style={{ fontSize:48 }}>🛒</div><p>Cart is empty. Add products!</p></div> :
            cart.map((c,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom:'1px solid #EDE0D0' }}>
                <div>
                  <div style={{ fontWeight:700 }}>{c.product.name} — {c.variant.weight}</div>
                  <div style={{ fontSize:13, color:'#D42B2B', fontWeight:600 }}>₹{c.price} × {c.quantity} = ₹{c.total}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <input type="number" min={1} value={c.quantity} onChange={e=>updateQty(i,+e.target.value)} style={{ width:60, padding:'6px 10px', border:'2px solid #EDE0D0', borderRadius:8, fontSize:14, textAlign:'center' }} />
                  <button onClick={()=>removeFromCart(i)} style={{ background:'#FEE2E2', border:'none', color:'#D42B2B', borderRadius:8, padding:'6px 12px', cursor:'pointer', fontWeight:700 }}>✕</button>
                </div>
              </div>
            ))}
            {cart.length>0 && (
              <div style={{ marginTop:16, display:'flex', justifyContent:'space-between', fontWeight:700, fontSize:18 }}>
                <span>Total:</span><span style={{ color:'#D42B2B' }}>₹{cartTotal.toLocaleString()}</span>
              </div>
            )}
          </div>
          <div style={{ background:'white', borderRadius:18, padding:28, boxShadow:'0 2px 16px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:20, fontWeight:700, marginBottom:20 }}>Shipping Details</h3>
            <div className="form-group"><label className="form-label">Address</label><input className="form-control" value={orderForm.shippingAddress.address} onChange={e=>setOrderForm({...orderForm,shippingAddress:{...orderForm.shippingAddress,address:e.target.value}})} placeholder="Full address" /></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div className="form-group"><label className="form-label">City</label><input className="form-control" value={orderForm.shippingAddress.city} onChange={e=>setOrderForm({...orderForm,shippingAddress:{...orderForm.shippingAddress,city:e.target.value}})} placeholder="City" /></div>
              <div className="form-group"><label className="form-label">Pincode</label><input className="form-control" value={orderForm.shippingAddress.pincode} onChange={e=>setOrderForm({...orderForm,shippingAddress:{...orderForm.shippingAddress,pincode:e.target.value}})} placeholder="Pincode" /></div>
            </div>
            <div className="form-group"><label className="form-label">Payment Method</label>
              <select className="form-control" value={orderForm.paymentMethod} onChange={e=>setOrderForm({...orderForm,paymentMethod:e.target.value})}>
                <option value="cod">Cash on Delivery</option><option value="bank">Bank Transfer</option><option value="upi">UPI</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Notes</label><textarea className="form-control" rows={2} value={orderForm.notes} onChange={e=>setOrderForm({...orderForm,notes:e.target.value})} placeholder="Any special instructions..." /></div>
            <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:14 }} onClick={placeOrder} disabled={placing||cart.length===0}>{placing?'Placing Order...':'Place Order →'}</button>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab==='orders' && (
        <div style={{ background:'white', borderRadius:18, padding:28, boxShadow:'0 2px 16px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:700, marginBottom:20 }}>My Orders</h3>
          {orders.length===0 ? <div style={{ textAlign:'center', padding:'30px 0', color:'#8B6A4A' }}><div style={{ fontSize:48 }}>📦</div><p>No orders yet. Add products to cart and order!</p></div> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Order #</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {orders.map(o=>(
                    <tr key={o._id}>
                      <td style={{ fontWeight:700, color:'#D42B2B' }}>{o.orderNumber}</td>
                      <td>{o.items?.length} item(s)</td>
                      <td style={{ fontWeight:700 }}>₹{o.total?.toLocaleString()}</td>
                      <td><span className={`badge status-${o.status}`} style={{ textTransform:'capitalize' }}>{o.status}</span></td>
                      <td style={{ color:'#8B6A4A', fontSize:13 }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
