import { Outlet, useNavigate } from 'react-router-dom';

export default function WizardLayout() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--clr-background)' }}>
      {/* Custom Topbar for Wizard */}
      <div style={{ background: 'var(--clr-primary)', padding: 'var(--sp-md) var(--sp-lg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)' }}>
            <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined icon-filled" style={{ fontSize: '20px', color: 'var(--clr-tertiary-fixed)' }}>account_balance</span>
            </div>
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', fontWeight: 700, color: 'white' }}>TUPA UNSAAC — Asistente de Trámites</span>
          </div>
          <button className="btn btn-ghost" style={{ color: 'rgba(255,255,255,0.7)' }} onClick={() => navigate('/estudiante')}>
            <span className="material-symbols-outlined">close</span> Cancelar
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'var(--sp-lg)', flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)' }}>
        <Outlet />
      </div>
    </div>
  );
}
