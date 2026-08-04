import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TrackingResults.css';

export default function TrackingResults() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('EXP-2024-8902');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ background: 'var(--clr-primary)', padding: 'var(--sp-lg)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)' }}>
            <button className="btn btn-ghost" style={{ color: 'rgba(255,255,255,0.7)' }} onClick={() => navigate('/seguimiento')}>
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div style={{ position: 'relative', flex: 1, maxWidth: '500px' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: 'var(--clr-outline)' }}>search</span>
              <input 
                type="text" 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                style={{ width: '100%', height: '44px', padding: '0 var(--sp-md) 0 40px', background: 'white', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '14px', outline: 'none' }}
                aria-label="Buscar otro expediente" 
              />
            </div>
            <button className="btn btn-teal">Buscar</button>
          </div>
        </div>
      </div>

      <main style={{ flex: 1, background: 'var(--clr-background)', padding: 'var(--sp-2xl) var(--sp-lg)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="alert alert-success animate-slide-up" style={{ marginBottom: 'var(--sp-xl)' }}>
            <span className="material-symbols-outlined">check_circle</span>
            <div>Se encontraron <strong>1 expediente</strong> para "{searchValue}"</div>
          </div>

          <div className="result-card animate-on-load" onClick={() => navigate('/seguimiento/detalle')} role="article" tabIndex="0">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)', marginBottom: 'var(--sp-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)' }}>
                <div style={{ width: '52px', height: '52px', background: 'var(--clr-primary-fixed)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '26px', color: 'var(--clr-primary)' }}>workspace_premium</span>
                </div>
                <div>
                  <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '20px', fontWeight: 700, color: 'var(--clr-primary)' }}>Diploma de Bachiller</div>
                  <div style={{ fontSize: '13px', color: 'var(--clr-secondary)', marginTop: '2px', display: 'flex', gap: 'var(--sp-md)' }}>
                    <span className="text-mono-sm" style={{ color: 'var(--clr-primary)' }}>EXP-2024-8902</span>
                    <span>·</span>
                    <span>Iniciado: 12 Oct 2024</span>
                  </div>
                </div>
              </div>
              <span className="badge badge-in-review badge-lg">En Revisión</span>
            </div>

            {/* Progress */}
            <div style={{ marginBottom: 'var(--sp-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-sm)' }}>
                <span style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>Progreso del trámite</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--clr-primary)' }}>Paso 3 de 5</span>
              </div>
              <div className="progress">
                <div className="progress-bar" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--sp-md)', marginBottom: 'var(--sp-lg)' }}>
              <div style={{ padding: 'var(--sp-md)', background: 'var(--clr-surface-container-low)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: '12px', color: 'var(--clr-secondary)', marginBottom: '2px' }}>Solicitante</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>Elena M. Rodríguez Q.</div>
              </div>
              <div style={{ padding: 'var(--sp-md)', background: 'var(--clr-surface-container-low)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: '12px', color: 'var(--clr-secondary)', marginBottom: '2px' }}>Área responsable</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>Ofic. de Grados y Títulos</div>
              </div>
              <div style={{ padding: 'var(--sp-md)', background: 'var(--clr-surface-container-low)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: '12px', color: 'var(--clr-secondary)', marginBottom: '2px' }}>Plazo estimado</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>05 Nov 2024</div>
              </div>
              <div style={{ padding: 'var(--sp-md)', background: 'var(--clr-surface-container-low)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: '12px', color: 'var(--clr-secondary)', marginBottom: '2px' }}>Costo</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: 700, color: 'var(--clr-primary)' }}>S/. 120.00</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle' }}>schedule</span> Última actualización: hace 2 días
              </div>
              <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); navigate('/seguimiento/detalle'); }}>
                Ver detalle completo
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

          <div style={{ marginTop: 'var(--sp-xl)', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: 'var(--clr-secondary)', marginBottom: 'var(--sp-md)' }}>¿No es el expediente que buscas?</p>
            <button className="btn btn-outline" onClick={() => navigate('/seguimiento')}>
              <span className="material-symbols-outlined">search</span>
              Nueva búsqueda
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
