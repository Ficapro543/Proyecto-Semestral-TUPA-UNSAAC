import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WizardStepper from '../../../components/ui/WizardStepper';
import DocumentItem from '../../../components/ui/DocumentItem';
import api from '../../../lib/api';
import { useWizard } from '../../../context/WizardContext';
import { formatSoles } from '../../../lib/estados';
import SinSolicitud from './SinSolicitud';
import './Step3.css';

export default function Step3() {
  const navigate = useNavigate();
  const wizard = useWizard();

  const [metodoPago, setMetodoPago] = useState('banco');
  const [archivo, setArchivo] = useState(null);
  const [nroRecibo, setNroRecibo] = useState('');
  const [arrastrando, setArrastrando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState(null);
  const [subido, setSubido] = useState(wizard.voucherSubido);
  const inputRef = useRef(null);

  const tramite = wizard.tramite;
  const monto = tramite?.precio ?? 0;

  useEffect(() => {
    if (wizard.idSolicitud) api.updateStep(wizard.idSolicitud, 3).catch(() => {});
  }, [wizard.idSolicitud]);

  const elegirArchivo = (f) => {
    setArchivo(f);
    setSubido(false);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setArrastrando(false);
    if (e.dataTransfer.files?.length > 0) elegirArchivo(e.dataTransfer.files[0]);
  };

  /** Sube el comprobante al backend; hasta que no responde no se avanza. */
  const subirVoucher = async () => {
    if (!archivo) return;
    setSubiendo(true);
    setError(null);

    try {
      const form = new FormData();
      form.append('archivo', archivo);
      if (nroRecibo.trim()) form.append('nro_recibo', nroRecibo.trim());
      form.append('monto_total', String(monto));

      await api.uploadVoucher(wizard.idSolicitud, form);
      wizard.update({ voucherSubido: true });
      setSubido(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubiendo(false);
    }
  };

  const continuar = async () => {
    if (!subido) await subirVoucher();
    navigate('/tramite/paso4');
  };

  if (!wizard.idSolicitud) return <SinSolicitud paso={3} />;

  return (
    <>
      <WizardStepper currentStep={3} />

      <div className="wizard-grid">
        <div style={{ minWidth: 0 }}>
          <h1 className="text-headline-md" style={{ color: 'var(--clr-primary)', marginBottom: 'var(--sp-xs)' }}>
            Confirmación de Pago
          </h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginBottom: 'var(--sp-xl)' }}>
            Realiza el pago de la tasa y sube tu voucher para continuar con el trámite.
          </p>

          <div style={{ background: 'linear-gradient(135deg, var(--clr-primary), var(--clr-primary-container))', borderRadius: 'var(--radius-xl)', padding: 'var(--sp-xl)', color: 'white', marginBottom: 'var(--sp-xl)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: '14px', opacity: 0.75, marginBottom: 'var(--sp-sm)' }}>
              Total a pagar por: {tramite?.nombre_tramite} ({tramite?.cod_tramite})
            </div>
            <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '48px', fontWeight: 800, color: 'var(--clr-tertiary-fixed)', lineHeight: 1 }}>
              {formatSoles(monto)}
            </div>
            <div style={{ fontSize: '13px', opacity: 0.65, marginTop: 'var(--sp-sm)' }}>
              Referencia: TUPA-{wizard.codTramite}-{wizard.idSolicitud}
            </div>
          </div>

          <h2 className="text-headline-sm" style={{ color: 'var(--clr-on-surface)', marginBottom: 'var(--sp-md)' }}>Método de pago</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)', marginBottom: 'var(--sp-xl)' }}>
            {[
              { id: 'banco', titulo: 'Banco de la Nación', desc: 'Cuenta corriente N.° 000-000-000000-0-00', icon: 'account_balance', bg: 'var(--clr-primary-fixed)', color: 'var(--clr-primary)', badge: 'Recomendado' },
              { id: 'agente', titulo: 'Agente Bancario', desc: 'Cualquier agente autorizado del Banco de la Nación', icon: 'point_of_sale', bg: '#d1fae5', color: '#065f46' },
              { id: 'tesoreria', titulo: 'Caja de Tesorería UNSAAC', desc: 'Pago presencial · Lunes a Viernes 8:00 – 16:00', icon: 'payments', bg: '#fef3c7', color: '#92400e' },
            ].map((m) => (
              <div
                key={m.id}
                className={`payment-method ${metodoPago === m.id ? 'selected' : ''}`}
                onClick={() => setMetodoPago(m.id)}
              >
                <div className="pay-icon" style={{ background: m.bg }}>
                  <span className="material-symbols-outlined icon-filled" style={{ color: m.color }}>{m.icon}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: 'var(--clr-on-surface)' }}>{m.titulo}</div>
                  <div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>{m.desc}</div>
                </div>
                {m.badge && <span className="badge badge-success">{m.badge}</span>}
              </div>
            ))}
          </div>

          <h2 className="text-headline-sm" style={{ color: 'var(--clr-on-surface)', marginBottom: 'var(--sp-md)' }}>Subir voucher de pago</h2>

          <div className="form-group" style={{ marginBottom: 'var(--sp-md)' }}>
            <label className="form-label" htmlFor="nro-recibo">N.º de recibo (opcional)</label>
            <input
              id="nro-recibo"
              className="form-input"
              placeholder="ej. REC-000123"
              value={nroRecibo}
              onChange={(e) => setNroRecibo(e.target.value)}
            />
          </div>

          <div
            className={`file-upload-area ${arrastrando ? 'drag-over' : ''}`}
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setArrastrando(true); }}
            onDragLeave={() => setArrastrando(false)}
            style={{ borderColor: archivo ? 'var(--clr-primary)' : '' }}
          >
            <span className="material-symbols-outlined icon-2xl" style={{ color: 'var(--clr-outline)' }}>upload_file</span>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--clr-on-surface)', marginTop: 'var(--sp-sm)' }}>
              Arrastra tu voucher aquí
            </div>
            <div style={{ fontSize: '13px', color: 'var(--clr-secondary)', marginTop: '4px' }}>
              o haz clic para seleccionar · PDF, JPG o PNG · máx. 5 MB
            </div>
            <input
              type="file" ref={inputRef} accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={(e) => e.target.files?.length && elegirArchivo(e.target.files[0])}
            />
          </div>

          {archivo && (
            <div style={{ marginTop: 'var(--sp-md)' }}>
              <DocumentItem
                name={archivo.name}
                size={(archivo.size / 1024).toFixed(0) + ' KB'}
                status="uploaded"
                required
                description={subido ? 'Comprobante registrado en el sistema' : 'Listo para enviar'}
              />
              {!subido && (
                <button className="btn btn-primary" style={{ marginTop: 'var(--sp-md)' }} onClick={subirVoucher} disabled={subiendo}>
                  {subiendo ? 'Subiendo…' : 'Subir comprobante'}
                  <span className="material-symbols-outlined">cloud_upload</span>
                </button>
              )}
            </div>
          )}

          {subido && (
            <div className="alert alert-success" style={{ marginTop: 'var(--sp-md)' }} role="status">
              <span className="material-symbols-outlined">check_circle</span>
              <div>Comprobante subido correctamente.</div>
            </div>
          )}

          {error && (
            <div className="alert alert-error" style={{ marginTop: 'var(--sp-md)' }} role="alert">
              <span className="material-symbols-outlined">error</span>
              <div>{error}</div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)', minWidth: 0 }}>
          <div className="card">
            <div className="card-header"><span className="card-header-title">Datos de depósito</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)', fontSize: '14px' }}>
              <div>
                <div style={{ color: 'var(--clr-secondary)', fontSize: '12px' }}>Beneficiario</div>
                <div style={{ fontWeight: 600 }}>UNSAAC</div>
              </div>
              <div>
                <div style={{ color: 'var(--clr-secondary)', fontSize: '12px' }}>N.° de cuenta</div>
                <div className="text-mono-sm" style={{ color: 'var(--clr-primary)' }}>000-000-000000-0-00</div>
              </div>
              <div>
                <div style={{ color: 'var(--clr-secondary)', fontSize: '12px' }}>Unidad responsable</div>
                <div style={{ fontWeight: 600 }}>{tramite?.unidad_responsable || '—'}</div>
              </div>
              <div style={{ padding: 'var(--sp-md)', background: 'var(--clr-surface-container-low)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '24px', fontWeight: 800, color: 'var(--clr-primary)' }}>
                  {formatSoles(monto)}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--clr-secondary)' }}>Monto exacto a depositar</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--sp-md)', flexWrap: 'wrap', paddingTop: 'var(--sp-lg)', borderTop: '1px solid var(--clr-outline-variant)', marginTop: 'var(--sp-xl)' }}>
        <button className="btn btn-outline" onClick={() => navigate('/tramite/paso2')}>
          <span className="material-symbols-outlined">arrow_back</span> Paso anterior
        </button>
        <button className="btn btn-primary btn-lg" onClick={continuar} disabled={subiendo || (!archivo && !subido)}>
          Ir a Subir Documentos
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </>
  );
}
