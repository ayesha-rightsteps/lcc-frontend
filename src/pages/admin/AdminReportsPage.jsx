import { useEffect, useState, useCallback } from 'react';
import ReactApexChart from 'react-apexcharts';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Button from '../../components/ui/Button.jsx';
import { useApi } from '../../hooks/useApi.js';
import API_ENDPOINTS from '../../constants/api-endpoints.js';
import {
  Clock, Phone, Ticket, AlertTriangle, MapPin, X, Users, TrendingUp,
} from 'lucide-react';

const TABS = [
  { id: 'expiring', label: 'Expiring Students', icon: <Clock size={15} /> },
  { id: 'consultations', label: 'Consultations', icon: <Phone size={15} /> },
  { id: 'tickets', label: 'Tickets', icon: <Ticket size={15} /> },
  { id: 'security', label: 'Suspicious IPs', icon: <AlertTriangle size={15} /> },
  { id: 'radar', label: 'Student Radar', icon: <MapPin size={15} /> },
];

const StatBox = ({ label, value, color = 'var(--color-primary)' }) => (
  <div style={{ padding: '16px 20px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', textAlign: 'center' }}>
    <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color, margin: '0 0 4px' }}>{value ?? '—'}</p>
    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{label}</p>
  </div>
);

const th = { padding: '10px 14px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', background: 'var(--color-surface-elevated)', borderBottom: '1px solid var(--color-border)' };
const td = { padding: '10px 14px', fontSize: '0.83rem', borderBottom: '1px solid var(--color-border-subtle)', whiteSpace: 'nowrap' };

