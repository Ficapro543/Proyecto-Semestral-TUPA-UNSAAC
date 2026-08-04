import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import WizardStepper from '../../../components/ui/WizardStepper';
import { useWizard } from '../../../context/WizardContext';
import './Step6.css';

export default function Step6() {
  const navigate = useNavigate();
  const wizard = useWizard();

  const [confetti, setConfetti] = useState([]);
  const [copiado, setCopiado] = useState(false);

  // El expediente lo asigna el backend al enviar; se lee del estado del
  // asistente en vez del valor fijo que había antes.
  const expediente = wizard.numeroExpediente;
  const idSolicitud = wizard.idSolicitud;
  const nombreTramite = wizard.tramite?.nombre_tramite;

  useEffect(() => {
    const colors = ['#002045', '#89f5e7', '#adc7f7', '#ffd700', '#65c9f7'];
    setConfetti(
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}vw`,
        width: `${6 + Math.random() * 8}px`,
        height: `${8 + Math.random() * 12}px`,
        background: colors[Math.floor(Math.random() * colors.length)],
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${2 + Math.random() * 3}s`,
      }))
    );
  }, []);

  const copiar = async () => {
    if (!expediente) return;
    try {
      await navigator.clipboard.writeText(expediente);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setCopiado(false);
    }
  };

  /** Cierra el asistente y limpia su estado antes de ir a otra pantalla. */
  const salir = (destino) => {
    wizard.reset();
    navigate(destino);
  };

  if (!expediente) {
    return (
      <>
        <WizardStepper currentStep={6} />
        <div className="alert alert-warning" style={{ marginTop: 'var(--sp-lg)' }}>
          <span className="material-symbols-outlined">info</span>
          <div>No hay una solicitud enviada en esta sesión.</div>
        </div>
        <button className="btn btn-primary" style={{ marginTop: 'var(--sp-lg)' }} onClick={() => navigate('/estudiante/solicitudes')}>
          Ver mis solicitudes
        </button>
      </>
    );
  }

  return (
    <>
      {confetti.map((c) => (
        <div
          key={c.id}
          className="confetti-particle"
          style={{
            left: c.left, top: '-10px', width: c.width, height: c.height,
            background: c.background, animationDelay: c.animationDelay,
            animationDuration: c.animationDuration, opacity: 0.9,
          }}
        />
      ))}

      <WizardStepper currentStep={6} />

      <div style={{ maxWidth: '720px', margin: '0 auto', width: '100%', textAlign: 'center', padding: 'var(--sp-2xl) 0' }}>
        <div className="success-ring animate-scale-in">
          <span className="material-symbols-outlined icon-filled" style={{ fontSize: '60px', color: '#065f46' }}>check_circle</span>
        </div>

        <h1 className="text-display-md animate-slide-up" style={{ color: 'var(--clr-primary)', marginBottom: 'var(--sp-md)' }}>
          ¡Solicitud enviada exitosamente!
        </h1>
        <p className="text-body-lg animate-fade-in" style={{ color: 'var(--clr-secondary)', marginBottom: 'var(--sp-2xl)', lineHeight: 1.65 }}>
          Tu solicitud de <strong>{nombreTramite}</strong> quedó registrada. La oficina responsable
          la revisará y verás el avance reflejado en tu panel.
        </p>

        <div className="animate-scale-in" style={{ background: 'var(--clr-primary)', borderRadius: 'var(--radius-2xl)', padding: 'var(--sp-xl)', marginBottom: 'var(--sp-2xl)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', marginBottom: 'var(--sp-sm)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
            Código de tu expediente
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(22px, 6vw, 36px)', fontWeight: 800, color: 'var(--clr-tertiary-fixed)', letterSpacing: '0.05em', marginBottom: 'var(--sp-md)', wordBreak: 'break-all' }}>
            {expediente}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>
            Guarda este código para rastrear el estado de tu trámite
          </div>
          <button
            onClick={copiar}
            style={{ marginTop: 'var(--sp-md)', background: 'rgba(137,245,231,0.15)', border: '1px solid rgba(137,245,231,0.3)', color: 'var(--clr-tertiary-fixed)', padding: '8px 20px', borderRadius: 'var(--radius-lg)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', margin: 'var(--sp-md) auto 0' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              {copiado ? 'check' : 'content_copy'}
            </span>
            {copiado ? 'Copiado' : 'Copiar código'}
          </button>
        </div>

        <div className="next-step-grid" style={{ marginBottom: 'var(--sp-lg)' }}>
          <button className="next-step-card" onClick={() => salir(`/estudiante/solicitudes/${idSolicitud}`)}>
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-lg)', background: 'var(--clr-primary-fixed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined icon-filled" style={{ color: 'var(--clr-primary)' }}>timeline</span>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, color: 'var(--clr-primary)' }}>Ver estado del expediente</div>
              <div style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}>Seguimiento en vivo</div>
            </div>
            <span className="material-symbols-outlined" style={{ color: 'var(--clr-outline)', marginLeft: 'auto' }}>chevron_right</span>
          </button>

          <button className="next-step-card" onClick={() => salir('/estudiante')}>
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-lg)', background: 'rgba(137,245,231,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined icon-filled" style={{ color: 'var(--clr-tertiary-container)' }}>dashboard</span>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, color: 'var(--clr-primary)' }}>Ir al dashboard</div>
              <div style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}>Ver todos mis trámites</div>
            </div>
            <span className="material-symbols-outlined" style={{ color: 'var(--clr-outline)', marginLeft: 'auto' }}>chevron_right</span>
          </button>
        </div>

        <button className="btn btn-outline" onClick={() => salir('/tramite/paso1')}>
          <span className="material-symbols-outlined">add</span> Iniciar otro trámite
        </button>
      </div>
    </>
  );
}
