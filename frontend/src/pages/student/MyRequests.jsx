import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import usePolling from '../../hooks/usePolling';
import { Loading, ErrorState, EmptyState, LiveBadge } from '../../components/ui/AsyncState';
import { estadoInfo, formatFecha, formatSoles } from '../../lib/estados';
import './MyRequests.css';

const POLL_MS = 4000;

const TABS = [
  { key: 'borrador', label: 'Borradores', filtra: (s) => s.estado === 'BORRADOR' },
  {
    key: 'enviadas',
    label: 'En curso',
    filtra: (s) => !['BORRADOR', 'COMPLETADO', 'RECHAZADO', 'ANULADO'].includes(s.estado),
  },
  {
    key: 'completadas',
    label: 'Finalizadas',
    filtra: (s) => ['COMPLETADO', 'RECHAZADO', 'ANULADO'].includes(s.estado),
  },
];

/**
 * Listado de solicitudes del estudiante. Con polling activo, el cambio de
 * estado que hace el administrador aparece aquí sin recargar.
 */
export default function MyRequests() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('enviadas');

  const fetcher = useCallback((opts) => api.listMyRequests({ limit: 100 }, opts), []);
  const { data, error, loading, refresh } = usePolling(fetcher, { intervalMs: POLL_MS });

  const solicitudes = data || [];
  const tabActual = TABS.find((t) => t.key === tab);
  const visibles = solicitudes.filter(tabActual.filtra);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <div>
          <h1 className="text-display-md" style={{ color: 'var(--clr-primary)' }}>Mis Solicitudes</h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', flexWrap: 'wrap' }}>
            <span>Estado de todos tus expedientes</span>
            <LiveBadge intervalMs={POLL_MS} />
          </p>
        </div>
        <Link to="/tramite/paso1" className="btn btn-primary">
          <span className="material-symbols-outlined">add</span> Nueva Solicitud
        </Link>
      </div>

      <div className="tabs" style={{ marginBottom: 'var(--sp-xl)' }}>
        {TABS.map((t) => (
          <div
            key={t.key}
            className={`tab-item ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label} ({solicitudes.filter(t.filtra).length})
          </div>
        ))}
      </div>

      {error && <ErrorState error={error} onRetry={refresh} />}

      {loading ? (
        <Loading label="Cargando solicitudes…" />
      ) : visibles.length === 0 ? (
        <EmptyState
          icon="assignment"
          title="No hay solicitudes en esta pestaña"
          description="Cuando inicies un trámite lo verás aquí."
          action={
            <Link to="/tramite/paso1" className="btn btn-primary" style={{ marginTop: 'var(--sp-md)' }}>
              <span className="material-symbols-outlined">add</span> Iniciar un trámite
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--sp-lg)' }}>
          {visibles.map((s) => {
            const info = estadoInfo(s.estado);
            const esBorrador = s.estado === 'BORRADOR';

            return (
              <div
                key={s.id_solicitud}
                className="card"
                style={{ borderLeft: `4px solid ${esBorrador ? 'var(--clr-secondary)' : 'var(--clr-primary)'}`, cursor: 'pointer' }}
                onClick={() => navigate(esBorrador ? '/tramite/paso1' : `/estudiante/solicitudes/${s.id_solicitud}`)}
              >
                <div className="card-body">
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--sp-md)', marginBottom: 'var(--sp-md)' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', fontWeight: 700, color: 'var(--clr-primary)' }}>
                        {s.nombre_tramite}
                      </div>
                      <span className={`badge ${info.badge}`} style={{ marginTop: '6px' }}>
                        <span className="material-symbols-outlined icon-sm">{info.icon}</span>
                        {info.label}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: '13px', color: 'var(--clr-secondary)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: 'var(--sp-md)' }}>
                    <div className="text-mono-sm">
                      {s.numero_expediente || `Borrador #${s.id_solicitud}`}
                    </div>
                    <div>{s.etapa_visible || '—'} · {formatFecha(s.fecha_solicitud)}</div>
                    <div>{formatSoles(s.monto_total)}</div>
                  </div>

                  <button
                    className="btn btn-outline btn-sm w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(esBorrador ? '/tramite/paso1' : `/estudiante/solicitudes/${s.id_solicitud}`);
                    }}
                  >
                    {esBorrador ? 'Continuar borrador' : 'Ver detalle'}
                    <span className="material-symbols-outlined icon-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
