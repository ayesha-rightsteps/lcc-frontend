import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import { useApi } from '../../hooks/useApi.js';
import API_ENDPOINTS from '../../constants/api-endpoints.js';
import { Users, Phone, Ticket, Bell, AlertTriangle, TrendingUp, ShieldAlert } from 'lucide-react';

const PRIMARY = '#2d6a4f';
const ACCENT = '#c9a84c';
const ERROR = '#c0392b';

const StatCard = ({ icon, label, value, sub = '', color = PRIMARY }) => (
  <Card>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</p>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1 }}>{value ?? '—'}</p>
        {sub && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 6 }}>{sub}</p>}
      </div>
      <div style={{ padding: 12, background: `${color}18`, borderRadius: 'var(--radius-md)', color }}>{icon}</div>
    </div>
  </Card>
);

const DAYS_OPTIONS = [7, 14, 30, null];

const GrowthChart = () => {
  const { get } = useApi();
  const [days, setDays] = useState(7);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = days ? { days } : { days: 90 };
    get(API_ENDPOINTS.REPORTS.STUDENT_GROWTH, { params })
      .then(r => setData(r?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [days]);

  const totalInPeriod = data.reduce((n, d) => n + d.count, 0);

  const series = [{ name: 'New Students', data: data.map(d => d.count) }];

  const options = {
    chart: {
      type: 'area',
      height: 240,
      toolbar: { show: false },
      sparkline: { enabled: false },
      background: 'transparent',
      animations: { enabled: true, speed: 400 },
    },
    stroke: { curve: 'smooth', width: 2.5, colors: [PRIMARY] },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.02,
        stops: [0, 100],
        colorStops: [
          { offset: 0, color: PRIMARY, opacity: 0.35 },
          { offset: 100, color: PRIMARY, opacity: 0.02 },
        ],
      },
    },
    markers: { size: 4, colors: [PRIMARY], strokeWidth: 0, hover: { size: 6 } },
    xaxis: {
      categories: data.map(d => {
        const dt = new Date(d.date);
        return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      }),
      labels: {
        style: { fontSize: '11px', fontFamily: 'monospace', colors: '#888' },
        rotate: -30,
        rotateAlways: days > 14,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      tickAmount: 3,
      forceNiceScale: true,
      labels: {
        style: { fontSize: '11px', fontFamily: 'monospace', colors: '#888' },
        formatter: v => Math.round(v),
      },
    },
    grid: { borderColor: '#e5e7eb', strokeDashArray: 4, xaxis: { lines: { show: false } } },
    tooltip: {
      theme: 'light',
      y: { formatter: v => `${v} student${v !== 1 ? 's' : ''}` },
      style: { fontSize: '12px', fontFamily: 'monospace' },
    },
    dataLabels: { enabled: false },
  };

  return (
    <Card style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <TrendingUp size={18} color={PRIMARY} />
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
            Student Enrollments
          </p>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {DAYS_OPTIONS.map(d => (
            <button
              key={d ?? 'all'}
              onClick={() => setDays(d)}
              style={{
                padding: '4px 12px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600,
                fontFamily: 'var(--font-mono)', cursor: 'pointer', border: '1px solid',
                background: days === d ? PRIMARY : 'transparent',
                borderColor: days === d ? PRIMARY : 'var(--color-border)',
                color: days === d ? '#fff' : 'var(--color-text-muted)',
                transition: 'all 0.12s',
              }}
            >
              {d === null ? 'All' : `${d}d`}
            </button>
          ))}
        </div>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 16px' }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: PRIMARY, marginRight: 6 }}>{totalInPeriod}</span>
        new student{totalInPeriod !== 1 ? 's' : ''} {days ? `in the last ${days} days` : 'all time'}
      </p>

      {loading ? (
        <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader />
        </div>
      ) : (
        <ReactApexChart options={options} series={series} type="area" height={240} />
      )}
    </Card>
  );
};

