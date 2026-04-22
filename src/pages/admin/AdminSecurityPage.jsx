import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import { useApi } from '../../hooks/useApi.js';
import API_ENDPOINTS from '../../constants/api-endpoints.js';
import { ShieldAlert, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

const typeColor = { screenshot_attempt: 'red', screen_recording: 'red', dev_tools_opened: 'yellow', suspicious_activity: 'yellow' };
const typeLabel = { screenshot_attempt: 'Screenshot', screen_recording: 'Screen Recording', dev_tools_opened: 'Dev Tools', suspicious_activity: 'Suspicious' };

const groupByDate = (alerts) => {
  const groups = {};
  alerts.forEach(a => {
    const date = new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!groups[date]) groups[date] = [];
    groups[date].push(a);
  });
  return groups;
};

const AdminSecurityPage = () => {
  const { get, post, loading, error } = useApi();
  const [alerts, setAlerts] = useState([]);
  const [showReviewed, setShowReviewed] = useState(false);
  const [openDates, setOpenDates] = useState({});

  const load = () => {
    const url = showReviewed ? API_ENDPOINTS.SECURITY.ALERTS : `${API_ENDPOINTS.SECURITY.ALERTS}?isReviewed=false`;
    get(url).then(r => {
      const data = r?.data || [];
      setAlerts(data);
      // Latest date auto-open
      if (data.length > 0) {
        const firstDate = new Date(data[0].createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        setOpenDates({ [firstDate]: true });
      }
    }).catch(() => {});
  };

  useEffect(() => { load(); }, [showReviewed]);

  const handleReview = async (id) => {
    await post(API_ENDPOINTS.SECURITY.REVIEW(id), {});
    load();
  };

  const toggleDate = (date) => setOpenDates(p => ({ ...p, [date]: !p[date] }));

  const grouped = groupByDate(alerts);

  if (loading && alerts.length === 0) return <DashboardLayout><Loader fullPage /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        <PageHeader
          title="Security Alerts"
          subtitle="Anti-piracy logs — screenshot and recording attempts."
          actions={
            <Button variant="ghost" onClick={() => setShowReviewed(p => !p)}>
              {showReviewed ? 'Show Unreviewed Only' : 'Show All'}
            </Button>
          }
        />
        <Alert message={error} />

        {alerts.length === 0 && (
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <CheckCircle size={20} color="var(--color-success)" />
              <p style={{ color: 'var(--color-text-muted)' }}>No unreviewed security alerts. All clear!</p>
            </div>
          </Card>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.entries(grouped).map(([date, dateAlerts]) => (
            <Card key={date} padded={false}>
              {/* Date header — clickable */}
              <button
                onClick={() => toggleDate(date)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: openDates[date] ? '1px solid var(--color-border-subtle)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ShieldAlert size={16} color="var(--color-error)" />
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-text)' }}>{date}</span>
                  <span style={{
                    padding: '2px 10px', borderRadius: '999px',
                    background: 'rgba(192,57,43,0.1)', color: 'var(--color-error)',
                    fontSize: '0.72rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
                  }}>{dateAlerts.length} alert{dateAlerts.length !== 1 ? 's' : ''}</span>
                </div>
                {openDates[date] ? <ChevronUp size={18} color="var(--color-text-muted)" /> : <ChevronDown size={18} color="var(--color-text-muted)" />}
              </button>

              {/* Alerts list */}
              {openDates[date] && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {dateAlerts.map((a, i) => (
                    <div key={a._id} style={{
                      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                      flexWrap: 'wrap', gap: 12,
                      padding: '14px 20px',
                      borderBottom: i < dateAlerts.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                      background: a.isReviewed ? 'transparent' : 'rgba(192,57,43,0.02)',
                    }}>
                      <div style={{ display: 'flex', gap: 14, flex: 1, minWidth: 0 }}>
                        {/* Student info */}
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                            <span style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.9rem' }}>
                              {a.student?.fullName || 'Unknown'}
                            </span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                              @{a.student?.username}
                            </span>
                            <Badge label={typeLabel[a.alertType] || a.alertType} color={typeColor[a.alertType] || 'red'} />
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 3 }}>
                            {a.description}
                          </p>
                          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>
                            {new Date(a.createdAt).toLocaleTimeString()} · IP: {a.ip}
                          </p>
                        </div>
                      </div>

                      {/* Action */}
                      <div style={{ flexShrink: 0 }}>
                        {!a.isReviewed ? (
                          <Button size="sm" variant="ghost" onClick={() => handleReview(a._id)}>
                            <CheckCircle size={13} />Dismiss
                          </Button>
                        ) : (
                          <Badge label="Reviewed" color="gray" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSecurityPage;
