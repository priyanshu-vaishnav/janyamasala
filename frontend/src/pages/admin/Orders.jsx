// ─── Admin/Orders.jsx ───────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { ordersAPI } from '../../api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending','confirmed','processing','shipped','delivered','cancelled'];
const STATUS_COLOR = { pending:'#D97706', confirmed:'#2563EB', processing:'#7C3AED', shipped:'#0891B2', delivered:'#16A34A', cancelled:'#DC2626' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = () => {
    setLoading(true);
    ordersAPI.getAll({ status: filter || undefined })
      .then(r => setOrders(r.data.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await ordersAPI.update(id, { status });
      toast.success('Order status updated!');
      load();
    } catch { toast.error('Update failed'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900 }}>Orders</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{orders.length} orders</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[{ val: '', label: 'All' }, ...STATUS_OPTIONS.map(s => ({ val: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))].map(opt => (
            <button key={opt.val} onClick={() => setFilter(opt.val)} className="btn btn-sm"
              style={{ background: filter === opt.val ? 'var(--red)' : 'white', color: filter === opt.val ? 'white' : 'var(--text)', border: '1px solid var(--border)' }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        {loading ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div> : (
          orders.length === 0 ? (
            <div style={{ padding: 80, textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🛒</div>
              <p>No orders found</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead style={{ background: 'var(--light-cream)' }}>
                <tr>
                  {['Order #', 'Retailer', 'Items', 'Total', 'Status', 'Date', 'Update'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '14px 18px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr key={order._id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'white' : 'rgba(255,248,238,0.4)' }}>
                    <td style={{ padding: '14px 18px', fontWeight: 800, color: 'var(--red)', fontFamily: 'var(--font-display)' }}>{order.orderNumber}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 600 }}>{order.retailer?.name || 'Walk-in'}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{order.retailer?.phone}</div>
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: 13 }}>{order.items?.length || 0} items</td>
                    <td style={{ padding: '14px 18px', fontWeight: 800, fontSize: 16 }}>₹{order.total?.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className="badge" style={{ background: `${STATUS_COLOR[order.status]}18`, color: STATUS_COLOR[order.status] }}>{order.status}</span>
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: 12 }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)}
                        style={{ fontSize: 12, padding: '5px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'white', cursor: 'pointer' }}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}
