import { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import { useApi } from '../../hooks/useApi.js';
import API_ENDPOINTS from '../../constants/api-endpoints.js';
import {
  Plus, UserCheck, UserX, RefreshCw, Clock, Pencil,
  Search, KeyRound, X, ChevronRight, MapPin, Mail,
  Phone, BookOpen, Calendar, Shield,
} from 'lucide-react';

const LIMIT = 10;

const statusColor = { active: 'green', inactive: 'gray', blocked: 'red' };

const th = {
  padding: '11px 16px', textAlign: 'left',
  fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700,
  color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em',
  whiteSpace: 'nowrap', background: 'var(--color-surface-elevated)',
  borderBottom: '1px solid var(--color-border)',
};

const td = {
  padding: '12px 16px', fontSize: '0.85rem',
  borderBottom: '1px solid var(--color-border-subtle)', whiteSpace: 'nowrap',
};

const selectStyle = {
  width: '100%', padding: '10px 12px',
  border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
  background: 'var(--color-surface)', color: 'var(--color-text)',
  fontSize: '0.875rem', outline: 'none',
};

const labelStyle = {
  display: 'block', fontSize: '0.78rem', fontWeight: 600,
  color: 'var(--color-text-muted)', marginBottom: 6,
  fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em',
};

const InfoRow = ({ icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
    <div style={{ color: 'var(--color-text-muted)', marginTop: 1, flexShrink: 0 }}>{icon}</div>
    <div style={{ minWidth: 0 }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>{label}</p>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text)', margin: 0, wordBreak: 'break-all' }}>{value}</p>
    </div>
  </div>
);

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MiniMap = ({ lat, lng }) => (
  <div style={{ height: 160, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)', marginTop: 10 }}>
    <MapContainer
      key={`${lat}-${lng}`}
      center={[lat, lng]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
      scrollWheelZoom={false}
      dragging={false}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]} />
    </MapContainer>
  </div>
);

const StudentPanel = ({ student, categories, onClose, onUpdated }) => {
  const { post } = useApi();
  const [current, setCurrent] = useState(student);
  const [editForm, setEditForm] = useState({
    fullName: student.fullName || '',
    phone: student.phone || '',
    courseName: student.courseName || '',
    courseDuration: student.courseDuration || '',
    paymentAmount: student.paymentAmount || '',
    category: student.category?._id || '',
  });
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [passStep, setPassStep] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    setCurrent(student);
    setEditForm({
      fullName: student.fullName || '',
      phone: student.phone || '',
      courseName: student.courseName || '',
      courseDuration: student.courseDuration || '',
      paymentAmount: student.paymentAmount || '',
      category: student.category?._id || '',
    });
    setEditing(false);
    setPassStep(null);
  }, [student]);

  const status = current.isBlocked ? 'blocked' : current.isActive ? 'active' : 'inactive';
  const daysLeft = current.validityDate ? Math.ceil((new Date(current.validityDate) - Date.now()) / 86400000) : null;
  const daysColor = daysLeft === null ? 'var(--color-text-muted)' : daysLeft <= 0 ? 'var(--color-error)' : daysLeft <= 14 ? 'var(--color-warning)' : 'var(--color-success)';

  const setEF = (k) => (e) => setEditForm(p => ({ ...p, [k]: e.target.value }));

  const handleEdit = async () => {
    setSubmitting(true);
    try {
      await post(API_ENDPOINTS.USERS.UPDATE(current._id), {
        ...editForm,
        courseDuration: editForm.courseDuration ? Number(editForm.courseDuration) : undefined,
        paymentAmount: editForm.paymentAmount !== '' ? Number(editForm.paymentAmount) : undefined,
        category: editForm.category || null,
      });
      setEditing(false);
      onUpdated();
    } finally { setSubmitting(false); }
  };

  const handleStatus = async (action, extra = {}) => {
    await post(API_ENDPOINTS.USERS.STATUS(current._id), { action, ...extra });
    onUpdated();
  };

  const handleResetIps = async () => {
    await post(API_ENDPOINTS.USERS.IPS(current._id), { action: 'reset' });
    onUpdated();
  };

  const handleSetPassword = async (sendEmail) => {
    setSubmitting(true);
    try {
      await post(API_ENDPOINTS.USERS.SET_PASSWORD(current._id), { password: newPassword, sendEmail });
      setPassStep(null);
      setNewPassword('');
    } finally { setSubmitting(false); }
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.35)', animation: 'fadeIn 0.2s ease' }}
      />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 480, zIndex: 51,
        background: 'var(--color-surface)', borderLeft: '1px solid var(--color-border)',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideInRight 0.25s ease',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, minWidth: 0, marginRight: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Badge label={status} color={statusColor[status]} />
                {daysLeft !== null && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, color: daysColor }}>
                    {daysLeft <= 0 ? 'Expired' : `${daysLeft}d left`}
                  </span>
                )}
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 2px', lineHeight: 1.3 }}>
                {current.fullName}
              </h2>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-primary)', margin: 0 }}>
                @{current.username}
              </p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 4, flexShrink: 0 }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Info */}
          <div>
            <InfoRow icon={<Mail size={14} />} label="Email" value={current.email} />
            <InfoRow icon={<Phone size={14} />} label="Phone" value={current.phone || '—'} />
            <InfoRow icon={<Shield size={14} />} label="Enrollment ID" value={current.enrollmentId || '—'} />
            <InfoRow icon={<BookOpen size={14} />} label="Category" value={current.category?.name || 'Not assigned'} />
            <InfoRow icon={<BookOpen size={14} />} label="Course" value={current.courseName || '—'} />
            <InfoRow icon={<Calendar size={14} />} label="Validity" value={current.validityDate ? new Date(current.validityDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'} />
            {current.lastLat && current.lastLng && (
              <>
                <InfoRow
                  icon={<MapPin size={14} />}
                  label="Last Location"
                  value={
                    <a
                      href={`https://maps.google.com/?q=${current.lastLat},${current.lastLng}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
                    >
                      {Number(current.lastLat).toFixed(4)}, {Number(current.lastLng).toFixed(4)}
                    </a>
                  }
                />
                <MiniMap lat={current.lastLat} lng={current.lastLng} />
              </>
            )}
          </div>

          {/* Edit form */}
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <div
              onClick={() => setEditing(p => !p)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'var(--color-surface-elevated)', cursor: 'pointer', userSelect: 'none' }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <Pencil size={12} style={{ marginRight: 6 }} />Edit Student
              </span>
              <ChevronRight size={14} color="var(--color-text-muted)" style={{ transform: editing ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
            </div>

            {editing && (
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--color-border-subtle)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Input label="Full Name" value={editForm.fullName} onChange={setEF('fullName')} />
                  <Input label="Phone" value={editForm.phone} onChange={setEF('phone')} />
                  <div>
                    <label style={labelStyle}>Category</label>
                    <select value={editForm.category} onChange={setEF('category')} style={selectStyle}>
                      <option value="">No category</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <Input label="Course Name" value={editForm.courseName} onChange={setEF('courseName')} />
                  <Input label="Payment (PKR)" type="number" value={editForm.paymentAmount} onChange={setEF('paymentAmount')} />
                  <Input label="Duration (Days)" type="number" value={editForm.courseDuration} onChange={setEF('courseDuration')} />
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                  <Button size="sm" loading={submitting} onClick={handleEdit}>Save Changes</Button>
                </div>
              </div>
            )}
          </div>

          {/* Set Password */}
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <div
              onClick={() => { setPassStep(p => p ? null : 'input'); setNewPassword(''); }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'var(--color-surface-elevated)', cursor: 'pointer', userSelect: 'none' }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <KeyRound size={12} style={{ marginRight: 6 }} />Set Password
              </span>
              <ChevronRight size={14} color="var(--color-text-muted)" style={{ transform: passStep ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
            </div>

            {passStep === 'input' && (
              <div style={{ padding: '16px', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Input label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimum 6 characters" />
                <Button size="sm" disabled={newPassword.length < 6} onClick={() => setPassStep('confirm')}>Continue</Button>
              </div>
            )}

            {passStep === 'confirm' && (
              <div style={{ padding: '16px', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ padding: '10px 14px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-text-muted)', margin: '0 0 4px' }}>NEW PASSWORD</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>{newPassword}</p>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>Send email to {current.email}?</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button size="sm" variant="outline" loading={submitting} onClick={() => handleSetPassword(false)}>Save Only</Button>
                  <Button size="sm" loading={submitting} onClick={() => handleSetPassword(true)}>Save &amp; Email</Button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Actions</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {status !== 'active' && (
                <Button size="sm" variant="ghost" onClick={() => handleStatus('reactivate')}>
                  <UserCheck size={13} />Reactivate
                </Button>
              )}
              {status === 'active' && (
                <Button size="sm" variant="outline" onClick={() => handleStatus('deactivate')}>
                  <UserX size={13} />Deactivate
                </Button>
              )}
              {status !== 'blocked' && (
                <Button size="sm" variant="danger" onClick={() => handleStatus('block')}>
                  <UserX size={13} />Block
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => handleStatus('extend_validity', { extendedDays: 30 })}>
                <Clock size={13} />+30 Days
              </Button>
              <Button size="sm" variant="ghost" onClick={handleResetIps}>
                <RefreshCw size={13} />Reset IPs
              </Button>
            </div>
          </div>

          {/* Allowed IPs */}
          {current.allowedIps?.length > 0 && (
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Allowed IPs</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {current.allowedIps.map((entry, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', border: `1px solid ${entry.isBlocked ? 'var(--color-error)' : 'var(--color-border-subtle)'}` }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: entry.isBlocked ? 'var(--color-error)' : 'var(--color-text)' }}>{entry.ip}</span>
                    {entry.isBlocked && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-error)' }}>BLOCKED</span>}
                  </div>
                ))}
              </div>
            </div>
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

const AdminStudentsPage = () => {
  const { get, post, loading, error } = useApi();
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [created, setCreated] = useState(null);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', courseName: '', paymentAmount: '', courseDuration: '', category: '' });
  const [submitting, setSubmitting] = useState(false);
  const searchTimer = useRef(null);

  const load = useCallback((p = 1, q = '', cat = '') => {
    const params = { page: p, limit: LIMIT };
    if (q) params.search = q;
    if (cat) params.category = cat;
    get(API_ENDPOINTS.USERS.STUDENTS, { params })
      .then(r => {
        setStudents(r?.data?.items || []);
        setPagination(r?.data?.pagination || { total: 0, page: 1 });
      }).catch(() => {});
  }, []);

  useEffect(() => { load(1, '', ''); }, [load]);

  useEffect(() => {
    get(API_ENDPOINTS.LIBRARY.CATEGORIES).then(r => setCategories(r?.data || [])).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearch(q);
    setPage(1);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => load(1, q, categoryFilter), 350);
  };

  const handleCategoryFilter = (cat) => {
    setCategoryFilter(cat);
    setPage(1);
    load(1, search, cat);
  };

  const handlePage = (p) => { setPage(p); load(p, search, categoryFilter); };

  const reload = () => {
    load(page, search, categoryFilter);
    setSelected(null);
  };

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
      setForm({ fullName: '', email: '', phone: '', courseName: '', paymentAmount: '', courseDuration: '', category: '' });
      setShowAdd(false);
      load(1, search);
    } finally { setSubmitting(false); }
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
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', minWidth: 260 }}>
              <Search size={14} color="var(--color-text-muted)" />
              <input
                value={search}
                onChange={handleSearch}
                placeholder="Search by name, email, username…"
                style={{ background: 'none', border: 'none', outline: 'none', fontSize: '0.85rem', color: 'var(--color-text)', width: '100%', fontFamily: 'var(--font-sans)' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[{ _id: '', name: 'All' }, ...categories].map(cat => (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryFilter(cat._id)}
                  style={{
                    padding: '6px 14px', borderRadius: 'var(--radius-md)', border: '1px solid', fontSize: '0.8rem',
                    fontWeight: categoryFilter === cat._id ? 700 : 400, cursor: 'pointer', fontFamily: 'var(--font-mono)',
                    background: categoryFilter === cat._id ? 'var(--color-primary-soft)' : 'transparent',
                    borderColor: categoryFilter === cat._id ? 'var(--color-primary)' : 'var(--color-border)',
                    color: categoryFilter === cat._id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    transition: 'all 0.15s',
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Username', 'Phone', 'Category', 'Status', ''].map(h => (
                    <th key={h} style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                      {search ? `No students matching "${search}"` : 'No students yet.'}
                    </td>
                  </tr>
                )}
                {students.map(s => {
                  const status = s.isBlocked ? 'blocked' : s.isActive ? 'active' : 'inactive';
                  const isSelected = selected?._id === s._id;
                  return (
                    <tr
                      key={s._id}
                      onClick={() => setSelected(s)}
                      style={{ borderBottom: '1px solid var(--color-border-subtle)', cursor: 'pointer', transition: 'background 0.12s', background: isSelected ? 'var(--color-primary-soft)' : 'transparent' }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--color-surface-elevated)'; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ ...td, fontWeight: 600, color: 'var(--color-text)' }}>{s.fullName}</td>
                      <td style={{ ...td, color: 'var(--color-text-muted)' }}>{s.email}</td>
                      <td style={{ ...td, fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-primary)' }}>{s.username || '—'}</td>
                      <td style={{ ...td, fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{s.phone || '—'}</td>
                      <td style={{ ...td, color: 'var(--color-text-muted)' }}>{s.category?.name || <span style={{ color: 'var(--color-error)', fontSize: '0.75rem' }}>Not set</span>}</td>
                      <td style={td}><Badge label={status} color={statusColor[status] || 'gray'} /></td>
                      <td style={{ ...td, textAlign: 'right' }}><ChevronRight size={16} color="var(--color-text-muted)" /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination page={pagination.page} total={pagination.total} limit={LIMIT} onChange={handlePage} />
        </Card>

        {selected && (
          <StudentPanel
            student={selected}
            categories={categories}
            onClose={() => setSelected(null)}
            onUpdated={reload}
          />
        )}

        <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add New Student"
          footer={<><Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button><Button loading={submitting} onClick={handleAdd}>Create Student</Button></>}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input label="Full Name" value={form.fullName} onChange={setF('fullName')} />
            <Input label="Email" type="email" value={form.email} onChange={setF('email')} />
            <Input label="Phone" value={form.phone} onChange={setF('phone')} />
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={setF('category')} style={selectStyle}>
                <option value="">Select category...</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <Input label="Course Name" value={form.courseName} onChange={setF('courseName')} />
            <Input label="Payment Amount (PKR)" type="number" value={form.paymentAmount} onChange={setF('paymentAmount')} />
            <Input label="Course Duration (Days)" type="number" value={form.courseDuration} onChange={setF('courseDuration')} />
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
