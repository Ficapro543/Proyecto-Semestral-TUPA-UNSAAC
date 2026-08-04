import { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import usePolling from '../../hooks/usePolling';
import StatCard from '../../components/ui/StatCard';
import { Loading, ErrorState, EmptyState, LiveBadge } from '../../components/ui/AsyncState';
import { estadoInfo, formatFecha, formatSoles, ESTADOS_CERRADOS } from '../../lib/estados';
import './MyProcedures.css';

const POLL_MS = 5000;

/**
 * Vista de seguimiento de todos los trámites del estudiante, con el detalle
 * de etapa y plazo. Complementa "Mis Solicitudes" (que agrupa por pestañas).
 */
export default function MyProcedures() {
  const navigate = useNavigate();

  const fetcher = useCallback((opts) => api.listMyRequests({ limit: 100 }, opts), []);
  const { data, error, loading, refresh } = usePolling(fetcher, { intervalMs: POLL_MS });

  const solicitudes = data || [];
  const enCurso = solicitudes.filter(
    (s) => !ESTADOS_CERRADOS.includes(s.estado) && s.estado !== 'BORRADOR'
  );
  const observadas = solicitudes.filter((s) => ['OBSERVADO', 'SUBSANACION'].includes(s.estado));
  const completadas = solicitudes.filter((s) => s.estado === 'COMPLETADO');

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <div>
          <h1 className="text-display-md" style={{ color: 'var(--clr-primary)' }}>Mis Trámites</h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', flexWrap: 'wrap' }}>
            <span>Seguimiento de todos tus expedientes</span>
            <LiveBadge intervalMs={POLL_MS} />
          </p>
        </div>
        <Link to="/tramite/paso1" className="btn btn-primary">
          <span className="material-symbols-outlined" aria-hidden="true">add</span> Nuevo Trámite
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <StatCard icon="pending_actions" iconBg="var(--clr-primary-fixed)" iconColor="var(--clr-primary)"
          value={String(enCurso.length)} label="En curso" badgeClass="badge-blue" />
        <StatCard icon="report_problem" iconBg="var(--clr-error-container)" iconColor="var(--clr-error)"
          value={String(observadas.length)} label="Observados" badgeClass="badge-error" />
        <StatCard icon="check_circle" iconBg="#d1fae5" iconColor="#065f46"
          value={String(completadas.length)} label="Completados" badgeClass="badge-success" />
      </div>

      {error && <ErrorState error={error} onRetry={refresh} />}

      {loading ? (
        <Loading label="Cargando trámites…" />
      ) : solicitudes.length === 0 ? (
        <EmptyState
          icon="description"
          title="Aún no tienes trámites"
          description="Inicia uno desde el catálogo TUPA."
          action={
            <Link to="/tramite/paso1" className="btn btn-primary" style={{ marginTop: 'var(--sp-md)' }}>
              Iniciar trámite
            </Link>
          }
        />
      ) : (
        <div className="card">
          <div className="table-scroll">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Trámite</th>
                  <th style={th}>Expediente</th>
                  <th style={th}>Etapa</th>
                  <th style={th}>Fecha</th>
                  <th style={th}>Monto</th>
                  <th style={th}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((s) => {
                  const info = estadoInfo(s.estado);
                  const esBorrador = s.estado === 'BORRADOR';
                  return (
                    <tr
                      key={s.id_solicitud}
                      style={{ borderTop: '1px solid var(--clr-outline-variant)', cursor: 'pointer' }}
                      onClick={() =>
                        navigate(esBorrador ? '/tramite/paso1' : `/estudiante/solicitudes/${s.id_solicitud}`)
                      }
                    >
                      <td style={{ ...td, fontWeight: 600 }}>{s.nombre_tramite}</td>
                      <td style={{ ...td, fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>
                        {s.numero_expediente || `#${s.id_solicitud}`}
                      </td>
                      <td style={td}>{s.etapa_visible || '—'}</td>
                      <td style={td}>{formatFecha(s.fecha_solicitud)}</td>
                      <td style={td}>{formatSoles(s.monto_total)}</td>
                      <td style={td}><span className={`badge ${info.badge}`}>{info.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

const th = {
  textAlign: 'left', padding: 'var(--sp-md)', fontSize: '11px', fontWeight: 700,
  color: 'var(--clr-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em',
  background: 'var(--clr-surface-container-low)', whiteSpace: 'nowrap',
};
const td = { padding: 'var(--sp-md)', fontSize: '13px', whiteSpace: 'nowrap' };
