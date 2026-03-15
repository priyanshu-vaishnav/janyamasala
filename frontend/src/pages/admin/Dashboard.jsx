import { useState, useEffect } from 'react';
import { dashboardAPI, inquiriesAPI, ordersAPI } from '../../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import toast from 'react-hot-toast';

const StatCard = ({ icon, label, value, sub, color = 'var(--red)' }) => (
  <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '28px 24px', boxShadow: 'var(--shadow-sm)', borderLeft: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 900, color: 'var(--dark)' }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 36, opacity: 0.8 }}>{icon}</div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.getStats()
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const handleInquiryStatus = async (id, status) => {
    try {
      await inquiriesAPI.update(id, { status });
      toast.success('Status updated!');
      setData(prev => ({
        ...prev,
        recentInquiries: prev.recentInquiries.map(i => i._id === id ? { ...i, status } : i)
      }));
    } catch { toast.error('Failed to update'); }
  };

  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
      {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-lg)' }} />)}
    </div>
  );

  const STATUS_COLOR = { new: 'var(--red)', contacted: 'var(--warning)', converted: 'var(--success)', closed: '#999' };
  const ORDER_COLOR = { pending: 'var(--warning)', confirmed: 'var(--info)', delivered: 'var(--success)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
        <StatCard icon="🛒" label="Total Orders" value={data?.stats.totalOrders} sub={`${data?.stats.pendingOrders} pending`} color="var(--red)" />
        <StatCard icon="💰" label="Revenue" value={`₹${(data?.stats.totalRevenue || 0).toLocaleString('en-IN')}`} sub="Confirmed orders" color="var(--success)" />
        <StatCard icon="💬" label="Inquiries" value={data?.stats.totalInquiries} sub={`${data?.stats.newInquiries} new`} color="var(--info)" />
        <StatCard icon="🤝" label="Retailers" value={data?.stats.totalRetailers} sub={`${data?.stats.pendingRetailers} pending approval`} color="var(--warning)" />
      </div>

      {/* Chart */}
      {data?.charts?.last7Days?.length > 0 && (
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Orders — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.charts.last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e0cc" />
              <XAxis dataKey="_id" tick={{ fontSize: 12, fontFamily: 'var(--font-body)' }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ fontFamily: 'var(--font-body)', borderRadius: 8, border: '1px solid var(--border)' }} />
              <Bar dataKey="count" fill="var(--red)" radius={[6,6,0,0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Inquiries */}
      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800 }}>Recent Inquiries</h3>
        </div>
        {data?.recentInquiries?.length === 0
          ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '30px 0' }}>No inquiries yet</p>
          : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  {['Name', 'Phone', 'Type', 'Status', 'Date', 'Action'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-muted)', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.recentInquiries?.map((inq, i) => (
                  <tr key={inq._id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,248,238,0.5)' }}>
                    <td style={{ padding: '12px' }}><strong>{inq.name}</strong></td>
                    <td style={{ padding: '12px' }}>
                      <a href={`tel:${inq.phone}`} style={{ color: 'var(--red)', fontWeight: 600 }}>{inq.phone}</a>
                    </td>
                    <td style={{ padding: '12px' }}><span className="badge badge-yellow">{inq.type}</span></td>
                    <td style={{ padding: '12px' }}>
                      <span className="badge" style={{ background: `${STATUS_COLOR[inq.status]}15`, color: STATUS_COLOR[inq.status] }}>
                        {inq.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: 12 }}>{new Date(inq.createdAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '12px' }}>
                      <select onChange={e => handleInquiryStatus(inq._id, e.target.value)} defaultValue={inq.status}
                        style={{ fontSize: 12, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'white', cursor: 'pointer' }}>
                        {['new','contacted','converted','closed'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>

      {/* Recent Orders */}
      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Recent Orders</h3>
        {data?.recentOrders?.length === 0
          ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '30px 0' }}>No orders yet</p>
          : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  {['Order#', 'Retailer', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-muted)', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.recentOrders?.map((order, i) => (
                  <tr key={order._id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,248,238,0.5)' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: 'var(--red)' }}>{order.orderNumber}</td>
                    <td style={{ padding: '12px' }}>{order.retailer?.name || 'N/A'}</td>
                    <td style={{ padding: '12px', fontWeight: 700 }}>₹{order.total?.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px' }}>
                      <span className="badge" style={{ background: `${ORDER_COLOR[order.status] || '#999'}15`, color: ORDER_COLOR[order.status] || '#999' }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: 12 }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>
    </div>
  );
}
