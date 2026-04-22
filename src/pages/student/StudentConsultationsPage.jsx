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
import API_ENDPOINTS from '../../constants/api-endpoints.js';
import { Plus, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

const statusColor = { pending: 'yellow', accepted: 'green', rejected: 'red', completed: 'blue' };

const REASON_LIMIT = 80;

const StudentConsultationsPage = () => {
  const { get, post, loading, error } = useApi();
  const [consultations, setConsultations] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => get(API_ENDPOINTS.CONSULTATIONS.MY).then(r => setConsultations(r?.data || [])).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.subject.trim()) return;
    setSubmitting(true);
    try {
      const reason = form.message.trim()
        ? `${form.subject.trim()} — ${form.message.trim()}`
        : form.subject.trim();
      await post(API_ENDPOINTS.CONSULTATIONS.BASE, { reason });
      setForm({ subject: '', message: '' });
      setShowNew(false);
      load();
    } finally { setSubmitting(false); }
  };

  if (loading && consultations.length === 0) return <DashboardLayout><Loader fullPage /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        <PageHeader
          title="Consultations"
          subtitle="Request a 1-on-1 session with Sir."
          actions={<Button onClick={() => setShowNew(true)}><Plus size={16} />Request Session</Button>}
        />
        <Alert message={error} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {consultations.length === 0 && <Card><p style={{ color: 'var(--color-text-muted)' }}>No consultations yet.</p></Card>}
          {consultations.map(c => (
            <Card key={c._id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ padding: 10, background: 'var(--color-primary-soft)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)', flexShrink: 0 }}>
                    <Calendar size={18} />
                  </div>
                  <div>
                    {(() => {
                      const isLong = c.reason?.length > REASON_LIMIT;
                      const isOpen = expanded[c._id];
                      return (
                        <div style={{ marginBottom: 4 }}>
                          <p style={{ fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
                            {isLong && !isOpen ? `${c.reason.slice(0, REASON_LIMIT)}...` : c.reason}
                          </p>
                          {isLong && (
                            <button
                              onClick={() => setExpanded(p => ({ ...p, [c._id]: !p[c._id] }))}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 3, marginTop: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 600, padding: 0 }}
                            >
                              {isOpen ? <><ChevronUp size={13} />Show less</> : <><ChevronDown size={13} />Show more</>}
                            </button>
                          )}
                        </div>
                      );
                    })()}
                    {c.scheduledAt && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>
                        Scheduled: {new Date(c.scheduledAt).toLocaleString()}
                      </p>
                    )}
                    {c.meetLink && (
                      <a href={c.meetLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--color-info)' }}>
                        Join Google Meet →
                      </a>
                    )}
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4 }}>{new Date(c.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge label={c.status} color={statusColor[c.status] || 'gray'} />
              </div>
            </Card>
          ))}
        </div>

        <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="Request a Session"
          footer={<><Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button><Button loading={submitting} onClick={handleCreate}>Submit Request</Button></>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Subject / Topic" name="subject" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="e.g. ISSB Psychological Tests" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Additional details (optional)</label>
              <textarea
                value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                rows={4}
                style={{ padding: '10px 14px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text)', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-sans)' }}
              />
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default StudentConsultationsPage;
