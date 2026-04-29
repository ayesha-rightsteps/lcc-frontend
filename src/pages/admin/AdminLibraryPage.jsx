import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { useApi } from '../../hooks/useApi.js';
import API_ENDPOINTS from '../../constants/api-endpoints.js';
import { Plus, Video, ChevronDown, ChevronRight, BookOpen } from 'lucide-react';

const TOPIC_ORDER = ['Initial Test', 'Interview', 'ISSB'];

const TopicBlock = ({ topic, onAddContent }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <div
        onClick={() => setOpen(p => !p)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', cursor: 'pointer', background: 'var(--color-surface-elevated)', userSelect: 'none' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{topic.name}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>({topic.content?.length || 0} videos)</span>
        </div>
        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onAddContent(topic); }}>
          <Plus size={13} /> Add Video
        </Button>
      </div>

      {open && (
        <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid var(--color-border-subtle)' }}>
          {topic.content?.length === 0 && (
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>No videos yet.</p>
          )}
          {topic.content?.map(c => (
            <div key={c._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)' }}>
              <Video size={15} color="var(--color-accent)" />
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>{c.title}</p>
                {c.description && <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', margin: 0 }}>{c.description}</p>}
              </div>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{c.driveId}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SubcategoryBlock = ({ sub, onAddContent }) => {
  const [open, setOpen] = useState(true);
  const sortedTopics = (sub.topics || []).slice().sort(
    (a, b) => TOPIC_ORDER.indexOf(a.name) - TOPIC_ORDER.indexOf(b.name)
  );

  return (
    <Card style={{ marginBottom: 16 }}>
      <div
        onClick={() => setOpen(p => !p)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: open ? 12 : 0, cursor: 'pointer', userSelect: 'none' }}
      >
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>{sub.name}</h3>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginLeft: 4 }}>
          {sortedTopics.reduce((n, t) => n + (t.content?.length || 0), 0)} total videos
        </span>
      </div>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sortedTopics.map(t => (
            <TopicBlock key={t._id} topic={t} onAddContent={onAddContent} />
          ))}
        </div>
      )}
    </Card>
  );
};

const AdminLibraryPage = () => {
  const { get, post, error } = useApi();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [library, setLibrary] = useState(null);
  const [loadingLib, setLoadingLib] = useState(false);

  const [showAddSub, setShowAddSub] = useState(false);
  const [subName, setSubName] = useState('');
  const [submittingSub, setSubmittingSub] = useState(false);

  const [addContentTopic, setAddContentTopic] = useState(null);
  const [contentForm, setContentForm] = useState({ title: '', description: '', driveId: '' });
  const [submittingContent, setSubmittingContent] = useState(false);

  useEffect(() => {
    get(API_ENDPOINTS.LIBRARY.CATEGORIES).then(r => {
      const cats = r?.data || [];
      setCategories(cats);
      if (cats.length > 0) setActiveCategory(cats[0]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeCategory) return;
    setLoadingLib(true);
    get(API_ENDPOINTS.LIBRARY.CATEGORY(activeCategory._id))
      .then(r => setLibrary(r?.data || null))
      .catch(() => {})
      .finally(() => setLoadingLib(false));
  }, [activeCategory]);

  const reload = () => {
    if (!activeCategory) return;
    setLoadingLib(true);
    get(API_ENDPOINTS.LIBRARY.CATEGORY(activeCategory._id))
      .then(r => setLibrary(r?.data || null))
      .catch(() => {})
      .finally(() => setLoadingLib(false));
  };

  const handleAddSubcategory = async () => {
    if (!subName.trim()) return;
    setSubmittingSub(true);
    try {
      await post(API_ENDPOINTS.LIBRARY.SUBCATEGORIES, { name: subName.trim(), categoryId: activeCategory._id });
      setSubName('');
      setShowAddSub(false);
      reload();
    } finally { setSubmittingSub(false); }
  };

  const handleAddContent = async () => {
    if (!contentForm.title || !contentForm.driveId) return;
    setSubmittingContent(true);
    try {
      await post(API_ENDPOINTS.LIBRARY.CONTENT, { ...contentForm, topicId: addContentTopic._id });
      setContentForm({ title: '', description: '', driveId: '' });
      setAddContentTopic(null);
      reload();
    } finally { setSubmittingContent(false); }
  };

  const setC = (k) => (e) => setContentForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        <PageHeader
          title="Course Library"
          subtitle="Manage subcategories and video content for each course track."
          actions={
            activeCategory && (
              <Button onClick={() => setShowAddSub(true)}>
                <Plus size={16} /> Add Subcategory
              </Button>
            )
          }
        />
        <Alert message={error} />

        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor: activeCategory?._id === cat._id ? 'var(--color-primary)' : 'var(--color-border)',
                background: activeCategory?._id === cat._id ? 'var(--color-primary-soft)' : 'var(--color-surface)',
                color: activeCategory?._id === cat._id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: activeCategory?._id === cat._id ? 700 : 400,
                fontFamily: 'var(--font-heading)',
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loadingLib && <Loader />}

        {!loadingLib && library && (
          <>
            {library.subcategories?.length === 0 && (
              <Card>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '32px 0', color: 'var(--color-text-muted)' }}>
                  <BookOpen size={36} />
                  <p style={{ margin: 0 }}>No subcategories yet. Add one to get started.</p>
                </div>
              </Card>
            )}
            {library.subcategories?.map(sub => (
              <SubcategoryBlock key={sub._id} sub={sub} onAddContent={setAddContentTopic} />
            ))}
          </>
        )}

        <Modal
          isOpen={showAddSub}
          onClose={() => { setShowAddSub(false); setSubName(''); }}
          title={`Add Subcategory — ${activeCategory?.name || ''}`}
          footer={
            <>
              <Button variant="ghost" onClick={() => { setShowAddSub(false); setSubName(''); }}>Cancel</Button>
              <Button loading={submittingSub} onClick={handleAddSubcategory}>Create</Button>
            </>
          }
        >
          <Input
            label="Subcategory Name (e.g. GD Pilot, Short Service Commission)"
            value={subName}
            onChange={(e) => setSubName(e.target.value)}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 8 }}>
            3 topics (Initial Test, Interview, ISSB) will be created automatically.
          </p>
        </Modal>

        <Modal
          isOpen={!!addContentTopic}
          onClose={() => { setAddContentTopic(null); setContentForm({ title: '', description: '', driveId: '' }); }}
          title={`Add Video — ${addContentTopic?.name || ''}`}
          footer={
            <>
              <Button variant="ghost" onClick={() => { setAddContentTopic(null); setContentForm({ title: '', description: '', driveId: '' }); }}>Cancel</Button>
              <Button loading={submittingContent} onClick={handleAddContent}>Add Video</Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="Video Title" value={contentForm.title} onChange={setC('title')} />
            <Input label="Description (optional)" value={contentForm.description} onChange={setC('description')} />
            <Input label="Google Drive File ID" value={contentForm.driveId} onChange={setC('driveId')} />
            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Drive File ID is the part after /d/ in the share link.
            </p>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default AdminLibraryPage;
