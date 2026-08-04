import { useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import usePolling from '../../hooks/usePolling';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ abierta = false, onCerrar = () => {} }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Pendientes reales tomados de /admin/stats (antes era el número fijo 12).
  const fetcher = useCallback((opts) => api.getAdminStats(opts), []);
  const { data } = usePolling(fetcher, { intervalMs: 10000 });
  const pendingCount = data?.pendientes ?? 0;

  const cerrarSesion = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const claseLink = ({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`;

  return (
    <aside
      className={`sidebar ${abierta ? 'is-open' : ''}`}
      id="admin-sidebar"
      aria-label="Menú de administración"
      onClick={(e) => {
        if (e.target.closest('a')) onCerrar();
      }}
    >
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
        <NavLink to="/admin" end className={claseLink}>
          <span className="material-symbols-outlined">dashboard</span><span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/cola" className={claseLink}>
          <span className="material-symbols-outlined">pending_actions</span><span>Cola de Pendientes</span>
          {pendingCount > 0 && (
            <span className="badge" aria-label={`${pendingCount} pendientes`}>{pendingCount}</span>
          )}
        </NavLink>
        <NavLink to="/admin/validacion" className={claseLink}>
          <span className="material-symbols-outlined">fact_check</span><span>Validar Documentos</span>
        </NavLink>
        <NavLink to="/admin/procedimientos" className={claseLink}>
          <span className="material-symbols-outlined">manage_search</span><span>Gestión de Trámites</span>
        </NavLink>
        <NavLink to="/admin/usuarios" className={claseLink}>
          <span className="material-symbols-outlined">group</span><span>Usuarios</span>
        </NavLink>
        <NavLink to="/admin/reportes" className={claseLink}>
          <span className="material-symbols-outlined">bar_chart</span><span>Reportes y Estadísticas</span>
        </NavLink>
        <NavLink to="/catalogo" className={claseLink}>
          <span className="material-symbols-outlined">menu_book</span><span>Catálogo TUPA</span>
        </NavLink>
      </nav>

      <span className="sidebar-section-label">Sistema</span>
      <div className="sidebar-footer">
        <button
          className="sidebar-link"
          onClick={cerrarSesion}
          style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: 'rgba(255,255,255,0.45)' }}
        >
          <span className="material-symbols-outlined">logout</span><span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
