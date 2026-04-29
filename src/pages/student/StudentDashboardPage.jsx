import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import { useApi } from '../../hooks/useApi.js';
import { useAuth } from '../../store/AuthContext.jsx';
import API_ENDPOINTS from '../../constants/api-endpoints.js';
import { Library, Ticket, Phone, Clock, ChevronRight } from 'lucide-react';

const TOPIC_COLORS = {
  'Initial Test': 'var(--color-primary)',
  'Interview': 'var(--color-accent)',
  'ISSB': 'var(--color-success)',
};

const StatCard = ({ icon, label, value, color = 'var(--color-primary)' }) => (
  <Card>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</p>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1 }}>{value ?? '—'}</p>
      </div>
      <div style={{ padding: 12, background: 'var(--color-primary-soft)', borderRadius: 'var(--radius-md)', color }}>
        {icon}
      </div>
    </div>
  </Card>
);

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { get, loading, error } = useApi();
  const [openTickets, setOpenTickets] = useState(null);
  const [consultations, setConsultations] = useState(null);
  const [library, setLibrary] = useState(null);

  useEffect(() => {
    get(API_ENDPOINTS.TICKETS.MY_TICKETS).then(res => {
      const tickets = res?.data || [];
      setOpenTickets(tickets.filter(t => t.status === 'open').length);
    }).catch(() => {});
    get(API_ENDPOINTS.CONSULTATIONS.MY).then(res => {
      setConsultations((res?.data || []).length);
    }).catch(() => {});
    get(API_ENDPOINTS.LIBRARY.MY).then(res => setLibrary(res?.data || null)).catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => get(API_ENDPOINTS.USERS.HEARTBEAT, { params: { lat: pos.coords.latitude, lng: pos.coords.longitude } }).catch(() => {}),
          () => get(API_ENDPOINTS.USERS.HEARTBEAT).catch(() => {}),
        );
      } else {
        get(API_ENDPOINTS.USERS.HEARTBEAT).catch(() => {});
      }
    }, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const validityDate = user?.validityDate ? new Date(user.validityDate) : null;
  const daysLeft = validityDate ? Math.max(0, Math.ceil((validityDate - Date.now()) / 86400000)) : null;

  const assignedTopicsCount = (library?.subcategories || []).reduce((n, s) => n + (s.topics?.length || 0), 0);

  return (
    <DashboardLayout>
      <div style={{ padding: '32px 32px' }}>
        <PageHeader
          title={`Welcome back, ${user?.fullName?.split(' ')[0] || 'Student'}`}
          subtitle="Here is your learning overview for today."
        />
        <Alert message={error} />

        {loading && <Loader fullPage />}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
          <StatCard icon={<Library size={22} />} label="Topics Assigned" value={assignedTopicsCount} />
          <StatCard icon={<Clock size={22} />} label="Days Remaining" value={daysLeft} color={daysLeft < 10 ? 'var(--color-error)' : 'var(--color-primary)'} />
          <StatCard icon={<Ticket size={22} />} label="Open Tickets" value={openTickets} />
          <StatCard icon={<Phone size={22} />} label="Consultations" value={consultations} />
        </div>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                {library?.category?.name ? `${library.category.name} — Course Library` : 'Course Library'}
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                {assignedTopicsCount > 0 ? `${assignedTopicsCount} topic${assignedTopicsCount > 1 ? 's' : ''} assigned` : 'No topics assigned yet'}
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/library')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', background: 'var(--color-primary)',
                color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0,
              }}
            >
              Open Library <ChevronRight size={14} />
            </button>
          </div>

          {assignedTopicsCount === 0 && !loading ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Contact your admin to get course access.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(library?.subcategories || []).map(sub => (
                <div key={sub._id} style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', overflow: 'hidden' }}>
                  <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-surface-elevated)' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)' }}>{sub.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginLeft: 8 }}>
                      {sub.topics?.length || 0} topic{sub.topics?.length !== 1 ? 's' : ''} assigned
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, padding: '10px 14px', flexWrap: 'wrap' }}>
                    {(sub.topics || []).map(t => (
                      <span key={t._id} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '4px 12px', borderRadius: 999,
                        background: `${TOPIC_COLORS[t.name] || 'var(--color-primary)'}18`,
                        border: `1px solid ${TOPIC_COLORS[t.name] || 'var(--color-primary)'}40`,
                        fontSize: '0.78rem', fontWeight: 600,
                        color: TOPIC_COLORS[t.name] || 'var(--color-primary)',
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: TOPIC_COLORS[t.name] || 'var(--color-primary)', flexShrink: 0 }} />
                        {t.name}
                        <span style={{ fontWeight: 400, opacity: 0.8 }}>· {t.content?.length || 0} videos</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboardPage;
