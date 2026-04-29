import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { useApi } from '../../hooks/useApi.js';
import { Users, Phone, Mail, MessageSquare, X, ChevronRight, Calendar } from 'lucide-react';

const STATUS_TABS = ['all', 'new', 'contacted', 'closed'];
const BRANCHES = ['All', 'Pak Army', 'Pak Air Force', 'Pak Navy'];

const statusColor = { new: 'yellow', contacted: 'blue', closed: 'green' };

const LeadPanel = ({ lead, onClose, onUpdated }) => {
  const { post } = useApi();
  const [updating, setUpdating] = useState(false);

  const handleStatus = async (status) => {
    setUpdating(true);
    try {
      await post(`/leads/${lead._id}/status`, { status });
      onUpdated(lead._id, status);
      onClose();
    } finally { setUpdating(false); }
  };

  const row = (icon, label, val) => val ? (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
      <div style={{ color: 'var(--color-text-muted)', marginTop: 2, flexShrink: 0 }}>{icon}</div>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>{label}</p>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text)', margin: 0, wordBreak: 'break-word' }}>{val}</p>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.3)' }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 440, zIndex: 51,
        background: 'var(--color-surface)', borderLeft: '1px solid var(--color-border)',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column',
        animation: 'slideInRight 0.22s ease', overflowY: 'auto',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Badge label={lead.status} color={statusColor[lead.status] || 'gray'} />
              {lead.branch && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-primary)', fontWeight: 700 }}>{lead.branch}</span>
              )}
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>{lead.name}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 4 }}><X size={20} /></button>
        </div>

        <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            {row(<Phone size={14} />, 'Phone', lead.phone)}
            {row(<Mail size={14} />, 'Email', lead.email)}
            {row(<Users size={14} />, 'Course', lead.course)}
            {row(<Calendar size={14} />, 'Submitted', new Date(lead.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }))}
            {lead.message && row(<MessageSquare size={14} />, 'Message', lead.message)}
          </div>

          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>Update Status</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['new', 'contacted', 'closed'].filter(s => s !== lead.status).map(s => (
                <Button
                  key={s}
                  variant={s === 'closed' ? 'ghost' : 'outline'}
                  loading={updating}
                  onClick={() => handleStatus(s)}
                  style={{ justifyContent: 'flex-start' }}
                >
                  Mark as {s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </>
  );
};

const th = {
  padding: '11px 16px', textAlign: 'left',
  fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700,
  color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em',
  background: 'var(--color-surface-elevated)', borderBottom: '1px solid var(--color-border)',
  whiteSpace: 'nowrap',
};
const td = { padding: '12px 16px', fontSize: '0.85rem', borderBottom: '1px solid var(--color-border-subtle)', whiteSpace: 'nowrap' };

const AdminLeadsPage = () => {
  const { get } = useApi();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState('all');
  const [branchFilter, setBranchFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const fetchLeads = (status = statusTab, branch = branchFilter) => {
    setLoading(true);
    const params = {};
    if (status !== 'all') params.status = status;
    if (branch !== 'All') params.branch = branch;
    get('/leads', { params })
      .then(r => setLeads(r?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleStatusTab = (s) => { setStatusTab(s); fetchLeads(s, branchFilter); };
  const handleBranch = (b) => { setBranchFilter(b); fetchLeads(statusTab, b); };

  const handleUpdated = (id, status) => {
    setLeads(prev => prev.map(l => l._id === id ? { ...l, status } : l));
  };

  const counts = STATUS_TABS.reduce((acc, s) => {
    acc[s] = s === 'all' ? leads.length : leads.filter(l => l.status === s).length;
    return acc;
  }, {});

  const filterBtn = (active, label, onClick) => (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px', borderRadius: 'var(--radius-md)', border: '1px solid', fontSize: '0.8rem',
        fontWeight: active ? 700 : 400, cursor: 'pointer', fontFamily: 'var(--font-mono)', transition: 'all 0.15s',
        background: active ? 'var(--color-primary-soft)' : 'transparent',
        borderColor: active ? 'var(--color-primary)' : 'var(--color-border)',
        color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
      }}
    >{label}</button>
  );

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        <PageHeader title="Leads" subtitle="Enquiries submitted via the website contact form." />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {STATUS_TABS.map(s => filterBtn(
              statusTab === s,
              `${s.charAt(0).toUpperCase() + s.slice(1)} (${counts[s]})`,
              () => handleStatusTab(s)
            ))}
          </div>
          <div style={{ width: 1, height: 24, background: 'var(--color-border)', flexShrink: 0 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            {BRANCHES.map(b => filterBtn(branchFilter === b, b, () => handleBranch(b)))}
          </div>
        </div>

        <Card padded={false}>
          {loading ? (
            <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}><Loader /></div>
          ) : leads.length === 0 ? (
            <div style={{ padding: '60px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: 'var(--color-text-muted)' }}>
              <Users size={36} style={{ opacity: 0.3 }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>No leads found.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Name', 'Phone', 'Branch', 'Course', 'Message', 'Date', 'Status', ''].map(h => (
                      <th key={h} style={th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr
                      key={lead._id}
                      onClick={() => setSelected(lead)}
                      style={{
                        cursor: 'pointer', transition: 'background 0.12s',
                        background: selected?._id === lead._id ? 'var(--color-primary-soft)' : 'transparent',
                      }}
                      onMouseEnter={e => { if (selected?._id !== lead._id) e.currentTarget.style.background = 'var(--color-surface-elevated)'; }}
                      onMouseLeave={e => { if (selected?._id !== lead._id) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ ...td, fontWeight: 700, color: 'var(--color-text)' }}>{lead.name}</td>
                      <td style={{ ...td, fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{lead.phone}</td>
                      <td style={{ ...td }}>
                        {lead.branch ? (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-primary)', padding: '2px 8px', background: 'var(--color-primary-soft)', borderRadius: 999 }}>
                            {lead.branch}
                          </span>
                        ) : '—'}
                      </td>
                      <td style={{ ...td, color: 'var(--color-text-muted)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.course || '—'}</td>
                      <td style={{ ...td, color: 'var(--color-text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', fontStyle: lead.message ? 'italic' : 'normal' }}>
                        {lead.message ? `"${lead.message.slice(0, 50)}${lead.message.length > 50 ? '…' : ''}"` : '—'}
                      </td>
                      <td style={{ ...td, fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                        {new Date(lead.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={td}><Badge label={lead.status} color={statusColor[lead.status] || 'gray'} /></td>
                      <td style={{ ...td, textAlign: 'right' }}><ChevronRight size={16} color="var(--color-text-muted)" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {selected && (
        <LeadPanel
          lead={selected}
          onClose={() => setSelected(null)}
          onUpdated={handleUpdated}
        />
      )}
    </DashboardLayout>
  );
};

export default AdminLeadsPage;
