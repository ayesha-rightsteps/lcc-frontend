import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import { useApi } from '../../hooks/useApi.js';
import API_ENDPOINTS from '../../constants/api-endpoints.js';
import { Users, BookOpen, Ticket, Bell, AlertTriangle } from 'lucide-react';

const StatCard = ({ icon, label, value, sub = '' }) => (
  <Card>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</p>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1 }}>{value ?? '—'}</p>
        {sub && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 6 }}>{sub}</p>}
      </div>
      <div style={{ padding: 12, background: 'var(--color-primary-soft)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)' }}>{icon}</div>
    </div>
  </Card>
);

const AdminDashboardPage = () => {
  const { get, loading, error } = useApi();
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    get(API_ENDPOINTS.REPORTS.SUMMARY).then(r => setSummary(r?.data)).catch(() => {});
    get(API_ENDPOINTS.SECURITY.ALERTS + '?isReviewed=false').then(r => setAlerts(r?.data || [])).catch(() => {});
  }, []);

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        <PageHeader title="Admin Overview" subtitle="Your command center for the ISSB Smart Study academy." />
        <Alert message={error} />
        {loading && <Loader fullPage />}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
          <StatCard icon={<Users size={22} />} label="Total Students" value={summary?.totalStudents} />
          <StatCard icon={<Users size={22} />} label="Active Students" value={summary?.activeStudents} />
          <StatCard icon={<BookOpen size={22} />} label="Content Items" value={summary?.totalContent} />
          <StatCard icon={<Ticket size={22} />} label="Open Tickets" value={summary?.openTickets} />
          <StatCard icon={<Bell size={22} />} label="Unread Alerts" value={alerts.length} sub={alerts.length > 0 ? 'Piracy attempts detected' : 'All clear'} />
        </div>

        {summary?.expiringSoon?.length > 0 && (
          <Card style={{ marginBottom: 24, borderColor: 'var(--color-warning)', background: 'rgba(224,123,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <AlertTriangle size={18} color="var(--color-warning)" />
              <p style={{ fontWeight: 700, color: 'var(--color-warning)' }}>Expiring Soon</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {summary.expiringSoon.map(s => (
                <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>{s.fullName}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-warning)' }}>Expires {new Date(s.validityDate).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {alerts.length > 0 && (
          <Card style={{ borderColor: 'var(--color-error)', background: 'rgba(192,57,43,0.04)' }}>
            <p style={{ fontWeight: 700, color: 'var(--color-error)', marginBottom: 12 }}>Recent Security Alerts</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {alerts.slice(0, 5).map(a => (
                <div key={a._id} style={{ fontSize: '0.85rem', color: 'var(--color-text)', padding: '8px 12px', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                  <strong>{a.student?.fullName || 'Unknown'}</strong> — {a.type} — {new Date(a.createdAt).toLocaleString()}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
