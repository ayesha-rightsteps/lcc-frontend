import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { useApi } from '../../hooks/useApi.js';
import API_ENDPOINTS from '../../constants/api-endpoints.js';
import { ChevronRight } from 'lucide-react';

const statusColor = { open: 'blue', in_progress: 'yellow', resolved: 'green', closed: 'gray' };
const nextStatus = { open: 'in_progress', in_progress: 'resolved', resolved: 'closed' };

const AdminTicketsPage = () => {
  const { get, post, loading, error } = useApi();
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => get(API_ENDPOINTS.TICKETS.BASE).then(r => setTickets(r?.data || [])).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleReply = async () => {
    if (!reply.trim() || !selected) return;
    setSubmitting(true);
    try {
      await post(API_ENDPOINTS.TICKETS.REPLY(selected._id), { message: reply });
      setReply('');
      const updated = await get(`${API_ENDPOINTS.TICKETS.BASE}/${selected._id}`);
      setSelected(updated?.data);
      load();
    } finally { setSubmitting(false); }
  };

  const handleStatus = async (id, status) => {
    await post(API_ENDPOINTS.TICKETS.STATUS(id), { status });
    load();
    setSelected(null);
  };

  if (loading && tickets.length === 0) return <DashboardLayout><Loader fullPage /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        <PageHeader title="Support Tickets" subtitle="Respond to student queries." />
        <Alert message={error} />

        <Card padded={false}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-elevated)' }}>
                  {['Student', 'Subject', 'Status', 'Date', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tickets.map(t => (
                  <tr key={t._id} style={{ borderBottom: '1px solid var(--color-border-subtle)', cursor: 'pointer' }} onClick={() => setSelected(t)}>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 2 }}>{t.student?.fullName || '—'}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>@{t.student?.username}</p>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)' }}>{t.subject}</td>
                    <td style={{ padding: '12px 16px' }}><Badge label={t.status} color={statusColor[t.status] || 'gray'} /></td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 16px' }}><ChevronRight size={16} color="var(--color-text-muted)" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.subject || ''} size="lg"
          footer={selected && nextStatus[selected?.status] ? (
            <Button onClick={() => handleStatus(selected._id, nextStatus[selected.status])}>
              Mark as {nextStatus[selected.status]?.replace('_', ' ')}
            </Button>
          ) : null}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {selected?.messages?.map((m, i) => {
              const isAdmin = m.sender !== selected?.student?._id;
              return (
                <div key={i} style={{
                  padding: '12px 16px', borderRadius: 'var(--radius-md)',
                  background: isAdmin ? 'var(--color-primary-soft)' : 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                      {isAdmin ? 'Admin' : selected?.student?.fullName}
                    </p>
                    <p style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', margin: 0 }}>
                      {new Date(m.sentAt).toLocaleString()}
                    </p>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: 1.6, margin: 0 }}>{m.message}</p>
                </div>
              );
            })}
            {selected?.status !== 'closed' && (
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <input value={reply} onChange={e => setReply(e.target.value)} placeholder="Write a reply..."
                  style={{ flex: 1, padding: '10px 14px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text)', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-sans)' }} />
                <Button loading={submitting} onClick={handleReply}>Reply</Button>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default AdminTicketsPage;
