import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import { useApi } from '../../hooks/useApi.js';
import API_ENDPOINTS from '../../constants/api-endpoints.js';
import { Video, X, BookOpen, ChevronDown, ChevronRight } from 'lucide-react';

const TOPIC_ORDER = ['Initial Test', 'Interview', 'ISSB'];

const TOPIC_COLORS = {
  'Initial Test': 'var(--color-primary)',
  'Interview': 'var(--color-accent)',
  'ISSB': 'var(--color-success)',
};

const DrivePlayer = ({ item, onClose }) => (
  <div
    style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.92)', display: 'flex', flexDirection: 'column' }}
    onContextMenu={e => e.preventDefault()}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Video size={16} color="var(--color-accent)" />
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{item.title}</span>
      </div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}>
        <X size={22} />
      </button>
    </div>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: 900, height: '75vh' }}>
        <iframe
          title={item.title}
          src={`https://drive.google.com/file/d/${item.driveId}/preview`}
          allow="autoplay; encrypted-media"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin"
          style={{ width: '100%', height: '100%', border: 'none', borderRadius: 'var(--radius-lg)', display: 'block' }}
        />
        {/* blocks the pop-out button (top-right of Drive iframe) */}
        <div
          style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 50, zIndex: 10, cursor: 'default', background: 'transparent' }}
          onContextMenu={e => e.preventDefault()}
          onClick={e => e.preventDefault()}
        />
        {/* blocks bottom Drive toolbar (download/open buttons) */}
        <div
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 48, zIndex: 10, cursor: 'default', background: 'transparent' }}
          onContextMenu={e => e.preventDefault()}
          onClick={e => e.preventDefault()}
        />
      </div>
    </div>
  </div>
);

const TopicSection = ({ topic }) => {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(null);
  const color = TOPIC_COLORS[topic.name] || 'var(--color-primary)';

  return (
    <div style={{ marginBottom: 8 }}>
      <div
        onClick={() => setOpen(p => !p)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--color-surface-elevated)', borderRadius: open ? 'var(--radius-md) var(--radius-md) 0 0' : 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', cursor: 'pointer', userSelect: 'none' }}
      >
        {open ? <ChevronDown size={14} color={color} /> : <ChevronRight size={14} color={color} />}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{topic.name}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>({topic.content?.length || 0})</span>
      </div>

      {open && (
        <div style={{ border: '1px solid var(--color-border-subtle)', borderTop: 'none', borderRadius: '0 0 var(--radius-md) var(--radius-md)', background: 'var(--color-bg)' }}>
          {topic.content?.length === 0 && (
            <p style={{ padding: '12px 14px', fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>No videos added yet.</p>
          )}
          {topic.content?.map(c => (
            <div
              key={c._id}
              onClick={() => setPlaying(c)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: '1px solid var(--color-border-subtle)', cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-elevated)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ padding: 8, borderRadius: 'var(--radius-sm)', background: 'var(--color-primary-soft)', color: 'var(--color-primary)', flexShrink: 0 }}>
                <Video size={15} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</p>
                {c.description && <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{c.description}</p>}
              </div>
              <span style={{ fontSize: '0.75rem', color, fontWeight: 600, flexShrink: 0 }}>Watch →</span>
            </div>
          ))}
        </div>
      )}

      {playing && <DrivePlayer item={playing} onClose={() => setPlaying(null)} />}
    </div>
  );
};

const SubcategorySection = ({ sub }) => {
  const [open, setOpen] = useState(true);
  const sortedTopics = (sub.topics || []).slice().sort(
    (a, b) => TOPIC_ORDER.indexOf(a.name) - TOPIC_ORDER.indexOf(b.name)
  );
  const totalVideos = sortedTopics.reduce((n, t) => n + (t.content?.length || 0), 0);

  return (
    <Card style={{ marginBottom: 20 }}>
      <div
        onClick={() => setOpen(p => !p)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: open ? 16 : 0, cursor: 'pointer', userSelect: 'none' }}
      >
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text)' }}>{sub.name}</h3>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginLeft: 4 }}>{totalVideos} videos</span>
      </div>
      {open && sortedTopics.map(t => <TopicSection key={t._id} topic={t} />)}
    </Card>
  );
};

const StudentLibraryPage = () => {
  const { get, loading, error } = useApi();
  const [library, setLibrary] = useState(null);

  useEffect(() => {
    get(API_ENDPOINTS.LIBRARY.MY).then(r => setLibrary(r?.data || null)).catch(() => {});
  }, []);

  if (loading) return <DashboardLayout><Loader fullPage /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        <PageHeader
          title={library?.category?.name ? `${library.category.name} — Course Library` : 'Course Library'}
          subtitle="All video resources for your course track, organised by topic."
        />
        <Alert message={error} />

        {!loading && library?.subcategories?.length === 0 && (
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '40px 0', color: 'var(--color-text-muted)' }}>
              <BookOpen size={40} />
              <p style={{ margin: 0, fontWeight: 600 }}>No topics assigned yet.</p>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>Please contact your admin to get access to course content.</p>
            </div>
          </Card>
        )}

        {library?.subcategories?.map(sub => (
          <SubcategorySection key={sub._id} sub={sub} />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default StudentLibraryPage;
