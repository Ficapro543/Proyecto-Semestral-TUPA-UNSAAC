import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import WizardStepper from '../../../components/ui/WizardStepper';
import TimelineItem from '../../../components/ui/TimelineItem';
import './Step6.css';

const steps = [
  { state:'completed', icon:'check', title:'Solicitud registrada', description:'Tu expediente ha sido creado en el sistema.', date:'Hoy' },
  { state:'active', icon:'payments', title:'Verificación de pago', description:'El sistema está verificando el pago con el Banco de la Nación.', date:'Próximas 24 horas' },
  { state:'pending', icon:'fact_check', title:'Revisión de documentos', description:'La Oficina de Grados y Títulos revisará tu documentación.', date:'Días 4–10' },
  { state:'pending', icon:'gavel', title:'Resolución del Decano', description:'Emisión de la resolución de otorgamiento del grado.', date:'Días 11–13' },
  { state:'pending', icon:'workspace_premium', title:'Elaboración y entrega del diploma', description:'Recoge tu diploma en la Oficina de Grados y Títulos.', date:'Días 14–15' },
];

export default function Step6() {
  const navigate = useNavigate();
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const colors = ['#002045','#89f5e7','#adc7f7','#ffd700','#65c9f7'];
    const newConfetti = [];
    for (let i = 0; i < 60; i++) {
      newConfetti.push({
        id: i,
        left: `${Math.random() * 100}vw`,
        width: `${6 + Math.random() * 8}px`,
        height: `${8 + Math.random() * 12}px`,
        background: colors[Math.floor(Math.random() * colors.length)],
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${2 + Math.random() * 3}s`,
      });
    }
    setConfetti(newConfetti);
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText('EXP-2024-8902').then(() => {
      // Show toast ideally
      alert('Código copiado al portapapeles');
    });
  };

  return (
    <>
      {confetti.map(c => (
        <div key={c.id} className="confetti-particle" style={{
          left: c.left, top: '-10px', width: c.width, height: c.height,
          background: c.background, animationDelay: c.animationDelay, animationDuration: c.animationDuration,
          opacity: 0.9
        }}></div>
      ))}

      <WizardStepper currentStep={6} />

      {/* Success card */}
      <div style={{ maxWidth: '720px', margin: '0 auto', width: '100%', textAlign: 'center', padding: 'var(--sp-2xl) 0' }}>
        <div className="success-ring animate-scale-in">
          <span className="material-symbols-outlined icon-filled" style={{ fontSize: '60px', color: '#065f46' }}>check_circle</span>
        </div>

        <h1 className="text-display-md animate-slide-up" style={{ color: 'var(--clr-primary)', marginBottom: 'var(--sp-md)' }}>
          ¡Solicitud enviada exitosamente!
        </h1>
        <p className="text-body-lg animate-fade-in" style={{ color: 'var(--clr-secondary)', marginBottom: 'var(--sp-2xl)', lineHeight: 1.65 }}>
          Tu solicitud de <strong>Diploma de Bachiller</strong> ha sido registrada en el sistema. 
          Recibirás notificaciones sobre el avance de tu expediente.
        </p>

        {/* Expediente code */}
        <div style={{ background: 'var(--clr-primary)', borderRadius: 'var(--radius-2xl)', padding: 'var(--sp-xl)', marginBottom: 'var(--sp-2xl)', position: 'relative', overflow: 'hidden' }} className="animate-scale-in">
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(137,245,231,0.1)', pointerEvents: 'none' }}></div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', marginBottom: 'var(--sp-sm)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Código de tu expediente</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '36px', fontWeight: 800, color: 'var(--clr-tertiary-fixed)', letterSpacing: '0.05em', marginBottom: 'var(--sp-md)' }}>
            EXP-2024-8902
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>Guarda este código para rastrear el estado de tu trámite</div>
          <button onClick={copyCode} style={{ marginTop: 'var(--sp-md)', background: 'rgba(137,245,231,0.15)', border: '1px solid rgba(137,245,231,0.3)', color: 'var(--clr-tertiary-fixed)', padding: '8px 20px', borderRadius: 'var(--radius-lg)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', margin: 'var(--sp-md) auto 0' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>content_copy</span>
            Copiar código
          </button>
        </div>

        {/* Timeline preview */}
        <div className="card" style={{ textAlign: 'left', marginBottom: 'var(--sp-xl)' }}>
          <div className="card-header"><span className="card-header-title">¿Qué sigue ahora?</span></div>
          <div className="card-body" style={{ padding: 'var(--sp-md)' }}>
            <div className="timeline">
              {steps.map((s, i) => (
                <TimelineItem key={i} {...s} isLast={i === steps.length - 1} />
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-md)', marginBottom: 'var(--sp-lg)' }}>
          <Link to="/seguimiento" className="next-step-card">
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-lg)', background: 'var(--clr-primary-fixed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined icon-filled" style={{ color: 'var(--clr-primary)' }}>timeline</span>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, color: 'var(--clr-primary)' }}>Ver estado del expediente</div>
              <div style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}>Seguimiento en tiempo real</div>
            </div>
            <span className="material-symbols-outlined" style={{ color: 'var(--clr-outline)', marginLeft: 'auto' }}>chevron_right</span>
          </Link>
          <Link to="/estudiante" className="next-step-card">
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-lg)', background: 'rgba(137,245,231,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined icon-filled" style={{ color: 'var(--clr-tertiary-container)' }}>dashboard</span>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, color: 'var(--clr-primary)' }}>Ir al dashboard</div>
              <div style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}>Ver todos mis trámites</div>
            </div>
            <span className="material-symbols-outlined" style={{ color: 'var(--clr-outline)', marginLeft: 'auto' }}>chevron_right</span>
          </Link>
        </div>

        <button className="btn btn-outline" onClick={() => navigate('/tramite/nuevo')}>
          <span className="material-symbols-outlined">add</span>
          Iniciar otro trámite
        </button>
      </div>
    </>
  );
}
