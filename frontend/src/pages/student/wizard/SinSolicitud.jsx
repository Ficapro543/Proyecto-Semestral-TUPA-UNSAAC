import { useNavigate } from 'react-router-dom';
import WizardStepper from '../../../components/ui/WizardStepper';

/**
 * Los pasos 2..5 dependen de un borrador creado en el paso 1. Antes, entrar
 * directo a /tramite/paso4 mostraba un formulario que no guardaba en ningún
 * lado; ahora se avisa y se ofrece volver al inicio del asistente.
 */
export default function SinSolicitud({ paso }) {
  const navigate = useNavigate();

  return (
    <>
      <WizardStepper currentStep={paso} />
      <div className="alert alert-warning" style={{ marginTop: 'var(--sp-lg)' }}>
        <span className="material-symbols-outlined">info</span>
        <div>
          No hay una solicitud en curso. Empieza por elegir el trámite en el primer paso.
        </div>
      </div>
      <div style={{ marginTop: 'var(--sp-lg)' }}>
        <button className="btn btn-primary" onClick={() => navigate('/tramite/paso1')}>
          <span className="material-symbols-outlined">arrow_back</span> Ir al paso 1
        </button>
      </div>
    </>
  );
}
