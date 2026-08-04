import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WizardStepper from '../../../components/ui/WizardStepper';
import './Step2.css';

const reqs = [
  { id:'r1', text:'Solicitud de diploma (Formato F-001)', sub:'PDF · Disponible en el portal', required:true },
  { id:'r2', text:'Certificado de estudios original', sub:'PDF digitalizado', required:true },
  { id:'r3', text:'Copia del DNI vigente', sub:'JPG o PDF, ambas caras', required:true },
  { id:'r4', text:'Constancia de no adeudar (Dirección Económica)', sub:'PDF', required:true },
  { id:'r5', text:'Constancia de no adeudar biblioteca', sub:'PDF', required:true },
  { id:'r6', text:'Voucher de pago S/. 120.00', sub:'Banco de la Nación · PDF o JPG', required:true },
  { id:'r7', text:'Foto tamaño carné (fondo blanco)', sub:'JPG, 3×4 cm', required:true },
  { id:'r8', text:'Certificado SERUMS (solo Medicina)', sub:'PDF — opcional si no aplica', required:false },
];

export default function Step2() {
  const navigate = useNavigate();
  const [checkedItems, setCheckedItems] = useState(new Set());

  const TOTAL_REQUIRED = reqs.filter(r => r.required).length;

  const toggleReq = (id) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) newChecked.delete(id);
    else newChecked.add(id);
    setCheckedItems(newChecked);
  };

  const requiredChecked = reqs.filter(r => r.required && checkedItems.has(r.id)).length;
  const pct = Math.round((requiredChecked / TOTAL_REQUIRED) * 100);
  const isReady = requiredChecked === TOTAL_REQUIRED;

  return (
    <>
      <WizardStepper currentStep={2} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--sp-xl)' }}>
        <div>
          <div style={{ marginBottom: 'var(--sp-lg)' }}>
            <h1 className="text-headline-md" style={{ color: 'var(--clr-primary)', marginBottom: 'var(--sp-xs)' }}>Revisar Requisitos</h1>
            <p className="text-body-md" style={{ color: 'var(--clr-secondary)' }}>Confirma que tienes todos los documentos necesarios. Marca cada ítem para registrar que lo tienes listo.</p>
          </div>

          {/* Procedure summary */}
          <div style={{ background: 'var(--clr-primary)', borderRadius: 'var(--radius-xl)', padding: 'var(--sp-md) var(--sp-lg)', display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', marginBottom: 'var(--sp-lg)' }}>
            <span className="material-symbols-outlined icon-filled" style={{ fontSize: '28px', color: 'var(--clr-tertiary-fixed)' }}>workspace_premium</span>
            <div>
              <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', fontWeight: 700, color: 'white' }}>Diploma de Bachiller</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>Procedimiento P001 · S/. 120.00 · 15 días hábiles</div>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto', color: 'var(--clr-tertiary-fixed)' }} onClick={() => navigate('/tramite/paso1')}>Cambiar</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
            {reqs.map(r => (
              <div 
                key={r.id}
                className={`req-check-item ${checkedItems.has(r.id) ? 'checked' : ''}`} 
                onClick={() => toggleReq(r.id)}
              >
                <span className="material-symbols-outlined status">
                  {checkedItems.has(r.id) ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--clr-on-surface)' }}>{r.text}</div>
                  <div style={{ fontSize: '12px', color: 'var(--clr-secondary)', marginTop: '2px' }}>{r.sub}</div>
                </div>
                <span className={`badge ${r.required ? 'badge-error' : 'badge-neutral'}`} style={{ fontSize: '10px' }}>
                  {r.required ? 'Obligatorio' : 'Opcional'}
                </span>
              </div>
            ))}
          </div>

          <div className="alert alert-warning" style={{ marginTop: 'var(--sp-lg)' }}>
            <span className="material-symbols-outlined">warning</span>
            <div>Todos los documentos marcados como obligatorios son necesarios para continuar. El sistema los verificará durante la revisión administrativa.</div>
          </div>
        </div>

        {/* Summary sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)' }}>
          <div className="card">
            <div className="card-header"><span className="card-header-title">Progreso de preparación</span></div>
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-sm)' }}>
                <span style={{ fontSize: '14px', color: 'var(--clr-secondary)' }}>Documentos confirmados</span>
                <span style={{ fontWeight: 700, color: 'var(--clr-primary)' }}>{requiredChecked} / {TOTAL_REQUIRED}</span>
              </div>
              <div className="progress" style={{ height: '8px', marginBottom: 'var(--sp-md)' }}>
                <div className="progress-bar" style={{ width: `${pct}%` }}></div>
              </div>
              <div>
                {isReady ? (
                  <div className="badge badge-success" style={{ fontSize: '13px' }}><span className="material-symbols-outlined">check_circle</span>¡Listo para continuar!</div>
                ) : (
                  <div className="badge badge-warning" style={{ fontSize: '13px' }}><span className="material-symbols-outlined">hourglass_empty</span>Faltan {TOTAL_REQUIRED - requiredChecked} documento{TOTAL_REQUIRED - requiredChecked !== 1 ? 's' : ''}</div>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-header-title">Resumen del trámite</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--clr-secondary)' }}>Procedimiento</span><span style={{ fontWeight: 600 }}>Diploma de Bachiller</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--clr-secondary)' }}>Código</span><span className="text-mono-sm" style={{ color: 'var(--clr-primary)' }}>P001</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--clr-secondary)' }}>Costo total</span><span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--clr-primary)' }}>S/. 120.00</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--clr-secondary)' }}>Plazo estimado</span><span style={{ fontWeight: 600 }}>15 días hábiles</span></div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--sp-lg)', borderTop: '1px solid var(--clr-outline-variant)', marginTop: 'var(--sp-xl)' }}>
        <button className="btn btn-outline" onClick={() => navigate('/tramite/paso1')}>
          <span className="material-symbols-outlined">arrow_back</span>
          Paso anterior
        </button>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/tramite/paso3')}>
          Ir a Confirmación de Pago
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </>
  );
}
