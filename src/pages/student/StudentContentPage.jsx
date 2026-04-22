import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { useApi } from '../../hooks/useApi.js';
import API_ENDPOINTS from '../../constants/api-endpoints.js';
import { FileText, Video, X, ShieldOff } from 'lucide-react';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const ContentViewer = ({ item, onClose }) => {
  const token = localStorage.getItem('accessToken');
  const streamUrl = `${BASE}/v1${API_ENDPOINTS.CONTENT.STREAM(item._id)}`;


  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShieldOff size={16} color="var(--color-accent)" />
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{item.title}</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}>
          <X size={22} />
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        {item.type === 'video' ? (
          <video
            controls
            controlsList="nodownload nofullscreen"
            disablePictureInPicture
            style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 'var(--radius-lg)' }}
            src={`${streamUrl}?token=${token}`}
          />
        ) : (
          <iframe
            title={item.title}
            src={`${streamUrl}?token=${token}`}
            style={{ width: '100%', height: '80vh', border: 'none', borderRadius: 'var(--radius-lg)' }}
          />
        )}
      </div>
    </div>
  );
};

const StudentContentPage = () => {
  const { get, loading, error } = useApi();
  const [content, setContent] = useState([]);
  const [viewing, setViewing] = useState(null);

  useEffect(() => {
    get(API_ENDPOINTS.CONTENT.MY_CONTENT).then(res => setContent(res?.data || [])).catch(() => {});
  }, []);

  if (loading) return <DashboardLayout><Loader fullPage /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        <PageHeader title="My Content" subtitle="Your assigned video lectures and PDF resources." />
        <Alert message={error} />
        {content.length === 0 && !loading ? (
          <Card><p style={{ color: 'var(--color-text-muted)' }}>No content assigned yet.</p></Card>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {content.map(item => (
              <Card key={item._id} style={{ cursor: 'pointer', transition: 'box-shadow 0.2s', padding: 0 }}>
                <div
                  style={{ padding: 20 }}
                  onClick={() => setViewing(item)}
                  onMouseEnter={e => { e.currentTarget.parentElement.style.boxShadow = 'var(--shadow-accent)'; e.currentTarget.parentElement.style.borderColor = 'var(--color-accent)'; }}
                  onMouseLeave={e => { e.currentTarget.parentElement.style.boxShadow = 'var(--shadow-card)'; e.currentTarget.parentElement.style.borderColor = 'var(--color-border)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ padding: 10, background: 'var(--color-primary-soft)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)' }}>
                      {item.type === 'video' ? <Video size={20} /> : <FileText size={20} />}
                    </div>
                    <Badge label={item.type} color={item.type === 'video' ? 'blue' : 'green'} />
                  </div>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>{item.title}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600 }}>Click to open →</p>
                </div>
              </Card>
            ))}
          </div>
        )}
        {viewing && <ContentViewer item={viewing} onClose={() => setViewing(null)} />}
      </div>
    </DashboardLayout>
  );
};

export default StudentContentPage;
