const Card = ({ children, className = '', style = {}, padded = true, onClick }) => (
  <div
    className={className}
    onClick={onClick}
    style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-card)',
      padding: padded ? '24px' : 0,
      ...style,
    }}
  >
    {children}
  </div>
);

export default Card;
