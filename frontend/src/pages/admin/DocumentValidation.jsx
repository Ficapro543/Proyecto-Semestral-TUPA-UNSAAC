import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DocumentValidation.css';

const docs = [
  { id: 1, name: 'Solicitud F-001', size: '325 KB', status: 'approved' },
  { id: 2, name: 'Certificado de estudios', size: '1.2 MB', status: 'approved' },
  { id: 3, name: 'Copia DNI (ambas caras)', size: '450 KB', status: 'approved' },
  { id: 4, name: 'Constancia no adeudo Económica', size: '280 KB', status: 'approved' },
  { id: 5, name: 'Constancia no adeudo Biblioteca', size: '210 KB', status: 'pending' },
  { id: 6, name: 'Voucher de pago S/. 120.00', size: '650 KB', status: 'pending' },
  { id: 7, name: 'Foto carné (fondo blanco)', size: '120 KB', status: 'pending' },
];

export default function DocumentValidation() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tab-approve');

  const handleDecision = (type) => {
    const msgs = { 
      aprobado: 'Expediente aprobado. Se notificará al estudiante.', 
      observado: 'Observación emitida. El estudiante fue notificado.', 
      rechazado: 'Expediente rechazado. El estudiante fue notificado.' 
    };
    alert(msgs[type]); // Idealmente usar showToast
    setTimeout(() => navigate('/admin/cola'), 1500);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
        <div>
          <h1 className="text-display-md" style={{ color: 'var(--clr-primary)' }}>Validación de Documentos</h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginTop: '4px' }}>Revisa y valida los documentos adjuntados a los expedientes</p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate('/admin/cola')}>
          <span className="material-symbols-outlined">arrow_back</span>
          Volver a la cola
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--sp-xl)' }}>
        {/* Main validation area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)' }}>
          {/* Expediente header */}
          <div className="doc-validate-card animate-on-load">
            <div className="doc-validate-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-md)' }}>
                <div>
                  <div style={{ fontSize: '12px', opacity: 0.65, marginBottom: '4px' }}>Revisando expediente</div>
                  <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '20px', fontWeight: 700 }}>EXP-2024-8902 — Diploma de Bachiller</div>
                  <div style={{ fontSize: '13px', opacity: 0.75, marginTop: '4px' }}>Solicitante: Elena M. Rodríguez Quispe · Código: 201900456</div>
                </div>
                <span className="badge badge-in-review">En Revisión</span>
              </div>
            </div>
            <div style={{ padding: 'var(--sp-lg)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--sp-md)', fontSize: '13px' }}>
                <div><div style={{ color: 'var(--clr-secondary)' }}>Trámite</div><div style={{ fontWeight: 600 }}>Diploma de Bachiller</div></div>
                <div><div style={{ color: 'var(--clr-secondary)' }}>Presentado</div><div style={{ fontWeight: 600 }}>12 Oct 2024</div></div>
                <div><div style={{ color: 'var(--clr-secondary)' }}>Plazo</div><div style={{ fontWeight: 600, color: 'var(--clr-error)' }}>05 Nov 2024</div></div>
                <div><div style={{ color: 'var(--clr-secondary)' }}>Documentos</div><div style={{ fontWeight: 600 }}>7 de 7 presentados</div></div>
              </div>
            </div>
          </div>

          {/* Documents list */}
          <div className="card animate-on-load stagger-1">
            <div className="card-header">
              <span className="card-header-title">Documentos adjuntados</span>
              <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>4 / 7 validados</div>
            </div>
            <div style={{ padding: 'var(--sp-sm) var(--sp-lg)' }}>
              <div className="progress" style={{ height: '6px', marginBottom: 'var(--sp-md)' }}>
                <div className="progress-bar" style={{ width: '57%' }}></div>
              </div>
            </div>

            <div>
              {docs.map(d => (
                <div key={d.id} className="doc-item">
                  <span className="material-symbols-outlined icon-filled" style={{ color: d.status === 'approved' ? 'var(--clr-primary)' : 'var(--clr-outline)' }}>
                    {d.status === 'approved' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{d.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}>{d.size} · PDF</div>
                  </div>
                  <div className="doc-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => alert('Visualizando documento...')}>
                      <span className="material-symbols-outlined icon-sm">visibility</span>
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => alert('Descargando...')}>
                      <span className="material-symbols-outlined icon-sm">download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decision panel */}
          <div className="card animate-on-load stagger-2">
            <div className="card-header"><span className="card-header-title">Decisión final</span></div>
            <div className="card-body">
              <div className="tabs" style={{ marginBottom: 'var(--sp-lg)' }}>
                <div className={`tab-item ${activeTab === 'tab-approve' ? 'active' : ''}`} onClick={() => setActiveTab('tab-approve')}>Aprobar</div>
                <div className={`tab-item ${activeTab === 'tab-observe' ? 'active' : ''}`} onClick={() => setActiveTab('tab-observe')}>Observar</div>
                <div className={`tab-item ${activeTab === 'tab-reject' ? 'active' : ''}`} onClick={() => setActiveTab('tab-reject')}>Rechazar</div>
              </div>

              {activeTab === 'tab-approve' && (
                <div className="tab-content active animate-fade-in">
                  <div className="alert alert-success" style={{ marginBottom: 'var(--sp-lg)' }}>
                    <span className="material-symbols-outlined">info</span>
                    <div>Al aprobar, el expediente pasará al siguiente paso: Resolución del Decano.</div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 'var(--sp-lg)' }}>
                    <label className="form-label" htmlFor="obs-approver">Observaciones opcionales</label>
                    <textarea className="form-textarea" id="obs-approver" rows="3" placeholder="Ej. Documentación completa y en orden..."></textarea>
                  </div>
                  <button className="btn btn-primary" onClick={() => handleDecision('aprobado')}>
                    <span className="material-symbols-outlined">check_circle</span>
                    Aprobar expediente
                  </button>
                </div>
              )}

              {activeTab === 'tab-observe' && (
                <div className="tab-content active animate-fade-in">
                  <div className="alert alert-warning" style={{ marginBottom: 'var(--sp-lg)' }}>
                    <span className="material-symbols-outlined">warning</span>
                    <div>Se enviará una notificación al estudiante con el detalle de la observación.</div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 'var(--sp-md)' }}>
                    <label className="form-label required" htmlFor="obs-document">Documento observado</label>
                    <select className="form-select w-full" id="obs-document">
                      <option>Seleccionar documento...</option>
                      <option>Constancia de no adeudo a biblioteca</option>
                      <option>Certificado de estudios</option>
                      <option>Voucher de pago</option>
                      <option>Foto carné</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 'var(--sp-lg)' }}>
                    <label className="form-label required" htmlFor="obs-detail">Descripción de la observación</label>
                    <textarea className="form-textarea" id="obs-detail" rows="3" placeholder="Describe detalladamente el problema encontrado..."></textarea>
                  </div>
                  <div className="form-group" style={{ marginBottom: 'var(--sp-lg)' }}>
                    <label className="form-label required" htmlFor="obs-plazo">Plazo para subsanar</label>
                    <input type="date" className="form-input" id="obs-plazo" />
                  </div>
                  <button className="btn btn-warning" onClick={() => handleDecision('observado')}>
                    <span className="material-symbols-outlined">warning</span>
                    Emitir observación
                  </button>
                </div>
              )}

              {activeTab === 'tab-reject' && (
                <div className="tab-content active animate-fade-in">
                  <div className="alert alert-error" style={{ marginBottom: 'var(--sp-lg)' }}>
                    <span className="material-symbols-outlined">error</span>
                    <div>El rechazo es definitivo. El estudiante deberá iniciar un nuevo trámite.</div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 'var(--sp-lg)' }}>
                    <label className="form-label required" htmlFor="rej-reason">Motivo de rechazo</label>
                    <select className="form-select w-full" id="rej-reason">
                      <option>Seleccionar motivo...</option>
                      <option>Documentación incompleta irresoluble</option>
                      <option>Pago no verificable</option>
                      <option>No cumple requisitos académicos</option>
                      <option>Datos del solicitante incorrectos</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 'var(--sp-lg)' }}>
                    <label className="form-label required" htmlFor="rej-detail">Detalle del rechazo</label>
                    <textarea className="form-textarea" id="rej-detail" rows="3" placeholder="Explica el motivo de rechazo para el expediente..."></textarea>
                  </div>
                  <button className="btn btn-error" onClick={() => handleDecision('rechazado')}>
                    <span className="material-symbols-outlined">cancel</span>
                    Rechazar expediente
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)', alignSelf: 'start', position: 'sticky', top: '80px' }}>
          <div className="card">
            <div className="card-header"><span className="card-header-title">Navegación de expedientes</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
              <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--clr-secondary)', marginBottom: 'var(--sp-sm)' }}>
                Expediente <strong>1</strong> de <strong>13</strong>
              </div>
              <div style={{ display: 'flex', gap: 'var(--sp-sm)' }}>
                <button className="btn btn-outline flex-1">
                  <span className="material-symbols-outlined">chevron_left</span>
                  Anterior
                </button>
                <button className="btn btn-outline flex-1" onClick={() => navigate('/admin/detalle')}>
                  Siguiente
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-header-title">Historial de revisión</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
              <div style={{ display: 'flex', gap: 'var(--sp-sm)', fontSize: '13px' }}>
                <span className="material-symbols-outlined icon-sm icon-filled" style={{ color: 'var(--clr-primary)' }}>check_circle</span>
                <div>
                  <div style={{ fontWeight: 600 }}>Recibido</div>
                  <div style={{ color: 'var(--clr-secondary)' }}>12 Oct · Auto</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--sp-sm)', fontSize: '13px' }}>
                <span className="material-symbols-outlined icon-sm icon-filled" style={{ color: 'var(--clr-primary)' }}>check_circle</span>
                <div>
                  <div style={{ fontWeight: 600 }}>Pago verificado</div>
                  <div style={{ color: 'var(--clr-secondary)' }}>14 Oct · Auto</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--sp-sm)', fontSize: '13px' }}>
                <span className="material-symbols-outlined icon-sm" style={{ color: 'var(--clr-tertiary-container)' }}>radio_button_unchecked</span>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--clr-tertiary-container)' }}>Revisión docs.</div>
                  <div style={{ color: 'var(--clr-secondary)' }}>En curso · Dr. Quispe</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
