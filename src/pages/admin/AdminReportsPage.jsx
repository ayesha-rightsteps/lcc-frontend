import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Button from '../../components/ui/Button.jsx';
import { useApi } from '../../hooks/useApi.js';
import API_ENDPOINTS from '../../constants/api-endpoints.js';
import { AlertTriangle, Eye } from 'lucide-react';

const AdminReportsPage = () => {
  const { get, loading, error } = useApi();
  const [suspiciousIps, setSuspiciousIps] = useState([]);
  const [contentLogs, setContentLogs] = useState([]);

  useEffect(() => {
    get(API_ENDPOINTS.REPORTS.SUSPICIOUS_IPS).then(r => setSuspiciousIps(r?.data || [])).catch(() => {});
    get(API_ENDPOINTS.REPORTS.CONTENT_LOGS).then(r => setContentLogs(r?.data || [])).catch(() => {});
  }, []);

  if (loading) return <DashboardLayout><Loader fullPage /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        <PageHeader title="Reports" subtitle="Analytics, suspicious activity, and content access logs." />
        <Alert message={error} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 24, alignItems: 'start' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <AlertTriangle size={18} color="var(--color-warning)" />
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>Suspicious IPs</p>
            </div>
            {suspiciousIps.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No suspicious activity detected.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {suspiciousIps.map((item, i) => (
                  <div key={i} style={{ padding: '12px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                    <p style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>{item.student?.name || 'Unknown'}</p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {item.knownIps?.join(', ')}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-warning)', marginTop: 4 }}>{item.ipCount} unique IPs detected</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Eye size={18} color="var(--color-primary)" />
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>Recent Content Access</p>
            </div>
            {contentLogs.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No access logs yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {contentLogs.map((log, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text)' }}>{log.student?.name || '—'}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{log.content?.title || '—'}</p>
                    </div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', marginLeft: 10 }}>{new Date(log.accessedAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminReportsPage;
