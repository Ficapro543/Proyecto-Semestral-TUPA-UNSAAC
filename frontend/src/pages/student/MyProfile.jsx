import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyProfile.css';

export default function MyProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('datos');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <nav className="breadcrumb" aria-label="Ruta de navegación"></nav>
      <h1 className="text-display-md" style={{ color: 'var(--clr-primary)', marginBottom: 'var(--sp-xl)' }}>Mi Perfil</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 'var(--sp-xl)' }}>
        
        {/* Left: Avatar card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)' }}>
          <div className="card animate-on-load">
            <div className="card-body" style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 'var(--sp-lg)' }}>
                <div className="avatar-ring">ER</div>
                <div className="avatar-edit">
                  <span className="material-symbols-outlined">photo_camera</span>
                </div>
              </div>
              <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '20px', fontWeight: 700, color: 'var(--clr-primary)' }}>Elena Rodríguez</div>
              <div style={{ fontSize: '13px', color: 'var(--clr-secondary)', marginTop: '4px' }}>Estudiante de Ingeniería Informática</div>
              <div style={{ marginTop: 'var(--sp-md)' }}>
                <span className="badge badge-success">Cuenta verificada</span>
              </div>
            </div>
          </div>

          <div className="card animate-on-load stagger-1">
            <div className="card-header"><span className="card-header-title">Estadísticas</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>Trámites iniciados</span>
                <span style={{ fontWeight: 700, color: 'var(--clr-primary)' }}>18</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>Trámites aprobados</span>
                <span style={{ fontWeight: 700, color: '#065f46' }}>15</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>En proceso</span>
                <span style={{ fontWeight: 700, color: 'var(--clr-primary)' }}>2</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>Miembro desde</span>
                <span style={{ fontWeight: 600 }}>Mar 2019</span>
              </div>
            </div>
          </div>

          <button className="btn btn-error" onClick={() => navigate('/login')}>
            <span className="material-symbols-outlined">logout</span>
            Cerrar sesión
          </button>
        </div>

        {/* Right: Tabs */}
        <div>
          <div className="tabs" style={{ marginBottom: 'var(--sp-xl)' }}>
            <div className={`tab-item ${activeTab === 'datos' ? 'active' : ''}`} onClick={() => setActiveTab('datos')}>Datos Personales</div>
            <div className={`tab-item ${activeTab === 'seguridad' ? 'active' : ''}`} onClick={() => setActiveTab('seguridad')}>Seguridad</div>
            <div className={`tab-item ${activeTab === 'notif' ? 'active' : ''}`} onClick={() => setActiveTab('notif')}>Notificaciones</div>
          </div>

          {/* Datos personales */}
          {activeTab === 'datos' && (
            <div className="card animate-on-load">
              <div className="card-header">
                <span className="card-header-title">Información Personal</span>
                <button className="btn btn-outline btn-sm" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? (
                    <><span className="material-symbols-outlined">close</span> Cancelar</>
                  ) : (
                    <><span className="material-symbols-outlined">edit</span> Editar</>
                  )}
                </button>
              </div>
              
              {!isEditing ? (
                <div className="card-body">
                  <div className="info-row"><div className="info-label">Nombres completos</div><div className="info-value">Elena María</div></div>
                  <div className="info-row"><div className="info-label">Apellidos</div><div className="info-value">Rodríguez Quispe</div></div>
                  <div className="info-row"><div className="info-label">CUI / DNI</div><div className="info-value"><span className="text-mono-sm">73456891</span></div></div>
                  <div className="info-row"><div className="info-label">Código UNSAAC</div><div className="info-value"><span className="text-mono-sm">201900456</span></div></div>
                  <div className="info-row"><div className="info-label">Facultad</div><div className="info-value">Ing. Eléctrica, Electrónica, Informática y Mecánica</div></div>
                  <div className="info-row"><div className="info-label">Especialidad</div><div className="info-value">Ingeniería Informática y de Sistemas</div></div>
                  <div className="info-row"><div className="info-label">Semestre</div><div className="info-value">X Semestre (2024-II)</div></div>
                  <div className="info-row"><div className="info-label">Correo institucional</div><div className="info-value">e.rodriguez@unsaac.edu.pe</div></div>
                  <div className="info-row"><div className="info-label">Correo personal</div><div className="info-value">elena.rodriguez@gmail.com</div></div>
                  <div className="info-row"><div className="info-label">Teléfono</div><div className="info-value">+51 984 123 456</div></div>
                </div>
              ) : (
                <div className="card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-md)', marginBottom: 'var(--sp-md)' }}>
                    <div className="form-group"><label className="form-label" htmlFor="f-nombres">Nombres</label><input className="form-input" id="f-nombres" defaultValue="Elena María" /></div>
                    <div className="form-group"><label className="form-label" htmlFor="f-apellidos">Apellidos</label><input className="form-input" id="f-apellidos" defaultValue="Rodríguez Quispe" /></div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 'var(--sp-md)' }}><label className="form-label" htmlFor="f-email">Correo personal</label><input className="form-input" id="f-email" type="email" defaultValue="elena.rodriguez@gmail.com" /></div>
                  <div className="form-group" style={{ marginBottom: 'var(--sp-md)' }}><label className="form-label" htmlFor="f-phone">Teléfono</label><input className="form-input" id="f-phone" type="tel" defaultValue="+51 984 123 456" /></div>
                  <div style={{ display: 'flex', gap: 'var(--sp-md)' }}>
                    <button className="btn btn-primary" onClick={() => setIsEditing(false)}>
                      <span className="material-symbols-outlined">save</span> Guardar cambios
                    </button>
                    <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>Cancelar</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Seguridad */}
          {activeTab === 'seguridad' && (
            <div className="card animate-on-load">
              <div className="card-header"><span className="card-header-title">Cambiar contraseña</span></div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-md)' }}>
                  <div className="form-group">
                    <label className="form-label required" htmlFor="pass-actual">Contraseña actual</label>
                    <input className="form-input" type="password" id="pass-actual" placeholder="••••••••" />
                  </div>
                  <div className="form-group">
                    <label className="form-label required" htmlFor="pass-nueva">Nueva contraseña</label>
                    <input className="form-input" type="password" id="pass-nueva" placeholder="Mínimo 8 caracteres" />
                  </div>
                  <div className="form-group">
                    <label className="form-label required" htmlFor="pass-confirm">Confirmar nueva contraseña</label>
                    <input className="form-input" type="password" id="pass-confirm" placeholder="Repite la nueva contraseña" />
                  </div>
                  <button className="btn btn-primary">
                    <span className="material-symbols-outlined">lock_reset</span>
                    Cambiar contraseña
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notificaciones config */}
          {activeTab === 'notif' && (
            <div className="card animate-on-load">
              <div className="card-header"><span className="card-header-title">Preferencias de notificación</span></div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--sp-md) 0', borderBottom: '1px solid var(--clr-outline-variant)' }}>
                  <div><div style={{ fontWeight: 600 }}>Notificaciones por correo</div><div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>Recibe alertas de tus trámites en tu correo</div></div>
                  <label className="toggle-switch"><input type="checkbox" defaultChecked /><span className="toggle-slider"></span></label>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--sp-md) 0', borderBottom: '1px solid var(--clr-outline-variant)' }}>
                  <div><div style={{ fontWeight: 600 }}>Recordatorios de plazo</div><div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>Alertas cuando un plazo está próximo a vencer</div></div>
                  <label className="toggle-switch"><input type="checkbox" defaultChecked /><span className="toggle-slider"></span></label>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--sp-md) 0' }}>
                  <div><div style={{ fontWeight: 600 }}>Notificaciones de pagos</div><div style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>Confirmaciones de pagos realizados</div></div>
                  <label className="toggle-switch"><input type="checkbox" defaultChecked /><span className="toggle-slider"></span></label>
                </div>
                <button className="btn btn-primary">
                  <span className="material-symbols-outlined">save</span> Guardar preferencias
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
