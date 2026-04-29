import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { useApi } from '../../hooks/useApi.js';
import API_ENDPOINTS from '../../constants/api-endpoints.js';
import { MapPin, Search, Users } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const PRIMARY = '#2d6a4f';
const ACCENT = '#c9a84c';

const makeIcon = (color) => L.divIcon({
  className: '',
  html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.35);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -10],
});

const activeIcon = makeIcon(PRIMARY);
const blockedIcon = makeIcon('#c0392b');
const inactiveIcon = makeIcon('#94a3b8');

const FlyTo = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 12, { duration: 1.2 });
  }, [coords]);
  return null;
};

const statusColor = { active: 'green', inactive: 'gray', blocked: 'red' };

const AdminLocationMapPage = () => {
  const { get } = useApi();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [flyTo, setFlyTo] = useState(null);
  const [selected, setSelected] = useState(null);
  const markerRefs = useRef({});

  useEffect(() => {
    get(API_ENDPOINTS.USERS.STUDENTS)
      .then(r => setStudents(r?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const mapped = students.filter(s => s.lastLat && s.lastLng);
  const unmapped = students.length - mapped.length;

  const filtered = search.trim()
    ? mapped.filter(s =>
        s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        s.enrollmentId?.toLowerCase().includes(search.toLowerCase())
      )
    : mapped;

  const getStatus = (s) => s.isBlocked ? 'blocked' : s.isActive ? 'active' : 'inactive';
  const getIcon = (s) => s.isBlocked ? blockedIcon : s.isActive ? activeIcon : inactiveIcon;

  const handleSelect = (student) => {
    setSelected(student);
    setFlyTo([student.lastLat, student.lastLng]);
    const marker = markerRefs.current[student._id];
    if (marker) marker.openPopup();
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '32px', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
        <PageHeader
          title="Student Location Map"
          subtitle={loading ? 'Loading…' : `${mapped.length} students tracked · ${unmapped} without location`}
        />

        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader />
          </div>
        ) : (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, minHeight: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--color-surface)' }}>
              <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border-subtle)', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 10px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  <Search size={13} color="var(--color-text-muted)" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search student…"
                    style={{ background: 'none', border: 'none', outline: 'none', fontSize: '0.82rem', color: 'var(--color-text)', width: '100%', fontFamily: 'var(--font-sans)' }}
                  />
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {filtered.length === 0 && (
                  <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.83rem' }}>
                    <Users size={28} style={{ opacity: 0.3, margin: '0 auto 8px' }} />
                    <p style={{ margin: 0 }}>No students with location data.</p>
                  </div>
                )}
                {filtered.map(s => {
                  const status = getStatus(s);
                  const isSelected = selected?._id === s._id;
                  return (
                    <div
                      key={s._id}
                      onClick={() => handleSelect(s)}
                      style={{
                        padding: '10px 14px', borderBottom: '1px solid var(--color-border-subtle)',
                        cursor: 'pointer', transition: 'background 0.12s',
                        background: isSelected ? 'var(--color-primary-soft)' : 'transparent',
                        display: 'flex', alignItems: 'center', gap: 10,
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--color-surface-elevated)'; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: status === 'active' ? PRIMARY : status === 'blocked' ? '#c0392b' : '#94a3b8', flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: '0.83rem', color: 'var(--color-text)', margin: '0 0 1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.fullName}</p>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-muted)', margin: 0 }}>{s.enrollmentId || s.email}</p>
                      </div>
                      <Badge label={status} color={statusColor[status]} style={{ marginLeft: 'auto', flexShrink: 0 }} />
                    </div>
                  );
                })}
              </div>

              <div style={{ padding: '10px 14px', borderTop: '1px solid var(--color-border-subtle)', flexShrink: 0, display: 'flex', gap: 12 }}>
                {[{ color: PRIMARY, label: 'Active' }, { color: '#c0392b', label: 'Blocked' }, { color: '#94a3b8', label: 'Inactive' }].map(({ color, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
              <MapContainer
                center={[30.3753, 69.3451]}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {flyTo && <FlyTo coords={flyTo} />}
                {filtered.map(s => (
                  <Marker
                    key={s._id}
                    position={[s.lastLat, s.lastLng]}
                    icon={getIcon(s)}
                    ref={ref => { if (ref) markerRefs.current[s._id] = ref; }}
                  >
                    <Popup>
                      <div style={{ fontFamily: 'system-ui, sans-serif', minWidth: 180 }}>
                        <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: '0 0 4px', color: '#1a1a1a' }}>{s.fullName}</p>
                        <p style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#666', margin: '0 0 6px' }}>{s.enrollmentId || s.email}</p>
                        <p style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 4px' }}>
                          <strong>Category:</strong> {s.category?.name || '—'}
                        </p>
                        <p style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: '#aaa', margin: 0 }}>
                          {Number(s.lastLat).toFixed(4)}, {Number(s.lastLng).toFixed(4)}
                        </p>
                        <a
                          href={`https://maps.google.com/?q=${s.lastLat},${s.lastLng}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ display: 'inline-block', marginTop: 8, fontSize: '0.72rem', color: PRIMARY, fontWeight: 600, textDecoration: 'none' }}
                        >
                          Open in Google Maps →
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminLocationMapPage;
