/**
 * Estados de carga / error / vacío compartidos por las pantallas que
 * consumen la API, para que todas fallen de la misma forma visible en vez
 * de quedarse en blanco.
 */

export function Loading({ label = 'Cargando…' }) {
  return (
    <div className="empty-state" style={{ padding: 'var(--sp-2xl) 0' }}>
      <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle
          cx="12" cy="12" r="10"
          stroke="var(--clr-primary)" strokeWidth="3"
          strokeDasharray="31.416" strokeDashoffset="10"
        />
      </svg>
      <div className="empty-state-desc" style={{ marginTop: 'var(--sp-sm)' }}>{label}</div>
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  const isOffline = error?.status === 0;
  return (
    <div className="alert alert-error" role="alert" style={{ alignItems: 'flex-start' }}>
      <span className="material-symbols-outlined">error</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, marginBottom: '4px' }}>
          {isOffline ? 'Sin conexión con el servidor' : 'No se pudo cargar la información'}
        </div>
        <div style={{ fontSize: '13px' }}>{error?.message || 'Error desconocido'}</div>
        {onRetry && (
          <button className="btn btn-outline btn-sm" style={{ marginTop: 'var(--sp-sm)' }} onClick={onRetry}>
            <span className="material-symbols-outlined icon-sm">refresh</span> Reintentar
          </button>
        )}
      </div>
    </div>
  );
}

export function EmptyState({ icon = 'inbox', title, description, action }) {
  return (
    <div className="empty-state" style={{ padding: 'var(--sp-2xl) 0' }}>
      <span className="material-symbols-outlined">{icon}</span>
      {title && <div className="empty-state-title">{title}</div>}
      {description && <div className="empty-state-desc">{description}</div>}
      {action}
    </div>
  );
}

/** Indicador discreto de que la pantalla se refresca sola. */
export function LiveBadge({ intervalMs = 4000 }) {
  return (
    <span
      title={`Actualizado automáticamente cada ${Math.round(intervalMs / 1000)} s`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontSize: '12px', color: 'var(--clr-secondary)', fontWeight: 600,
      }}
    >
      <span className="live-dot" aria-hidden="true" />
      En vivo
    </span>
  );
}
