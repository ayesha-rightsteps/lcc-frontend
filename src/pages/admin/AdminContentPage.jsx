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
import { Plus, FileText, Video, UserPlus, UserMinus } from 'lucide-react';

const AdminContentPage = () => {
  const { get, post, loading, error } = useApi();
  const [content, setContent] = useState([]);
  const [students, setStudents] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [managing, setManaging] = useState(null);
  const [form, setForm] = useState({ title: '', type: 'video', driveId: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    get(API_ENDPOINTS.CONTENT.BASE).then(r => setContent(r?.data || [])).catch(() => {});
    get(API_ENDPOINTS.USERS.STUDENTS).then(r => setStudents(r?.data || [])).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    setSubmitting(true);
    try {
      await post(API_ENDPOINTS.CONTENT.BASE, form);
      setForm({ title: '', type: 'video', driveId: '' });
      setShowAdd(false);
      load();
    } finally { setSubmitting(false); }
  };

  const handleAccess = async (contentId, studentId, action) => {
    await post(API_ENDPOINTS.CONTENT.ACCESS(contentId), { studentId, action });
    load();
  };

  if (loading && content.length === 0) return <DashboardLayout><Loader fullPage /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        <PageHeader
          title="Content Library"
          subtitle="Manage video lectures and PDF resources."
          actions={<Button onClick={() => setShowAdd(true)}><Plus size={16} />Add Content</Button>}
        />
        <Alert message={error} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {content.map(item => (
            <Card key={item._id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ padding: 10, background: 'var(--color-primary-soft)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)' }}>
                  {item.type === 'video' ? <Video size={18} /> : <FileText size={18} />}
                </div>
                <Badge label={item.type} color={item.type === 'video' ? 'blue' : 'green'} />
              </div>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>{item.title}</p>
              <p style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: 16 }}>
                {item.grantedStudents?.length || 0} students have access
              </p>
              <Button size="sm" variant="outline" onClick={() => setManaging(item)} style={{ width: '100%' }}>Manage Access</Button>
            </Card>
          ))}
        </div>

        <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Content"
          footer={<><Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button><Button loading={submitting} onClick={handleAdd}>Add</Button></>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Title" name="title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Type</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                style={{ padding: '10px 14px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text)', fontSize: '0.9rem', outline: 'none' }}>
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
            <Input label="Google Drive File ID" name="driveId" value={form.driveId} onChange={e => setForm(p => ({ ...p, driveId: e.target.value }))} />
          </div>
        </Modal>

        <Modal isOpen={!!managing} onClose={() => setManaging(null)} title={`Access: ${managing?.title}`} size="lg">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {students.map(s => {
              const hasAccess = managing?.grantedStudents?.includes(s._id);
              return (
                <div key={s._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text)' }}>{s.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{s.username}</p>
                  </div>
                  <Button size="sm" variant={hasAccess ? 'danger' : 'ghost'} onClick={() => handleAccess(managing._id, s._id, hasAccess ? 'revoke' : 'grant')}>
                    {hasAccess ? <><UserMinus size={13} />Revoke</> : <><UserPlus size={13} />Grant</>}
                  </Button>
                </div>
              );
            })}
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default AdminContentPage;
