import { Link } from 'react-router-dom';
import './AuthShell.css';

/**
 * Marco compartido por todas las pantallas de autenticación (registro,
 * activación, recuperación). Reutiliza el panel institucional del login
 * para que el conjunto se vea como una sola familia de pantallas.
 */
export default function AuthShell({ titulo, subtitulo, icono = 'account_balance', children, ancho }) {
  return (
    <div className="auth-shell">
      <div className="auth-shell-aside" aria-hidden="true">
        <div className="auth-orb" style={{ top: '-120px', right: '-120px', width: '380px', height: '380px', background: 'rgba(255,255,255,1)' }} />
        <div className="auth-orb" style={{ bottom: '-90px', left: '-90px', width: '280px', height: '280px', background: 'rgba(137,245,231,1)' }} />

        <Link to="/" className="auth-shell-brand">
          <div className="auth-brand-logo">
            <span className="material-symbols-outlined icon-filled">account_balance</span>
          </div>
          <div>
            <div className="auth-brand-title">TUPA UNSAAC</div>
            <div className="auth-brand-sub">Portal Administrativo Digital</div>
          </div>
        </Link>

        <div className="auth-shell-copy">
          <h2>Tus trámites universitarios, en un solo lugar</h2>
          <p>
            Presenta solicitudes, adjunta tus documentos y sigue el estado de cada expediente
            sin moverte de casa.
          </p>
        </div>

        <div className="auth-shell-foot">
          <span className="material-symbols-outlined">verified_user</span>
          Acceso institucional seguro
        </div>
      </div>

      <div className="auth-shell-main">
        <div className="auth-card" style={ancho ? { maxWidth: ancho } : undefined}>
          <div className="auth-card-head">
            <div className="auth-card-icon">
              <span className="material-symbols-outlined icon-filled">{icono}</span>
            </div>
            <h1>{titulo}</h1>
            {subtitulo && <p>{subtitulo}</p>}
          </div>

          {children}

          <div className="auth-card-back">
            <Link to="/">← Volver al portal principal</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
