import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import Topbar from './Topbar';
import SharedFooter from './SharedFooter';
import { useAuth, displayName } from '../../context/AuthContext';

export default function StudentLayout() {
  const { user } = useAuth();
  const [sidebarAbierta, setSidebarAbierta] = useState(false);

  return (
    <div className="app-layout">
      <StudentSidebar
        abierta={sidebarAbierta}
        onCerrar={() => setSidebarAbierta(false)}
      />
      <div className="main-content">
        <Topbar
          title="Portal Estudiantil"
          userName={displayName(user)}
          userRole={user?.nombre_especialidad || 'Estudiante'}
        />
        <div className="page-content">
          <Outlet />
        </div>
        <SharedFooter />
      </div>

      <div
        className={`sidebar-backdrop ${sidebarAbierta ? 'is-open' : ''}`}
        onClick={() => setSidebarAbierta(false)}
        aria-hidden="true"
      />
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarAbierta((v) => !v)}
        aria-label={sidebarAbierta ? 'Cerrar menú' : 'Abrir menú'}
      >
        <span className="material-symbols-outlined">{sidebarAbierta ? 'close' : 'menu'}</span>
      </button>
    </div>
  );
}
