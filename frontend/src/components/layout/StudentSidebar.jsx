import { NavLink } from 'react-router-dom';

export default function StudentSidebar({ activeRoute = '', userName = 'Estudiante', userRole = 'Pregrado', notifCount = 2 }) {
  return (
    <aside className="sidebar" id="student-sidebar" aria-label="Menú de navegación estudiantil">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <span className="material-symbols-outlined icon-filled">account_balance</span>
        </div>
        <div>
          <div className="sidebar-brand-title">TUPA Student</div>
          <div className="sidebar-brand-subtitle">Portal Estudiantil · UNSAAC</div>
        </div>
      </div>

      <NavLink to="/tramite/nuevo" className="sidebar-new-btn" aria-label="Iniciar nuevo trámite">
        <span className="material-symbols-outlined icon-sm">add</span>
        Nuevo Trámite
      </NavLink>

      <span className="sidebar-section-label">Principal</span>
      <nav className="sidebar-nav">
        <NavLink to="/estudiante" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/catalogo" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">menu_book</span>
          <span>Catálogo TUPA</span>
        </NavLink>
        <NavLink to="/estudiante/tramites" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">description</span>
          <span>Mis Trámites</span>
        </NavLink>
        <NavLink to="/estudiante/solicitudes" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">assignment</span>
          <span>Mis Solicitudes</span>
        </NavLink>
        <NavLink to="/seguimiento" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">location_searching</span>
          <span>Rastrear Trámite</span>
        </NavLink>
        <NavLink to="/estudiante/notificaciones" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">notifications</span>
          <span>Notificaciones</span>
          {notifCount > 0 && <span className="badge" aria-label={`${notifCount} notificaciones`}>{notifCount}</span>}
        </NavLink>
      </nav>

      <span className="sidebar-section-label">Cuenta</span>
      <div className="sidebar-footer">
        <NavLink to="/estudiante/perfil" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">person</span>
          <span>Mi Perfil</span>
        </NavLink>
        <button className="sidebar-link" onClick={() => {}} style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
          <span className="material-symbols-outlined">help</span>
          <span>Centro de Ayuda</span>
        </button>
        <button className="sidebar-link" onClick={() => {}} style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: 'rgba(255,255,255,0.45)' }}>
          <span className="material-symbols-outlined">logout</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
