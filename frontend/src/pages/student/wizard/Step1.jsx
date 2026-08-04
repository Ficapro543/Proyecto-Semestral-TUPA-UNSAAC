import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WizardStepper from '../../../components/ui/WizardStepper';
import './Step1.css';

const procedures = [
  { id:'P001', title:'Diploma de Bachiller', cat:'Académico', cost:'S/. 120.00', time:'15 días', icon:'workspace_premium', iconBg:'var(--clr-primary-fixed)', iconColor:'var(--clr-primary)', desc:'Diploma acreditativo del Grado Académico de Bachiller.' },
  { id:'P002', title:'Certificado de Matrícula', cat:'Académico', cost:'Gratuito', time:'2 días', icon:'school', iconBg:'#d1fae5', iconColor:'#065f46', desc:'Constancia oficial del estado de matrícula del semestre actual.' },
  { id:'P003', title:'Constancia de Egresado', cat:'Académico', cost:'S/. 30.00', time:'3 días', icon:'verified', iconBg:'var(--clr-surface-container)', iconColor:'var(--clr-primary)', desc:'Certifica la conclusión satisfactoria del plan de estudios.' },
  { id:'P004', title:'Récord Académico', cat:'Académico', cost:'S/. 15.00', time:'1 día', icon:'receipt_long', iconBg:'rgba(137,245,231,0.2)', iconColor:'var(--clr-tertiary-container)', desc:'Historial completo de notas y créditos del estudiante.' },
  { id:'P007', title:'Traslado Externo', cat:'Administrativo', cost:'S/. 180.00', time:'20 días', icon:'swap_horiz', iconBg:'#fef3c7', iconColor:'#92400e', desc:'Proceso de admisión por traslado desde otra universidad.' },
  { id:'P010', title:'Beca Comedor Universitario', cat:'Bienestar', cost:'Gratuito', time:'5 días', icon:'restaurant', iconBg:'var(--clr-error-container)', iconColor:'var(--clr-error)', desc:'Solicitud de beca para el servicio de comedor universitario.' },
];

export default function Step1() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('todos');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const selectedProc = procedures.find(p => p.id === selectedId);

  const filteredProcedures = procedures.filter(p => {
    const matchesFilter = filter === 'todos' || p.cat === filter;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      {/* Stepper */}
      <WizardStepper currentStep={1} />

      <div className="wizard-layout">
        {/* LEFT: Procedure selection */}
        <div>
          <div style={{ marginBottom: 'var(--sp-xl)' }}>
            <h1 className="text-headline-md" style={{ color: 'var(--clr-primary)', marginBottom: 'var(--sp-xs)' }}>Selecciona el procedimiento</h1>
            <p className="text-body-md" style={{ color: 'var(--clr-secondary)' }}>Elige el trámite que deseas iniciar. Puedes buscar por nombre o filtrar por categoría.</p>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 'var(--sp-md)' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: 'var(--clr-outline)' }}>search</span>
            <input 
              type="text" 
              placeholder="Buscar procedimiento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', height: '44px', padding: '0 var(--sp-md) 0 40px', background: 'var(--clr-surface-container-lowest)', border: '1px solid var(--clr-outline-variant)', borderRadius: 'var(--radius-lg)', fontSize: '14px', outline: 'none' }} 
            />
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', gap: 'var(--sp-xs)', flexWrap: 'wrap', marginBottom: 'var(--sp-lg)' }}>
            <button className={`filter-chip ${filter === 'todos' ? 'active' : ''}`} onClick={() => setFilter('todos')}>Todos</button>
            <button className={`filter-chip ${filter === 'Académico' ? 'active' : ''}`} onClick={() => setFilter('Académico')}>Académico</button>
            <button className={`filter-chip ${filter === 'Administrativo' ? 'active' : ''}`} onClick={() => setFilter('Administrativo')}>Administrativo</button>
            <button className={`filter-chip ${filter === 'Bienestar' ? 'active' : ''}`} onClick={() => setFilter('Bienestar')}>Bienestar</button>
          </div>

          {/* Procedure options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
            {filteredProcedures.map(p => (
              <div 
                key={p.id}
                className={`proc-option animate-on-load ${selectedId === p.id ? 'selected' : ''}`}
                onClick={() => setSelectedId(p.id)}
              >
                <div className="proc-option-icon" style={{ background: p.iconBg }}>
                  <span className="material-symbols-outlined" style={{ color: p.iconColor }}>{p.icon}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)', marginBottom: '4px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--clr-on-surface)' }}>{p.title}</div>
                    <span className="badge badge-primary" style={{ fontSize: '10px' }}>{p.cat}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--clr-secondary)', marginBottom: 'var(--sp-xs)' }}>{p.desc}</div>
                  <div style={{ display: 'flex', gap: 'var(--sp-md)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}><span className="material-symbols-outlined" style={{ fontSize: '12px', verticalAlign: 'middle' }}>payments</span> {p.cost}</span>
                    <span style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}><span className="material-symbols-outlined" style={{ fontSize: '12px', verticalAlign: 'middle' }}>schedule</span> {p.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)' }}>
          <div className="card">
            <div className="card-header">
              <span className="card-header-title">Tu selección</span>
            </div>
            <div className="card-body">
              {!selectedProc ? (
                <div className="empty-state" style={{ padding: 'var(--sp-xl) 0' }}>
                  <span className="material-symbols-outlined">touch_app</span>
                  <div className="empty-state-title">Selecciona un trámite</div>
                  <div className="empty-state-desc">Haz clic en uno de los procedimientos de la lista</div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', marginBottom: 'var(--sp-md)' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: selectedProc.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined icon-filled" style={{ fontSize: '24px', color: selectedProc.iconColor }}>{selectedProc.icon}</span>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', fontWeight: 700, color: 'var(--clr-primary)' }}>{selectedProc.title}</div>
                      <span className="badge badge-primary">{selectedProc.cat}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)', fontSize: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--clr-secondary)' }}>Código</span><span className="text-mono-sm" style={{ color: 'var(--clr-primary)' }}>{selectedProc.id}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--clr-secondary)' }}>Costo</span><span style={{ fontWeight: 700, color: 'var(--clr-primary)' }}>{selectedProc.cost}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--clr-secondary)' }}>Plazo</span><span style={{ fontWeight: 600 }}>{selectedProc.time} hábiles</span></div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="alert alert-info">
            <span className="material-symbols-outlined">info</span>
            <div>Una vez seleccionado el procedimiento, revisarás los requisitos antes de continuar con el pago.</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--sp-lg)', borderTop: '1px solid var(--clr-outline-variant)', marginTop: 'var(--sp-xl)' }}>
        <button className="btn btn-ghost" onClick={() => navigate('/catalogo')}>
          <span className="material-symbols-outlined">arrow_back</span>
          Volver al catálogo
        </button>
        <button 
          className="btn btn-primary btn-lg" 
          disabled={!selectedProc} 
          onClick={() => navigate('/tramite/paso2')}
        >
          Continuar a Requisitos
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </>
  );
}
