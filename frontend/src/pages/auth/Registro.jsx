import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { REGLAS_PASSWORD, passwordCumple } from '../../context/AuthContext';
import AuthShell from './AuthShell';

const VACIO = {
  nombres: '',
  ap_paterno: '',
  ap_materno: '',
  dni: '',
  codigo_universitario: '',
  email_institucional: '',
  telefono: '',
  cod_especialidad: '',
  password: '',
  password2: '',
};

export default function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState(VACIO);
  const [especialidades, setEspecialidades] = useState([]);
  const [verPassword, setVerPassword] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [listo, setListo] = useState(null);

  // Las especialidades salen del catálogo real para no inventar una lista fija.
  useEffect(() => {
    let cancelado = false;
    api
      .getCategories()
      .catch(() => null)
      .then(() => {
        if (!cancelado) setEspecialidades([]);
      });
    return () => { cancelado = true; };
  }, []);

  const set = (campo) => (e) => {
    setForm((f) => ({ ...f, [campo]: e.target.value }));
    setError(null);
  };

  const passwordOk = passwordCumple(form.password);
  const coinciden = form.password.length > 0 && form.password === form.password2;

  const enviar = async (e) => {
    e.preventDefault();
    setError(null);

    if (!passwordOk) return setError('La contraseña no cumple todos los requisitos.');
    if (!coinciden) return setError('Las contraseñas no coinciden.');

    setEnviando(true);
    try {
      const { password2, cod_especialidad, ...resto } = form;
      await api.register({
        ...resto,
        cod_especialidad: cod_especialidad || undefined,
      });
      setListo(form.email_institucional);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  // ── Pantalla de confirmación ──────────────────────────────
  if (listo) {
    return (
      <AuthShell
        icono="mark_email_read"
        titulo="Revisa tu correo"
        subtitulo={`Enviamos un enlace de activación a ${listo}`}
      >
        <div className="alert alert-success" role="status">
          <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
          <div>
            Tu cuenta fue creada. Ábre el enlace del correo para activarla y poder iniciar sesión.
          </div>
        </div>

        <div className="alert alert-info" style={{ marginTop: 'var(--sp-md)' }}>
          <span className="material-symbols-outlined" aria-hidden="true">info</span>
          <div>
            ¿No te llegó? Revisa la carpeta de spam. El enlace vence en 24 horas.
          </div>
        </div>

        <button
          className="btn btn-outline w-full"
          style={{ marginTop: 'var(--sp-md)' }}
          onClick={async () => {
            try {
              await api.reenviarActivacion(listo);
              setError(null);
            } catch (err) {
              setError(err.message);
            }
          }}
        >
          <span className="material-symbols-outlined" aria-hidden="true">forward_to_inbox</span>
          Reenviar correo de activación
        </button>

        <button
          className="btn btn-primary w-full"
          style={{ marginTop: 'var(--sp-sm)' }}
          onClick={() => navigate('/login')}
        >
          Ir a iniciar sesión
        </button>
      </AuthShell>
    );
  }

  // ── Formulario ────────────────────────────────────────────
  return (
    <AuthShell
      icono="person_add"
      titulo="Crear cuenta"
      subtitulo="Regístrate con tu correo institucional para presentar trámites en línea"
      ancho="540px"
    >
      <form className="auth-form" onSubmit={enviar} noValidate>
        <div className="auth-row">
          <div className="form-group">
            <label className="form-label" htmlFor="nombres">Nombres *</label>
            <input id="nombres" className="form-input" value={form.nombres} onChange={set('nombres')} required autoComplete="given-name" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="ap_paterno">Apellido paterno *</label>
            <input id="ap_paterno" className="form-input" value={form.ap_paterno} onChange={set('ap_paterno')} required autoComplete="family-name" />
          </div>
        </div>

        <div className="auth-row">
          <div className="form-group">
            <label className="form-label" htmlFor="ap_materno">Apellido materno</label>
            <input id="ap_materno" className="form-input" value={form.ap_materno} onChange={set('ap_materno')} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="dni">DNI *</label>
            <input
              id="dni" className="form-input" inputMode="numeric" maxLength={8}
              value={form.dni}
              onChange={(e) => setForm((f) => ({ ...f, dni: e.target.value.replace(/\D/g, '') }))}
              required
            />
          </div>
        </div>

        <div className="auth-row">
          <div className="form-group">
            <label className="form-label" htmlFor="codigo">Código universitario</label>
            <input id="codigo" className="form-input" value={form.codigo_universitario} onChange={set('codigo_universitario')} placeholder="20201234" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="telefono">Teléfono</label>
            <input id="telefono" className="form-input" type="tel" value={form.telefono} onChange={set('telefono')} placeholder="984000000" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">Correo institucional *</label>
          <div className="form-input-icon">
            <span className="material-symbols-outlined" aria-hidden="true">mail</span>
            <input
              id="email" className="form-input" type="email" required autoComplete="email"
              value={form.email_institucional} onChange={set('email_institucional')}
              placeholder="nombre.apellido@unsaac.edu.pe"
            />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--clr-secondary)', marginTop: '4px' }}>
            Debe terminar en <strong>@unsaac.edu.pe</strong>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Contraseña *</label>
          <div className="form-input-icon">
            <span className="material-symbols-outlined" aria-hidden="true">lock</span>
            <input
              id="password" className="form-input" required autoComplete="new-password"
              type={verPassword ? 'text' : 'password'}
              value={form.password} onChange={set('password')}
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

          {form.password.length > 0 && (
            <ul className="auth-reglas">
              {REGLAS_PASSWORD.map((r) => {
                const ok = r.test(form.password);
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
          <label className="form-label" htmlFor="password2">Repetir contraseña *</label>
          <div className="form-input-icon">
            <span className="material-symbols-outlined" aria-hidden="true">lock_reset</span>
            <input
              id="password2" className="form-input" required autoComplete="new-password"
              type={verPassword ? 'text' : 'password'}
              value={form.password2} onChange={set('password2')}
            />
          </div>
          {form.password2.length > 0 && !coinciden && (
            <div style={{ fontSize: '12px', color: 'var(--clr-error)', marginTop: '4px' }}>
              Las contraseñas no coinciden
            </div>
          )}
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            <span className="material-symbols-outlined" aria-hidden="true">error</span>
            <div>{error}</div>
          </div>
        )}

        <button className="btn btn-primary btn-lg w-full" type="submit" disabled={enviando}>
          {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
          {!enviando && <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 'var(--sp-lg)', fontSize: '14px', color: 'var(--clr-secondary)' }}>
        ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--clr-primary)', fontWeight: 600 }}>Inicia sesión</Link>
      </div>
    </AuthShell>
  );
}
