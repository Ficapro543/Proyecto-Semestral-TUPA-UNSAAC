import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import usePolling from '../../hooks/usePolling';
import StatCard from '../../components/ui/StatCard';
import { Loading, ErrorState, EmptyState, LiveBadge } from '../../components/ui/AsyncState';
import { estadoInfo, formatFecha, nombreCompleto } from '../../lib/estados';
import './PendingQueue.css';

const POLL_MS = 4000;

const FILTROS = [
  { key: 'todos', label: 'Todos' },
  { key: 'SOLICITADO', label: 'Nuevos' },
  { key: 'EN PROCESO', label: 'En proceso' },
  { key: 'OBSERVADO', label: 'Observados' },
  { key: 'COMPLETADO', label: 'Completados' },
];

/**
 * Cola de expedientes. Es la vista que la sesión B mantiene abierta: al
 * refrescarse por polling, la solicitud que el estudiante acaba de enviar
 * aparece sola en unos segundos.
 */
export default function PendingQueue() {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState('todos');
  const [search, setSearch] = useState('');

  const fetcher = useCallback(
    (opts) => {
      const params = { limit: 50 };
      if (filtro !== 'todos') params.estado = filtro;
      if (search.trim()) params.search = search.trim();
      return Promise.all([api.listAdminRequests(params, opts), api.getAdminStats(opts)]).then(
        ([lista, stats]) => ({ lista, stats })
      );
    },
    [filtro, search]
  );

  const { data, error, loading, refresh } = usePolling(fetcher, {
    intervalMs: POLL_MS,
    deps: [filtro, search],
  });

  const filas = data?.lista?.data || [];
  const total = data?.lista?.total ?? 0;
  const stats = data?.stats;

  const statsDef = [
    { icon: 'pending_actions', iconBg: 'var(--clr-primary-fixed)', iconColor: 'var(--clr-primary)', value: String(stats?.pendientes ?? '—'), label: 'Pendientes', badgeClass: 'badge-blue' },
    { icon: 'report_problem', iconBg: 'var(--clr-error-container)', iconColor: 'var(--clr-error)', value: String(stats?.observadas ?? '—'), label: 'Observadas', badgeClass: 'badge-error' },
    { icon: 'inbox', iconBg: '#fef3c7', iconColor: '#92400e', value: String(stats?.total_solicitudes ?? '—'), label: 'Total expedientes', badgeClass: 'badge-warning' },
    { icon: 'check_circle', iconBg: '#d1fae5', iconColor: '#065f46', value: String(stats?.completadas ?? '—'), label: 'Completadas', badgeClass: 'badge-success' },
  ];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <div>
          <h1 className="text-display-md" style={{ color: 'var(--clr-primary)' }}>Cola de Pendientes</h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', flexWrap: 'wrap' }}>
            <span><strong>{total}</strong> expediente{total === 1 ? '' : 's'} en esta vista</span>
            <LiveBadge intervalMs={POLL_MS} />
          </p>
        </div>
        <button className="btn btn-outline" onClick={refresh}>
          <span className="material-symbols-outlined">refresh</span> Actualizar ahora
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        {statsDef.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: 'var(--sp-md)' }}>
          <div style={{ display: 'flex', gap: 'var(--sp-sm)', flexWrap: 'wrap' }}>
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
          <div style={{ position: 'relative', marginLeft: 'auto' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: 'var(--clr-outline)' }}>search</span>
            <input
              type="text"
              placeholder="Expediente, DNI o nombre…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ height: '36px', padding: '0 var(--sp-md) 0 34px', border: '1px solid var(--clr-outline-variant)', borderRadius: 'var(--radius-lg)', fontSize: '13px', outline: 'none', maxWidth: '100%' }}
            />
          </div>
        </div>

        {error && <div style={{ padding: 'var(--sp-lg)' }}><ErrorState error={error} onRetry={refresh} /></div>}

        {loading ? (
          <Loading label="Cargando cola…" />
        ) : (
          <div className="table-scroll">
            <div className="queue-item" style={{ background: 'var(--clr-surface-container-low)', cursor: 'default', fontSize: '11px', fontWeight: 700, color: 'var(--clr-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <div></div>
              <div>Solicitante / Expediente</div>
              <div>Trámite</div>
              <div>Fecha</div>
              <div>Estado</div>
              <div>Acción</div>
            </div>

            {filas.map((item) => {
              const info = estadoInfo(item.estado);
              const colorPrioridad =
                item.prioridad === 'URGENTE' ? 'var(--clr-error)'
                  : item.prioridad === 'BAJA' ? 'var(--clr-outline)'
                  : '#92400e';

              return (
                <div
                  key={item.id_solicitud}
                  className="queue-item"
                  onClick={() => navigate(`/admin/solicitudes/${item.id_solicitud}`)}
                >
                  <div className="priority-dot" style={{ background: colorPrioridad }} title={item.prioridad} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{nombreCompleto(item)}</div>
                    <div className="text-mono-sm" style={{ fontSize: '11px', color: 'var(--clr-secondary)' }}>
                      {item.numero_expediente || `Borrador #${item.id_solicitud}`}
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>{item.nombre_tramite}</div>
                  <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>{formatFecha(item.fecha_solicitud)}</div>
                  <div><span className={`badge ${info.badge}`}>{info.label}</span></div>
                  <div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/solicitudes/${item.id_solicitud}`);
                      }}
                    >
                      Revisar
                    </button>
                  </div>
                </div>
              );
            })}

            {filas.length === 0 && !error && (
              <EmptyState
                icon="inbox"
                title="No hay expedientes en esta vista"
                description="Cambia el filtro o espera a que llegue una nueva solicitud."
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}
