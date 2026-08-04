import { useCallback, useMemo } from 'react';
import api from '../../lib/api';
import usePolling from '../../hooks/usePolling';
import StatCard from '../../components/ui/StatCard';
import { Loading, ErrorState, LiveBadge } from '../../components/ui/AsyncState';
import { estadoInfo, formatSoles } from '../../lib/estados';
import './Reports.css';

const POLL_MS = 8000;

/**
 * Reportes calculados sobre los expedientes reales. No hay endpoint de
 * agregación por estado/trámite, así que se derivan en el cliente a partir
 * del listado — suficiente para el volumen de este proyecto.
 */
export default function Reports() {
  const fetcher = useCallback(
    (opts) =>
      Promise.all([
        api.getAdminStats(opts),
        api.listAdminRequests({ limit: 200 }, opts),
      ]).then(([stats, lista]) => ({ stats, lista })),
    []
  );

  const { data, error, loading, refresh } = usePolling(fetcher, { intervalMs: POLL_MS });

  const stats = data?.stats;
  const filas = useMemo(() => data?.lista?.data || [], [data]);

  const porEstado = useMemo(() => {
    const mapa = new Map();
    for (const r of filas) mapa.set(r.estado, (mapa.get(r.estado) || 0) + 1);
    return [...mapa.entries()].sort((a, b) => b[1] - a[1]);
  }, [filas]);

  const porTramite = useMemo(() => {
    const mapa = new Map();
    for (const r of filas) {
      const actual = mapa.get(r.nombre_tramite) || { total: 0, monto: 0 };
      actual.total += 1;
      actual.monto += Number(r.monto_total) || 0;
      mapa.set(r.nombre_tramite, actual);
    }
    return [...mapa.entries()].sort((a, b) => b[1].total - a[1].total);
  }, [filas]);

  const maxEstado = Math.max(1, ...porEstado.map(([, n]) => n));

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <div>
          <h1 className="text-display-md" style={{ color: 'var(--clr-primary)' }}>Reportes y Estadísticas</h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', flexWrap: 'wrap' }}>
            <span>Calculado sobre {filas.length} expedientes</span>
            <LiveBadge intervalMs={POLL_MS} />
          </p>
        </div>
        <button className="btn btn-outline" onClick={refresh}>
          <span className="material-symbols-outlined" aria-hidden="true">refresh</span> Actualizar
        </button>
      </div>

      {error && <ErrorState error={error} onRetry={refresh} />}

      {loading ? (
        <Loading label="Calculando reportes…" />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
            <StatCard icon="inbox" iconBg="var(--clr-primary-fixed)" iconColor="var(--clr-primary)"
              value={String(stats?.total_solicitudes ?? '—')} label="Total expedientes" badgeClass="badge-blue" />
            <StatCard icon="pending_actions" iconBg="#fef3c7" iconColor="#92400e"
              value={String(stats?.pendientes ?? '—')} label="Pendientes" badgeClass="badge-warning" />
            <StatCard icon="check_circle" iconBg="#d1fae5" iconColor="#065f46"
              value={String(stats?.completadas ?? '—')} label="Completadas" badgeClass="badge-success" />
            <StatCard icon="payments" iconBg="rgba(137,245,231,0.25)" iconColor="var(--clr-tertiary-container)"
              value={formatSoles(stats?.total_recaudado)} label="Recaudado" badgeClass="badge-teal" />
          </div>

          <div className="detail-grid">
            <div className="card" style={{ minWidth: 0 }}>
              <div className="card-header"><span className="card-header-title">Expedientes por estado</span></div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
                {porEstado.length === 0 ? (
                  <div style={{ fontSize: '14px', color: 'var(--clr-secondary)' }}>Sin datos.</div>
                ) : (
                  porEstado.map(([estado, n]) => {
                    const info = estadoInfo(estado);
                    return (
                      <div key={estado}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: 'var(--sp-md)' }}>
                          <span className={`badge ${info.badge}`}>{info.label}</span>
                          <strong>{n}</strong>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div className="progress-bar" style={{ width: `${(n / maxEstado) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="card" style={{ minWidth: 0 }}>
              <div className="card-header"><span className="card-header-title">Por tipo de trámite</span></div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
                {porTramite.length === 0 ? (
                  <div style={{ fontSize: '14px', color: 'var(--clr-secondary)' }}>Sin datos.</div>
                ) : (
                  porTramite.map(([nombre, v]) => (
                    <div key={nombre} style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--sp-md)', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid var(--clr-outline-variant)' }}>
                      <span style={{ minWidth: 0 }}>{nombre}</span>
                      <span style={{ whiteSpace: 'nowrap' }}>
                        <strong>{v.total}</strong> · {formatSoles(v.monto)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
