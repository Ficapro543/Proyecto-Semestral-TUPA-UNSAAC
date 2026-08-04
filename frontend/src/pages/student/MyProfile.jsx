import { useState, useEffect, useRef } from 'react';
import api, { API_ORIGIN } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Loading, ErrorState } from '../../components/ui/AsyncState';
import { nombreCompleto } from '../../lib/estados';
import './MyProfile.css';

/**
 * Perfil del estudiante. Sólo son editables los datos de contacto: los
 * identificadores académicos (DNI, código, correo institucional) los
 * administra la universidad y el backend los ignora en el update.
 */
const CAMPOS_EDITABLES = ['telefono', 'email_personal'];

export default function MyProfile() {
  const { actualizarUsuario } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState({ telefono: '', email_personal: '' });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [subiendoAvatar, setSubiendoAvatar] = useState(false);
  const [errorAvatar, setErrorAvatar] = useState(null);
  const inputAvatarRef = useRef(null);

  const cargar = async () => {
    setCargando(true);
    try {
      const data = await api.getProfile();
      setPerfil(data);
      setForm({
        telefono: data.telefono || '',
        email_personal: data.email_personal || '',
      });
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);
    setError(null);

    try {
      const payload = {};
      for (const campo of CAMPOS_EDITABLES) payload[campo] = form[campo];
      const res = await api.updateProfile(payload);
      setPerfil((p) => ({ ...p, ...res.user }));
      setMensaje('Perfil actualizado correctamente.');
    } catch (err) {
      setError(err);
    } finally {
      setGuardando(false);
    }
  };

  const subirAvatar = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setSubiendoAvatar(true);
    setErrorAvatar(null);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await api.uploadAvatar(formData);
      setPerfil((p) => ({ ...p, avatar_url: res.avatar_url }));
      actualizarUsuario({ avatar_url: res.avatar_url });
    } catch (err) {
      setErrorAvatar(err);
    } finally {
      setSubiendoAvatar(false);
    }
  };

  if (cargando) return <Loading label="Cargando perfil…" />;
  if (error && !perfil) return <ErrorState error={error} onRetry={cargar} />;

  const iniciales = [perfil?.nombres, perfil?.ap_paterno]
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-lg)', marginBottom: 'var(--sp-xl)', flexWrap: 'wrap' }}>
        <div className="avatar-ring" style={{ backgroundImage: perfil?.avatar_url ? `url(${API_ORIGIN}${perfil.avatar_url})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          {!perfil?.avatar_url && iniciales}
          <button
            type="button"
            className="avatar-edit"
            aria-label="Cambiar foto de perfil"
            onClick={() => inputAvatarRef.current?.click()}
            disabled={subiendoAvatar}
            style={{ border: 'none' }}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              {subiendoAvatar ? 'hourglass_empty' : 'photo_camera'}
            </span>
          </button>
          <input
            ref={inputAvatarRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={subirAvatar}
            style={{ display: 'none' }}
          />
        </div>
        <div>
          <h1 className="text-display-md" style={{ color: 'var(--clr-primary)' }}>Mi Perfil</h1>
          <p className="text-body-md" style={{ color: 'var(--clr-secondary)', marginTop: '4px' }}>
            Datos de tu cuenta institucional
          </p>
          {errorAvatar && (
            <p style={{ color: 'var(--clr-error)', fontSize: '13px', marginTop: '4px' }}>{errorAvatar.message}</p>
          )}
        </div>
      </div>

      <div className="detail-grid">
        <div className="card" style={{ minWidth: 0 }}>
          <div className="card-header"><span className="card-header-title">Datos institucionales</span></div>
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--sp-lg)', fontSize: '14px' }}>
            <Campo label="Nombre completo" valor={nombreCompleto(perfil)} />
            <Campo label="DNI" valor={perfil?.dni} mono />
            <Campo label="Código universitario" valor={perfil?.codigo_universitario} mono />
            <Campo label="Correo institucional" valor={perfil?.email_institucional} />
            <Campo label="Especialidad" valor={perfil?.nombre_especialidad} />
            <Campo label="Facultad" valor={perfil?.facultad} />
            <Campo label="Semestre" valor={perfil?.semestre_actual} />
          </div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            <div className="alert alert-info">
              <span className="material-symbols-outlined" aria-hidden="true">info</span>
              <div>
                Estos datos los administra la universidad. Si hay un error, comunícate con
                Registros Académicos.
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ minWidth: 0 }}>
          <div className="card-header"><span className="card-header-title">Datos de contacto</span></div>
          <form className="card-body" onSubmit={guardar} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="telefono">Teléfono</label>
              <input
                id="telefono" className="form-input" type="tel"
                value={form.telefono}
                onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                placeholder="984000000"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email_personal">Correo personal</label>
              <input
                id="email_personal" className="form-input" type="email"
                value={form.email_personal}
                onChange={(e) => setForm((f) => ({ ...f, email_personal: e.target.value }))}
                placeholder="tucorreo@gmail.com"
              />
            </div>

            {mensaje && (
              <div className="alert alert-success" role="status">
                <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
                <div>{mensaje}</div>
              </div>
            )}
            {error && (
              <div className="alert alert-error" role="alert">
                <span className="material-symbols-outlined" aria-hidden="true">error</span>
                <div>{error.message}</div>
              </div>
            )}

            <button className="btn btn-primary" type="submit" disabled={guardando}>
              {guardando ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

function Campo({ label, valor, mono = false }) {
  return (
    <div>
      <div className="detail-label">{label}</div>
      <div className={mono ? 'text-mono-sm' : ''} style={{ fontWeight: 600 }}>{valor || '—'}</div>
    </div>
  );
}
