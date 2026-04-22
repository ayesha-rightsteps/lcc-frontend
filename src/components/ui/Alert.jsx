import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const variants = {
  error:   { bg: 'rgba(192, 57, 43, 0.08)', border: 'rgba(192, 57, 43, 0.3)', color: 'var(--color-error)', Icon: AlertCircle },
  success: { bg: 'rgba(45, 158, 107, 0.08)', border: 'rgba(45, 158, 107, 0.3)', color: 'var(--color-success)', Icon: CheckCircle },
  warning: { bg: 'rgba(224, 123, 0, 0.08)', border: 'rgba(224, 123, 0, 0.3)', color: 'var(--color-warning)', Icon: AlertTriangle },
  info:    { bg: 'rgba(36, 113, 163, 0.08)', border: 'rgba(36, 113, 163, 0.3)', color: 'var(--color-info)', Icon: Info },
};

const Alert = ({ message, variant = 'error' }) => {
  if (!message) return null;
  const { bg, border, color, Icon } = variants[variant];

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '12px 14px',
      background: bg, border: `1px solid ${border}`, borderRadius: 'var(--radius-md)',
      color, fontSize: '0.875rem', lineHeight: 1.5,
    }}>
      <Icon size={16} style={{ flexShrink: 0, marginTop: 2 }} />
      <span>{message}</span>
    </div>
  );
};

export default Alert;
