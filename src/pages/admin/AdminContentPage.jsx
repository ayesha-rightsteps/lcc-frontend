import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Button from '../../components/ui/Button.jsx';
import { useApi } from '../../hooks/useApi.js';
import API_ENDPOINTS from '../../constants/api-endpoints.js';
import { Search, BookOpen, ChevronDown, ChevronRight, User, ChevronLeft } from 'lucide-react';

const LIST_LIMIT = 8;

const TOPIC_ORDER = ['Initial Test', 'Interview', 'ISSB'];
const TOPIC_COLORS = {
  'Initial Test': 'var(--color-primary)',
  'Interview': 'var(--color-accent)',
  'ISSB': 'var(--color-success)',
};

const TopicRow = ({ topic, studentId, onToggle, toggling }) => {
  const color = TOPIC_COLORS[topic.name] || 'var(--color-primary)';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 14px',
      background: topic.hasAccess ? 'rgba(var(--color-success-rgb, 34,197,94), 0.06)' : 'var(--color-bg)',
      borderRadius: 'var(--radius-sm)',
      border: `1px solid ${topic.hasAccess ? 'var(--color-success)' : 'var(--color-border-subtle)'}`,
      transition: 'all 0.15s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: topic.hasAccess ? 'var(--color-success)' : 'var(--color-border)' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700, color }}>{topic.name}</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>({topic.content?.length || 0} videos)</span>
      </div>
      <Button
        size="sm"
        variant={topic.hasAccess ? 'danger' : 'ghost'}
        loading={toggling[topic._id]}
        onClick={() => onToggle(topic._id, topic.hasAccess)}
      >
        {topic.hasAccess ? 'Revoke' : 'Grant'}
      </Button>
    </div>
  );
};

const SubcategoryBlock = ({ sub, studentId, onToggle, toggling }) => {
  const [open, setOpen] = useState(true);
  const sorted = (sub.topics || []).slice().sort(
    (a, b) => TOPIC_ORDER.indexOf(a.name) - TOPIC_ORDER.indexOf(b.name)
  );
  const grantedCount = sorted.filter(t => t.hasAccess).length;

  return (
    <div style={{ marginBottom: 12, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <div
        onClick={() => setOpen(p => !p)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'var(--color-surface-elevated)', cursor: 'pointer', userSelect: 'none' }}
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)', fontFamily: 'var(--font-heading)', flex: 1 }}>{sub.name}</span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px',
          borderRadius: 'var(--radius-sm)',
          background: grantedCount > 0 ? 'var(--color-primary-soft)' : 'var(--color-surface)',
          color: grantedCount > 0 ? 'var(--color-primary)' : 'var(--color-text-muted)',
        }}>
          {grantedCount}/{sorted.length} granted
        </span>
      </div>
      {open && (
        <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid var(--color-border-subtle)' }}>
          {sorted.map(t => (
            <TopicRow key={t._id} topic={t} studentId={studentId} onToggle={onToggle} toggling={toggling} />
          ))}
        </div>
      )}
    </div>
  );
};

