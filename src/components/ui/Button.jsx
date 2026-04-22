const variants = {
  primary: { bg: 'var(--color-primary)', color: 'var(--color-text-on-primary)', border: 'var(--color-primary)' },
  accent:  { bg: 'var(--color-accent)', color: 'var(--color-text-on-accent)', border: 'var(--color-accent)' },
  outline: { bg: 'transparent', color: 'var(--color-primary)', border: 'var(--color-primary)' },
  ghost:   { bg: 'var(--color-primary-soft)', color: 'var(--color-primary)', border: 'transparent' },
  danger:  { bg: 'var(--color-error)', color: '#fff', border: 'var(--color-error)' },
};

const sizes = {
  sm: { padding: '6px 14px', fontSize: '0.8rem' },
  md: { padding: '10px 20px', fontSize: '0.875rem' },
  lg: { padding: '13px 28px', fontSize: '0.95rem' },
};

const Button = ({ children, variant = 'primary', size = 'md', disabled = false, loading = false, onClick, type = 'button', style = {} }) => {
  const v = variants[variant];
  const s = sizes[size];

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: s.padding, fontSize: s.fontSize, fontWeight: 600,
        fontFamily: 'var(--font-sans)',
        background: v.bg, color: v.color,
        border: `1px solid ${v.border}`,
        borderRadius: 'var(--radius-md)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        transition: 'opacity 0.15s, box-shadow 0.15s',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {loading && (
        <div style={{
          width: 15, height: 15,
          border: '2px solid rgba(255,255,255,0.3)',
          borderTopColor: v.color,
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
          flexShrink: 0,
        }} />
      )}
      {children}
    </button>
  );
};

export default Button;
