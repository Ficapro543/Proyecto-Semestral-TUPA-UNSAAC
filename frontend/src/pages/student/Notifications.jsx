import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import usePolling from '../../hooks/usePolling';
import { Loading, ErrorState, EmptyState, LiveBadge } from '../../components/ui/AsyncState';
import { formatFecha } from '../../lib/estados';
import './Notifications.css';

const POLL_MS = 5000;

/** Estilo por tipo de notificación, según el CHECK de la tabla `notificacion`. */
const ESTILO_TIPO = {
  ESTADO: { icon: 'update', bg: 'var(--clr-primary-fixed)', color: 'var(--clr-primary)' },
  OBSERVACION: { icon: 'warning', bg: 'var(--clr-error-container)', color: 'var(--clr-error)' },
  PAGO: { icon: 'payments', bg: 'var(--clr-tertiary-fixed)', color: 'var(--clr-on-tertiary-fixed)' },
  VENCIMIENTO: { icon: 'schedule', bg: '#fef3c7', color: '#92400e' },
};

const FILTROS = [
  { key: 'todos', label: 'Todas' },
  { key: 'no_leidas', label: 'Sin leer' },
  { key: 'OBSERVACION', label: 'Observaciones' },
  { key: 'ESTADO', label: 'Estados' },
];

export default function Notifications() {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState('todos');
  const [accionando, setAccionando] = useState(false);

  const fetcher = useCallback((opts) => api.getNotifications(opts), []);
  const { data, error, loading, refresh } = usePolling(fetcher, { intervalMs: POLL_MS });

  const notificaciones = data?.data || [];
  const sinLeer = data?.unread_count ?? 0;

  const visibles = notificaciones.filter((n) => {
    if (filtro === 'todos') return true;
    if (filtro === 'no_leidas') return !n.leida;
    return n.tipo === filtro;
  });

  const marcarTodas = async () => {
    setAccionando(true);
    try {
      await api.markAllNotificationsRead();
      await refresh();
    } finally {
      setAccionando(false);
    }
  };

  /** Marca como leída y navega a la solicitud asociada, si la tiene. */
  const abrir = async (n) => {
    if (!n.leida) {
      try {
        await api.markNotificationRead(n.id_notificacion);
        await refresh();
      } catch {
        /* que no bloquee la navegación */
      }
    }
    if (n.id_solicitud) navigate(`/estudiante/solicitudes/${n.id_solicitud}`);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <div>
          <h1 className="text-display-md" style={{ color: 'var(--clr-primary)' }}>Notificaciones</h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', flexWrap: 'wrap' }}>
            <span>{sinLeer} sin leer de {notificaciones.length}</span>
            <LiveBadge intervalMs={POLL_MS} />
          </p>
        </div>
        <button className="btn btn-outline" onClick={marcarTodas} disabled={accionando || sinLeer === 0}>
          <span className="material-symbols-outlined" aria-hidden="true">done_all</span> Marcar todas como leídas
        </button>
      </div>

      <div style={{ display: 'flex', gap: 'var(--sp-sm)', flexWrap: 'wrap', marginBottom: 'var(--sp-lg)' }}>
        {FILTROS.map((f) => (
          <button
            key={f.key}
            className={`filter-chip ${filtro === f.key ? 'active' : ''}`}
            onClick={() => setFiltro(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <ErrorState error={error} onRetry={refresh} />}

      {loading ? (
        <Loading label="Cargando notificaciones…" />
      ) : visibles.length === 0 ? (
        <EmptyState icon="notifications_off" title="No hay notificaciones en este filtro" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
          {visibles.map((n) => {
            const est = ESTILO_TIPO[n.tipo] || ESTILO_TIPO.ESTADO;
            return (
              <div
                key={n.id_notificacion}
                className="doc-review-row"
                style={{
                  cursor: 'pointer',
                  background: n.leida ? 'transparent' : 'var(--clr-surface-container-low)',
                  borderLeft: `3px solid ${n.leida ? 'var(--clr-outline-variant)' : 'var(--clr-primary)'}`,
                }}
                onClick={() => abrir(n)}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)', background: est.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined icon-filled" style={{ color: est.color }} aria-hidden="true">
                    {est.icon}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: n.leida ? 500 : 700, color: 'var(--clr-on-surface)' }}>
                    {n.asunto}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--clr-secondary)', marginTop: '2px' }}>
                    {n.mensaje}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--clr-outline)', marginTop: '4px' }}>
                    {formatFecha(n.fecha_envio, { conHora: true })}
                  </div>
                </div>
                {!n.leida && (
                  <span className="badge badge-blue" style={{ fontSize: '10px', flexShrink: 0 }}>Nueva</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