const makeTrendOptions = (data, color, label) => ({
  chart: { type: 'bar', height: 180, toolbar: { show: false }, background: 'transparent', animations: { enabled: true, speed: 400 } },
  plotOptions: { bar: { columnWidth: '55%', borderRadius: 3 } },
  fill: { colors: [color] },
  xaxis: {
    categories: data.map(d => {
      const dt = new Date(d.date);
      return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    }),
    labels: { style: { fontSize: '10px', fontFamily: 'monospace', colors: '#888' }, rotate: -30, rotateAlways: data.length > 14 },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    min: 0,
    tickAmount: 3,
    forceNiceScale: true,
    labels: { style: { fontSize: '10px', fontFamily: 'monospace', colors: '#888' }, formatter: v => Math.round(v) },
  },
  grid: { borderColor: '#e5e7eb', strokeDashArray: 4, xaxis: { lines: { show: false } } },
  tooltip: {
    theme: 'light',
    y: { formatter: v => `${v} ${label}` },
    style: { fontSize: '12px', fontFamily: 'monospace' },
  },
  dataLabels: { enabled: false },
});

const MiniTrendChart = ({ endpoint, label, color, icon, title }) => {
  const { get } = useApi();
  const [days, setDays] = useState(7);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = days ? { days } : { days: 90 };
    get(endpoint, { params })
      .then(r => setData(r?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [days]);

  const total = data.reduce((n, d) => n + d.count, 0);
  const series = [{ name: label, data: data.map(d => d.count) }];
  const options = makeTrendOptions(data, color, label.toLowerCase());

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon}
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>{title}</p>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {DAYS_OPTIONS.map(d => (
            <button
              key={d ?? 'all'}
              onClick={() => setDays(d)}
              style={{
                padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 600,
                fontFamily: 'var(--font-mono)', cursor: 'pointer', border: '1px solid',
                background: days === d ? color : 'transparent',
                borderColor: days === d ? color : 'var(--color-border)',
                color: days === d ? '#fff' : 'var(--color-text-muted)',
                transition: 'all 0.12s',
              }}
            >
              {d === null ? 'All' : `${d}d`}
            </button>
          ))}
        </div>
      </div>
      <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: '0 0 12px' }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color, marginRight: 6 }}>{total}</span>
        {label.toLowerCase()} {days ? `in the last ${days} days` : 'all time'}
      </p>
      {loading ? (
        <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader /></div>
      ) : (
        <ReactApexChart options={options} series={series} type="bar" height={180} />
      )}
    </Card>
  );
};

const ALERT_LABELS = {
  screenshot_attempt: 'Screenshot',
  screen_recording: 'Screen Recording',
  dev_tools_opened: 'Dev Tools',
  suspicious_activity: 'Suspicious Activity',
  new_ip_login_attempt: 'New IP Login',
};

const ALERT_COLORS = ['#c0392b', '#e07b00', '#7c3aed', '#0369a1', '#b45309'];

const ALERT_DAYS_OPTIONS = [7, 14, 30, null];

