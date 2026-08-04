import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { REGLAS_PASSWORD, passwordCumple } from '../../context/AuthContext';
import AuthShell from './AuthShell';

const LARGO_CODIGO = 6;
const SEGUNDOS_REENVIO = 60;

/**
 * Recuperación de contraseña en tres pasos dentro de una sola pantalla:
 * correo → código de 6 dígitos → contraseña nueva.
 *
 * Mantenerlo en una ruta evita perder el estado al navegar y hace el flujo
 * más corto que en el proyecto de referencia (tres pantallas separadas).
 */
export default function RecuperarPassword() {
  const navigate = useNavigate();

  const [paso, setPaso] = useState(1);
  const [email, setEmail] = useState('');
  const [digitos, setDigitos] = useState(Array(LARGO_CODIGO).fill(''));
  const [resetToken, setResetToken] = useState(null);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [verPassword, setVerPassword] = useState(false);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [segundos, setSegundos] = useState(0);

  const inputsRef = useRef([]);

  // Cuenta atrás para poder reenviar el código.
  useEffect(() => {
    if (segundos <= 0) return;
    const t = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [segundos]);

  const codigo = digitos.join('');

  // ── Paso 1: pedir el código ───────────────────────────────
  const pedirCodigo = async (e) => {
    e?.preventDefault();
    setError(null);
    setCargando(true);
    try {
      const res = await api.forgotPassword(email.trim());
      setAviso(res.message);
      setPaso(2);
      setSegundos(SEGUNDOS_REENVIO);
      setTimeout(() => inputsRef.current[0]?.focus(), 80);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const reenviar = async () => {
    setError(null);
    setCargando(true);
    try {
      const res = await api.resendCode(email.trim());
      setAviso(res.message);
      setDigitos(Array(LARGO_CODIGO).fill(''));
      setSegundos(SEGUNDOS_REENVIO);
      inputsRef.current[0]?.focus();
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  // ── Paso 2: casillas del código ───────────────────────────
  const escribirDigito = (i, valor) => {
    const limpio = valor.replace(/\D/g, '');
    setError(null);

    if (limpio.length > 1) {
      // Pegar el código completo de una vez.
      const nuevos = limpio.slice(0, LARGO_CODIGO).split('');
      const siguiente = Array(LARGO_CODIGO).fill('');
      nuevos.forEach((d, idx) => (siguiente[idx] = d));
      setDigitos(siguiente);
      inputsRef.current[Math.min(nuevos.length, LARGO_CODIGO - 1)]?.focus();
      return;
    }

    setDigitos((prev) => {
      const copia = [...prev];
      copia[i] = limpio;
      return copia;
    });
    if (limpio && i < LARGO_CODIGO - 1) inputsRef.current[i + 1]?.focus();
  };

  const teclaDigito = (i, e) => {
    if (e.key === 'Backspace' && !digitos[i] && i > 0) inputsRef.current[i - 1]?.focus();
    if (e.key === 'ArrowLeft' && i > 0) inputsRef.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < LARGO_CODIGO - 1) inputsRef.current[i + 1]?.focus();
  };

  const verificarCodigo = async (e) => {
    e?.preventDefault();
    setError(null);
    setCargando(true);
    try {
      const res = await api.verifyCode(email.trim(), codigo);
      setResetToken(res.resetToken);
      setAviso(null);
      setPaso(3);
    } catch (err) {
      setError(err.message);
      setDigitos(Array(LARGO_CODIGO).fill(''));
      inputsRef.current[0]?.focus();
    } finally {
      setCargando(false);
    }
  };

  // ── Paso 3: contraseña nueva ──────────────────────────────
  const guardarPassword = async (e) => {
    e.preventDefault();
    setError(null);

    if (!passwordCumple(password)) return setError('La contraseña no cumple todos los requisitos.');
    if (password !== password2) return setError('Las contraseñas no coinciden.');

    setCargando(true);
    try {
      await api.resetPassword(resetToken, password);
      setPaso(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const Pasos = () => (
    <div className="auth-pasos" aria-hidden="true">
      {[1, 2, 3].map((n) => (
        <div key={n} className={`auth-paso ${paso === n ? 'activo' : paso > n ? 'hecho' : ''}`} />
      ))}
    </div>
  );

  const Error = () =>
    error ? (
      <div className="alert alert-error" role="alert">
        <span className="material-symbols-outlined" aria-hidden="true">error</span>
        <div>{error}</div>
      </div>
    ) : null;

  // ── Paso 4: listo ─────────────────────────────────────────
  if (paso === 4) {
    return (
      <AuthShell icono="lock_reset" titulo="Contraseña actualizada">
        <div className="alert alert-success" role="status">
          <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
          <div>
            Tu contraseña se cambió correctamente. Por seguridad cerramos las demás sesiones
            que tuvieras abiertas.
          </div>
        </div>
        <button
          className="btn btn-primary btn-lg w-full"
          style={{ marginTop: 'var(--sp-lg)' }}
          onClick={() => navigate('/login')}
        >
          Iniciar sesión
        </button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      icono={paso === 1 ? 'lock_open' : paso === 2 ? 'pin' : 'lock_reset'}
      titulo={
        paso === 1 ? 'Recuperar contraseña' : paso === 2 ? 'Ingresa el código' : 'Nueva contraseña'
      }
      subtitulo={
        paso === 1
          ? 'Te enviaremos un código de verificación a tu correo'
          : paso === 2
          ? `Enviamos un código de 6 dígitos a ${email}`
          : 'Elige una contraseña segura para tu cuenta'
      }
    >
      <Pasos />

      {paso === 1 && (
        <form className="auth-form" onSubmit={pedirCodigo} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Correo institucional</label>
            <div className="form-input-icon">
              <span className="material-symbols-outlined" aria-hidden="true">mail</span>
              <input
                id="email" className="form-input" type="email" required autoFocus
                autoComplete="email" value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                placeholder="nombre.apellido@unsaac.edu.pe"
              />
            </div>
          </div>

          <Error />

          <button className="btn btn-primary btn-lg w-full" type="submit" disabled={cargando || !email.trim()}>
            {cargando ? 'Enviando…' : 'Enviar código'}
          </button>
        </form>
      )}

      {paso === 2 && (
        <form className="auth-form" onSubmit={verificarCodigo} noValidate>
          {aviso && (
            <div className="alert alert-info">
              <span className="material-symbols-outlined" aria-hidden="true">info</span>
              <div>{aviso}</div>
            </div>
          )}

          <div className="auth-codigo">
            {digitos.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={LARGO_CODIGO}
                value={d}
                onChange={(e) => escribirDigito(i, e.target.value)}
                onKeyDown={(e) => teclaDigito(i, e)}
                aria-label={`Dígito ${i + 1} de ${LARGO_CODIGO}`}
              />
            ))}
          </div>

          <Error />

          <button
            className="btn btn-primary btn-lg w-full"
            type="submit"
            disabled={cargando || codigo.length !== LARGO_CODIGO}
          >
            {cargando ? 'Verificando…' : 'Verificar código'}
          </button>

          <button
            className="btn btn-ghost w-full"
            type="button"
            onClick={reenviar}
            disabled={cargando || segundos > 0}
          >
            {segundos > 0 ? `Reenviar código en ${segundos}s` : 'Reenviar código'}
          </button>

          <button className="btn btn-ghost w-full" type="button" onClick={() => { setPaso(1); setError(null); }}>
            Cambiar el correo
          </button>
        </form>
      )}

      {paso === 3 && (
        <form className="auth-form" onSubmit={guardarPassword} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="np">Nueva contraseña</label>
            <div className="form-input-icon">
              <span className="material-symbols-outlined" aria-hidden="true">lock</span>
              <input
                id="np" className="form-input" required autoFocus autoComplete="new-password"
                type={verPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
              />
              <button
                type="button"
                onClick={() => setVerPassword((v) => !v)}
                aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--clr-outline)', display: 'flex' }}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  {verPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>

            {password.length > 0 && (
              <ul className="auth-reglas">
                {REGLAS_PASSWORD.map((r) => {
                  const ok = r.test(password);
                  return (
                    <li key={r.id} className={`auth-regla ${ok ? 'ok' : ''}`}>
                      <span className="material-symbols-outlined" aria-hidden="true">
                        {ok ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      {r.texto}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="np2">Repetir contraseña</label>
            <div className="form-input-icon">
              <span className="material-symbols-outlined" aria-hidden="true">lock_reset</span>
              <input
                id="np2" className="form-input" required autoComplete="new-password"
                type={verPassword ? 'text' : 'password'}
                value={password2}
                onChange={(e) => { setPassword2(e.target.value); setError(null); }}
              />
            </div>
          </div>

          <Error />

          <button className="btn btn-primary btn-lg w-full" type="submit" disabled={cargando}>
            {cargando ? 'Guardando…' : 'Guardar contraseña'}
          </button>
        </form>
      )}

      <div style={{ textAlign: 'center', marginTop: 'var(--sp-lg)', fontSize: '14px', color: 'var(--clr-secondary)' }}>
        <Link to="/login" style={{ color: 'var(--clr-primary)', fontWeight: 600 }}>Volver a iniciar sesión</Link>
      </div>
    </AuthShell>
  );
}
