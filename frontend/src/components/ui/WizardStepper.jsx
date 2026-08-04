import { useNavigate } from 'react-router-dom';
import './WizardStepper.css';

const WIZARD_STEPS = [
  { step: 1, label: 'Seleccionar',  route: '/tramite/paso1', icon: 'fact_check' },
  { step: 2, label: 'Requisitos',   route: '/tramite/paso2', icon: 'checklist' },
  { step: 3, label: 'Pago',         route: '/tramite/paso3', icon: 'payments' },
  { step: 4, label: 'Documentos',   route: '/tramite/paso4', icon: 'upload_file' },
  { step: 5, label: 'Revisar',      route: '/tramite/paso5', icon: 'rate_review' },
  { step: 6, label: 'Confirmación', route: '/tramite/paso6', icon: 'check_circle' },
];

export default function WizardStepper({ currentStep }) {
  const navigate = useNavigate();

  return (
    <div className="stepper">
      {WIZARD_STEPS.map((s, i) => {
        const isDone    = s.step < currentStep;
        const isActive  = s.step === currentStep;
        const isPending = s.step > currentStep;
        const stateClass = isDone ? 'done' : isActive ? 'active' : 'pending';
        
        return (
          <div key={s.step} style={{ display: 'flex', flex: 1, position: 'relative' }}>
            <div 
              className="step-item" 
              onClick={() => isDone && navigate(s.route)}
              style={{ cursor: isDone ? 'pointer' : 'default' }}
            >
              <div className={`step-circle ${stateClass}`}>
                {isDone ? (
                  <span className="material-symbols-outlined icon-sm icon-filled">check</span>
                ) : (
                  s.step
                )}
              </div>
              <span className={`step-label ${stateClass} hide-mobile`}>{s.label}</span>
            </div>
            {i < WIZARD_STEPS.length - 1 && (
              <div className={`step-connector ${isDone ? 'done' : ''}`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
