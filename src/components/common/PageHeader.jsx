const PageHeader = ({ title, subtitle = '', actions = null }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: 12,
    marginBottom: 28,
  }}>
    <div>
      <h1 style={{
        fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700,
        color: 'var(--color-text)', margin: 0, lineHeight: 1.2,
      }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
          {subtitle}
        </p>
      )}
    </div>
    {actions && <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{actions}</div>}
  </div>
);

export default PageHeader;