const AlertBreakdownChart = () => {
  const { get } = useApi();
  const [days, setDays] = useState(7);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = days ? { days } : {};
    get(API_ENDPOINTS.REPORTS.ALERT_BREAKDOWN, { params })
      .then(r => setData(r?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [days]);

  const total = data.reduce((n, d) => n + d.count, 0);

  const options = {
    chart: { type: 'bar', toolbar: { show: false }, background: 'transparent', animations: { enabled: true, speed: 400 } },
    plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '55%', distributed: true } },
    colors: ALERT_COLORS,
    xaxis: {
      categories: data.map(d => ALERT_LABELS[d.alertType] || d.alertType),
      labels: { style: { fontSize: '11px', fontFamily: 'monospace', colors: '#888' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { fontSize: '11px', fontFamily: 'monospace', colors: '#888' } } },
    grid: { borderColor: '#e5e7eb', strokeDashArray: 4, yaxis: { lines: { show: false } } },
    tooltip: { theme: 'light', style: { fontSize: '12px', fontFamily: 'monospace' }, y: { formatter: v => `${v} alert${v !== 1 ? 's' : ''}` } },
    dataLabels: { enabled: true, style: { fontSize: '11px', fontFamily: 'monospace', colors: ['#fff'] }, formatter: v => v },
    legend: { show: false },
  };

  return (
    <Card style={{ height: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldAlert size={18} color={ERROR} />
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
            Security Alert Types
          </p>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {ALERT_DAYS_OPTIONS.map(d => (
            <button
              key={d ?? 'all'}
              onClick={() => setDays(d)}
              style={{
                padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 600,
                fontFamily: 'var(--font-mono)', cursor: 'pointer', border: '1px solid',
                background: days === d ? ERROR : 'transparent',
                borderColor: days === d ? ERROR : 'var(--color-border)',
                color: days === d ? '#fff' : 'var(--color-text-muted)',
                transition: 'all 0.12s',
              }}
            >
              {d === null ? 'All' : `${d}d`}
            </button>
          ))}
        </div>
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 16px' }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: ERROR, marginRight: 6 }}>{total}</span>
        total alert{total !== 1 ? 's' : ''} {days ? `in the last ${days} days` : 'all time'}
      </p>
      {loading ? (
        <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader /></div>
      ) : data.length === 0 ? (
        <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          No alerts recorded yet.
        </div>
      ) : (
        <ReactApexChart options={options} series={[{ name: 'Alerts', data: data.map(d => d.count) }]} type="bar" height={Math.max(140, data.length * 44)} />
      )}
    </Card>
  );
};

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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 20, marginBottom: 28 }}>
          <StatCard icon={<Users size={20} />} label="Total Students" value={summary?.totalStudents} />
          <StatCard icon={<Users size={20} />} label="Active Students" value={summary?.activeStudents} />
          <StatCard icon={<Phone size={20} />} label="Pending Consultations" value={summary?.pendingConsultations} color={ACCENT} />
          <StatCard icon={<Ticket size={20} />} label="Open Tickets" value={summary?.openTickets} color={ACCENT} />
          <StatCard icon={<Bell size={20} />} label="Unread Alerts" value={alerts.length} sub={alerts.length > 0 ? 'Piracy attempts' : 'All clear'} color={alerts.length > 0 ? ERROR : PRIMARY} />
        </div>

        <GrowthChart />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <MiniTrendChart
            endpoint={API_ENDPOINTS.REPORTS.TICKET_TREND}
            label="Tickets"
            color={ACCENT}
            icon={<Ticket size={16} color={ACCENT} />}
            title="Ticket Activity"
          />
          <MiniTrendChart
            endpoint={API_ENDPOINTS.REPORTS.CONSULTATION_TREND}
            label="Consultations"
            color="#7c3aed"
            icon={<Phone size={16} color="#7c3aed" />}
            title="Consultation Requests"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24, alignItems: 'stretch' }}>
          <AlertBreakdownChart />
          {alerts.length > 0 ? (
            <Card style={{ height: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <ShieldAlert size={18} color={ERROR} />
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Recent Security Alerts</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {alerts.slice(0, 5).map(a => (
                  <div key={a._id} style={{ fontSize: '0.83rem', color: 'var(--color-text)', padding: '8px 12px', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: `1px solid ${ERROR}22`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 700, margin: 0, fontSize: '0.83rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.student?.fullName || 'Unknown'}</p>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{a.alertType?.replace(/_/g, ' ')}</p>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-text-muted)', flexShrink: 0 }}>{new Date(a.createdAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card style={{ height: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <ShieldAlert size={18} color={ERROR} />
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Recent Security Alerts</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 140, color: 'var(--color-text-muted)', gap: 8 }}>
                <ShieldAlert size={28} color="var(--color-success)" />
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>All clear — no alerts.</p>
              </div>
            </Card>
          )}
        </div>

        {summary?.expiringSoon?.length > 0 && (
          <Card style={{ marginBottom: 24, borderColor: 'var(--color-warning)', background: 'rgba(224,123,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <AlertTriangle size={18} color="var(--color-warning)" />
              <p style={{ fontWeight: 700, color: 'var(--color-warning)', margin: 0 }}>Expiring Soon (within 14 days)</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {summary.expiringSoon.map(s => (
                <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>{s.fullName}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-warning)' }}>
                    {new Date(s.validityDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
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
