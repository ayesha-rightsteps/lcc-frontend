const Pagination = ({ page, total, limit, onChange }) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      pages.push(i);
    }
  }

  const btnBase = {
    minWidth: 32, height: 32, padding: '0 8px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--color-surface)',
    color: 'var(--color-text-muted)',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-mono)',
    cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.12s',
  };

  const activeBtnStyle = {
    ...btnBase,
    background: 'var(--color-primary)',
    borderColor: 'var(--color-primary)',
    color: '#fff',
    fontWeight: 700,
  };

  const disabledBtnStyle = {
    ...btnBase,
    opacity: 0.4,
    cursor: 'not-allowed',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderTop: '1px solid var(--color-border-subtle)' }}>
      <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: 0, fontFamily: 'var(--font-mono)' }}>
        {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
      </p>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <button
          style={page <= 1 ? disabledBtnStyle : btnBase}
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          ←
        </button>

        {pages.map((p, i) => {
          const prev = pages[i - 1];
          return (
            <>
              {prev && p - prev > 1 && (
                <span key={`ellipsis-${p}`} style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', padding: '0 4px' }}>…</span>
              )}
              <button
                key={p}
                style={p === page ? activeBtnStyle : btnBase}
                onClick={() => onChange(p)}
              >
                {p}
              </button>
            </>
          );
        })}

        <button
          style={page >= totalPages ? disabledBtnStyle : btnBase}
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
