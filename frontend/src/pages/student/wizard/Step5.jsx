import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WizardStepper from '../../../components/ui/WizardStepper';
import api from '../../../lib/api';
import { useWizard } from '../../../context/WizardContext';
import { useAuth } from '../../../context/AuthContext';
import { Loading, ErrorState } from '../../../components/ui/AsyncState';
import { formatSoles, formatFecha, nombreCompleto } from '../../../lib/estados';
import SinSolicitud from './SinSolicitud';
import './Step5.css';

export default function Step5() {
  const navigate = useNavigate();
  const wizard = useWizard();
  const { user } = useAuth();

  const [detalle, setDetalle] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [declaracion, setDeclaracion] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState(null);

  const cargar = async () => {
    setCargando(true);
    try {
      const d = await api.getRequest(wizard.idSolicitud);
      setDetalle(d);
      setErrorCarga(null);
    } catch (err) {
      setErrorCarga(err);
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
    api.updateStep(wizard.idSolicitud, 5).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wizard.idSolicitud]);

  /** Envía de verdad la solicitud: aquí es donde aparece del lado del admin. */
  const enviar = async () => {
    if (!declaracion) {
      setErrorEnvio('Debes aceptar la declaración jurada para continuar.');
      return;
    }

    setEnviando(true);
    setErrorEnvio(null);

    try {
      const res = await api.submitRequest(wizard.idSolicitud);
      wizard.update({ numeroExpediente: res.solicitud.numero_expediente });
      navigate('/tramite/paso6');
    } catch (err) {
      setErrorEnvio(err.message);
      setEnviando(false);
    }
  };

  if (!wizard.idSolicitud) return <SinSolicitud paso={5} />;
  if (cargando) return (<><WizardStepper currentStep={5} /><Loading label="Cargando resumen…" /></>);
  if (errorCarga) return (<><WizardStepper currentStep={5} /><ErrorState error={errorCarga} onRetry={cargar} /></>);

  const docs = (detalle?.documentos || []).filter((d) => d.id_requisito !== null);

  return (
    <>
      <WizardStepper currentStep={5} />

      <div className="wizard-grid">
        <div style={{ minWidth: 0 }}>
          <h1 className="text-headline-md" style={{ color: 'var(--clr-primary)', marginBottom: 'var(--sp-xs)' }}>
            Revisar y Enviar
          </h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginBottom: 'var(--sp-xl)' }}>
            Verifica que toda la información sea correcta antes de enviar tu solicitud.
          </p>

          <div className="review-section">
            <div className="review-section-header">
              <span className="review-section-title">Procedimiento seleccionado</span>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tramite/paso1')}>
                <span className="material-symbols-outlined">edit</span> Cambiar
              </button>
            </div>
            <CampoReview label="Nombre del trámite" valor={<strong style={{ color: 'var(--clr-primary)' }}>{detalle.nombre_tramite}</strong>} />
            <CampoReview label="Código TUPA" valor={<span className="text-mono-sm">{detalle.cod_tramite}</span>} />
            <CampoReview label="Categoría" valor={detalle.nombre_categoria || '—'} />
            <CampoReview label="Plazo" valor={`${detalle.dias_habiles} días hábiles`} />
          </div>

          <div className="review-section">
            <div className="review-section-header">
              <span className="review-section-title">Datos del solicitante</span>
            </div>
            <CampoReview label="Nombre completo" valor={nombreCompleto(detalle)} />
            <CampoReview label="DNI" valor={<span className="text-mono-sm">{detalle.dni}</span>} />
            <CampoReview label="Código UNSAAC" valor={<span className="text-mono-sm">{detalle.codigo_universitario || '—'}</span>} />
            <CampoReview label="Correo" valor={detalle.email_institucional || user?.email_institucional} />
          </div>

          <div className="review-section">
            <div className="review-section-header">
              <span className="review-section-title">Información de pago</span>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tramite/paso3')}>
                <span className="material-symbols-outlined">edit</span> Editar
              </button>
            </div>
            <CampoReview label="Monto" valor={<strong style={{ color: 'var(--clr-primary)' }}>{formatSoles(detalle.monto_total)}</strong>} />
            <CampoReview label="N.º de recibo" valor={<span className="text-mono-sm">{detalle.nro_recibo || '—'}</span>} />
            <CampoReview label="Fecha de pago" valor={formatFecha(detalle.fecha_pago)} />
          </div>

          <div className="review-section">
            <div className="review-section-header">
              <span className="review-section-title">Documentos adjuntados ({docs.length})</span>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tramite/paso4')}>
                <span className="material-symbols-outlined">edit</span> Editar
              </button>
            </div>
            <div>
              {(detalle.requisitos || []).map((r) => {
                const doc = docs.find((d) => d.id_requisito === r.id_requisito);
                return (
                  <div key={r.id_requisito} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', padding: 'var(--sp-md) var(--sp-lg)', borderBottom: '1px solid var(--clr-outline-variant)', flexWrap: 'wrap' }}>
                    <span className="material-symbols-outlined icon-filled" style={{ color: doc ? 'var(--clr-primary)' : 'var(--clr-outline)' }}>
                      {doc ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span style={{ fontSize: '14px', flex: 1, minWidth: 0 }}>{r.descripcion_requisito}</span>
                    <span className={`badge ${doc ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '10px' }}>
                      {doc ? 'Cargado' : 'Pendiente'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <label className="form-check" style={{ alignItems: 'flex-start', gap: 'var(--sp-md)' }}>
                <input
                  type="checkbox"
                  style={{ marginTop: '3px' }}
                  checked={declaracion}
                  onChange={(e) => { setDeclaracion(e.target.checked); setErrorEnvio(null); }}
                />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Declaración Jurada</div>
                  <p style={{ fontSize: '13px', color: 'var(--clr-secondary)', lineHeight: 1.6 }}>
                    Declaro bajo juramento que toda la información y documentos adjuntados en esta
                    solicitud son auténticos y verídicos. Soy consciente que proporcionar información
                    falsa o documentación adulterada es sancionado conforme a ley.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {errorEnvio && (
            <div className="alert alert-error" style={{ marginTop: 'var(--sp-lg)' }} role="alert">
              <span className="material-symbols-outlined">error</span>
              <div>{errorEnvio}</div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)', minWidth: 0 }}>
          <div className="card detail-sticky" style={{ borderColor: 'var(--clr-primary)' }}>
            <div className="card-header"><span className="card-header-title">Resumen del envío</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)', fontSize: '14px' }}>
              <Fila label="Trámite" valor={<strong>{detalle.nombre_tramite}</strong>} />
              <Fila label="Documentos" valor={<strong style={{ color: 'var(--clr-primary)' }}>{docs.length} de {detalle.requisitos?.length || 0}</strong>} />
              <Fila label="Monto" valor={formatSoles(detalle.monto_total)} />
              <div className="divider" />
              <div style={{ fontSize: '13px', color: 'var(--clr-secondary)', lineHeight: 1.5 }}>
                Al enviar recibirás un número de expediente para rastrear el estado de tu trámite.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--sp-md)', flexWrap: 'wrap', paddingTop: 'var(--sp-lg)', borderTop: '1px solid var(--clr-outline-variant)', marginTop: 'var(--sp-xl)' }}>
        <button className="btn btn-outline" onClick={() => navigate('/tramite/paso4')} disabled={enviando}>
          <span className="material-symbols-outlined">arrow_back</span> Paso anterior
        </button>
        <button className="btn btn-primary btn-lg" onClick={enviar} disabled={enviando}>
          {enviando ? 'Enviando solicitud…' : (<><span className="material-symbols-outlined">send</span> Enviar Solicitud</>)}
        </button>
      </div>
    </>
  );
}

function CampoReview({ label, valor }) {
  return (
    <div className="review-field">
      <div className="review-label">{label}</div>
      <div className="review-value">{valor}</div>
    </div>
  );
}

function Fila({ label, valor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--sp-md)' }}>
      <span style={{ color: 'var(--clr-secondary)' }}>{label}</span>
      <span style={{ textAlign: 'right' }}>{valor}</span>
    </div>
  );
}
