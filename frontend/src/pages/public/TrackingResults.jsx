import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../lib/api';
import usePolling from '../../hooks/usePolling';
import { Loading, ErrorState, EmptyState, LiveBadge } from '../../components/ui/AsyncState';
import { estadoInfo, formatFecha } from '../../lib/estados';
import './TrackingResults.css';

const POLL_MS = 6000;

/**
 * Resultado del seguimiento público. Recibe el expediente por router state
 * desde la búsqueda; también acepta ?exp=... para poder compartir el enlace.
 */
export default function TrackingResults() {
  const navigate = useNavigate();
  const location = useLocation();

  const inicial =
    location.state?.tracking?.numero_expediente ||
    new URLSearchParams(location.search).get('exp') ||
    '';

  const [expediente, setExpediente] = useState(inicial);
  const [busqueda, setBusqueda] = useState(inicial);

  useEffect(() => {
    setBusqueda(inicial);
    setExpediente(inicial);
  }, [inicial]);

  const fetcher = useCallback(
    (opts) => api.trackByExpediente(expediente, opts),
    [expediente]
  );

  const { data, error, loading } = usePolling(fetcher, {
    intervalMs: POLL_MS,
    enabled: Boolean(expediente),
    deps: [expediente],
  });

  const buscar = () => {
    const limpio = busqueda.trim().toUpperCase();
    if (limpio.length >= 3) {
      setExpediente(limpio);
      navigate(`/seguimiento/resultados?exp=${encodeURIComponent(limpio)}`, { replace: true });
    }
  };

  const info = data ? estadoInfo(data.estado) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ background: 'var(--clr-primary)', padding: 'var(--sp-lg)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', flexWrap: 'wrap' }}>
            <button className="btn btn-ghost" style={{ color: 'rgba(255,255,255,0.7)' }} onClick={() => navigate('/seguimiento')} aria-label="Volver a la búsqueda">
              <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
            </button>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '500px' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: 'var(--clr-outline)' }} aria-hidden="true">search</span>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && buscar()}
                placeholder="EXP-2026-000001"
                style={{ width: '100%', height: '44px', padding: '0 var(--sp-md) 0 40px', background: 'white', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '14px', outline: 'none' }}
                aria-label="Buscar otro expediente"
              />
            </div>
            <button className="btn btn-teal" onClick={buscar}>Buscar</button>
          </div>
        </div>
      </div>

      <main style={{ flex: 1, background: 'var(--clr-background)', padding: 'var(--sp-2xl) var(--sp-lg)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {!expediente ? (
            <EmptyState
              icon="search"
              title="Ingresa un número de expediente"
              description="Escribe el código en el buscador de arriba."
            />
          ) : loading ? (
            <Loading label="Consultando expediente…" />
          ) : error ? (
            <ErrorState
              error={
                error.status === 404
                  ? { ...error, message: `No se encontró ningún expediente con el código ${expediente}.` }
                  : error
              }
            />
          ) : data ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', marginBottom: 'var(--sp-lg)', flexWrap: 'wrap' }}>
                <div className="alert alert-success" style={{ flex: 1, minWidth: '260px', marginBottom: 0 }}>
                  <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
                  <div>Expediente <strong>{data.numero_expediente}</strong> encontrado</div>
                </div>
                <LiveBadge intervalMs={POLL_MS} />
              </div>

              <div className="result-card" role="article">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)', marginBottom: 'var(--sp-lg)' }}>
                  <div style={{ minWidth: 0 }}>
                    <h2 className="text-headline-sm" style={{ color: 'var(--clr-primary)' }}>
                      {data.nombre_tramite}
                    </h2>
                    <div className="text-mono-sm" style={{ color: 'var(--clr-secondary)', marginTop: '4px' }}>
                      {data.numero_expediente}
                    </div>
                  </div>
                  <span className={`badge ${info.badge}`} style={{ fontSize: '14px' }}>
                    <span className="material-symbols-outlined icon-sm" aria-hidden="true">{info.icon}</span>
                    {info.label}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 'var(--sp-md)', marginBottom: 'var(--sp-lg)' }}>
                  <div>
                    <div className="detail-label">Solicitante</div>
                    <div style={{ fontWeight: 600 }}>{data.solicitante}</div>
                  </div>
                  <div>
                    <div className="detail-label">Etapa actual</div>
                    <div style={{ fontWeight: 600 }}>{data.etapa_visible || '—'}</div>
                  </div>
                  <div>
                    <div className="detail-label">Fecha de ingreso</div>
                    <div style={{ fontWeight: 600 }}>{formatFecha(data.fecha_solicitud)}</div>
                  </div>
                  <div>
                    <div className="detail-label">Plazo</div>
                    <div style={{ fontWeight: 600 }}>{data.dias_habiles} días hábiles</div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header"><span className="card-header-title">Historial público</span></div>
                  <div className="card-body">
                    {(data.historial || []).length === 0 ? (
                      <div style={{ fontSize: '14px', color: 'var(--clr-secondary)' }}>
                        Sin movimientos registrados todavía.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
                        {data.historial.map((h, i) => (
                          <div key={i} style={{ borderLeft: '3px solid var(--clr-primary)', paddingLeft: 'var(--sp-md)' }}>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--clr-primary)' }}>
                              {estadoInfo(h.estado_nuevo).label}
                            </div>
                            {h.comentario && <div style={{ fontSize: '13px', marginTop: '2px' }}>{h.comentario}</div>}
                            <div style={{ fontSize: '12px', color: 'var(--clr-secondary)', marginTop: '2px' }}>
                              {formatFecha(h.fecha_cambio, { conHora: true })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}
