import { useEffect, useState } from 'react';
import api from '../../lib/api';

/**
 * Modal que muestra un documento subido por multer (voucher o adjunto de
 * requisito). El archivo se sirve desde un endpoint protegido
 * (GET /documents/:id/view), así que se trae como blob autenticado en vez
 * de apuntar un <a>/<img> directo a /uploads.
 */
export default function DocumentViewer({ idDocumento, nombreArchivo, onClose }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let url = null;
    let cancelado = false;

    setCargando(true);
    setError(null);
    setBlobUrl(null);

    api
      .getDocumentBlob(idDocumento)
      .then((blob) => {
        if (cancelado) return;
        url = URL.createObjectURL(blob);
        setBlobUrl(url);
        setTipo(blob.type);
      })
      .catch((err) => {
        if (!cancelado) setError(err);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [idDocumento]);

  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onClose]);

  const esImagen = tipo?.startsWith('image/');
  const esPdf = tipo === 'application/pdf';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Visor de documento: ${nombreArchivo}`}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 'var(--sp-lg)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card"
        style={{
          width: '100%', maxWidth: '900px', height: '85vh',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        <div className="card-header" style={{ flexShrink: 0 }}>
          <span className="card-header-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {nombreArchivo}
          </span>
          <div style={{ display: 'flex', gap: 'var(--sp-xs)', marginLeft: 'auto', flexShrink: 0 }}>
            {blobUrl && (
              <a className="btn btn-outline btn-sm" href={blobUrl} download={nombreArchivo}>
                <span className="material-symbols-outlined icon-sm">download</span> Descargar
              </a>
            )}
            <button className="btn btn-ghost btn-sm" aria-label="Cerrar visor" onClick={onClose}>
              <span className="material-symbols-outlined icon-sm">close</span>
            </button>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, background: 'var(--clr-surface-container-lowest)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}>
          {cargando && <div style={{ color: 'var(--clr-secondary)' }}>Cargando documento…</div>}

          {error && (
            <div className="alert alert-error" style={{ margin: 'var(--sp-lg)' }} role="alert">
              <span className="material-symbols-outlined">error</span>
              <div>{error.message}</div>
            </div>
          )}

          {!cargando && !error && blobUrl && esImagen && (
            <img src={blobUrl} alt={nombreArchivo} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          )}

          {!cargando && !error && blobUrl && esPdf && (
            <iframe src={blobUrl} title={nombreArchivo} style={{ width: '100%', height: '100%', border: 'none' }} />
          )}

          {!cargando && !error && blobUrl && !esImagen && !esPdf && (
            <div style={{ textAlign: 'center', color: 'var(--clr-secondary)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>description</span>
              <p>No hay vista previa disponible para este tipo de archivo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
