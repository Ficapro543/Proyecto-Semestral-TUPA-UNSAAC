import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import WizardStepper from '../../../components/ui/WizardStepper';
import DocumentItem from '../../../components/ui/DocumentItem';
import './Step3.css';

export default function Step3() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('banco');
  const [voucherFile, setVoucherFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleVoucherUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setVoucherFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setVoucherFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <>
      <WizardStepper currentStep={3} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--sp-xl)' }}>
        <div>
          <h1 className="text-headline-md" style={{ color: 'var(--clr-primary)', marginBottom: 'var(--sp-xs)' }}>Confirmación de Pago</h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginBottom: 'var(--sp-xl)' }}>Realiza el pago de la tasa y sube tu voucher de pago para continuar con el trámite.</p>

          {/* Payment amount */}
          <div style={{ background: 'linear-gradient(135deg, var(--clr-primary), var(--clr-primary-container))', borderRadius: 'var(--radius-xl)', padding: 'var(--sp-xl)', color: 'white', marginBottom: 'var(--sp-xl)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(137,245,231,0.12)', pointerEvents: 'none' }}></div>
            <div style={{ fontSize: '14px', opacity: 0.75, marginBottom: 'var(--sp-sm)' }}>Total a pagar por: Diploma de Bachiller (P001)</div>
            <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '48px', fontWeight: 800, color: 'var(--clr-tertiary-fixed)', lineHeight: 1 }}>S/. 120.00</div>
            <div style={{ fontSize: '13px', opacity: 0.65, marginTop: 'var(--sp-sm)' }}>Referencia: TUPA-2024-P001-8902</div>
          </div>

          {/* Payment methods */}
          <h2 className="text-headline-sm" style={{ color: 'var(--clr-on-surface)', marginBottom: 'var(--sp-md)' }}>Método de pago</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
            <div 
              className={`payment-method ${paymentMethod === 'banco' ? 'selected' : ''}`} 
              onClick={() => setPaymentMethod('banco')}
            >
              <div className="pay-icon" style={{ background: 'var(--clr-primary-fixed)' }}>
                <span className="material-symbols-outlined icon-filled" style={{ color: 'var(--clr-primary)' }}>account_balance</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--clr-on-surface)' }}>Banco de la Nación</div>
                <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>Cuenta corriente N.° 000-000-000000-0-00 · Presencial o agencia bancaria</div>
              </div>
              <span className="badge badge-success">Recomendado</span>
            </div>
            
            <div 
              className={`payment-method ${paymentMethod === 'agente' ? 'selected' : ''}`} 
              onClick={() => setPaymentMethod('agente')}
            >
              <div className="pay-icon" style={{ background: '#d1fae5' }}>
                <span className="material-symbols-outlined icon-filled" style={{ color: '#065f46' }}>point_of_sale</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--clr-on-surface)' }}>Agente Bancario</div>
                <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>Cualquier agente autorizado del Banco de la Nación</div>
              </div>
            </div>

            <div 
              className={`payment-method ${paymentMethod === 'tesoreria' ? 'selected' : ''}`} 
              onClick={() => setPaymentMethod('tesoreria')}
            >
              <div className="pay-icon" style={{ background: '#fef3c7' }}>
                <span className="material-symbols-outlined icon-filled" style={{ color: '#92400e' }}>payments</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--clr-on-surface)' }}>Caja de Tesorería UNSAAC</div>
                <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>Pago presencial en la Oficina de Tesorería · Lunes a Viernes 8:00 – 16:00</div>
              </div>
            </div>
          </div>

          {/* Voucher upload */}
          <h2 className="text-headline-sm" style={{ color: 'var(--clr-on-surface)', marginBottom: 'var(--sp-md)' }}>Subir voucher de pago</h2>
          <div 
            className={`file-upload-area ${isDragOver ? 'drag-over' : ''}`} 
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            style={{ borderColor: voucherFile ? 'var(--clr-primary)' : '' }}
          >
            <span className="material-symbols-outlined icon-2xl" style={{ color: 'var(--clr-outline)' }}>upload_file</span>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--clr-on-surface)', marginTop: 'var(--sp-sm)' }}>Arrastra tu voucher aquí</div>
            <div style={{ fontSize: '13px', color: 'var(--clr-secondary)', marginTop: '4px' }}>o haz clic para seleccionar · PDF o JPG · máx. 5 MB</div>
            <input type="file" ref={fileInputRef} accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={handleVoucherUpload} />
          </div>
          
          {voucherFile && (
            <div style={{ marginTop: 'var(--sp-md)' }}>
              <DocumentItem 
                name={voucherFile.name} 
                size={(voucherFile.size / 1024).toFixed(0) + ' KB'} 
                status="uploaded" 
                required={true}
                description="Voucher de pago cargado correctamente" 
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)' }}>
          <div className="card">
            <div className="card-header"><span className="card-header-title">Datos de depósito</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)', fontSize: '14px' }}>
              <div><div style={{ color: 'var(--clr-secondary)', fontSize: '12px', marginBottom: '2px' }}>Beneficiario</div><div style={{ fontWeight: 600 }}>UNSAAC</div></div>
              <div><div style={{ color: 'var(--clr-secondary)', fontSize: '12px', marginBottom: '2px' }}>N.° de cuenta</div><div className="text-mono-sm" style={{ color: 'var(--clr-primary)' }}>000-000-000000-0-00</div></div>
              <div><div style={{ color: 'var(--clr-secondary)', fontSize: '12px', marginBottom: '2px' }}>Concepto</div><div style={{ fontWeight: 600 }}>Derecho de tramitación P001</div></div>
              <div><div style={{ color: 'var(--clr-secondary)', fontSize: '12px', marginBottom: '2px' }}>Referencia</div><div className="text-mono-sm" style={{ color: 'var(--clr-primary)' }}>TUPA-2024-P001-8902</div></div>
              <div style={{ padding: 'var(--sp-md)', background: 'var(--clr-surface-container-low)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '24px', fontWeight: 800, color: 'var(--clr-primary)' }}>S/. 120.00</div>
                <div style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}>Monto exacto a depositar</div>
              </div>
            </div>
          </div>
          <div className="alert alert-info">
            <span className="material-symbols-outlined">info</span>
            <div>Guarda tu voucher de pago. Lo necesitarás para subir en este paso. El número de referencia es único para tu expediente.</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--sp-lg)', borderTop: '1px solid var(--clr-outline-variant)', marginTop: 'var(--sp-xl)' }}>
        <button className="btn btn-outline" onClick={() => navigate('/tramite/paso2')}>
          <span className="material-symbols-outlined">arrow_back</span>
          Paso anterior
        </button>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/tramite/paso4')} disabled={!voucherFile}>
          Ir a Subir Documentos
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </>
  );
}
