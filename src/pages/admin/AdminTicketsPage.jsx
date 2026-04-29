import { useEffect, useState, useRef } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import { useApi } from '../../hooks/useApi.js';
import API_ENDPOINTS from '../../constants/api-endpoints.js';
import { ChevronRight, X, Send, CheckCircle } from 'lucide-react';

const LIMIT = 15;

const statusColor = { open: 'blue', in_progress: 'yellow', resolved: 'green', closed: 'gray' };
const nextStatus = { open: 'in_progress', in_progress: 'resolved', resolved: 'closed' };
const nextLabel = { open: 'Mark In Progress', in_progress: 'Mark Resolved', resolved: 'Close Ticket' };

const TicketPanel = ({ ticket, onClose, onUpdated }) => {
  const { post, get } = useApi();
  const [current, setCurrent] = useState(ticket);
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { setCurrent(ticket); }, [ticket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [current?.messages]);

  const refresh = async () => {
    const res = await get(`${API_ENDPOINTS.TICKETS.BASE}/${current._id}`);
    if (res?.data) { setCurrent(res.data); onUpdated(); }
  };

  const handleReply = async () => {
    if (!reply.trim()) return;
    setSubmitting(true);
    try {
      await post(API_ENDPOINTS.TICKETS.REPLY(current._id), { message: reply });
      setReply('');
      await refresh();
    } finally { setSubmitting(false); }
  };

  const handleAdvance = async () => {
    const next = nextStatus[current.status];
    if (!next) return;
    setAdvancing(true);
    try {
      await post(API_ENDPOINTS.TICKETS.STATUS(current._id), { status: next });
      await refresh();
    } finally { setAdvancing(false); }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(); }
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.35)',
          animation: 'fadeIn 0.2s ease',
        }}
      />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 520, zIndex: 51,
        background: 'var(--color-surface)',
        borderLeft: '1px solid var(--color-border)',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideInRight 0.25s ease',
      }}>
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid var(--color-border)',
          flexShrink: 0,
        }}>
          <div style={{ flex: 1, minWidth: 0, marginRight: 12 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>
              {current.student?.fullName} · @{current.student?.username}
            </p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 8px', lineHeight: 1.3 }}>
              {current.subject}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Badge label={current.status} color={statusColor[current.status] || 'gray'} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                {new Date(current.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 4, flexShrink: 0 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {current.messages?.map((m, i) => {
            const isAdminMsg = m.sender !== current.student?._id;
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: isAdminMsg ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%',
                  padding: '10px 14px',
                  borderRadius: isAdminMsg ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: isAdminMsg ? 'var(--color-primary)' : 'var(--color-surface-elevated)',
                  border: isAdminMsg ? 'none' : '1px solid var(--color-border-subtle)',
                }}>
                  <p style={{ fontSize: '0.875rem', color: isAdminMsg ? '#fff' : 'var(--color-text)', lineHeight: 1.55, margin: 0 }}>
                    {m.message}
                  </p>
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginTop: 3, padding: '0 4px' }}>
                  {isAdminMsg ? 'Admin' : current.student?.fullName} · {new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--color-border)', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {nextStatus[current.status] && (
            <Button variant="ghost" size="sm" loading={advancing} onClick={handleAdvance} style={{ alignSelf: 'flex-start' }}>
              <CheckCircle size={14} />{nextLabel[current.status]}
            </Button>
          )}
          {current.status !== 'closed' ? (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <textarea
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Write a reply… (Enter to send)"
                rows={2}
                style={{
                  flex: 1, padding: '10px 14px', resize: 'none',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text)',
                  fontSize: '0.875rem',
                  outline: 'none',
                  fontFamily: 'var(--font-sans)',
                  lineHeight: 1.5,
                }}
              />
              <Button loading={submitting} onClick={handleReply} style={{ flexShrink: 0 }}>
                <Send size={15} />
              </Button>
            </div>
          ) : (
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center', margin: 0 }}>This ticket is closed.</p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </>
  );
};

const AdminTicketsPage = () => {
  const { get, loading, error } = useApi();
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1 });
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);

  const load = (p = 1, status = '') => {
    get(API_ENDPOINTS.TICKETS.BASE, { params: { page: p, limit: LIMIT, ...(status ? { status } : {}) } })
      .then(r => {
        setTickets(r?.data?.items || []);
        setPagination(r?.data?.pagination || { total: 0, page: 1 });
      }).catch(() => {});
  };

  useEffect(() => { load(1, statusFilter); }, []);

  const handlePage = (p) => { setPage(p); load(p, statusFilter); };
  const handleStatus = (s) => { setStatusFilter(s); setPage(1); load(1, s); };

  const STATUSES = ['', 'open', 'in_progress', 'resolved', 'closed'];
  const STATUS_LABELS = { '': 'All', open: 'Open', in_progress: 'In Progress', resolved: 'Resolved', closed: 'Closed' };

  if (loading && tickets.length === 0) return <DashboardLayout><Loader fullPage /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        <PageHeader title="Support Tickets" subtitle="Click any ticket to open the conversation." />
        <Alert message={error} />

        <Card padded={false}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', gap: 6 }}>
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => handleStatus(s)}
                style={{
                  padding: '5px 14px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', border: '1px solid',
                  background: statusFilter === s ? 'var(--color-primary)' : 'transparent',
                  borderColor: statusFilter === s ? 'var(--color-primary)' : 'var(--color-border)',
                  color: statusFilter === s ? '#fff' : 'var(--color-text-muted)',
                  transition: 'all 0.12s',
                }}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-elevated)' }}>
                  {['Student', 'Subject', 'Status', 'Messages', 'Date', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                      No tickets found.
                    </td>
                  </tr>
                )}
                {tickets.map(t => (
                  <tr
                    key={t._id}
                    onClick={() => setSelected(t)}
                    style={{ borderBottom: '1px solid var(--color-border-subtle)', cursor: 'pointer', transition: 'background 0.12s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-elevated)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontWeight: 600, color: 'var(--color-text)', margin: '0 0 2px' }}>{t.student?.fullName || '—'}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', margin: 0 }}>@{t.student?.username}</p>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text)', maxWidth: 260 }}>
                      <p style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.subject}</p>
                    </td>
                    <td style={{ padding: '12px 16px' }}><Badge label={t.status} color={statusColor[t.status] || 'gray'} /></td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t.messages?.length || 0}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 16px' }}><ChevronRight size={16} color="var(--color-text-muted)" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={pagination.page} total={pagination.total} limit={LIMIT} onChange={handlePage} />
        </Card>
      </div>

      {selected && (
        <TicketPanel
          ticket={selected}
          onClose={() => setSelected(null)}
          onUpdated={load}
        />
      )}
    </DashboardLayout>
  );
};

export default AdminTicketsPage;
