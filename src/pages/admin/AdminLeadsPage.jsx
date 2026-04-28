import { useState, useEffect } from 'react';
import api from '../../services/api.js';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { Users, Phone, Mail, Filter } from 'lucide-react';

const STATUS_COLORS = {
  new: { bg: 'rgba(201,168,76,0.12)', color: '#92721a', label: 'New' },
  contacted: { bg: 'rgba(59,130,246,0.1)', color: '#1d4ed8', label: 'Contacted' },
  closed: { bg: 'rgba(34,197,94,0.1)', color: '#15803d', label: 'Closed' },
};

const BRANCH_COLORS = {
  'Pak Army': { bg: 'rgba(45,90,39,0.1)', color: '#2d5a27' },
  'Pak Air Force': { bg: 'rgba(26,58,107,0.1)', color: '#1a3a6b' },
  'Pak Navy': { bg: 'rgba(10,42,74,0.1)', color: '#0a2a4a' },
};

const AdminLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterBranch) params.branch = filterBranch;
      const res = await api.get('/leads', { params });
      setLeads(res.data?.data || []);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, [filterStatus, filterBranch]);

  const updateStatus = async (leadId, status) => {
    setUpdatingId(leadId);
    try {
      await api.post(`/leads/${leadId}/status`, { status });
      setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status } : l));
    } finally {
      setUpdatingId(null);
    }
  };

  const badge = (type, value) => {
    const map = type === 'status' ? STATUS_COLORS : BRANCH_COLORS;
    const s = map[value] || { bg: 'var(--color-surface)', color: 'var(--color-text-muted)' };
    return (
      <span style={{
        display: 'inline-block', padding: '3px 10px',
        borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 700,
        background: s.bg, color: s.color,
        whiteSpace: 'nowrap',
      }}>
        {type === 'status' ? STATUS_COLORS[value]?.label || value : value}
      </span>
    );
  };

  return (
    <DashboardLayout>
    <div style={{ padding: '32px', maxWidth: '1280px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '4px' }}>Enquiries / Leads</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>People who submitted the "Let Us Know" form from the website</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={14} color="var(--color-text-muted)" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{
              padding: '8px 12px', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)', background: 'var(--color-surface)',
              color: 'var(--color-text)', fontSize: '0.85rem', cursor: 'pointer',
            }}
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <select
          value={filterBranch}
          onChange={e => setFilterBranch(e.target.value)}
          style={{
            padding: '8px 12px', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)', background: 'var(--color-surface)',
            color: 'var(--color-text)', fontSize: '0.85rem', cursor: 'pointer',
          }}
        >
          <option value="">All Branches</option>
          <option value="Pak Army">Pak Army</option>
          <option value="Pak Air Force">Pak Air Force</option>
          <option value="Pak Navy">Pak Navy</option>
        </select>

        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', alignSelf: 'center' }}>
          {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--color-text-muted)' }}>Loading...</div>
      ) : leads.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px',
          border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-xl)',
          color: 'var(--color-text-muted)',
        }}>
          <Users size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <p>No enquiries yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {leads.map(lead => (
            <div
              key={lead._id}
              style={{
                background: 'var(--color-surface)',
                border: lead.status === 'new' ? '1.5px solid rgba(201,168,76,0.4)' : '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '20px 24px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr auto',
                gap: '16px',
                alignItems: 'center',
              }}
            >
              {/* Left: person info */}
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-primary-dark)', marginBottom: '6px' }}>
                  {lead.name}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.83rem', color: 'var(--color-text-muted)' }}>
                    <Phone size={12} /> {lead.phone}
                  </div>
                  {lead.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.83rem', color: 'var(--color-text-muted)' }}>
                      <Mail size={12} /> {lead.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Middle: course/branch info + message */}
              <div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {badge('branch', lead.branch)}
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', alignSelf: 'center' }}>{lead.course}</span>
                </div>
                {lead.message && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
                    "{lead.message}"
                  </p>
                )}
                <div style={{ marginTop: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'rgba(0,0,0,0.3)' }}>
                  {new Date(lead.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {/* Right: status selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                {badge('status', lead.status)}
                <select
                  value={lead.status}
                  disabled={updatingId === lead._id}
                  onChange={e => updateStatus(lead._id, e.target.value)}
                  style={{
                    padding: '6px 10px', border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)', background: 'var(--color-bg)',
                    color: 'var(--color-text)', fontSize: '0.78rem', cursor: 'pointer',
                  }}
                >
                  <option value="new">Mark New</option>
                  <option value="contacted">Mark Contacted</option>
                  <option value="closed">Mark Closed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default AdminLeadsPage;
