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
import { Check, X, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

const statusColor = { pending: 'yellow', accepted: 'green', rejected: 'red', completed: 'blue' };
const REASON_LIMIT = 80;

const AdminConsultationsPage = () => {
  const { get, post, loading, error } = useApi();
  const [consultations, setConsultations] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [accepting, setAccepting] = useState(null);
  const [acceptForm, setAcceptForm] = useState({ meetingLink: '', meetingDate: '', meetingTime: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => get(API_ENDPOINTS.CONSULTATIONS.BASE).then(r => setConsultations(r?.data || [])).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleAccept = async () => {
    setSubmitting(true);
    try {
      await post(API_ENDPOINTS.CONSULTATIONS.ACCEPT(accepting._id), acceptForm);
      setAccepting(null);
      setAcceptForm({ meetingLink: '', meetingDate: '', meetingTime: '' });
      load();
    } finally { setSubmitting(false); }
  };

  const handleReject = async (id) => {
    await post(API_ENDPOINTS.CONSULTATIONS.REJECT(id), {});
    load();
  };

  if (loading && consultations.length === 0) return <DashboardLayout><Loader fullPage /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        <PageHeader title="Consultations" subtitle="Review and schedule student consultation requests." />
        <Alert message={error} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {consultations.length === 0 && <Card><p style={{ color: 'var(--color-text-muted)' }}>No consultation requests.</p></Card>}
          {consultations.map(c => (
            <Card key={c._id}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <div style={{ padding: 10, background: 'var(--color-primary-soft)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)', flexShrink: 0 }}>
                    <Calendar size={18} />
                  </div>
                  <div>
                    {(() => {
                      const isLong = c.reason?.length > REASON_LIMIT;
                      const isOpen = expanded[c._id];
                      return (
                        <div style={{ marginBottom: 4 }}>
                          <p style={{ fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
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
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>
                      {c.student?.fullName} · {c.student?.email} · {c.isFree ? 'Free Session' : 'Paid'}
                    </p>
                    {c.scheduledAt && <p style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>Scheduled: {new Date(c.scheduledAt).toLocaleString()}</p>}
                    {c.meetLink && <a href={c.meetLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--color-info)' }}>Join Meet →</a>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Badge label={c.status} color={statusColor[c.status] || 'gray'} />
                  {c.status === 'pending' && (
                    <>
                      <Button size="sm" onClick={() => setAccepting(c)}><Check size={14} />Accept</Button>
                      <Button size="sm" variant="danger" onClick={() => handleReject(c._id)}><X size={14} />Reject</Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Modal isOpen={!!accepting} onClose={() => setAccepting(null)} title="Accept Consultation"
          footer={<><Button variant="ghost" onClick={() => setAccepting(null)}>Cancel</Button><Button loading={submitting} onClick={handleAccept}>Confirm & Notify Student</Button></>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Alert message="An email with the Meet link and schedule will be sent to the student automatically." variant="info" />
            <Input label="Google Meet Link" name="meetingLink" value={acceptForm.meetingLink} onChange={e => setAcceptForm(p => ({ ...p, meetingLink: e.target.value }))} placeholder="https://meet.google.com/..." />
            <Input label="Meeting Date" name="meetingDate" type="date" value={acceptForm.meetingDate} onChange={e => setAcceptForm(p => ({ ...p, meetingDate: e.target.value }))} />
            <Input label="Meeting Time" name="meetingTime" value={acceptForm.meetingTime} onChange={e => setAcceptForm(p => ({ ...p, meetingTime: e.target.value }))} placeholder="e.g. 10:00 AM" />
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default AdminConsultationsPage;
