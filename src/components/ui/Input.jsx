const Input = ({ label, name, type = 'text', value, onChange, placeholder = '', error = '', ...rest }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {label && (
      <label
        htmlFor={name}
        style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)' }}
      >
        {label}
      </label>
    )}
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        padding: '10px 14px',
        background: 'var(--color-bg)',
        border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-md)',
        color: 'var(--color-text)',
        fontSize: '0.9rem',
        fontFamily: 'var(--font-sans)',
        outline: 'none',
        transition: 'border-color 0.15s',
        width: '100%',
        boxSizing: 'border-box',
      }}
      onFocus={e => { e.target.style.borderColor = 'var(--color-primary)'; }}
      onBlur={e => { e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)'; }}
      {...rest}
    />
    {error && (
      <span style={{ fontSize: '0.78rem', color: 'var(--color-error)' }}>{error}</span>
    )}
  </div>
);

export default Input;
