import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, ArrowLeft, AlertCircle, ShieldX, AlertTriangle } from 'lucide-react';
import { useAuth } from '../store/AuthContext.jsx';
import { useApi } from '../hooks/useApi.js';
import API_ENDPOINTS from '../constants/api-endpoints.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const { post, loading, error, setError } = useApi();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [blockedState, setBlockedState] = useState(null);

  const handleChange = (e) => {
    setError('');
    setBlockedState(null);
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError('Please enter your username and password.');
      return;
    }
    try {
      const res = await post(API_ENDPOINTS.AUTH.LOGIN, {
        identifier: form.username.trim(),
        password: form.password,
      });
      const { user, tokens } = res.data;
      login(user, tokens.accessToken, tokens.refreshToken);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || '';
      if (status === 403 && msg.toLowerCase().includes('blocked')) {
        setBlockedState('blocked');
        setError('');
      } else if (status === 403 && msg.toLowerCase().includes('inactive')) {
        setBlockedState('inactive');
        setError('');
      }
    }
  };

  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/images/logo.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(6px) brightness(0.75)',
        transform: 'scale(1.06)',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.35)',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '420px',
          margin: '24px',
          background: 'rgba(13, 43, 30, 0.25)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(201,168,76,0.25)',
          borderRadius: 'var(--radius-xl)',
          padding: '48px 40px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '36px' }}>
          <img
            src="/images/logo.png"
            alt="ISSB Smart Study"
            style={{
              height: '72px',
              width: '72px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--color-accent)',
              marginBottom: '16px',
              boxShadow: '0 4px 24px rgba(201,168,76,0.25)',
            }}
          />
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.6rem',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.1,
            textAlign: 'center',
            marginBottom: '6px',
          }}>
            ISSB Smart Study
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            textAlign: 'center',
          }}>
            Student Portal
          </p>
        </div>

        <div style={{ width: '100%', height: '1px', background: 'rgba(201,168,76,0.2)', marginBottom: '32px' }} />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '8px',
            }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              placeholder="your_lcc_username"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(201,168,76,0.2)'; }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '8px',
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '12px 48px 12px 16px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(201,168,76,0.2)'; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(255,255,255,0.4)',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {blockedState === 'blocked' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                padding: '20px 16px',
                background: 'rgba(192, 57, 43, 0.18)',
                border: '1px solid rgba(192, 57, 43, 0.5)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
              }}
            >
              <ShieldX size={32} color="#ff6b6b" />
              <p style={{ color: '#ff8a80', fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>Account Blocked</p>
              <p style={{ color: 'rgba(255,138,128,0.8)', fontSize: '0.78rem', lineHeight: 1.6, margin: 0 }}>
                Your account has been blocked due to suspicious activity.<br />
                Please contact the admin for assistance.
              </p>
            </motion.div>
          )}

          {blockedState === 'inactive' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                padding: '20px 16px',
                background: 'rgba(224, 123, 0, 0.15)',
                border: '1px solid rgba(224, 123, 0, 0.4)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
              }}
            >
              <AlertTriangle size={32} color="#e07b00" />
              <p style={{ color: '#f0a040', fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>Account Inactive</p>
              <p style={{ color: 'rgba(240,160,64,0.8)', fontSize: '0.78rem', lineHeight: 1.6, margin: 0 }}>
                Your account is currently inactive.<br />
                Please contact the admin to reactivate it.
              </p>
            </motion.div>
          )}

          {error && !blockedState && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '12px 14px',
                background: 'rgba(192, 57, 43, 0.15)',
                border: '1px solid rgba(192, 57, 43, 0.35)',
                borderRadius: 'var(--radius-md)',
                color: '#ff8a80',
                fontSize: '0.82rem',
                lineHeight: 1.5,
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              width: '100%',
              padding: '14px',
              background: loading ? 'rgba(201,168,76,0.5)' : 'var(--color-accent)',
              color: 'var(--color-text-on-accent)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.2s',
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '16px', height: '16px',
                  border: '2px solid rgba(27,16,0,0.3)',
                  borderTopColor: 'var(--color-text-on-accent)',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                }} />
                Signing In...
              </>
            ) : (
              <>
                <LogIn size={16} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '28px', textAlign: 'center' }}>
          <Link to="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
          >
            <ArrowLeft size={13} />
            Back to Home
          </Link>
        </div>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default LoginPage;