const AdminContentPage = () => {
  const { get, post, error } = useApi();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [listPage, setListPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [accessData, setAccessData] = useState(null);
  const [loadingAccess, setLoadingAccess] = useState(false);
  const [toggling, setToggling] = useState({});

  useEffect(() => {
    get(API_ENDPOINTS.USERS.STUDENTS).then(r => setStudents(r?.data || [])).catch(() => {});
  }, []);

  const loadAccess = useCallback((studentId) => {
    setLoadingAccess(true);
    get(API_ENDPOINTS.LIBRARY.ACCESS(studentId))
      .then(r => setAccessData(r?.data || null))
      .catch(() => {})
      .finally(() => setLoadingAccess(false));
  }, []);

  const handleSelect = (student) => {
    setSelected(student);
    setAccessData(null);
    loadAccess(student._id);
  };

  const handleToggle = async (topicId, currentAccess) => {
    setToggling(p => ({ ...p, [topicId]: true }));
    await post(API_ENDPOINTS.LIBRARY.MANAGE_ACCESS, {
      studentId: selected._id,
      topicId,
      action: currentAccess ? 'revoke' : 'grant',
    }).catch(() => {});
    setToggling(p => ({ ...p, [topicId]: false }));
    loadAccess(selected._id);
  };

  const filtered = students.filter(s =>
    !search || s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    s.enrollmentId?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );
  const totalListPages = Math.ceil(filtered.length / LIST_LIMIT);
  const pagedStudents = filtered.slice((listPage - 1) * LIST_LIMIT, listPage * LIST_LIMIT);

  return (
    <DashboardLayout>
      <div style={{ padding: '32px', height: 'calc(100vh - 0px)', display: 'flex', flexDirection: 'column' }}>
        <PageHeader
          title="Assign Content"
          subtitle="Select a student to manage their library topic access."
        />
        <Alert message={error} />

        <div style={{ display: 'flex', gap: 20, flex: 1, minHeight: 0 }}>
          <div style={{
            width: 300, flexShrink: 0,
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-surface)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <Search size={14} color="var(--color-text-muted)" />
                <input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setListPage(1); }}
                  placeholder="Search students..."
                  style={{ background: 'none', border: 'none', outline: 'none', fontSize: '0.85rem', color: 'var(--color-text)', width: '100%', fontFamily: 'var(--font-sans)' }}
                />
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {pagedStudents.map(s => {
                const isSelected = selected?._id === s._id;
                return (
                  <div
                    key={s._id}
                    onClick={() => handleSelect(s)}
                    style={{
                      padding: '12px 14px',
                      borderBottom: '1px solid var(--color-border-subtle)',
                      cursor: 'pointer',
                      background: isSelected ? 'var(--color-primary-soft)' : 'transparent',
                      borderLeft: isSelected ? '3px solid var(--color-primary)' : '3px solid transparent',
                      transition: 'all 0.12s',
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--color-surface-elevated)'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: isSelected ? 'var(--color-primary)' : 'var(--color-surface-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <User size={15} color={isSelected ? '#fff' : 'var(--color-text-muted)'} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', color: isSelected ? 'var(--color-primary)' : 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.fullName}</p>
                        <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>
                          {s.category?.name || <span style={{ color: 'var(--color-error)' }}>No category</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {pagedStudents.length === 0 && (
                <p style={{ padding: '24px 16px', color: 'var(--color-text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>No students found.</p>
              )}
            </div>

            {totalListPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', borderTop: '1px solid var(--color-border-subtle)', flexShrink: 0 }}>
                <button
                  onClick={() => setListPage(p => Math.max(1, p - 1))}
                  disabled={listPage <= 1}
                  style={{ background: 'none', border: 'none', cursor: listPage <= 1 ? 'not-allowed' : 'pointer', color: listPage <= 1 ? 'var(--color-border)' : 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}
                >
                  <ChevronLeft size={16} />
                </button>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                  {listPage}/{totalListPages}
                </span>
                <button
                  onClick={() => setListPage(p => Math.min(totalListPages, p + 1))}
                  disabled={listPage >= totalListPages}
                  style={{ background: 'none', border: 'none', cursor: listPage >= totalListPages ? 'not-allowed' : 'pointer', color: listPage >= totalListPages ? 'var(--color-border)' : 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          <div style={{
            flex: 1, minWidth: 0,
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-surface)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {!selected && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', gap: 12 }}>
                <BookOpen size={44} />
                <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>Select a student</p>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>Choose from the list to manage their library access.</p>
              </div>
            )}

            {selected && (
              <>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border-subtle)', flexShrink: 0 }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 2px' }}>
                    Assigning access for
                  </p>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>
                    {selected.fullName}
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-text-muted)', marginLeft: 10 }}>
                      {selected.category?.name || 'No category'}
                    </span>
                  </h3>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                  {loadingAccess && <Loader />}

                  {!loadingAccess && !accessData?.subcategories?.length && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, paddingTop: 60, color: 'var(--color-text-muted)' }}>
                      <BookOpen size={36} />
                      <p style={{ margin: 0 }}>
                        {!selected.category ? 'No category assigned to this student. Edit student first.' : 'No subcategories in this category yet.'}
                      </p>
                    </div>
                  )}

                  {!loadingAccess && accessData?.subcategories?.map(sub => (
                    <SubcategoryBlock
                      key={sub._id}
                      sub={sub}
                      studentId={selected._id}
                      onToggle={handleToggle}
                      toggling={toggling}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminContentPage;
