import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { useApi } from '../../hooks/useApi.js';
import { useAuth } from '../../store/AuthContext.jsx';
import API_ENDPOINTS from '../../constants/api-endpoints.js';
import { Plus, ChevronRight } from 'lucide-react';

const statusColor = { open: 'blue', in_progress: 'yellow', resolved: 'green', closed: 'gray' };

const StudentTicketsPage = () => {
  const { get, post, loading, error, setError } = useApi();
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ subject: '', message: '' });
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => get(API_ENDPOINTS.TICKETS.MY_TICKETS).then(r => setTickets(r?.data || [])).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.subject.trim() || !form.message.trim()) return;
    setSubmitting(true);
    try {
      await post(API_ENDPOINTS.TICKETS.BASE, form);
      setForm({ subject: '', message: '' });
      setShowNew(false);
      load();
    } finally { setSubmitting(false); }
  };

  const handleReply = async () => {
    if (!reply.trim() || !selected) return;
    setSubmitting(true);
    try {
      await post(API_ENDPOINTS.TICKETS.REPLY(selected._id), { message: reply });
      setReply('');
      const updated = await get(`${API_ENDPOINTS.TICKETS.BASE}/${selected._id}`);
      setSelected(updated?.data);
    } finally { setSubmitting(false); }
  };

  if (loading && tickets.length === 0) return <DashboardLayout><Loader fullPage /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        <PageHeader
          title="Support Tickets"
          subtitle="Raise a query and Sir's team will respond."
          actions={<Button onClick={() => setShowNew(true)}><Plus size={16} />New Ticket</Button>}
        />
        <Alert message={error} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tickets.length === 0 && <Card><p style={{ color: 'var(--color-text-muted)' }}>No tickets yet.</p></Card>}
          {tickets.map(t => (
            <Card key={t._id} style={{ cursor: 'pointer' }} onClick={() => setSelected(t)}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>{t.subject}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Badge label={t.status} color={statusColor[t.status] || 'gray'} />
                  <ChevronRight size={16} color="var(--color-text-muted)" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="New Support Ticket"
          footer={<><Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button><Button loading={submitting} onClick={handleCreate}>Submit</Button></>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Subject" name="subject" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Message</label>
              <textarea
                value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                rows={5}
                style={{ padding: '10px 14px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text)', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-sans)' }}
              />
            </div>
          </div>
        </Modal>

        <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.subject || ''} size="lg">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {selected?.messages?.map((m, i) => {
              const isMe = m.sender === user?._id;
              return (
                <div key={i} style={{
                  padding: '12px 16px', borderRadius: 'var(--radius-md)',
                  background: isMe ? 'var(--color-surface-elevated)' : 'var(--color-primary-soft)',
                  border: '1px solid var(--color-border-subtle)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                      {isMe ? 'You' : 'Sir'}
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
                <input
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  placeholder="Write a reply..."
                  style={{ flex: 1, padding: '10px 14px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text)', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-sans)' }}
                />
                <Button loading={submitting} onClick={handleReply}>Reply</Button>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default StudentTicketsPage;
