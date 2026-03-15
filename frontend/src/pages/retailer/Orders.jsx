import { useState, useEffect } from 'react';
import { ordersAPI } from '../../api';
import toast from 'react-hot-toast';

const STATUS_COLOR = { pending:'#D97706', confirmed:'#2563EB', processing:'#7C3AED', shipped:'#0891B2', delivered:'#16A34A', cancelled:'#DC2626' };

export default function RetailerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI.getAll()
      .then(r => setOrders(r.data.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, marginBottom: 8 }}>My Orders</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>{orders.length} total orders</p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading…</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, background: 'white', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>No Orders Yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Contact us to place your first order!</p>
          <a href="https://wa.me/919328454346?text=Hi%20Janya%20Masala%2C%20I%20want%20to%20place%20an%20order." target="_blank" rel="noreferrer"
            style={{ background: '#25D366', color: 'white', padding: '12px 28px', borderRadius: 25, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
            💬 WhatsApp to Order
          </a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map(order => (
            <div key={order._id} style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--red)' }}>{order.orderNumber}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge" style={{ background: `${STATUS_COLOR[order.status]}18`, color: STATUS_COLOR[order.status], fontSize: 13, padding: '5px 14px' }}>{order.status}</span>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: 'var(--dark)', marginTop: 6 }}>₹{order.total?.toLocaleString('en-IN')}</div>
                </div>
              </div>
              {order.items?.length > 0 && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Items</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ background: 'var(--light-cream)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 13 }}>
                        <span style={{ fontWeight: 600 }}>{item.product?.name || 'Product'}</span>
                        <span style={{ color: 'var(--text-muted)' }}> × {item.quantity} @ ₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
