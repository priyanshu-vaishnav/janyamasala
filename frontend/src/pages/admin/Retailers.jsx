import { useState, useEffect } from 'react';
import { authAPI } from '../../api';
import toast from 'react-hot-toast';

export default function AdminRetailers() {
  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    authAPI.getRetailers()
      .then(r => setRetailers(r.data.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleApproval = async (id, isApproved) => {
    try {
      await authAPI.approveRetailer(id, isApproved);
      toast.success(isApproved ? 'Retailer approved! ✅' : 'Approval revoked');
      load();
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900 }}>Retailers</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{retailers.length} registered retailers</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Registered', value: retailers.length, color: 'var(--red)', icon: '🤝' },
          { label: 'Approved', value: retailers.filter(r => r.isApproved).length, color: 'var(--success)', icon: '✅' },
          { label: 'Pending Approval', value: retailers.filter(r => !r.isApproved).length, color: 'var(--warning)', icon: '⏳' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '22px', boxShadow: 'var(--shadow-sm)', borderLeft: `4px solid ${s.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 900, color: 'var(--dark)' }}>{s.value}</div>
              </div>
              <span style={{ fontSize: 32 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        {loading ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div> : (
          retailers.length === 0 ? (
            <div style={{ padding: 80, textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🤝</div>
              <p>No retailers registered yet</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead style={{ background: 'var(--light-cream)' }}>
                <tr>
                  {['Retailer', 'Contact', 'Location', 'Registered', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '14px 18px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {retailers.map((r, i) => (
                  <tr key={r._id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'white' : 'rgba(255,248,238,0.4)' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--red)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                          {r.name?.[0] || 'R'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{r.name}</div>
                          {r.company && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.company}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <a href={`tel:${r.phone}`} style={{ color: 'var(--red)', fontWeight: 600, display: 'block', fontSize: 13 }}>{r.phone}</a>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.email}</span>
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-light)', fontSize: 13 }}>
                      {[r.city, r.state].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: 12 }}>
                      {new Date(r.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className={`badge ${r.isApproved ? 'badge-green' : 'badge-yellow'}`}>
                        {r.isApproved ? '✅ Approved' : '⏳ Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <button onClick={() => toggleApproval(r._id, !r.isApproved)}
                        className="btn btn-sm"
                        style={{ background: r.isApproved ? 'rgba(220,38,38,0.08)' : 'rgba(22,163,74,0.1)', color: r.isApproved ? 'var(--red)' : 'var(--success)', border: `1px solid ${r.isApproved ? 'rgba(220,38,38,0.2)' : 'rgba(22,163,74,0.2)'}` }}>
                        {r.isApproved ? 'Revoke' : 'Approve'}
                      </button>
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