const ExpiringTab = () => {
  const { get } = useApi();
  const [data, setData] = useState([]);
  const [days, setDays] = useState(90);
  const [loading, setLoading] = useState(false);

  const load = useCallback((d) => {
    setLoading(true);
    get(`${API_ENDPOINTS.REPORTS.EXPIRING}?days=${d}`)
      .then(r => setData(r?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(90); }, []);

  const handleDays = (d) => { setDays(d); load(d); };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          {data.length} student{data.length !== 1 ? 's' : ''} expiring within {days} days
        </p>
        <div style={{ display: 'flex', gap: 6 }}>
          {[7, 14, 30, 60].map(d => (
            <button key={d} onClick={() => handleDays(d)} style={{ padding: '5px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid', borderColor: days === d ? 'var(--color-primary)' : 'var(--color-border)', background: days === d ? 'var(--color-primary-soft)' : 'var(--color-surface)', color: days === d ? 'var(--color-primary)' : 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      {loading && <Loader />}
      {!loading && data.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>No students expiring in this window.</p>}
      {!loading && data.length > 0 && (
        <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['Name', 'Email', 'Phone', 'Course', 'Enrollment ID', 'Expires', 'Days Left'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {data.map(s => {
                const daysLeft = Math.ceil((new Date(s.validityDate) - Date.now()) / 86400000);
                const col = daysLeft <= 3 ? 'var(--color-error)' : daysLeft <= 7 ? 'var(--color-warning)' : 'var(--color-success)';
                return (
                  <tr key={s._id}>
                    <td style={{ ...td, fontWeight: 600, color: 'var(--color-text)' }}>{s.fullName}</td>
                    <td style={{ ...td, color: 'var(--color-text-muted)' }}>{s.email}</td>
                    <td style={{ ...td, fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{s.phone || '—'}</td>
                    <td style={{ ...td, color: 'var(--color-text-muted)' }}>{s.courseName || '—'}</td>
                    <td style={{ ...td, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{s.enrollmentId}</td>
                    <td style={{ ...td, fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{new Date(s.validityDate).toLocaleDateString()}</td>
                    <td style={td}><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: col }}>{daysLeft}d</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const ConsultationsTab = () => {
  const { get } = useApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get(API_ENDPOINTS.REPORTS.CONSULTATIONS)
      .then(r => setData(r?.data || null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (!data) return <p style={{ color: 'var(--color-text-muted)' }}>No data.</p>;

  const donutSeries = [data.pending, data.accepted, data.completed, data.rejected];
  const donutOptions = {
    chart: { type: 'donut', background: 'transparent' },
    labels: ['Pending', 'Accepted', 'Completed', 'Rejected'],
    colors: ['#e07b00', '#2d6a4f', '#16a34a', '#c0392b'],
    legend: { position: 'bottom', fontFamily: 'monospace', fontSize: '12px' },
    plotOptions: { pie: { donut: { size: '65%', labels: { show: true, total: { show: true, label: 'Total', fontFamily: 'monospace', fontSize: '13px', color: '#888', formatter: () => data.total } } } } },
    dataLabels: { enabled: false },
    tooltip: { style: { fontFamily: 'monospace' } },
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 24 }}>
        <StatBox label="Total" value={data.total} />
        <StatBox label="Pending" value={data.pending} color="var(--color-warning)" />
        <StatBox label="Accepted" value={data.accepted} color="var(--color-primary)" />
        <StatBox label="Completed" value={data.completed} color="var(--color-success)" />
        <StatBox label="Rejected" value={data.rejected} color="var(--color-error)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Status Breakdown</p>
          <ReactApexChart options={donutOptions} series={donutSeries} type="donut" height={220} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ padding: '20px', background: 'var(--color-primary-soft)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>Total Revenue</p>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
              PKR {(data.totalRevenue || 0).toLocaleString()}
            </p>
          </div>
          <div style={{ padding: '20px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>Paid Sessions</p>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>{data.paidSessions}</p>
          </div>
        </div>
      </div>

      {data.recentPaid?.length > 0 && (
        <>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Recent Paid Sessions</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.recentPaid.map(c => (
              <div key={c._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text)', margin: 0 }}>{c.student?.fullName || '—'}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', margin: 0 }}>{c.student?.email}</p>
                </div>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-success)', margin: 0 }}>PKR {(c.paymentAmount || 0).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const TicketsTab = () => {
  const { get } = useApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get(API_ENDPOINTS.REPORTS.TICKETS)
      .then(r => setData(r?.data || null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (!data) return <p style={{ color: 'var(--color-text-muted)' }}>No data.</p>;

  const bars = [
    { label: 'Open', value: data.open, color: 'var(--color-primary)' },
    { label: 'In Progress', value: data.inProgress, color: 'var(--color-warning)' },
    { label: 'Resolved', value: data.resolved, color: 'var(--color-success)' },
    { label: 'Closed', value: data.closed, color: '#94a3b8' },
  ];

  const donutSeries = [data.open, data.inProgress, data.resolved, data.closed];
  const donutOptions = {
    chart: { type: 'donut', background: 'transparent' },
    labels: ['Open', 'In Progress', 'Resolved', 'Closed'],
    colors: ['#2d6a4f', '#e07b00', '#16a34a', '#94a3b8'],
    legend: { position: 'bottom', fontFamily: 'monospace', fontSize: '12px' },
    plotOptions: { pie: { donut: { size: '65%', labels: { show: true, total: { show: true, label: 'Total', fontFamily: 'monospace', fontSize: '13px', color: '#888', formatter: () => data.total } } } } },
    dataLabels: { enabled: false },
    tooltip: { style: { fontFamily: 'monospace' } },
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 24 }}>
        <StatBox label="Total" value={data.total} />
        {bars.map(b => <StatBox key={b.label} label={b.label} value={b.value} color={b.color} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Status Breakdown</p>
          <ReactApexChart options={donutOptions} series={donutSeries} type="donut" height={220} />
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Distribution</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {bars.map(b => {
              const pct = data.total ? Math.round((b.value / data.total) * 100) : 0;
              return (
                <div key={b.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text)' }}>{b.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: b.color, fontWeight: 700 }}>{b.value} ({pct}%)</span>
                  </div>
                  <div style={{ height: 7, borderRadius: 4, background: 'var(--color-border)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: b.color, borderRadius: 4, transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const SecurityTab = () => {
  const { get } = useApi();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get(API_ENDPOINTS.REPORTS.SUSPICIOUS_IPS)
      .then(r => setData(r?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (!data.length) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '40px 0', color: 'var(--color-text-muted)' }}>
      <AlertTriangle size={36} color="var(--color-success)" />
      <p style={{ margin: 0, fontWeight: 600 }}>No suspicious IP activity detected.</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.map(item => (
        <div key={item.studentId} style={{ padding: '14px 16px', background: 'rgba(192,57,43,0.04)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-error)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)', margin: 0 }}>{item.fullName}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>{item.email}</p>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--color-error)', color: '#fff' }}>
              {item.blockedIps?.length} blocked IP{item.blockedIps?.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {item.blockedIps?.map(ip => (
              <span key={ip} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', padding: '2px 8px', background: 'var(--color-surface)', border: '1px solid var(--color-error)', borderRadius: 'var(--radius-sm)', color: 'var(--color-error)' }}>{ip}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const RadarTab = () => {
  const { get } = useApi();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [radar, setRadar] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    get(API_ENDPOINTS.USERS.STUDENTS).then(r => setStudents(r?.data || [])).catch(() => {});
  }, []);

  const lookup = (student) => {
    setLoading(true);
    setRadar(null);
    get(API_ENDPOINTS.REPORTS.RADAR(student._id))
      .then(r => setRadar({ ...r?.data, studentName: student.fullName }))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const filtered = students.filter(s =>
    !search || s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    s.enrollmentId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
      <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--color-surface)' }}>
        <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border-subtle)' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student..."
            style={{ width: '100%', padding: '7px 10px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text)', fontSize: '0.83rem', outline: 'none', fontFamily: 'var(--font-sans)', boxSizing: 'border-box' }} />
        </div>
        <div style={{ maxHeight: 380, overflowY: 'auto' }}>
          {filtered.map(s => (
            <div key={s._id} onClick={() => lookup(s)} style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border-subtle)', cursor: 'pointer', transition: 'background 0.12s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-elevated)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
              <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text)', margin: '0 0 2px' }}>{s.fullName}</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-text-muted)', margin: 0 }}>{s.enrollmentId || s.email}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 20, background: 'var(--color-surface)' }}>
        {!radar && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10, color: 'var(--color-text-muted)', minHeight: 200 }}>
            <MapPin size={36} />
            <p style={{ margin: 0 }}>Select a student to see their radar data.</p>
          </div>
        )}
        {loading && <Loader />}
        {!loading && radar && (
          <div>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 16 }}>{radar.studentName}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ padding: '12px 16px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Last Seen</p>
                <p style={{ fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>{radar.lastSeen ? new Date(radar.lastSeen).toLocaleString() : '—'}</p>
              </div>
              <div style={{ padding: '12px 16px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Location</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                  {radar.lastLat && radar.lastLng ? `${radar.lastLat.toFixed(4)}, ${radar.lastLng.toFixed(4)}` : 'Not available'}
                </p>
              </div>
            </div>

            {radar.lastLat && radar.lastLng && (
              <a href={`https://maps.google.com/?q=${radar.lastLat},${radar.lastLng}`} target="_blank" rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: '7px 14px', background: 'var(--color-primary-soft)', borderRadius: 'var(--radius-sm)', color: 'var(--color-primary)', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>
                <MapPin size={14} /> Open in Google Maps
              </a>
            )}

            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Registered IPs</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {radar.allowedIps?.length === 0 && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>No IPs registered.</p>}
              {radar.allowedIps?.map((entry, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: entry.isBlocked ? 'rgba(192,57,43,0.05)' : 'var(--color-bg)', borderRadius: 'var(--radius-sm)', border: `1px solid ${entry.isBlocked ? 'var(--color-error)' : 'var(--color-border-subtle)'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: entry.isBlocked ? 'var(--color-error)' : 'var(--color-success)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: entry.isBlocked ? 'var(--color-error)' : 'var(--color-text)' }}>{entry.ip}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{entry.device || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TAB_COMPONENTS = {
  expiring: ExpiringTab,
  consultations: ConsultationsTab,
  tickets: TicketsTab,
  security: SecurityTab,
  radar: RadarTab,
};

const AdminReportsPage = () => {
  const [activeTab, setActiveTab] = useState('expiring');
  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        <PageHeader title="Reports" subtitle="Analytics, student tracking, and revenue insights." />

        <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-border)',
                background: activeTab === tab.id ? 'var(--color-primary-soft)' : 'var(--color-surface)',
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: activeTab === tab.id ? 700 : 400,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        <Card>
          <ActiveComponent key={activeTab} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminReportsPage;
