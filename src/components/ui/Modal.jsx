import { X } from 'lucide-react';
import Button from './Button.jsx';

const Modal = ({ isOpen, onClose, title, children, footer = null, size = 'md' }) => {
  if (!isOpen) return null;

  const widths = { sm: 440, md: 560, lg: 720 };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
    >
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        width: '100%', maxWidth: widths[size],
        maxHeight: '90vh', overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--color-border-subtle)',
        }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', padding: 4, borderRadius: 'var(--radius-sm)' }}
          >
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '24px', flex: 1 }}>{children}</div>
        {footer && (
          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: 12,
            padding: '16px 24px',
            borderTop: '1px solid var(--color-border-subtle)',
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
