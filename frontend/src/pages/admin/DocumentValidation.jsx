import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import usePolling from '../../hooks/usePolling';
import { Loading, ErrorState, EmptyState, LiveBadge } from '../../components/ui/AsyncState';
import { estadoInfo, formatFecha, nombreCompleto, ESTADOS_PENDIENTES } from '../../lib/estados';
import './DocumentValidation.css';

const POLL_MS = 5000;

/**
 * Bandeja de expedientes que esperan validación documentaria. Es un atajo a la
 * pantalla de decisión: la revisión real ocurre en /admin/solicitudes/:id.
 */
export default function DocumentValidation() {
  const navigate = useNavigate();
  const [estado, setEstado] = useState('SOLICITADO');

  const fetcher = useCallback(
    (opts) => api.listAdminRequests({ estado, limit: 50 }, opts),
    [estado]
  );

  const { data, error, loading, refresh } = usePolling(fetcher, {
    intervalMs: POLL_MS,
    deps: [estado],
  });

  const filas = data?.data || [];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <div>
          <h1 className="text-display-md" style={{ color: 'var(--clr-primary)' }}>Validar Documentos</h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', flexWrap: 'wrap' }}>
            <span>Expedientes esperando revisión documentaria</span>
            <LiveBadge intervalMs={POLL_MS} />
          </p>
        </div>
        <button className="btn btn-outline" onClick={refresh}>
          <span className="material-symbols-outlined" aria-hidden="true">refresh</span> Actualizar
        </button>
      </div>

      <div style={{ display: 'flex', gap: 'var(--sp-sm)', flexWrap: 'wrap', marginBottom: 'var(--sp-lg)' }}>
        {ESTADOS_PENDIENTES.map((e) => (
          <button
            key={e}
            className={`filter-chip ${estado === e ? 'active' : ''}`}
            onClick={() => setEstado(e)}
          >
            {estadoInfo(e).label}
          </button>
        ))}
      </div>

      {error && <ErrorState error={error} onRetry={refresh} />}

      {loading ? (
        <Loading label="Cargando expedientes…" />
      ) : filas.length === 0 ? (
        <EmptyState
          icon="fact_check"
          title={`No hay expedientes en "${estadoInfo(estado).label}"`}
          description="Cambia el filtro de estado para ver otros expedientes."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--sp-lg)' }}>
          {filas.map((r) => {
            const info = estadoInfo(r.estado);
            return (
              <div
                key={r.id_solicitud}
                className="card"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/admin/solicitudes/${r.id_solicitud}`)}
              >
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--sp-md)', marginBottom: 'var(--sp-md)' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', fontWeight: 700, color: 'var(--clr-primary)' }}>
                        {r.nombre_tramite}
                      </div>
                      <div className="text-mono-sm" style={{ fontSize: '12px', color: 'var(--clr-secondary)', marginTop: '2px' }}>
                        {r.numero_expediente || `Borrador #${r.id_solicitud}`}
                      </div>
                    </div>
                    <span className={`badge ${info.badge}`} style={{ flexShrink: 0 }}>{info.label}</span>
                  </div>

                  <div style={{ fontSize: '13px', color: 'var(--clr-secondary)', display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: 'var(--sp-md)' }}>
                    <div>{nombreCompleto(r)}</div>
                    <div>DNI {r.dni} · {formatFecha(r.fecha_solicitud)}</div>
                  </div>

                  <button
                    className="btn btn-primary btn-sm w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/solicitudes/${r.id_solicitud}`);
                    }}
                  >
                    <span className="material-symbols-outlined icon-sm" aria-hidden="true">fact_check</span>
                    Revisar documentos
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
