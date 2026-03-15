import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const StatCard = ({ icon, label, value, sub, color='#D42B2B', link }) => (
  <Link to={link || '#'} style={{ textDecoration:'none' }}>
    <div style={{ background:'white', borderRadius:18, padding:24, boxShadow:'0 2px 16px rgba(0,0,0,0.06)', transition:'all 0.25s', cursor:'pointer', borderLeft:`5px solid ${color}` }}
      onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'}
      onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ fontSize:13, color:'#8B6A4A', fontWeight:600, marginBottom:8 }}>{label}</div>
          <div style={{ fontFamily:'Playfair Display,serif', fontSize:32, fontWeight:900, color:'#1A0A00' }}>{value}</div>
          {sub && <div style={{ fontSize:12, color:'#8B6A4A', marginTop:4 }}>{sub}</div>}
        </div>
        <div style={{ fontSize:36 }}>{icon}</div>
      </div>
    </div>
  </Link>
)

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/stats').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
      {[...Array(4)].map((_,i) => <div key={i} style={{ height:120, background:'#F0E6D6', borderRadius:18, animation:'pulse 1.5s infinite' }} />)}
    </div>
  )

  const stats = data?.stats || {}
  const chartData = data?.charts?.last7Days || []
  const recentInquiries = data?.recentInquiries || []
  const recentOrders = data?.recentOrders || []

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:900 }}>Dashboard Overview</h2>
        <p style={{ color:'#8B6A4A', fontSize:14 }}>Welcome back! Here's what's happening with Janya Masala.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:20, marginBottom:32 }}>
        <StatCard icon="📦" label="Total Orders" value={stats.totalOrders ?? 0} sub={`${stats.pendingOrders ?? 0} pending`} color="#D42B2B" link="/admin/orders" />
        <StatCard icon="💰" label="Total Revenue" value={`₹${(stats.totalRevenue ?? 0).toLocaleString()}`} sub="Confirmed orders" color="#C9960C" />
        <StatCard icon="📩" label="Inquiries" value={stats.totalInquiries ?? 0} sub={`${stats.newInquiries ?? 0} new`} color="#3B82F6" link="/admin/inquiries" />
        <StatCard icon="🤝" label="Retailers" value={stats.totalRetailers ?? 0} sub={`${stats.pendingRetailers ?? 0} pending approval`} color="#22C55E" link="/admin/retailers" />
        <StatCard icon="🌶️" label="Products" value={stats.totalProducts ?? 0} color="#8B5CF6" link="/admin/products" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:24, marginBottom:24 }}>
        {/* Chart */}
        <div style={{ background:'white', borderRadius:18, padding:28, boxShadow:'0 2px 16px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:20, fontWeight:700, marginBottom:20 }}>Last 7 Days Orders</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E6D6" />
                <XAxis dataKey="_id" tick={{ fontSize:11 }} />
                <YAxis tick={{ fontSize:11 }} />
                <Tooltip formatter={(val, name) => [name==='revenue'?`₹${val}`:val, name==='revenue'?'Revenue':'Orders']} />
                <Bar dataKey="count" fill="#D42B2B" radius={[6,6,0,0]} />
                <Bar dataKey="revenue" fill="#F5C518" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height:220, display:'flex', alignItems:'center', justifyContent:'center', color:'#8B6A4A', fontSize:14 }}>No order data yet. Start selling! 🌶️</div>
          )}
        </div>

        {/* Recent Inquiries */}
        <div style={{ background:'white', borderRadius:18, padding:28, boxShadow:'0 2px 16px rgba(0,0,0,0.06)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:20, fontWeight:700 }}>New Inquiries</h3>
            <Link to="/admin/inquiries" style={{ color:'#D42B2B', fontSize:13, fontWeight:600 }}>View all →</Link>
          </div>
          {recentInquiries.length === 0 ? (
            <div style={{ color:'#8B6A4A', fontSize:14, textAlign:'center', padding:'20px 0' }}>No inquiries yet</div>
          ) : recentInquiries.map(inq => (
            <div key={inq._id} style={{ padding:'12px 0', borderBottom:'1px solid #F0E6D6', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontWeight:700, fontSize:14 }}>{inq.name}</div>
                <div style={{ fontSize:12, color:'#8B6A4A' }}>{inq.phone} · {inq.type}</div>
              </div>
              <span className={`badge status-${inq.status}`}>{inq.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ background:'white', borderRadius:18, padding:28, boxShadow:'0 2px 16px rgba(0,0,0,0.06)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:20, fontWeight:700 }}>Recent Orders</h3>
          <Link to="/admin/orders" style={{ color:'#D42B2B', fontSize:13, fontWeight:600 }}>View all →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div style={{ color:'#8B6A4A', fontSize:14, textAlign:'center', padding:'30px 0' }}>No orders yet. Share the website with retailers! 🚀</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Order #</th><th>Retailer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o._id}>
                    <td style={{ fontWeight:700, color:'#D42B2B' }}>{o.orderNumber}</td>
                    <td>{o.retailer?.name || '—'}</td>
                    <td style={{ fontWeight:700 }}>₹{o.total?.toLocaleString()}</td>
                    <td><span className={`badge status-${o.status}`}>{o.status}</span></td>
                    <td style={{ color:'#8B6A4A', fontSize:13 }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
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
