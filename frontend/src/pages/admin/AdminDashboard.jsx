import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import usePolling from '../../hooks/usePolling';
import { Loading, ErrorState, EmptyState, LiveBadge } from '../../components/ui/AsyncState';
import { estadoInfo, formatFecha, formatSoles, nombreCompleto } from '../../lib/estados';
import './AdminDashboard.css';

const POLL_MS = 5000;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const hoy = new Date().toLocaleDateString('es-PE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const fetcher = useCallback(
    (opts) =>
      Promise.all([
        api.getAdminStats(opts),
        api.listAdminRequests({ limit: 8 }, opts),
      ]).then(([stats, lista]) => ({ stats, lista })),
    []
  );

  const { data, error, loading, refresh } = usePolling(fetcher, { intervalMs: POLL_MS });

  const stats = data?.stats;
  const recientes = data?.lista?.data || [];

  const metricas = [
    { valor: stats?.pendientes, label: 'Trámites pendientes', icon: 'pending_actions', bg: 'var(--clr-primary-fixed)', color: 'var(--clr-primary)', ruta: '/admin/cola' },
    { valor: stats?.observadas, label: 'Observadas', icon: 'report_problem', bg: 'var(--clr-error-container)', color: 'var(--clr-error)', ruta: '/admin/cola' },
    { valor: stats?.completadas, label: 'Completadas', icon: 'check_circle', bg: '#d1fae5', color: '#065f46', ruta: '/admin/cola' },
    { valor: stats?.total_solicitudes, label: 'Total expedientes', icon: 'inbox', bg: '#fef3c7', color: '#92400e', ruta: '/admin/cola' },
  ];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <div>
          <h1 className="text-display-md" style={{ color: 'var(--clr-primary)' }}>Dashboard Administrativo</h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', flexWrap: 'wrap' }}>
            <span style={{ textTransform: 'capitalize' }}>{hoy}</span>
            <LiveBadge intervalMs={POLL_MS} />
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-sm)', flexWrap: 'wrap' }}>
          <button className="btn btn-outline" onClick={() => navigate('/admin/reportes')}>
            <span className="material-symbols-outlined" aria-hidden="true">bar_chart</span> Reportes
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/cola')}>
            <span className="material-symbols-outlined" aria-hidden="true">inbox</span> Cola de pendientes
          </button>
        </div>
      </div>

      {error && <ErrorState error={error} onRetry={refresh} />}

      {loading ? (
        <Loading label="Cargando panel…" />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
            {metricas.map((m) => (
              <div key={m.label} className="admin-metric" onClick={() => navigate(m.ruta)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--sp-sm)' }}>
                  <div style={{ minWidth: 0 }}>
                    <div className="admin-metric-value" style={{ color: 'var(--clr-primary)' }}>
                      {m.valor ?? '—'}
                    </div>
                    <div className="admin-metric-label">{m.label}</div>
                  </div>
                  <div style={{ width: '44px', height: '44px', background: m.bg, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined icon-filled" style={{ fontSize: '22px', color: m.color }} aria-hidden="true">
                      {m.icon}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginBottom: 'var(--sp-xl)' }}>
            <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', flexWrap: 'wrap' }}>
              <span className="material-symbols-outlined icon-filled" style={{ color: 'var(--clr-primary)', fontSize: '32px' }} aria-hidden="true">payments</span>
              <div>
                <div className="detail-label">Total recaudado (pagados, en proceso y completados)</div>
                <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '28px', fontWeight: 800, color: 'var(--clr-primary)' }}>
                  {formatSoles(stats?.total_recaudado)}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-header-title">Expedientes recientes</span>
              <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => navigate('/admin/cola')}>
                Ver toda la cola
              </button>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
              {recientes.length === 0 ? (
                <EmptyState icon="inbox" title="No hay expedientes registrados" />
              ) : (
                recientes.map((r) => {
                  const info = estadoInfo(r.estado);
                  return (
                    <div
                      key={r.id_solicitud}
                      className="doc-review-row"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/admin/solicitudes/${r.id_solicitud}`)}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{nombreCompleto(r)}</div>
                        <div className="text-mono-sm" style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}>
                          {r.numero_expediente || `Borrador #${r.id_solicitud}`} · {r.nombre_tramite}
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}>
                        {formatFecha(r.fecha_solicitud)}
                      </div>
                      <span className={`badge ${info.badge}`}>{info.label}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
