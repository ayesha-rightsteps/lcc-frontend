const colors = {
  green:  { bg: 'var(--color-primary-soft)', color: 'var(--color-primary)' },
  gold:   { bg: 'var(--color-accent-soft)', color: 'var(--color-accent-dark)' },
  red:    { bg: 'rgba(192,57,43,0.1)', color: 'var(--color-error)' },
  blue:   { bg: 'rgba(36,113,163,0.1)', color: 'var(--color-info)' },
  yellow: { bg: 'rgba(224,123,0,0.1)', color: 'var(--color-warning)' },
  gray:   { bg: 'var(--color-surface-elevated)', color: 'var(--color-text-muted)' },
};

const Badge = ({ label, color = 'gray' }) => {
  const c = colors[color] || colors.gray;
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      background: c.bg, color: c.color,
      fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 600,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      borderRadius: 'var(--radius-full)',
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
};

export default Badge;
