import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WizardStepper from '../../../components/ui/WizardStepper';
import './Step5.css';

const docNames = ['Solicitud F-001','Certificado de estudios','Copia DNI','Constancia no adeudo Econ.','Constancia no adeudo Biblioteca','Voucher de pago','Foto carné'];

export default function Step5() {
  const navigate = useNavigate();
  const [declaration, setDeclaration] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!declaration) {
      alert('Debes aceptar la declaración jurada para continuar');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      navigate('/tramite/paso6');
    }, 2000);
  };

  return (
    <>
      <WizardStepper currentStep={5} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--sp-xl)' }}>
        <div>
          <h1 className="text-headline-md" style={{ color: 'var(--clr-primary)', marginBottom: 'var(--sp-xs)' }}>Revisar y Enviar</h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginBottom: 'var(--sp-xl)' }}>Verifica que toda la información sea correcta antes de enviar tu solicitud. Una vez enviada, no podrás modificarla.</p>

          {/* Procedure info */}
          <div className="review-section animate-on-load">
            <div className="review-section-header">
              <span className="review-section-title">Procedimiento seleccionado</span>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tramite/paso1')}>
                <span className="material-symbols-outlined">edit</span> Cambiar
              </button>
            </div>
            <div className="review-field">
              <div className="review-label">Nombre del trámite</div>
              <div className="review-value" style={{ fontWeight: 700, color: 'var(--clr-primary)' }}>Diploma de Bachiller</div>
            </div>
            <div className="review-field">
              <div className="review-label">Código TUPA</div>
              <div className="review-value"><span className="text-mono-sm" style={{ color: 'var(--clr-primary)' }}>P001</span></div>
            </div>
            <div className="review-field">
              <div className="review-label">Facultad</div>
              <div className="review-value">Ing. Eléctrica, Electrónica, Informática y Mecánica</div>
            </div>
            <div className="review-field">
              <div className="review-label">Modalidad</div>
              <div className="review-value"><span className="badge badge-success">100% Digital</span></div>
            </div>
          </div>

          {/* Applicant info */}
          <div className="review-section animate-on-load stagger-1">
            <div className="review-section-header">
              <span className="review-section-title">Datos del solicitante</span>
            </div>
            <div className="review-field"><div className="review-label">Nombre completo</div><div className="review-value">Elena María Rodríguez Quispe</div></div>
            <div className="review-field"><div className="review-label">CUI / DNI</div><div className="review-value"><span className="text-mono-sm">73456891</span></div></div>
            <div className="review-field"><div className="review-label">Código UNSAAC</div><div className="review-value"><span className="text-mono-sm">201900456</span></div></div>
            <div className="review-field"><div className="review-label">Correo</div><div className="review-value">e.rodriguez@unsaac.edu.pe</div></div>
          </div>

          {/* Payment info */}
          <div className="review-section animate-on-load stagger-2">
            <div className="review-section-header">
              <span className="review-section-title">Información de pago</span>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tramite/paso3')}>
                <span className="material-symbols-outlined">edit</span> Editar
              </button>
            </div>
            <div className="review-field"><div className="review-label">Método de pago</div><div className="review-value">Banco de la Nación</div></div>
            <div className="review-field"><div className="review-label">Referencia de pago</div><div className="review-value"><span className="text-mono-sm">TUPA-2024-P001-8902</span></div></div>
            <div className="review-field"><div className="review-label">Monto pagado</div><div className="review-value"><span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--clr-primary)' }}>S/. 120.00</span></div></div>
            <div className="review-field"><div className="review-label">Estado del pago</div><div className="review-value"><span className="badge badge-success"><span className="material-symbols-outlined">check_circle</span>Verificado</span></div></div>
          </div>

          {/* Documents */}
          <div className="review-section animate-on-load stagger-3">
            <div className="review-section-header">
              <span className="review-section-title">Documentos adjuntados</span>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tramite/paso4')}>
                <span className="material-symbols-outlined">edit</span> Editar
              </button>
            </div>
            <div>
              {docNames.map((name, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', padding: 'var(--sp-md) var(--sp-lg)', borderBottom: '1px solid var(--clr-outline-variant)' }}>
                  <span className="material-symbols-outlined icon-filled" style={{ color: 'var(--clr-primary)' }}>check_circle</span>
                  <span style={{ fontSize: '14px', flex: 1 }}>{name}</span>
                  <span className="badge badge-success" style={{ fontSize: '10px' }}>Cargado</span>
                </div>
              ))}
            </div>
          </div>

          {/* Declaration */}
          <div className="card animate-on-load stagger-4">
            <div className="card-body">
              <label className="form-check" style={{ alignItems: 'flex-start', gap: 'var(--sp-md)' }}>
                <input type="checkbox" style={{ marginTop: '3px' }} checked={declaration} onChange={(e) => setDeclaration(e.target.checked)} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--clr-on-surface)', marginBottom: '4px' }}>Declaración Jurada</div>
                  <p style={{ fontSize: '13px', color: 'var(--clr-secondary)', lineHeight: 1.6 }}>
                    Declaro bajo juramento que toda la información y documentos adjuntados en esta solicitud son auténticos y verídicos. 
                    Soy consciente que proporcionar información falsa o documentación adulterada es sancionado conforme a ley.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)', alignSelf: 'start', position: 'sticky', top: '80px' }}>
          <div className="card" style={{ borderColor: 'var(--clr-primary)' }}>
            <div className="card-header"><span className="card-header-title">Resumen del envío</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--clr-secondary)' }}>Trámite</span><span style={{ fontWeight: 700 }}>Diploma de Bachiller</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--clr-secondary)' }}>Documentos</span><span style={{ fontWeight: 700, color: 'var(--clr-primary)' }}>7 de 7</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--clr-secondary)' }}>Pago</span><span className="badge badge-success">Verificado</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--clr-secondary)' }}>Plazo estimado</span><span style={{ fontWeight: 600 }}>15 días hábiles</span></div>
              <div className="divider"></div>
              <div style={{ fontSize: '13px', color: 'var(--clr-secondary)', lineHeight: 1.5 }}>
                Al enviar, recibirás un código de expediente para rastrear el estado de tu trámite.
              </div>
            </div>
          </div>
          <div className="alert alert-success">
            <span className="material-symbols-outlined">check_circle</span>
            <div>Tu solicitud está lista para ser enviada. Todos los documentos han sido verificados.</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--sp-lg)', borderTop: '1px solid var(--clr-outline-variant)', marginTop: 'var(--sp-xl)' }}>
        <button className="btn btn-outline" onClick={() => navigate('/tramite/paso4')} disabled={isSubmitting}>
          <span className="material-symbols-outlined">arrow_back</span>
          Paso anterior
        </button>
        <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ marginRight: '8px' }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="10" />
              </svg>
              Enviando solicitud...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">send</span>
              Enviar Solicitud
            </>
          )}
        </button>
      </div>
    </>
  );
}
