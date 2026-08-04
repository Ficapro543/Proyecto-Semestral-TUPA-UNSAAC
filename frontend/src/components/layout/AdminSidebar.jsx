import { NavLink } from 'react-router-dom';

export default function AdminSidebar({ pendingCount = 12 }) {
  return (
    <aside className="sidebar" id="admin-sidebar" aria-label="Menú de administración">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <span className="material-symbols-outlined icon-filled">admin_panel_settings</span>
        </div>
        <div>
          <div className="sidebar-brand-title">TUPA Admin</div>
          <div className="sidebar-brand-subtitle">Portal Administrativo · UNSAAC</div>
        </div>
      </div>

      <span className="sidebar-section-label">Gestión</span>
      <nav className="sidebar-nav">
        <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/cola" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">pending_actions</span>
          <span>Cola de Pendientes</span>
          {pendingCount > 0 && <span className="badge" aria-label={`${pendingCount} pendientes`}>{pendingCount}</span>}
        </NavLink>
        <NavLink to="/admin/validacion" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">fact_check</span>
          <span>Validar Documentos</span>
        </NavLink>
        <NavLink to="/admin/procedimientos" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">manage_search</span>
          <span>Gestión de Trámites</span>
        </NavLink>
        <NavLink to="/admin/usuarios" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">group</span>
          <span>Usuarios</span>
        </NavLink>
        <NavLink to="/admin/reportes" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">bar_chart</span>
          <span>Reportes y Estadísticas</span>
        </NavLink>
        <NavLink to="/catalogo" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">menu_book</span>
          <span>Catálogo TUPA</span>
        </NavLink>
      </nav>

      <span className="sidebar-section-label">Sistema</span>
      <div className="sidebar-footer">
        <button className="sidebar-link" onClick={() => {}} style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
          <span className="material-symbols-outlined">help</span>
          <span>Soporte Técnico</span>
        </button>
        <button className="sidebar-link" onClick={() => {}} style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: 'rgba(255,255,255,0.45)' }}>
          <span className="material-symbols-outlined">logout</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
