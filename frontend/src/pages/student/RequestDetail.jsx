import { useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import usePolling from '../../hooks/usePolling';
import { Loading, ErrorState, LiveBadge } from '../../components/ui/AsyncState';
import DocumentViewer from '../../components/ui/DocumentViewer';
import { estadoInfo, formatFecha, formatSoles } from '../../lib/estados';

const POLL_MS = 4000;

/**
 * Detalle de una solicitud para el estudiante. Se refresca por polling, así
 * que la decisión que toma el administrador en la otra máquina aparece aquí
 * sin recargar la página.
 */
export default function StudentRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const fetcher = useCallback((opts) => api.getRequest(id, opts), [id]);
  const { data: s, error, loading, refresh } = usePolling(fetcher, {
    intervalMs: POLL_MS,
    deps: [id],
  });
  const [docEnVisor, setDocEnVisor] = useState(null);

  if (loading) return <Loading label="Cargando solicitud…" />;
  if (error) {
    return (
      <>
        <button className="btn btn-ghost" onClick={() => navigate('/estudiante/solicitudes')}>
          <span className="material-symbols-outlined">arrow_back</span> Mis solicitudes
        </button>
        <div style={{ marginTop: 'var(--sp-lg)' }}>
          <ErrorState error={error} onRetry={refresh} />
        </div>
      </>
    );
  }
  if (!s) return null;

  const info = estadoInfo(s.estado);
  const docsRequisito = (s.documentos || []).filter((d) => d.id_requisito !== null);
  const observacionesAbiertas = (s.observaciones || []).filter((o) => o.estado === 'PENDIENTE');

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', marginBottom: 'var(--sp-lg)', flexWrap: 'wrap' }}>
        <button className="btn btn-ghost" onClick={() => navigate('/estudiante/solicitudes')}>
          <span className="material-symbols-outlined">arrow_back</span> Mis solicitudes
        </button>
        <LiveBadge intervalMs={POLL_MS} />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <div>
          <h1 className="text-display-md" style={{ color: 'var(--clr-primary)' }}>{s.nombre_tramite}</h1>
          <p className="text-mono-sm" style={{ color: 'var(--clr-secondary)', marginTop: '4px' }}>
            {s.numero_expediente || `Borrador #${s.id_solicitud}`}
          </p>
        </div>
        <span className={`badge ${info.badge}`} style={{ fontSize: '14px' }}>
          <span className="material-symbols-outlined icon-sm">{info.icon}</span>
          {info.label}
        </span>
      </div>

      {observacionesAbiertas.length > 0 && (
        <div className="alert alert-warning" style={{ marginBottom: 'var(--sp-lg)', alignItems: 'flex-start' }}>
          <span className="material-symbols-outlined">report_problem</span>
          <div>
            <div style={{ fontWeight: 700, marginBottom: '4px' }}>
              Tu expediente tiene observaciones por subsanar
            </div>
            <ul style={{ paddingLeft: '18px', listStyle: 'disc' }}>
              {observacionesAbiertas.map((o) => (
                <li key={o.id_observacion} style={{ fontSize: '13px' }}>
                  {o.descripcion}
                  {o.fecha_limite_subsanacion && (
                    <> — plazo: {formatFecha(o.fecha_limite_subsanacion)}</>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)', minWidth: 0 }}>
          <div className="card">
            <div className="card-header"><span className="card-header-title">Estado del trámite</span></div>
            <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 'var(--sp-md)', fontSize: '14px' }}>
              <div>
                <div className="detail-label">Etapa actual</div>
                <div style={{ fontWeight: 600 }}>{s.etapa_visible || '—'}</div>
              </div>
              <div>
                <div className="detail-label">Fecha de solicitud</div>
                <div style={{ fontWeight: 600 }}>{formatFecha(s.fecha_solicitud, { conHora: true })}</div>
              </div>
              <div>
                <div className="detail-label">Plazo del trámite</div>
                <div style={{ fontWeight: 600 }}>{s.dias_habiles} días hábiles</div>
              </div>
              <div>
                <div className="detail-label">Monto</div>
                <div style={{ fontWeight: 600 }}>{formatSoles(s.monto_total)}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-header-title">Documentos presentados</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
              {(s.requisitos || []).map((req) => {
                const doc = docsRequisito.find((d) => d.id_requisito === req.id_requisito);
                const badge =
                  !doc ? 'badge-neutral'
                    : doc.estado_validacion === 'APROBADO' ? 'badge-success'
                    : doc.estado_validacion === 'RECHAZADO' ? 'badge-error'
                    : 'badge-warning';

                return (
                  <div key={req.id_requisito} className="doc-review-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{req.descripcion_requisito}</div>
                      {doc ? (
                        <button
                          type="button"
                          onClick={() => setDocEnVisor(doc)}
                          style={{ fontSize: '12px', color: 'var(--clr-primary)', fontWeight: 600, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                        >
                          {doc.nombre_archivo}
                        </button>
                      ) : (
                        <div style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}>No adjuntado</div>
                      )}
                    </div>
                    <span className={`badge ${badge}`} style={{ fontSize: '10px' }}>
                      {doc ? doc.estado_validacion : 'FALTANTE'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)', minWidth: 0 }}>
          <div className="card detail-sticky">
            <div className="card-header"><span className="card-header-title">Línea de tiempo</span></div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
                {/* El registro inicial no vive en `seguimiento` (esa tabla exige un
                    admin), así que se deriva de la propia solicitud. */}
                {s.numero_expediente && (
                  <HitoTimeline
                    titulo="Solicitud registrada"
                    detalle={`Expediente ${s.numero_expediente}`}
                    fecha={s.fecha_solicitud}
                  />
                )}
                {(s.seguimiento || []).map((seg) => (
                  <HitoTimeline
                    key={seg.id_seguimiento}
                    titulo={estadoInfo(seg.estado_nuevo).label}
                    detalle={seg.comentario || seg.etapa_visible}
                    fecha={seg.fecha_cambio}
                    autor={seg.admin_nombres ? `${seg.admin_nombres} ${seg.admin_ap_paterno || ''}` : null}
                  />
                ))}
                {!s.numero_expediente && (s.seguimiento || []).length === 0 && (
                  <div style={{ fontSize: '14px', color: 'var(--clr-secondary)' }}>
                    Esta solicitud aún es un borrador sin enviar.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {docEnVisor && (
        <DocumentViewer
          idDocumento={docEnVisor.id_documento}
          nombreArchivo={docEnVisor.nombre_archivo}
          onClose={() => setDocEnVisor(null)}
        />
      )}
    </>
  );
}

function HitoTimeline({ titulo, detalle, fecha, autor }) {
  return (
    <div style={{ borderLeft: '3px solid var(--clr-primary)', paddingLeft: 'var(--sp-md)' }}>
      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--clr-primary)' }}>{titulo}</div>
      {detalle && <div style={{ fontSize: '13px', marginTop: '2px' }}>{detalle}</div>}
      <div style={{ fontSize: '12px', color: 'var(--clr-secondary)', marginTop: '2px' }}>
        {formatFecha(fecha, { conHora: true })}
        {autor ? ` · ${autor}` : ''}
      </div>
    </div>
  );
}
