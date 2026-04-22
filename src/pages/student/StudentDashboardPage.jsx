import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import { useApi } from '../../hooks/useApi.js';
import { useAuth } from '../../store/AuthContext.jsx';
import API_ENDPOINTS from '../../constants/api-endpoints.js';
import { BookOpen, Ticket, Phone, Clock } from 'lucide-react';

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
  const { get, loading, error } = useApi();
  const [content, setContent] = useState([]);
  const [openTickets, setOpenTickets] = useState(null);
  const [consultations, setConsultations] = useState(null);

  useEffect(() => {
    get(API_ENDPOINTS.CONTENT.MY_CONTENT).then(res => setContent(res?.data || [])).catch(() => {});
    get(API_ENDPOINTS.TICKETS.MY_TICKETS).then(res => {
      const tickets = res?.data || [];
      setOpenTickets(tickets.filter(t => t.status === 'open').length);
    }).catch(() => {});
    get(API_ENDPOINTS.CONSULTATIONS.MY).then(res => {
      setConsultations((res?.data || []).length);
    }).catch(() => {});
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
          <StatCard icon={<BookOpen size={22} />} label="Content Assigned" value={content.length} />
          <StatCard icon={<Clock size={22} />} label="Days Remaining" value={daysLeft} color={daysLeft < 10 ? 'var(--color-error)' : 'var(--color-primary)'} />
          <StatCard icon={<Ticket size={22} />} label="Open Tickets" value={openTickets} />
          <StatCard icon={<Phone size={22} />} label="Consultations" value={consultations} />
        </div>

        <Card>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
            My Assigned Content
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 20 }}>
            Access your videos and PDFs from the Content tab.
          </p>
          {content.length === 0 && !loading ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No content assigned yet. Contact Sir to get started.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {content.slice(0, 5).map(item => (
                <div key={item._id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-subtle)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <BookOpen size={16} color="var(--color-primary)" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>{item.title}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.type}</span>
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
