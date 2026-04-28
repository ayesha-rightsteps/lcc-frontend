import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext.jsx';
import { useTheme } from '../hooks/useTheme.js';
import useAntiPiracy from '../hooks/useAntiPiracy.js';
import useHeartbeat from '../hooks/useHeartbeat.js';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, BookOpen, Ticket, Phone, LogOut, Sun, Moon,
  Users, BarChart3, ShieldAlert, UserPlus,
} from 'lucide-react';

const studentNav = [
  { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/dashboard/content', icon: <BookOpen size={18} />, label: 'My Content' },
  { to: '/dashboard/tickets', icon: <Ticket size={18} />, label: 'Support' },
  { to: '/dashboard/consultations', icon: <Phone size={18} />, label: 'Consultations' },
];

const adminNav = [
  { to: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Overview' },
  { to: '/admin/students', icon: <Users size={18} />, label: 'Students' },
  { to: '/admin/content', icon: <BookOpen size={18} />, label: 'Content' },
  { to: '/admin/tickets', icon: <Ticket size={18} />, label: 'Tickets' },
  { to: '/admin/consultations', icon: <Phone size={18} />, label: 'Consultations' },
  { to: '/admin/reports', icon: <BarChart3 size={18} />, label: 'Reports' },
  { to: '/admin/security', icon: <ShieldAlert size={18} />, label: 'Security' },
  { to: '/admin/leads', icon: <UserPlus size={18} />, label: 'Enquiries' },
];

const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ padding: '10px 12px', margin: '4px 0' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.08em', textAlign: 'center' }}>
        {time.toLocaleTimeString('en-GB')}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-muted)', letterSpacing: '0.06em', textAlign: 'center', marginTop: 2 }}>
        {time.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
      </div>
    </div>
  );
};

const Watermark = ({ username }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 9998,
    pointerEvents: 'none', userSelect: 'none',
    overflow: 'hidden',
  }}>
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={`text-${i}`} style={{
        position: 'absolute',
        top: `${(i % 4) * 28 + 5}%`,
        left: `${Math.floor(i / 4) * 36 + 5}%`,
        transform: 'rotate(-30deg)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      }}>
        <img
          src="/images/logo.png"
          alt=""
          style={{ width: 48, height: 'auto', opacity: 0.18 }}
        />
        <span style={{
          fontFamily: 'monospace',
          fontSize: '0.68rem',
          fontWeight: 700,
          color: 'rgba(80,80,80,0.2)',
          whiteSpace: 'nowrap',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          ISSB SMART STUDY
        </span>
        <span style={{
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'rgba(80,80,80,0.2)',
          whiteSpace: 'nowrap',
          letterSpacing: '0.1em',
        }}>
          {username}
        </span>
      </div>
    ))}
  </div>
);

const DashboardLayout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  useAntiPiracy(!isAdmin);
  useHeartbeat(!isAdmin);

  const nav = isAdmin ? adminNav : studentNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeStyle = {
    background: 'var(--color-primary-soft)',
    color: 'var(--color-primary)',
    fontWeight: 600,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <aside style={{
        width: 240, flexShrink: 0,
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 40,
      }}>
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--color-border-subtle)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <img src="/images/logo.png" alt="Logo" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-accent)', flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary-dark)', lineHeight: 1.1 }}>
              ISSB Smart Study
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--color-text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 2 }}>
              {isAdmin ? 'Admin Portal' : 'Student Portal'}
            </div>
          </div>
        </div>

        {!isAdmin && <LiveClock />}
        <nav style={{ flex: 1, padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
          {nav.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard' || to === '/admin/dashboard'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                color: 'var(--color-text-muted)',
                transition: 'all 0.15s',
                ...(isActive ? activeStyle : {}),
              })}
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={{
          padding: '12px',
          borderTop: '1px solid var(--color-border-subtle)',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--color-primary-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700,
              color: 'var(--color-primary)', flexShrink: 0,
            }}>
              {user?.fullName?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.fullName || 'User'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.username || ''}
              </div>
            </div>
          </div>

          <button
            onClick={toggle}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
              width: '100%', background: 'none', border: 'none', cursor: 'pointer',
              borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--color-text-muted)',
              textAlign: 'left',
            }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
              width: '100%', background: 'none', border: 'none', cursor: 'pointer',
              borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--color-error)',
              textAlign: 'left',
            }}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {!isAdmin && user?.username && <Watermark username={user.username} />}
      <main style={{ flex: 1, marginLeft: 240, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
