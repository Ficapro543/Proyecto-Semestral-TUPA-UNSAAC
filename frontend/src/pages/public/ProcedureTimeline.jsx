import { useNavigate } from 'react-router-dom';
import TimelineItem from '../../components/ui/TimelineItem';

const steps = [
  { state: 'completed', icon: 'check', title: 'Solicitud presentada online', description: 'Formulario completado y documentos subidos al sistema.', date: '12 Oct 2024 · 10:45' },
  { state: 'completed', icon: 'check', title: 'Pago verificado', description: 'El pago de S/. 120.00 fue confirmado con el Banco de la Nación.', date: '14 Oct 2024 · 09:30' },
  { state: 'active', icon: 'fact_check', title: 'Revisión de documentos — EN PROCESO', description: 'La Oficina de Grados y Títulos está revisando tu documentación. Se detectó una observación en el Anexo B.', date: 'Desde 18 Oct 2024', desc: 'Acción requerida: Resubir Anexo B antes del 30 Oct.' },
  { state: 'pending', icon: 'gavel', title: 'Resolución del Decano', description: 'Aprobación formal mediante resolución decanal.', date: 'Estimado: 01 Nov 2024' },
  { state: 'pending', icon: 'workspace_premium', title: 'Elaboración del diploma', description: 'Impresión y firma por autoridades universitarias.', date: 'Estimado: 03–05 Nov 2024' },
  { state: 'pending', icon: 'check_circle', title: 'Entrega del diploma', description: 'Recoge tu diploma en la Oficina de Grados y Títulos con tu DNI.', date: 'Estimado: desde 05 Nov 2024' },
];

export default function ProcedureTimeline() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ background: 'var(--clr-primary)', padding: 'var(--sp-xl) var(--sp-lg)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 50%, rgba(137,245,231,0.1) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <nav className="breadcrumb" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 'var(--sp-md)' }}>
            <span style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }} onClick={() => navigate('/seguimiento')}>Rastrear</span>
            <span className="material-symbols-outlined">chevron_right</span>
            <span style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }} onClick={() => navigate('/seguimiento/resultados')}>Resultados</span>
            <span className="material-symbols-outlined">chevron_right</span>
            <span style={{ color: 'white' }}>EXP-2024-8902</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-lg)' }}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined icon-filled" style={{ fontSize: '30px', color: 'var(--clr-tertiary-fixed)' }}>workspace_premium</span>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--clr-tertiary-fixed)', fontWeight: 600, marginBottom: '4px' }}>Expediente · EXP-2024-8902</div>
                <h1 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '28px', fontWeight: 800, color: 'white', lineHeight: 1.1 }}>Diploma de Bachiller</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', marginTop: 'var(--sp-sm)' }}>
                  <span className="badge badge-in-review">En Revisión</span>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>Facultad: IEEIM · Inicio: 12 Oct 2024</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--sp-sm)' }}>
              <button className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} onClick={() => alert('Compartiendo enlace...')}>
                <span className="material-symbols-outlined">share</span>
              </button>
              <button className="btn btn-teal" onClick={() => navigate('/tramite/paso4')}>
                <span className="material-symbols-outlined">upload_file</span>
                Subir documentos pendientes
              </button>
            </div>
          </div>
        </div>
      </div>

      <main style={{ flex: 1, background: 'var(--clr-background)', padding: 'var(--sp-2xl) var(--sp-lg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--sp-xl)' }}>
          {/* Timeline */}
          <div>
            {/* Progress overview */}
            <div className="card animate-on-load" style={{ marginBottom: 'var(--sp-xl)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-sm)' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--clr-on-surface)' }}>Progreso general</span>
                  <span style={{ fontWeight: 700, color: 'var(--clr-primary)' }}>60%</span>
                </div>
                <div className="progress" style={{ height: '10px', marginBottom: 'var(--sp-md)' }}>
                  <div className="progress-bar" style={{ width: '60%' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--clr-secondary)' }}>
                  <span>Iniciado: 12 Oct 2024</span>
                  <span>Estimado: 05 Nov 2024</span>
                </div>
              </div>
            </div>

            {/* Full timeline */}
            <h2 className="text-headline-sm" style={{ color: 'var(--clr-primary)', marginBottom: 'var(--sp-lg)' }}>Línea de tiempo del expediente</h2>
            <div className="timeline">
              {steps.map((s, i) => (
                <TimelineItem key={i} {...s} isLast={i === steps.length - 1} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)', alignSelf: 'start', position: 'sticky', top: '80px' }}>
            <div className="card">
              <div className="card-header"><span className="card-header-title">Información del expediente</span></div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--clr-secondary)' }}>Código</span><span className="text-mono-sm" style={{ color: 'var(--clr-primary)' }}>EXP-2024-8902</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--clr-secondary)' }}>Trámite</span><span style={{ fontWeight: 600 }}>Diploma de Bachiller</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--clr-secondary)' }}>Costo</span><span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--clr-primary)' }}>S/. 120.00</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--clr-secondary)' }}>Área</span><span style={{ fontWeight: 600 }}>Grados y Títulos</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--clr-secondary)' }}>Responsable</span><span style={{ fontWeight: 600 }}>Dr. Quispe M.</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--clr-secondary)' }}>Estado</span><span className="badge badge-in-review">En Revisión</span></div>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-header-title">Documentos</span></div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-xs)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)', padding: '6px 0' }}>
                  <span className="material-symbols-outlined icon-sm icon-filled" style={{ color: 'var(--clr-primary)' }}>check_circle</span>
                  <span style={{ fontSize: '13px' }}>Solicitud F-001</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)', padding: '6px 0' }}>
                  <span className="material-symbols-outlined icon-sm icon-filled" style={{ color: 'var(--clr-primary)' }}>check_circle</span>
                  <span style={{ fontSize: '13px' }}>Certificado de estudios</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)', padding: '6px 0' }}>
                  <span className="material-symbols-outlined icon-sm icon-filled" style={{ color: 'var(--clr-primary)' }}>check_circle</span>
                  <span style={{ fontSize: '13px' }}>Copia DNI</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)', padding: '6px 0' }}>
                  <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--clr-error)' }}>error</span>
                  <span style={{ fontSize: '13px', color: 'var(--clr-error)' }}>Anexo B — Observado</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)', padding: '6px 0' }}>
                  <span className="material-symbols-outlined icon-sm icon-filled" style={{ color: 'var(--clr-primary)' }}>check_circle</span>
                  <span style={{ fontSize: '13px' }}>Voucher de pago</span>
                </div>
                <div className="divider"></div>
                <button className="btn btn-outline btn-sm w-full" onClick={() => navigate('/tramite/paso4')}>
                  <span className="material-symbols-outlined">upload_file</span>
                  Resubir Anexo B
                </button>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-header-title">Acciones</span></div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
                <button className="btn btn-ghost w-full" style={{ justifyContent: 'flex-start' }} onClick={() => alert('Centro de ayuda')}>
                  <span className="material-symbols-outlined">help</span> Centro de ayuda
                </button>
                <button className="btn btn-ghost w-full" style={{ justifyContent: 'flex-start' }} onClick={() => alert('Descargando comprobante...')}>
                  <span className="material-symbols-outlined">download</span> Descargar comprobante
                </button>
                <button className="btn btn-error w-full" style={{ justifyContent: 'flex-start' }} onClick={() => alert('Solicitud de cancelación enviada')}>
                  <span className="material-symbols-outlined">cancel</span> Solicitar cancelación
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
