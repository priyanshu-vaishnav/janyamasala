import { useState, useEffect } from 'react';
import { inquiriesAPI } from '../../api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['new', 'contacted', 'converted', 'closed'];
const STATUS_COLOR = { new: '#2563EB', contacted: '#D97706', converted: '#16A34A', closed: '#9CA3AF' };

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);

  const load = (status = filter) => {
    setLoading(true);
    inquiriesAPI.getAll({ status: status || undefined })
      .then(r => setInquiries(r.data.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await inquiriesAPI.update(id, { status });
      toast.success('Status updated!');
      load();
      if (selected?._id === id) setSelected(p => ({ ...p, status }));
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this inquiry?')) return;
    try { await inquiriesAPI.delete(id); toast.success('Deleted'); load(); setSelected(null); }
    catch { toast.error('Delete failed'); }
  };

  const counts = { all: inquiries.length };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900 }}>Inquiries</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Manage customer and retailer inquiries</p>
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

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 24 }}>
        {/* Table */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          {loading ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div> : (
            inquiries.length === 0 ? (
              <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
                <p>No inquiries found</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead style={{ background: 'var(--light-cream)' }}>
                  <tr>
                    {['Name & Phone', 'Type', 'Message', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '14px 16px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inq, i) => (
                    <tr key={inq._id} onClick={() => setSelected(inq)} style={{ borderTop: '1px solid var(--border)', cursor: 'pointer', background: selected?._id === inq._id ? 'rgba(212,43,43,0.04)' : i % 2 === 0 ? 'white' : 'rgba(255,248,238,0.4)', transition: 'background 0.15s' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700 }}>{inq.name}</div>
                        <a href={`tel:${inq.phone}`} style={{ color: 'var(--red)', fontSize: 13, fontWeight: 600 }} onClick={e => e.stopPropagation()}>{inq.phone}</a>
                      </td>
                      <td style={{ padding: '14px 16px' }}><span className="badge badge-yellow">{inq.type}</span></td>
                      <td style={{ padding: '14px 16px', maxWidth: 200 }}>
                        <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-light)', fontSize: 13 }}>{inq.message}</p>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className="badge" style={{ background: `${STATUS_COLOR[inq.status]}18`, color: STATUS_COLOR[inq.status] }}>{inq.status}</span>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: 12 }}>{new Date(inq.createdAt).toLocaleDateString('en-IN')}</td>
                      <td style={{ padding: '14px 16px' }} onClick={e => e.stopPropagation()}>
                        <select value={inq.status} onChange={e => updateStatus(inq._id, e.target.value)}
                          style={{ fontSize: 12, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'white', cursor: 'pointer' }}>
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

        {/* Detail Panel */}
        {selected && (
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 28, alignSelf: 'start', position: 'sticky', top: 100 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800 }}>Inquiry Details</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--text-muted)' }}>×</button>
            </div>
            {[
              ['Name', selected.name],
              ['Phone', selected.phone],
              ['Email', selected.email || '—'],
              ['City', selected.city || '—'],
              ['Type', selected.type],
              ['Status', selected.status],
              ['Date', new Date(selected.createdAt).toLocaleString('en-IN')],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, minWidth: 60, textTransform: 'uppercase', letterSpacing: 0.5 }}>{k}</span>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 16, padding: '14px', background: 'var(--light-cream)', borderRadius: 10 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>Message</div>
              <p style={{ fontSize: 14, lineHeight: 1.7 }}>{selected.message}</p>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <a href={`tel:${selected.phone}`} className="btn btn-primary btn-sm" style={{ flex: 1, textAlign: 'center' }}>📞 Call</a>
              <a href={`https://wa.me/91${selected.phone?.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                className="btn btn-sm" style={{ flex: 1, background: '#25D366', color: 'white', textAlign: 'center' }}>💬 WhatsApp</a>
            </div>
            <button onClick={() => handleDelete(selected._id)} className="btn btn-sm" style={{ width: '100%', marginTop: 10, background: 'rgba(212,43,43,0.08)', color: 'var(--red)', border: '1px solid rgba(212,43,43,0.2)' }}>
              Delete Inquiry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
