import { useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import usePolling from '../../hooks/usePolling';
import { useAuth } from '../../context/AuthContext';

export default function StudentSidebar({ abierta = false, onCerrar = () => {} }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Contador real de notificaciones no leídas (antes era el número fijo 2).
  const fetcher = useCallback((opts) => api.getNotifications(opts), []);
  const { data } = usePolling(fetcher, { intervalMs: 10000 });
  const notifCount = data?.unread_count ?? 0;

  const cerrarSesion = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const claseLink = ({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`;

  return (
    <aside
      className={`sidebar ${abierta ? 'is-open' : ''}`}
      id="student-sidebar"
      aria-label="Menú de navegación estudiantil"
      onClick={(e) => {
        // En móvil el panel se superpone: al elegir una opción se cierra solo.
        if (e.target.closest('a')) onCerrar();
      }}
    >
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <span className="material-symbols-outlined icon-filled">account_balance</span>
        </div>
        <div>
          <div className="sidebar-brand-title">TUPA Student</div>
          <div className="sidebar-brand-subtitle">Portal Estudiantil · UNSAAC</div>
        </div>
      </div>

      <NavLink to="/tramite/paso1" className="sidebar-new-btn" aria-label="Iniciar nuevo trámite">
        <span className="material-symbols-outlined icon-sm">add</span>
        Nuevo Trámite
      </NavLink>

      <span className="sidebar-section-label">Principal</span>
      <nav className="sidebar-nav">
        <NavLink to="/estudiante" end className={claseLink}>
          <span className="material-symbols-outlined">dashboard</span><span>Dashboard</span>
        </NavLink>
        <NavLink to="/catalogo" className={claseLink}>
          <span className="material-symbols-outlined">menu_book</span><span>Catálogo TUPA</span>
        </NavLink>
        <NavLink to="/estudiante/tramites" className={claseLink}>
          <span className="material-symbols-outlined">description</span><span>Mis Trámites</span>
        </NavLink>
        <NavLink to="/estudiante/solicitudes" className={claseLink}>
          <span className="material-symbols-outlined">assignment</span><span>Mis Solicitudes</span>
        </NavLink>
        <NavLink to="/seguimiento" className={claseLink}>
          <span className="material-symbols-outlined">location_searching</span><span>Rastrear Trámite</span>
        </NavLink>
        <NavLink to="/estudiante/notificaciones" className={claseLink}>
          <span className="material-symbols-outlined">notifications</span><span>Notificaciones</span>
          {notifCount > 0 && (
            <span className="badge" aria-label={`${notifCount} notificaciones sin leer`}>{notifCount}</span>
          )}
        </NavLink>
      </nav>

      <span className="sidebar-section-label">Cuenta</span>
      <div className="sidebar-footer">
        <NavLink to="/estudiante/perfil" className={claseLink}>
          <span className="material-symbols-outlined">person</span><span>Mi Perfil</span>
        </NavLink>
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
