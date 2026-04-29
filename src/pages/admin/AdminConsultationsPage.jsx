import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import { useApi } from '../../hooks/useApi.js';
import API_ENDPOINTS from '../../constants/api-endpoints.js';
import { X, Check, XCircle, CheckCircle, Calendar, ChevronRight, Phone } from 'lucide-react';

const STATUS_TABS = ['all', 'pending', 'accepted', 'completed', 'rejected'];
const statusColor = { pending: 'yellow', accepted: 'blue', rejected: 'red', completed: 'green' };

const panelTd = { padding: '8px 0', fontSize: '0.83rem', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', gap: 16 };

const ConsultationPanel = ({ c, onClose, onUpdated }) => {
  const { post } = useApi();

  const [view, setView] = useState('detail');
  const [acceptForm, setAcceptForm] = useState({ meetingLink: '', meetingDate: '', meetingTime: '' });
  const [rejectForm, setRejectForm] = useState({ rejectionReason: '' });
  const [completeForm, setCompleteForm] = useState({ paymentStatus: 'not_applicable', paymentAmount: '' });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  const setA = (k) => (e) => setAcceptForm(p => ({ ...p, [k]: e.target.value }));
  const setC = (k) => (e) => setCompleteForm(p => ({ ...p, [k]: e.target.value }));

  const handleAccept = async () => {
    setErr('');
    if (!acceptForm.meetingLink || !acceptForm.meetingDate || !acceptForm.meetingTime) {
      setErr('All fields are required.');
      return;
    }
    setSubmitting(true);
    try {
      await post(API_ENDPOINTS.CONSULTATIONS.ACCEPT(c._id), {
        meetingLink: acceptForm.meetingLink,
        meetingDate: new Date(acceptForm.meetingDate).toISOString(),
        meetingTime: acceptForm.meetingTime,
      });
      onUpdated();
      onClose();
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to accept.');
    } finally { setSubmitting(false); }
  };

  const handleReject = async () => {
    setSubmitting(true);
    try {
      await post(API_ENDPOINTS.CONSULTATIONS.REJECT(c._id), { rejectionReason: rejectForm.rejectionReason });
      onUpdated();
      onClose();
    } finally { setSubmitting(false); }
  };

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      const body = { status: 'completed', paymentStatus: completeForm.paymentStatus };
      if (completeForm.paymentStatus === 'paid') body.paymentAmount = Number(completeForm.paymentAmount) || 0;
      await post(API_ENDPOINTS.CONSULTATIONS.COMPLETE(c._id), body);
      onUpdated();
      onClose();
    } finally { setSubmitting(false); }
  };

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, height: '100%', width: 420, background: 'var(--color-surface)', borderLeft: '1px solid var(--color-border)', zIndex: 200, display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 24px rgba(0,0,0,0.08)', overflowY: 'auto' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ padding: 8, background: 'var(--color-primary-soft)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)' }}><Phone size={16} /></div>
          <div>
            <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)', margin: 0 }}>Consultation</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-text-muted)', margin: 0 }}>{c._id}</p>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 4 }}><X size={18} /></button>
      </div>

      <div style={{ padding: '20px 24px', flex: 1 }}>
        <Badge label={c.status} color={statusColor[c.status] || 'gray'} />

        <div style={{ marginTop: 16, marginBottom: 20 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Reason</p>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text)', lineHeight: 1.6, margin: 0 }}>{c.reason}</p>
        </div>

        <div style={{ marginBottom: 20 }}>
          {[
            ['Student', c.student?.fullName || '—'],
            ['Email', c.student?.email || '—'],
            ['Session Type', c.isFree ? 'Free' : 'Paid'],
            ['Submitted', new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })],
            c.scheduledAt && ['Scheduled', new Date(c.scheduledAt).toLocaleString()],
            c.meetLink && ['Meet Link', c.meetLink],
            c.rejectionReason && ['Rejection Reason', c.rejectionReason],
            c.paymentStatus && c.paymentStatus !== 'not_applicable' && ['Payment', `${c.paymentStatus} — PKR ${(c.paymentAmount || 0).toLocaleString()}`],
          ].filter(Boolean).map(([label, val]) => (
            <div key={label} style={panelTd}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{label}</span>
              <span style={{ fontWeight: 600, color: 'var(--color-text)', textAlign: 'right', wordBreak: 'break-all' }}>{val}</span>
            </div>
          ))}
        </div>

        {c.status === 'pending' && (
          <div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
              {['detail', 'accept', 'reject'].map(v => (
                <button key={v} onClick={() => { setView(v); setErr(''); }}
                  style={{ padding: '6px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-mono)',
                    background: view === v ? 'var(--color-primary)' : 'transparent',
                    borderColor: view === v ? 'var(--color-primary)' : 'var(--color-border)',
                    color: view === v ? '#fff' : 'var(--color-text-muted)',
                  }}>
                  {v === 'detail' ? 'Overview' : v === 'accept' ? 'Accept' : 'Reject'}
                </button>
              ))}
            </div>

            {view === 'accept' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {err && <p style={{ color: 'var(--color-error)', fontSize: '0.8rem' }}>{err}</p>}
                <Input label="Google Meet Link" value={acceptForm.meetingLink} onChange={setA('meetingLink')} placeholder="https://meet.google.com/..." />
                <Input label="Meeting Date" type="date" value={acceptForm.meetingDate} onChange={setA('meetingDate')} />
                <Input label="Meeting Time" value={acceptForm.meetingTime} onChange={setA('meetingTime')} placeholder="e.g. 10:00 AM" />
                <Button loading={submitting} onClick={handleAccept}><Check size={15} />Confirm & Accept</Button>
              </div>
            )}

            {view === 'reject' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Input label="Rejection Reason (optional)" value={rejectForm.rejectionReason} onChange={e => setRejectForm({ rejectionReason: e.target.value })} placeholder="Brief reason..." />
                <Button variant="danger" loading={submitting} onClick={handleReject}><XCircle size={15} />Reject Consultation</Button>
              </div>
            )}
          </div>
        )}

        {c.status === 'accepted' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Mark as Completed</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {['not_applicable', 'paid'].map(v => (
                <button key={v} onClick={() => setCompleteForm(p => ({ ...p, paymentStatus: v }))}
                  style={{ flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-mono)',
                    background: completeForm.paymentStatus === v ? 'var(--color-primary)' : 'transparent',
                    borderColor: completeForm.paymentStatus === v ? 'var(--color-primary)' : 'var(--color-border)',
                    color: completeForm.paymentStatus === v ? '#fff' : 'var(--color-text-muted)',
                  }}>
                  {v === 'not_applicable' ? 'Free' : 'Paid'}
                </button>
              ))}
            </div>
            {completeForm.paymentStatus === 'paid' && (
              <Input label="Payment Amount (PKR)" type="number" value={completeForm.paymentAmount} onChange={setC('paymentAmount')} placeholder="e.g. 2500" />
            )}
            <Button loading={submitting} onClick={handleComplete}><CheckCircle size={15} />Mark Complete</Button>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminConsultationsPage = () => {
  const { get, error } = useApi();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [selected, setSelected] = useState(null);

  const load = () => {
    setLoading(true);
    get(API_ENDPOINTS.CONSULTATIONS.BASE)
      .then(r => setConsultations(r?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = tab === 'all' ? consultations : consultations.filter(c => c.status === tab);

  const counts = STATUS_TABS.reduce((acc, s) => {
    acc[s] = s === 'all' ? consultations.length : consultations.filter(c => c.status === s).length;
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <div style={{ padding: '32px', paddingRight: selected ? 460 : 32, transition: 'padding-right 0.25s ease' }}>
        <PageHeader title="Consultations" subtitle="Review and schedule student consultation requests." />
        <Alert message={error} />

        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          {STATUS_TABS.map(s => (
            <button key={s} onClick={() => setTab(s)}
              style={{
                padding: '7px 16px', borderRadius: 'var(--radius-md)', border: '1px solid', fontSize: '0.82rem', fontWeight: tab === s ? 700 : 400, cursor: 'pointer', fontFamily: 'var(--font-mono)',
                background: tab === s ? 'var(--color-primary-soft)' : 'transparent',
                borderColor: tab === s ? 'var(--color-primary)' : 'var(--color-border)',
                color: tab === s ? 'var(--color-primary)' : 'var(--color-text-muted)',
                transition: 'all 0.15s',
              }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
              <span style={{ marginLeft: 6, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', opacity: 0.7 }}>({counts[s]})</span>
            </button>
          ))}
        </div>

        {loading && <Loader />}

        {!loading && filtered.length === 0 && (
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '32px 0', color: 'var(--color-text-muted)' }}>
              <Calendar size={36} />
              <p style={{ margin: 0 }}>No {tab === 'all' ? '' : tab} consultations.</p>
            </div>
          </Card>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(c => (
            <div key={c._id}
              onClick={() => setSelected(c._id === selected?._id ? null : c)}
              style={{
                padding: '14px 18px', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
                border: `1px solid ${selected?._id === c._id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                <div style={{ padding: 8, background: 'var(--color-primary-soft)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)', flexShrink: 0 }}>
                  <Calendar size={16} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text)', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.student?.fullName || '—'}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.reason?.slice(0, 80)}{c.reason?.length > 80 ? '…' : ''}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                  {new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
                <Badge label={c.status} color={statusColor[c.status] || 'gray'} />
                <ChevronRight size={15} color="var(--color-text-muted)" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <>
          <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 199 }} />
          <ConsultationPanel c={selected} onClose={() => setSelected(null)} onUpdated={load} />
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminConsultationsPage;
