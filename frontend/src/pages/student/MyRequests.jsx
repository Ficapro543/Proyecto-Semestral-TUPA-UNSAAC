import { useState } from 'react';
import { Link } from 'react-router-dom';
import './MyRequests.css';

const enviadas = [
  { exp:'EXP-2024-8902', title:'Diploma de Bachiller', status:'En Revisión', sc:'badge-in-review', date:'12 Oct 2024' },
  { exp:'EXP-2024-1102', title:'Certificado de Matrícula', status:'Verificando pago', sc:'badge-warning', date:'15 Sep 2024' },
  { exp:'EXP-2024-0891', title:'Récord Académico', status:'Pendiente', sc:'badge-neutral', date:'20 Ago 2024' },
  { exp:'EXP-2024-0442', title:'Constancia de Egresado', status:'Observado', sc:'badge-error', date:'05 Jul 2024' },
  { exp:'EXP-2024-0201', title:'Reserva de Matrícula', status:'En cola', sc:'badge-neutral', date:'10 Jun 2024' },
];

const completadas = [
  { exp:'EXP-2023-8841', title:'Carné Universitario', status:'Aprobado', sc:'badge-success', date:'14 Dic 2023' },
  { exp:'EXP-2023-7720', title:'Constancia de Notas', status:'Aprobado', sc:'badge-success', date:'05 Nov 2023' },
  { exp:'EXP-2023-6601', title:'Duplicado de Carné', status:'Aprobado', sc:'badge-success', date:'22 Sep 2023' },
];

export default function MyRequests() {
  const [activeTab, setActiveTab] = useState('borrador');

  return (
    <>
      <nav className="breadcrumb" aria-label="Ruta de navegación"></nav>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <div>
          <h1 className="text-display-md" style={{ color: 'var(--clr-primary)' }}>Mis Solicitudes</h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginTop: '4px' }}>Borradores y solicitudes en curso que aún no han sido enviadas</p>
        </div>
        <Link to="/tramite/nuevo" className="btn btn-primary">
          <span className="material-symbols-outlined">add</span>
          Nueva Solicitud
        </Link>
      </div>

      {/* Tab selector */}
      <div className="tabs" style={{ marginBottom: 'var(--sp-xl)' }}>
        <div className={`tab-item ${activeTab === 'borrador' ? 'active' : ''}`} onClick={() => setActiveTab('borrador')}>Borradores (2)</div>
        <div className={`tab-item ${activeTab === 'enviadas' ? 'active' : ''}`} onClick={() => setActiveTab('enviadas')}>Enviadas (5)</div>
        <div className={`tab-item ${activeTab === 'completadas' ? 'active' : ''}`} onClick={() => setActiveTab('completadas')}>Completadas (12)</div>
      </div>

      {/* Borrador cards */}
      {activeTab === 'borrador' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--sp-lg)' }}>
          <div className="card animate-on-load" style={{ borderLeft: '4px solid var(--clr-secondary)' }}>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--sp-md)' }}>
                <div>
                  <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', fontWeight: 700, color: 'var(--clr-primary)' }}>Diploma de Bachiller</div>
                  <span className="badge badge-neutral" style={{ marginTop: '4px' }}>Borrador</span>
                </div>
                <div style={{ width: '48px', height: '48px', background: 'var(--clr-surface-container)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '24px', color: 'var(--clr-secondary)' }}>draft</span>
                </div>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--clr-secondary)', marginBottom: 'var(--sp-md)' }}>
                Guardado: hace 3 días · Completado al 60%
              </div>
              <div className="progress" style={{ height: '6px', marginBottom: 'var(--sp-lg)' }}>
                <div className="progress-bar" style={{ width: '60%' }}></div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--sp-sm)' }}>
                <Link to="/tramite/paso3" className="btn btn-primary flex-1" style={{ textDecoration: 'none' }}>
                  <span className="material-symbols-outlined">edit</span>
                  Continuar
                </Link>
                <button className="btn btn-ghost">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </div>

          <div className="card animate-on-load stagger-1" style={{ borderLeft: '4px solid var(--clr-secondary)' }}>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--sp-md)' }}>
                <div>
                  <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '16px', fontWeight: 700, color: 'var(--clr-primary)' }}>Traslado Externo</div>
                  <span className="badge badge-neutral" style={{ marginTop: '4px' }}>Borrador</span>
                </div>
                <div style={{ width: '48px', height: '48px', background: 'var(--clr-surface-container)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '24px', color: 'var(--clr-secondary)' }}>draft</span>
                </div>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--clr-secondary)', marginBottom: 'var(--sp-md)' }}>
                Guardado: hace 1 semana · Completado al 20%
              </div>
              <div className="progress" style={{ height: '6px', marginBottom: 'var(--sp-lg)' }}>
                <div className="progress-bar" style={{ width: '20%' }}></div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--sp-sm)' }}>
                <Link to="/tramite/paso1" className="btn btn-primary flex-1" style={{ textDecoration: 'none' }}>
                  <span className="material-symbols-outlined">edit</span>
                  Continuar
                </Link>
                <button className="btn btn-ghost">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enviadas */}
      {activeTab === 'enviadas' && (
        <div className="card animate-on-load">
          <div className="request-row" style={{ background: 'var(--clr-surface-container-low)', fontSize: '12px', fontWeight: 700, color: 'var(--clr-secondary)', textTransform: 'uppercase', letterSpacing: '.06em', cursor: 'default' }}>
            <div>Trámite</div><div>Estado</div><div>Fecha</div>
          </div>
          {enviadas.map((i, index) => (
            <Link to="/seguimiento" key={index} className="request-row">
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--clr-on-surface)' }}>{i.title}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--clr-secondary)' }}>{i.exp}</div>
              </div>
              <div><span className={`badge ${i.sc}`}>{i.status}</span></div>
              <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>{i.date}</div>
            </Link>
          ))}
        </div>
      )}

      {/* Completadas */}
      {activeTab === 'completadas' && (
        <div className="card animate-on-load">
          <div className="request-row" style={{ background: 'var(--clr-surface-container-low)', fontSize: '12px', fontWeight: 700, color: 'var(--clr-secondary)', textTransform: 'uppercase', letterSpacing: '.06em', cursor: 'default' }}>
            <div>Trámite</div><div>Estado</div><div>Fecha</div>
          </div>
          {completadas.map((i, index) => (
            <Link to="/seguimiento" key={index} className="request-row">
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--clr-on-surface)' }}>{i.title}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--clr-secondary)' }}>{i.exp}</div>
              </div>
              <div><span className={`badge ${i.sc}`}>{i.status}</span></div>
              <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>{i.date}</div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
