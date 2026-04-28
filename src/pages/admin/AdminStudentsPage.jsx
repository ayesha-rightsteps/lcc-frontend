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
import { Plus, UserCheck, UserX, RefreshCw, Clock } from 'lucide-react';

const statusColor = { active: 'green', inactive: 'gray', blocked: 'red' };

const AdminStudentsPage = () => {
  const { get, post, loading, error, setError } = useApi();
  const [students, setStudents] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [created, setCreated] = useState(null);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', courseName: '', paymentAmount: '', courseDuration: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => get(API_ENDPOINTS.USERS.STUDENTS).then(r => setStudents(r?.data || [])).catch(() => {});

  useEffect(() => { load(); }, []);

  const setF = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleAdd = async () => {
    setSubmitting(true);
    try {
      const res = await post(API_ENDPOINTS.USERS.STUDENTS, {
        ...form,
        paymentAmount: Number(form.paymentAmount),
        courseDuration: Number(form.courseDuration),
      });
      setCreated(res?.data);
      setForm({ fullName: '', email: '', phone: '', courseName: '', paymentAmount: '', courseDuration: '' });
      setShowAdd(false);
      load();
    } finally { setSubmitting(false); }
  };

  const handleStatus = async (id, action, extra = {}) => {
    await post(API_ENDPOINTS.USERS.STATUS(id), { action, ...extra });
    load();
  };

  if (loading && students.length === 0) return <DashboardLayout><Loader fullPage /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        <PageHeader
          title="Students"
          subtitle="Onboard and manage all enrolled students."
          actions={<Button onClick={() => setShowAdd(true)}><Plus size={16} />Add Student</Button>}
        />
        <Alert message={error} />

        <Card padded={false}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-elevated)' }}>
                  {['Name', 'Username', 'Course', 'Validity', 'Days Left', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map(s => {
                  const status = s.isBlocked ? 'blocked' : s.isActive ? 'active' : 'inactive';
                  const daysLeft = s.validityDate ? Math.ceil((new Date(s.validityDate) - Date.now()) / 86400000) : null;
                  const daysColor = daysLeft === null ? 'var(--color-text-muted)' : daysLeft <= 0 ? 'var(--color-error)' : daysLeft <= 14 ? 'var(--color-warning)' : 'var(--color-success)';

                  return (
                    <tr key={s._id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text)' }}>{s.fullName}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{s.username}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)' }}>{s.courseName}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{s.validityDate ? new Date(s.validityDate).toLocaleDateString() : '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: daysColor }}>
                          {daysLeft === null ? '—' : daysLeft <= 0 ? 'Expired' : `${daysLeft}d`}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}><Badge label={status} color={statusColor[status] || 'gray'} /></td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {status !== 'active' && <Button size="sm" variant="ghost" onClick={() => handleStatus(s._id, 'reactivate')}><UserCheck size={13} />Activate</Button>}
                          {status === 'active' && <Button size="sm" variant="ghost" onClick={() => handleStatus(s._id, 'deactivate')}><UserX size={13} />Deactivate</Button>}
                          {status !== 'blocked' && <Button size="sm" variant="danger" onClick={() => handleStatus(s._id, 'block')}><UserX size={13} />Block</Button>}
                          <Button size="sm" variant="outline" onClick={() => handleStatus(s._id, 'extend_validity', { extendedDays: 30 })}><Clock size={13} />+30d</Button>
                          <Button size="sm" variant="ghost" onClick={() => post(API_ENDPOINTS.USERS.IPS(s._id), { action: 'reset' }).then(load)}><RefreshCw size={13} />Reset IPs</Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add New Student"
          footer={<><Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button><Button loading={submitting} onClick={handleAdd}>Create Student</Button></>}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input label="Full Name" name="fullName" value={form.fullName} onChange={setF('fullName')} />
            <Input label="Email" name="email" type="email" value={form.email} onChange={setF('email')} />
            <Input label="Phone" name="phone" value={form.phone} onChange={setF('phone')} />
            <Input label="Course Name" name="courseName" value={form.courseName} onChange={setF('courseName')} />
            <Input label="Payment Amount (PKR)" name="paymentAmount" type="number" value={form.paymentAmount} onChange={setF('paymentAmount')} />
            <Input label="Course Duration (Days)" name="courseDuration" type="number" value={form.courseDuration} onChange={setF('courseDuration')} />
          </div>
        </Modal>

        <Modal isOpen={!!created} onClose={() => setCreated(null)} title="Student Created Successfully">
          <Alert message="Credentials have been emailed to the student. Keep these safe:" variant="success" />
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '12px 16px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>USERNAME</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)' }}>{created?.credentialsGenerated?.username}</p>
            </div>
            <div style={{ padding: '12px 16px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>PASSWORD</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)' }}>{created?.credentialsGenerated?.password}</p>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default AdminStudentsPage;
