import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../lib/api';
import AuthShell from './AuthShell';

/**
 * Destino del enlace del correo de activación (/activar/:token).
 * Confirma la cuenta contra el backend y guía al usuario al login.
 */
export default function ActivarCuenta() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [estado, setEstado] = useState('cargando'); // cargando | ok | error
  const [mensaje, setMensaje] = useState('');
  const [nombre, setNombre] = useState('');
  const yaLlamado = useRef(false);

  useEffect(() => {
    // React 18 monta dos veces en desarrollo (StrictMode): sin esta guarda el
    // POST de activación saldría duplicado.
    if (yaLlamado.current) return;
    yaLlamado.current = true;

    api
      .activarCuenta(token)
      .then((res) => {
        setEstado('ok');
        setMensaje(res.message);
        setNombre(res.nombres || '');
      })
      .catch((err) => {
        setEstado('error');
        setMensaje(err.message);
      });
  }, [token]);

  if (estado === 'cargando') {
    return (
      <AuthShell icono="hourglass_top" titulo="Activando tu cuenta" subtitulo="Un momento…">
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--sp-xl) 0' }}>
          <svg className="animate-spin" width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="var(--clr-primary)" strokeWidth="3" strokeDasharray="31.416" strokeDashoffset="10" />
          </svg>
        </div>
      </AuthShell>
    );
  }

  if (estado === 'error') {
    return (
      <AuthShell icono="link_off" titulo="No pudimos activar la cuenta" subtitulo={mensaje}>
        <div className="alert alert-error" role="alert">
          <span className="material-symbols-outlined" aria-hidden="true">error</span>
          <div>
            El enlace puede haber vencido o ya no ser válido. Puedes pedir uno nuevo desde el
            inicio de sesión.
          </div>
        </div>
        <Link to="/login" className="btn btn-primary w-full" style={{ marginTop: 'var(--sp-lg)' }}>
          Ir a iniciar sesión
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      icono="verified"
      titulo="¡Cuenta activada!"
      subtitulo={nombre ? `Bienvenido/a, ${nombre}` : undefined}
    >
      <div className="alert alert-success" role="status">
        <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
        <div>{mensaje}</div>
      </div>

      <button
        className="btn btn-primary btn-lg w-full"
        style={{ marginTop: 'var(--sp-lg)' }}
        onClick={() => navigate('/login')}
      >
        <span className="material-symbols-outlined" aria-hidden="true">login</span>
        Iniciar sesión
      </button>
    </AuthShell>
  );
}
