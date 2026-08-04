import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WizardStepper from '../../../components/ui/WizardStepper';
import api from '../../../lib/api';
import { useWizard } from '../../../context/WizardContext';
import { Loading, ErrorState } from '../../../components/ui/AsyncState';
import SinSolicitud from './SinSolicitud';
import './Step4.css';

export default function Step4() {
  const navigate = useNavigate();
  const wizard = useWizard();

  const [requisitos, setRequisitos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [subiendo, setSubiendo] = useState({});
  const [errores, setErrores] = useState({});
  const inputsRef = useRef({});

  // Estado real de lo ya subido, leído del backend: así el paso sobrevive a un
  // refresco de la página y refleja lo que de verdad está guardado.
  const [documentos, setDocumentos] = useState({});

  const cargar = async () => {
    setCargando(true);
    try {
      const detalle = await api.getRequest(wizard.idSolicitud);
      setRequisitos(detalle.requisitos || []);
      const mapa = {};
      for (const d of detalle.documentos || []) {
        if (d.id_requisito !== null) mapa[d.id_requisito] = d;
      }
      setDocumentos(mapa);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (!wizard.idSolicitud) {
      setCargando(false);
      return;
    }
    cargar();
    api.updateStep(wizard.idSolicitud, 4).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wizard.idSolicitud]);

  const subir = async (idRequisito, file) => {
    setSubiendo((p) => ({ ...p, [idRequisito]: true }));
    setErrores((p) => ({ ...p, [idRequisito]: null }));

    try {
      const form = new FormData();
      form.append('archivo', file);
      const res = await api.uploadDocument(wizard.idSolicitud, idRequisito, form);
      setDocumentos((p) => ({ ...p, [idRequisito]: res.documento }));
      wizard.markDocumento(idRequisito, res.documento);
    } catch (err) {
      setErrores((p) => ({ ...p, [idRequisito]: err.message }));
    } finally {
      setSubiendo((p) => ({ ...p, [idRequisito]: false }));
    }
  };

  const eliminar = async (idRequisito) => {
    const doc = documentos[idRequisito];
    if (!doc) return;
    try {
      await api.deleteDocument(doc.id_documento);
      setDocumentos((p) => {
        const next = { ...p };
        delete next[idRequisito];
        return next;
      });
    } catch (err) {
      setErrores((p) => ({ ...p, [idRequisito]: err.message }));
    }
  };

  if (!wizard.idSolicitud) return <SinSolicitud paso={4} />;

  const obligatorios = requisitos.filter((r) => r.es_obligatorio);
  const listos = obligatorios.filter((r) => documentos[r.id_requisito]).length;
  const pct = obligatorios.length > 0 ? (listos / obligatorios.length) * 100 : 100;
  const puedeAvanzar = listos === obligatorios.length;

  return (
    <>
      <WizardStepper currentStep={4} />

      {cargando ? (
        <Loading label="Cargando documentos…" />
      ) : error ? (
        <ErrorState error={error} onRetry={cargar} />
      ) : (
        <div className="wizard-grid">
          <div style={{ minWidth: 0 }}>
            <h1 className="text-headline-md" style={{ color: 'var(--clr-primary)', marginBottom: 'var(--sp-xs)' }}>
              Subir Documentos
            </h1>
            <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginBottom: 'var(--sp-xl)' }}>
              Carga cada documento en el formato indicado. Formatos aceptados: PDF, JPG, PNG. Máximo 5 MB por archivo.
            </p>

            <div style={{ marginBottom: 'var(--sp-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-sm)' }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Progreso de carga</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--clr-primary)' }}>
                  {listos} / {obligatorios.length} obligatorios
                </span>
              </div>
              <div className="progress"><div className="progress-bar" style={{ width: `${pct}%` }} /></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
              {requisitos.map((r, i) => {
                const doc = documentos[r.id_requisito];
                const cargandoEste = subiendo[r.id_requisito];
                const errorEste = errores[r.id_requisito];

                return (
                  <div key={r.id_requisito} className={`doc-slot ${doc ? 'uploaded' : ''}`}>
                    <div className="doc-slot-header">
                      <div className="doc-slot-num">{doc ? '✓' : i + 1}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--clr-on-surface)' }}>
                          {r.descripcion_requisito}
                          {r.es_obligatorio && <span style={{ color: 'var(--clr-error)' }}> *</span>}
                        </div>
                      </div>
                      <span className={`badge ${r.es_obligatorio ? 'badge-error' : 'badge-neutral'}`} style={{ fontSize: '10px' }}>
                        {r.es_obligatorio ? 'Obligatorio' : 'Opcional'}
                      </span>
                    </div>

                    {doc ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)', padding: 'var(--sp-sm) var(--sp-md)', background: 'var(--clr-surface-container-low)', borderRadius: 'var(--radius-lg)', flexWrap: 'wrap' }}>
                        <span className="material-symbols-outlined icon-filled" style={{ color: 'var(--clr-primary)' }}>check_circle</span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--clr-primary)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {doc.nombre_archivo}
                        </span>
                        <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => eliminar(r.id_requisito)}>
                          <span className="material-symbols-outlined icon-sm">delete</span> Eliminar
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                          ref={(el) => (inputsRef.current[r.id_requisito] = el)}
                          onChange={(e) => e.target.files?.length && subir(r.id_requisito, e.target.files[0])}
                        />
                        <div
                          className="doc-upload-btn"
                          onClick={() => !cargandoEste && inputsRef.current[r.id_requisito]?.click()}
                        >
                          <span className="material-symbols-outlined">upload</span>
                          {cargandoEste ? 'Subiendo…' : 'Seleccionar archivo'}
                        </div>
                      </>
                    )}

                    {errorEste && (
                      <div className="alert alert-error" style={{ marginTop: 'var(--sp-sm)' }} role="alert">
                        <span className="material-symbols-outlined">error</span>
                        <div>{errorEste}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)', minWidth: 0 }}>
            <div className="card">
              <div className="card-header"><span className="card-header-title">Documentos cargados</span></div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-xs)' }}>
                {Object.keys(documentos).length === 0 ? (
                  <div className="empty-state" style={{ padding: 'var(--sp-lg) 0' }}>
                    <span className="material-symbols-outlined">upload_file</span>
                    <div className="empty-state-desc">Aún no has subido ningún documento</div>
                  </div>
                ) : (
                  requisitos
                    .filter((r) => documentos[r.id_requisito])
                    .map((r) => (
                      <div key={r.id_requisito} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)', padding: '6px 0' }}>
                        <span className="material-symbols-outlined icon-sm icon-filled" style={{ color: 'var(--clr-primary)' }}>check_circle</span>
                        <span style={{ fontSize: '13px' }}>{r.descripcion_requisito}</span>
                      </div>
                    ))
                )}
              </div>
            </div>

            {!puedeAvanzar && (
              <div className="alert alert-warning">
                <span className="material-symbols-outlined">warning</span>
                <div>Debes adjuntar todos los documentos obligatorios antes de enviar la solicitud.</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--sp-md)', flexWrap: 'wrap', paddingTop: 'var(--sp-lg)', borderTop: '1px solid var(--clr-outline-variant)', marginTop: 'var(--sp-xl)' }}>
        <button className="btn btn-outline" onClick={() => navigate('/tramite/paso3')}>
          <span className="material-symbols-outlined">arrow_back</span> Paso anterior
        </button>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/tramite/paso5')} disabled={!puedeAvanzar}>
          Revisar y Enviar
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </>
  );
}
