import { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import usePolling from '../../hooks/usePolling';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/ui/StatCard';
import { Loading, ErrorState, EmptyState, LiveBadge } from '../../components/ui/AsyncState';
import { estadoInfo, formatFecha, ESTADOS_CERRADOS } from '../../lib/estados';
import './Dashboard.css';

const POLL_MS = 5000;

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetcher = useCallback(
    (opts) =>
      Promise.all([
        api.listMyRequests({ limit: 100 }, opts),
        api.getNotifications(opts),
      ]).then(([solicitudes, notificaciones]) => ({ solicitudes, notificaciones })),
    []
  );

  const { data, error, loading, refresh } = usePolling(fetcher, { intervalMs: POLL_MS });

  const solicitudes = data?.solicitudes || [];
  const notificaciones = data?.notificaciones?.data || [];

  const enCurso = solicitudes.filter(
    (s) => !ESTADOS_CERRADOS.includes(s.estado) && s.estado !== 'BORRADOR'
  );
  const observadas = solicitudes.filter((s) => ['OBSERVADO', 'SUBSANACION'].includes(s.estado));
  const completadas = solicitudes.filter((s) => s.estado === 'COMPLETADO');
  const borradores = solicitudes.filter((s) => s.estado === 'BORRADOR');

  // La más reciente en curso encabeza el seguimiento del panel.
  const destacada = enCurso[0] || solicitudes[0];

  return (
    <>
      <section style={{ marginBottom: 'var(--sp-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)' }}>
          <div>
            <h1 className="text-display-md" style={{ color: 'var(--clr-primary)' }}>
              Buen día, {user?.nombres || 'estudiante'} 👋
            </h1>
            <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', flexWrap: 'wrap' }}>
              <span>Aquí tienes un resumen de tu estado administrativo actual.</span>
              <LiveBadge intervalMs={POLL_MS} />
            </p>
          </div>
          <Link to="/tramite/paso1" className="btn btn-primary">
            <span className="material-symbols-outlined" aria-hidden="true">add</span> Nuevo Trámite
          </Link>
        </div>
      </section>

      {error && <ErrorState error={error} onRetry={refresh} />}

      {loading ? (
        <Loading label="Cargando tu panel…" />
      ) : (
        <>
          <section style={{ marginBottom: 'var(--sp-xl)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 'var(--sp-lg)' }}>
              <StatCard icon="pending_actions" iconBg="var(--clr-primary-fixed)" iconColor="var(--clr-primary)"
                value={String(enCurso.length)} label="En curso" badgeClass="badge-blue" />
              <StatCard icon="report_problem" iconBg="var(--clr-error-container)" iconColor="var(--clr-error)"
                value={String(observadas.length)} label="Observadas" badgeClass="badge-error" />
              <StatCard icon="check_circle" iconBg="#d1fae5" iconColor="#065f46"
                value={String(completadas.length)} label="Completadas" badgeClass="badge-success" />
              <StatCard icon="draft" iconBg="var(--clr-surface-container)" iconColor="var(--clr-secondary)"
                value={String(borradores.length)} label="Borradores" badgeClass="badge-neutral" />
            </div>
          </section>

          <div className="detail-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)', minWidth: 0 }}>
              <div className="card">
                <div className="card-header">
                  <span className="card-header-title">Mis solicitudes recientes</span>
                  <Link to="/estudiante/solicitudes" className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>
                    Ver todas
                  </Link>
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
                  {solicitudes.length === 0 ? (
                    <EmptyState
                      icon="assignment"
                      title="Todavía no tienes trámites"
                      description="Inicia tu primer trámite desde el catálogo."
                      action={
                        <Link to="/tramite/paso1" className="btn btn-primary" style={{ marginTop: 'var(--sp-md)' }}>
                          Iniciar trámite
                        </Link>
                      }
                    />
                  ) : (
                    solicitudes.slice(0, 5).map((s) => {
                      const info = estadoInfo(s.estado);
                      const esBorrador = s.estado === 'BORRADOR';
                      return (
                        <div
                          key={s.id_solicitud}
                          className="doc-review-row"
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            navigate(esBorrador ? '/tramite/paso1' : `/estudiante/solicitudes/${s.id_solicitud}`)
                          }
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '14px', fontWeight: 600 }}>{s.nombre_tramite}</div>
                            <div className="text-mono-sm" style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}>
                              {s.numero_expediente || `Borrador #${s.id_solicitud}`} · {formatFecha(s.fecha_solicitud)}
                            </div>
                          </div>
                          <span className={`badge ${info.badge}`}>{info.label}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)', minWidth: 0 }}>
              {destacada && (
                <div className="card">
                  <div className="card-header"><span className="card-header-title">Trámite en seguimiento</span></div>
                  <div className="card-body">
                    <div style={{ fontWeight: 700, color: 'var(--clr-primary)', marginBottom: '4px' }}>
                      {destacada.nombre_tramite}
                    </div>
                    <div className="text-mono-sm" style={{ fontSize: '12px', color: 'var(--clr-secondary)', marginBottom: 'var(--sp-md)' }}>
                      {destacada.numero_expediente || `Borrador #${destacada.id_solicitud}`}
                    </div>
                    <div style={{ fontSize: '13px', marginBottom: 'var(--sp-md)' }}>
                      Etapa actual: <strong>{destacada.etapa_visible || '—'}</strong>
                    </div>
                    <button
                      className="btn btn-outline btn-sm w-full"
                      onClick={() =>
                        navigate(
                          destacada.estado === 'BORRADOR'
                            ? '/tramite/paso1'
                            : `/estudiante/solicitudes/${destacada.id_solicitud}`
                        )
                      }
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              )}

              <div className="card">
                <div className="card-header">
                  <span className="card-header-title">Notificaciones</span>
                  <Link to="/estudiante/notificaciones" className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>
                    Ver todas
                  </Link>
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
                  {notificaciones.length === 0 ? (
                    <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>Sin notificaciones.</div>
                  ) : (
                    notificaciones.slice(0, 4).map((n) => (
                      <div key={n.id_notificacion} style={{ borderLeft: `3px solid ${n.leida ? 'var(--clr-outline-variant)' : 'var(--clr-primary)'}`, paddingLeft: 'var(--sp-md)' }}>
                        <div style={{ fontSize: '13px', fontWeight: n.leida ? 500 : 700 }}>{n.asunto}</div>
                        <div style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}>
                          {formatFecha(n.fecha_envio, { conHora: true })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
