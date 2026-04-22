const Loader = ({ size = 24, fullPage = false }) => {
  const spinner = (
    <div
      style={{
        width: size,
        height: size,
        border: `${size * 0.12}px solid var(--color-border)`,
        borderTopColor: 'var(--color-primary)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        flexShrink: 0,
      }}
    />
  );

  if (fullPage) {
    return (
      <div style={{
        position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-bg)', zIndex: 100,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          {spinner}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return spinner;
};

export default Loader;
