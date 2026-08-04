import { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../lib/api';
import usePolling from '../../hooks/usePolling';
import { Loading, ErrorState, LiveBadge } from '../../components/ui/AsyncState';
import DocumentViewer from '../../components/ui/DocumentViewer';
import { estadoInfo, esCerrado, formatFecha, formatSoles, nombreCompleto } from '../../lib/estados';

const POLL_MS = 4000;

/**
 * Detalle administrativo de una solicitud: documentos, validación por documento
 * y registro de la decisión. Es la pantalla donde la sesión B actúa.
 */
export default function AdminRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const fetcher = useCallback((opts) => api.getAdminRequest(id, opts), [id]);
  const { data: solicitud, error, loading, refresh } = usePolling(fetcher, {
    intervalMs: POLL_MS,
    deps: [id],
  });

  // Validación por documento elegida por el admin: { [id_documento]: 'APROBADO' | 'RECHAZADO' }
  const [validaciones, setValidaciones] = useState({});
  const [observaciones, setObservaciones] = useState({});
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [errorDecision, setErrorDecision] = useState(null);
  const [exito, setExito] = useState(null);
  const [docEnVisor, setDocEnVisor] = useState(null);

  const cerrado = solicitud ? esCerrado(solicitud.estado) : false;

  const docsRequisito = useMemo(
    () => (solicitud?.documentos || []).filter((d) => d.id_requisito !== null),
    [solicitud]
  );
  const voucher = useMemo(
    () => (solicitud?.documentos || []).find((d) => d.id_requisito === null),
    [solicitud]
  );

  const setValidacion = (idDoc, valor) => {
    setValidaciones((prev) => ({ ...prev, [idDoc]: prev[idDoc] === valor ? undefined : valor }));
  };

  const marcarTodos = (valor) => {
    const next = {};
    for (const d of docsRequisito) next[d.id_documento] = valor;
    setValidaciones(next);
  };

  const construirObservacionesDocumentos = () =>
    Object.entries(validaciones)
      .filter(([, estado]) => Boolean(estado))
      .map(([idDoc, estado]) => ({
        id_documento: Number(idDoc),
        estado_validacion: estado,
        observacion: observaciones[idDoc] || undefined,
      }));

  const decidir = async (accion) => {
    setEnviando(true);
    setErrorDecision(null);
    setExito(null);

    try {
      const payload = {
        accion,
        comentario: comentario.trim() || undefined,
        observaciones_documentos: construirObservacionesDocumentos(),
      };
      const res = await api.processDecision(id, payload);
      setExito(`Estado actualizado a ${res.solicitud.estado}`);
      setComentario('');
      await refresh();
    } catch (err) {
      setErrorDecision(err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return <Loading label="Cargando expediente…" />;
  if (error) {
    return (
      <>
        <button className="btn btn-ghost" onClick={() => navigate('/admin/cola')}>
          <span className="material-symbols-outlined">arrow_back</span> Volver a la cola
        </button>
        <div style={{ marginTop: 'var(--sp-lg)' }}>
          <ErrorState error={error} onRetry={refresh} />
        </div>
      </>
    );
  }
  if (!solicitud) return null;

  const info = estadoInfo(solicitud.estado);
  const todosDecididos =
    docsRequisito.length > 0 && docsRequisito.every((d) => validaciones[d.id_documento]);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', marginBottom: 'var(--sp-lg)', flexWrap: 'wrap' }}>
        <button className="btn btn-ghost" onClick={() => navigate('/admin/cola')}>
          <span className="material-symbols-outlined">arrow_back</span> Cola
        </button>
        <LiveBadge intervalMs={POLL_MS} />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <div>
          <h1 className="text-display-md" style={{ color: 'var(--clr-primary)' }}>
            {solicitud.nombre_tramite}
          </h1>
          <p className="text-mono-sm" style={{ color: 'var(--clr-secondary)', marginTop: '4px' }}>
            {solicitud.numero_expediente || `Borrador #${solicitud.id_solicitud}`}
          </p>
        </div>
        <span className={`badge ${info.badge}`} style={{ fontSize: '14px' }}>
          <span className="material-symbols-outlined icon-sm">{info.icon}</span>
          {info.label}
        </span>
      </div>

      <div className="detail-grid">
        {/* ── Columna principal ───────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)', minWidth: 0 }}>
          <div className="card">
            <div className="card-header"><span className="card-header-title">Solicitante</span></div>
            <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--sp-md)', fontSize: '14px' }}>
              <Campo label="Nombre" valor={nombreCompleto(solicitud)} />
              <Campo label="DNI" valor={solicitud.dni} mono />
              <Campo label="Código universitario" valor={solicitud.codigo_universitario} mono />
              <Campo label="Correo" valor={solicitud.email_institucional} />
              <Campo label="Teléfono" valor={solicitud.telefono} />
              <Campo label="Fecha de solicitud" valor={formatFecha(solicitud.fecha_solicitud, { conHora: true })} />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-header-title">Pago</span>
            </div>
            <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--sp-md)', fontSize: '14px' }}>
              <Campo label="Monto" valor={formatSoles(solicitud.monto_total)} />
              <Campo label="N.º de recibo" valor={solicitud.nro_recibo} mono />
              <Campo label="Fecha de pago" valor={formatFecha(solicitud.fecha_pago)} />
              <div>
                <div className="detail-label">Comprobante</div>
                {voucher ? (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setDocEnVisor(voucher)}
                    style={{ marginTop: '4px' }}
                  >
                    <span className="material-symbols-outlined icon-sm">open_in_new</span> Ver voucher
                  </button>
                ) : (
                  <div style={{ color: 'var(--clr-secondary)' }}>No adjuntado</div>
                )}
              </div>
            </div>
          </div>

          {/* Documentos + validación */}
          <div className="card">
            <div className="card-header" style={{ flexWrap: 'wrap', gap: 'var(--sp-sm)' }}>
              <span className="card-header-title">
                Documentos ({docsRequisito.length} de {solicitud.requisitos?.length || 0} requisitos)
              </span>
              {!cerrado && docsRequisito.length > 0 && (
                <div style={{ display: 'flex', gap: 'var(--sp-xs)', marginLeft: 'auto' }}>
                  <button className="btn btn-ghost btn-sm" aria-label="Marcar todos los documentos como aprobados" onClick={() => marcarTodos('APROBADO')}>
                    <span className="material-symbols-outlined icon-sm" aria-hidden="true">done_all</span> Aprobar todos
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setValidaciones({})}>
                    Limpiar
                  </button>
                </div>
              )}
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
              {(solicitud.requisitos || []).map((req) => {
                const doc = docsRequisito.find((d) => d.id_requisito === req.id_requisito);
                const elegido = doc ? validaciones[doc.id_documento] : undefined;

                return (
                  <div key={req.id_requisito} className="doc-review-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)', flexWrap: 'wrap' }}>
                        {req.descripcion_requisito}
                        <span className={`badge ${req.es_obligatorio ? 'badge-error' : 'badge-neutral'}`} style={{ fontSize: '10px' }}>
                          {req.es_obligatorio ? 'Obligatorio' : 'Opcional'}
                        </span>
                      </div>

                      {doc ? (
                        <div style={{ fontSize: '12px', color: 'var(--clr-secondary)', marginTop: '4px', display: 'flex', gap: 'var(--sp-md)', flexWrap: 'wrap', alignItems: 'center' }}>
                          <button
                            type="button"
                            className="btn-link"
                            onClick={() => setDocEnVisor(doc)}
                            style={{ color: 'var(--clr-primary)', fontWeight: 600, background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <span className="material-symbols-outlined icon-sm" style={{ verticalAlign: 'middle' }}>description</span> {doc.nombre_archivo}
                          </button>
                          <span>{formatFecha(doc.fecha_subida)}</span>
                          <span className={`badge ${doc.estado_validacion === 'APROBADO' ? 'badge-success' : doc.estado_validacion === 'RECHAZADO' ? 'badge-error' : 'badge-neutral'}`} style={{ fontSize: '10px' }}>
                            {doc.estado_validacion}
                          </span>
                        </div>
                      ) : (
                        <div style={{ fontSize: '12px', color: 'var(--clr-error)', marginTop: '4px' }}>
                          No adjuntado
                        </div>
                      )}

                      {elegido === 'RECHAZADO' && (
                        <input
                          className="form-input"
                          style={{ marginTop: 'var(--sp-sm)', fontSize: '13px' }}
                          placeholder="Motivo del rechazo (se envía al estudiante)"
                          value={observaciones[doc.id_documento] || ''}
                          onChange={(e) =>
                            setObservaciones((prev) => ({ ...prev, [doc.id_documento]: e.target.value }))
                          }
                        />
                      )}
                    </div>

                    {doc && !cerrado && (
                      <div style={{ display: 'flex', gap: 'var(--sp-xs)', flexShrink: 0 }}>
                        <button
                          className={`btn btn-sm ${elegido === 'APROBADO' ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => setValidacion(doc.id_documento, 'APROBADO')}
                          title="Marcar como aprobado"
                        >
                          <span className="material-symbols-outlined icon-sm">check</span>
                        </button>
                        <button
                          className={`btn btn-sm ${elegido === 'RECHAZADO' ? 'btn-danger' : 'btn-outline'}`}
                          onClick={() => setValidacion(doc.id_documento, 'RECHAZADO')}
                          title="Marcar como rechazado"
                        >
                          <span className="material-symbols-outlined icon-sm">close</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              {(solicitud.requisitos || []).length === 0 && (
                <div style={{ color: 'var(--clr-secondary)', fontSize: '14px' }}>
                  Este trámite no tiene requisitos registrados.
                </div>
              )}
            </div>
          </div>

          {/* Historial */}
          <div className="card">
            <div className="card-header"><span className="card-header-title">Historial de seguimiento</span></div>
            <div className="card-body">
              {(solicitud.seguimiento || []).length === 0 ? (
                <div style={{ color: 'var(--clr-secondary)', fontSize: '14px' }}>
                  Sin movimientos administrativos todavía.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
                  {solicitud.seguimiento.map((s) => (
                    <div key={s.id_seguimiento} style={{ borderLeft: '3px solid var(--clr-primary)', paddingLeft: 'var(--sp-md)' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>
                        {s.estado_anterior || '—'} → {s.estado_nuevo}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}>
                        {formatFecha(s.fecha_cambio, { conHora: true })}
                        {s.admin_nombres ? ` · ${s.admin_nombres} ${s.admin_ap_paterno || ''}` : ''}
                      </div>
                      {s.comentario && (
                        <div style={{ fontSize: '13px', marginTop: '4px' }}>{s.comentario}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Panel de decisión ───────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)', minWidth: 0 }}>
          <div className="card detail-sticky" style={{ borderColor: 'var(--clr-primary)' }}>
            <div className="card-header"><span className="card-header-title">Decisión</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
              {cerrado ? (
                <div className="alert alert-info">
                  <span className="material-symbols-outlined">lock</span>
                  <div>
                    Este expediente está en estado <strong>{info.label}</strong> y ya no admite
                    nuevas decisiones.
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="form-label" htmlFor="comentario">
                      Comentario para el estudiante
                    </label>
                    <textarea
                      id="comentario"
                      className="form-input"
                      rows={4}
                      style={{ resize: 'vertical', paddingTop: 'var(--sp-sm)' }}
                      placeholder="Obligatorio al observar o rechazar"
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                    />
                  </div>

                  {docsRequisito.length > 0 && !todosDecididos && (
                    <div className="alert alert-warning" style={{ fontSize: '13px' }}>
                      <span className="material-symbols-outlined">info</span>
                      <div>
                        Para que el expediente pase a <strong>Completado</strong>, marca todos los
                        documentos obligatorios como aprobados.
                      </div>
                    </div>
                  )}

                  {errorDecision && (
                    <div className="alert alert-error" role="alert">
                      <span className="material-symbols-outlined">error</span>
                      <div>{errorDecision}</div>
                    </div>
                  )}
                  {exito && (
                    <div className="alert alert-success" role="status">
                      <span className="material-symbols-outlined">check_circle</span>
                      <div>{exito}</div>
                    </div>
                  )}

                  {/* aria-label explícito: el texto de la ligadura del icono
                      (p. ej. "check_circle") se cuela en el nombre accesible
                      del botón y lo vuelve ilegible para lectores de pantalla. */}
                  <button className="btn btn-primary w-full" aria-label="Aprobar solicitud" disabled={enviando} onClick={() => decidir('APROBAR')}>
                    <span className="material-symbols-outlined" aria-hidden="true">check_circle</span> Aprobar
                  </button>
                  <button className="btn btn-outline w-full" aria-label="Marcar en proceso" disabled={enviando} onClick={() => decidir('EN_PROCESO')}>
                    <span className="material-symbols-outlined" aria-hidden="true">fact_check</span> Marcar en proceso
                  </button>
                  <button className="btn btn-warning w-full" aria-label="Observar solicitud" disabled={enviando} onClick={() => decidir('OBSERVAR')}>
                    <span className="material-symbols-outlined" aria-hidden="true">report_problem</span> Observar
                  </button>
                  <button className="btn btn-danger w-full" aria-label="Rechazar solicitud" disabled={enviando} onClick={() => decidir('RECHAZAR')}>
                    <span className="material-symbols-outlined" aria-hidden="true">cancel</span> Rechazar
                  </button>
                </>
              )}
            </div>
          </div>

          {(solicitud.observaciones || []).length > 0 && (
            <div className="card">
              <div className="card-header"><span className="card-header-title">Observaciones emitidas</span></div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
                {solicitud.observaciones.map((o) => (
                  <div key={o.id_observacion} style={{ fontSize: '13px' }}>
                    <div style={{ fontWeight: 600 }}>{o.descripcion}</div>
                    <div style={{ color: 'var(--clr-secondary)', fontSize: '12px' }}>
                      {formatFecha(o.fecha_creacion, { conHora: true })} · {o.estado}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link to="/admin/cola" className="btn btn-ghost">
            <span className="material-symbols-outlined">list</span> Ver toda la cola
          </Link>
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

function Campo({ label, valor, mono = false }) {
  return (
    <div>
      <div className="detail-label">{label}</div>
      <div className={mono ? 'text-mono-sm' : ''} style={{ fontWeight: 600 }}>{valor || '—'}</div>
    </div>
  );
}
