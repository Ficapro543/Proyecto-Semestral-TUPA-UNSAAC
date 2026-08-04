import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import WizardStepper from '../../../components/ui/WizardStepper';
import './Step4.css';

const docs = [
  { id:'d1', name:'Solicitud de diploma (F-001)', hint:'PDF · Formato disponible en el portal', required:true },
  { id:'d2', name:'Certificado de estudios original', hint:'PDF digitalizado', required:true },
  { id:'d3', name:'Copia del DNI (ambas caras)', hint:'JPG o PDF', required:true },
  { id:'d4', name:'Constancia de no adeudar (Dir. Económica)', hint:'PDF', required:true },
  { id:'d5', name:'Constancia de no adeudar biblioteca', hint:'PDF', required:true },
  { id:'d6', name:'Voucher de pago S/. 120.00', hint:'JPG o PDF · Banco de la Nación', required:true },
  { id:'d7', name:'Foto carné (fondo blanco)', hint:'JPG, 3×4 cm', required:true },
  { id:'d8', name:'Certificado SERUMS (solo Medicina)', hint:'PDF — opcional si no aplica', required:false },
];

export default function Step4() {
  const navigate = useNavigate();
  const [uploaded, setUploaded] = useState(new Set());
  const fileInputRef = useRef({});

  const handleUpload = (id, e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newUploaded = new Set(uploaded);
      newUploaded.add(id);
      setUploaded(newUploaded);
    }
  };

  const removeDoc = (id) => {
    const newUploaded = new Set(uploaded);
    newUploaded.delete(id);
    setUploaded(newUploaded);
  };

  const totalRequired = docs.filter(d => d.required).length;
  const doneRequired = docs.filter(d => d.required && uploaded.has(d.id)).length;
  const pct = totalRequired > 0 ? (doneRequired / totalRequired) * 100 : 100;

  return (
    <>
      <WizardStepper currentStep={4} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--sp-xl)' }}>
        <div>
          <h1 className="text-headline-md" style={{ color: 'var(--clr-primary)', marginBottom: 'var(--sp-xs)' }}>Subir Documentos</h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginBottom: 'var(--sp-xl)' }}>Carga cada documento en el formato indicado. Formatos aceptados: PDF, JPG, PNG. Tamaño máximo: 5 MB por archivo.</p>

          {/* Overall progress */}
          <div style={{ marginBottom: 'var(--sp-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-sm)' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--clr-on-surface)' }}>Progreso de carga</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--clr-primary)' }}>{doneRequired} / {totalRequired} subidos</span>
            </div>
            <div className="progress"><div className="progress-bar" style={{ width: `${pct}%` }}></div></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
            {docs.map((d, i) => (
              <div key={d.id} className={`doc-slot ${uploaded.has(d.id) ? 'uploaded' : ''}`}>
                <div className="doc-slot-header">
                  <div className="doc-slot-num">{uploaded.has(d.id) ? '✓' : i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--clr-on-surface)' }}>
                      {d.name} {d.required && <span style={{ color: 'var(--clr-error)' }}>*</span>}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}>{d.hint}</div>
                  </div>
                  <span className={`badge ${d.required ? 'badge-error' : 'badge-neutral'}`} style={{ fontSize: '10px' }}>
                    {d.required ? 'Obligatorio' : 'Opcional'}
                  </span>
                </div>

                {uploaded.has(d.id) ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)', padding: 'var(--sp-sm) var(--sp-md)', background: 'var(--clr-surface-container-low)', borderRadius: 'var(--radius-lg)' }}>
                    <span className="material-symbols-outlined icon-filled" style={{ color: 'var(--clr-primary)' }}>check_circle</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--clr-primary)' }}>Documento cargado correctamente</span>
                    <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => removeDoc(d.id)}>
                      <span className="material-symbols-outlined icon-sm">delete</span> Eliminar
                    </button>
                  </div>
                ) : (
                  <>
                    <input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png" 
                      style={{ display: 'none' }} 
                      ref={el => fileInputRef.current[d.id] = el}
                      onChange={(e) => handleUpload(d.id, e)} 
                    />
                    <div className="doc-upload-btn" onClick={() => fileInputRef.current[d.id]?.click()}>
                      <span className="material-symbols-outlined">upload</span>
                      Seleccionar archivo
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)' }}>
          <div className="card">
            <div className="card-header"><span className="card-header-title">Documentos cargados</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-xs)' }}>
              {uploaded.size === 0 ? (
                <div className="empty-state" style={{ padding: 'var(--sp-lg) 0' }}>
                  <span className="material-symbols-outlined">upload_file</span>
                  <div className="empty-state-desc">Aún no has subido ningún documento</div>
                </div>
              ) : (
                Array.from(uploaded).map(id => {
                  const d = docs.find(x => x.id === id);
                  return (
                    <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)', padding: '6px 0' }}>
                      <span className="material-symbols-outlined icon-sm icon-filled" style={{ color: 'var(--clr-primary)' }}>check_circle</span>
                      <span style={{ fontSize: '13px', color: 'var(--clr-on-surface)' }}>{d.name}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div className="alert alert-warning">
            <span className="material-symbols-outlined">warning</span>
            <div>Asegúrate de que los documentos sean legibles y estén en el formato correcto antes de subirlos.</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--sp-lg)', borderTop: '1px solid var(--clr-outline-variant)', marginTop: 'var(--sp-xl)' }}>
        <button className="btn btn-outline" onClick={() => navigate('/tramite/paso3')}>
          <span className="material-symbols-outlined">arrow_back</span>
          Paso anterior
        </button>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/tramite/paso5')}>
          Revisar y Enviar
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </>
  );
}
