import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WizardStepper from '../../../components/ui/WizardStepper';
import api from '../../../lib/api';
import { useWizard } from '../../../context/WizardContext';
import { Loading, ErrorState } from '../../../components/ui/AsyncState';
import { formatSoles } from '../../../lib/estados';
import SinSolicitud from './SinSolicitud';
import './Step2.css';

export default function Step2() {
  const navigate = useNavigate();
  const wizard = useWizard();

  const [tramite, setTramite] = useState(wizard.tramite || null);
  const [requisitos, setRequisitos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [marcados, setMarcados] = useState(new Set());

  useEffect(() => {
    if (!wizard.codTramite) {
      setCargando(false);
      return;
    }

    let cancelado = false;
    setCargando(true);

    api
      .getProcedure(wizard.codTramite)
      .then((data) => {
        if (cancelado) return;
        setTramite(data);
        setRequisitos(data.requisitos || []);
        setError(null);
      })
      .catch((err) => !cancelado && setError(err))
      .finally(() => !cancelado && setCargando(false));

    return () => { cancelado = true; };
  }, [wizard.codTramite]);

  // Registrar el avance también en el backend, para que un borrador retomado
  // más tarde sepa en qué paso se quedó.
  useEffect(() => {
    if (wizard.idSolicitud) api.updateStep(wizard.idSolicitud, 2).catch(() => {});
  }, [wizard.idSolicitud]);

  const alternar = (id) => {
    setMarcados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const obligatorios = requisitos.filter((r) => r.es_obligatorio);
  const listos = obligatorios.filter((r) => marcados.has(r.id_requisito)).length;
  const pct = obligatorios.length > 0 ? Math.round((listos / obligatorios.length) * 100) : 100;
  const todoListo = listos === obligatorios.length;

  if (!wizard.idSolicitud) return <SinSolicitud paso={2} />;

  return (
    <>
      <WizardStepper currentStep={2} />

      {cargando ? (
        <Loading label="Cargando requisitos…" />
      ) : error ? (
        <ErrorState error={error} />
      ) : (
        <div className="wizard-grid">
          <div style={{ minWidth: 0 }}>
            <div style={{ marginBottom: 'var(--sp-lg)' }}>
              <h1 className="text-headline-md" style={{ color: 'var(--clr-primary)', marginBottom: 'var(--sp-xs)' }}>
                Revisar Requisitos
              </h1>
              <p className="text-body-md" style={{ color: 'var(--clr-secondary)' }}>
                Confirma que tienes todos los documentos necesarios. Marca cada ítem para registrar que lo tienes listo.
              </p>
            </div>

            <div style={{ background: 'var(--clr-primary)', borderRadius: 'var(--radius-xl)', padding: 'var(--sp-md) var(--sp-lg)', display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', marginBottom: 'var(--sp-lg)', flexWrap: 'wrap' }}>
              <span className="material-symbols-outlined icon-filled" style={{ fontSize: '28px', color: 'var(--clr-tertiary-fixed)' }}>description</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', fontWeight: 700, color: 'white' }}>
                  {tramite?.nombre_tramite}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>
                  {tramite?.cod_tramite} · {formatSoles(tramite?.precio)} · {tramite?.dias_habiles} días hábiles
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--clr-tertiary-fixed)' }} onClick={() => navigate('/tramite/paso1')}>
                Cambiar
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
              {requisitos.map((r) => (
                <div
                  key={r.id_requisito}
                  className={`req-check-item ${marcados.has(r.id_requisito) ? 'checked' : ''}`}
                  onClick={() => alternar(r.id_requisito)}
                >
                  <span className="material-symbols-outlined status">
                    {marcados.has(r.id_requisito) ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--clr-on-surface)' }}>
                      {r.descripcion_requisito}
                    </div>
                  </div>
                  <span className={`badge ${r.es_obligatorio ? 'badge-error' : 'badge-neutral'}`} style={{ fontSize: '10px' }}>
                    {r.es_obligatorio ? 'Obligatorio' : 'Opcional'}
                  </span>
                </div>
              ))}
              {requisitos.length === 0 && (
                <div style={{ color: 'var(--clr-secondary)' }}>Este trámite no tiene requisitos registrados.</div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)', minWidth: 0 }}>
            <div className="card">
              <div className="card-header"><span className="card-header-title">Progreso de preparación</span></div>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-sm)' }}>
                  <span style={{ fontSize: '14px', color: 'var(--clr-secondary)' }}>Documentos confirmados</span>
                  <span style={{ fontWeight: 700, color: 'var(--clr-primary)' }}>{listos} / {obligatorios.length}</span>
                </div>
                <div className="progress" style={{ height: '8px', marginBottom: 'var(--sp-md)' }}>
                  <div className="progress-bar" style={{ width: `${pct}%` }} />
                </div>
                {todoListo ? (
                  <div className="badge badge-success" style={{ fontSize: '13px' }}>
                    <span className="material-symbols-outlined">check_circle</span> ¡Listo para continuar!
                  </div>
                ) : (
                  <div className="badge badge-warning" style={{ fontSize: '13px' }}>
                    <span className="material-symbols-outlined">hourglass_empty</span>
                    Faltan {obligatorios.length - listos}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--sp-md)', flexWrap: 'wrap', paddingTop: 'var(--sp-lg)', borderTop: '1px solid var(--clr-outline-variant)', marginTop: 'var(--sp-xl)' }}>
        <button className="btn btn-outline" onClick={() => navigate('/tramite/paso1')}>
          <span className="material-symbols-outlined">arrow_back</span> Paso anterior
        </button>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/tramite/paso3')}>
          Ir a Confirmación de Pago
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </>
  );
}
