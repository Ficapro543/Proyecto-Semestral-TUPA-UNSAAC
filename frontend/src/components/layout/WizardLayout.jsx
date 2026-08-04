import { Outlet, useNavigate } from 'react-router-dom';
import { WizardProvider } from '../../context/WizardContext';

export default function WizardLayout() {
  const navigate = useNavigate();

  return (
    <WizardProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--clr-background)' }}>
        <div style={{ background: 'var(--clr-primary)', padding: 'var(--sp-md) var(--sp-lg)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--sp-md)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', minWidth: 0 }}>
              <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined icon-filled" style={{ fontSize: '20px', color: 'var(--clr-tertiary-fixed)' }}>account_balance</span>
              </div>
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', fontWeight: 700, color: 'white' }}>
                TUPA UNSAAC — Asistente de Trámites
              </span>
            </div>
            <button className="btn btn-ghost" style={{ color: 'rgba(255,255,255,0.7)' }} onClick={() => navigate('/estudiante')}>
              <span className="material-symbols-outlined">close</span> Cancelar
            </button>
          </div>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'var(--sp-lg)', flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)', minWidth: 0 }}>
          <Outlet />
        </div>
      </div>
    </WizardProvider>
  );
}
