import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Topbar from './Topbar';
import SharedFooter from './SharedFooter';
import { useAuth, displayName } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user } = useAuth();
  const [sidebarAbierta, setSidebarAbierta] = useState(false);

  return (
    <div className="app-layout">
      <AdminSidebar
        abierta={sidebarAbierta}
        onCerrar={() => setSidebarAbierta(false)}
      />
      <div className="main-content">
        <Topbar
          title="Panel Administrativo"
          userName={displayName(user)}
          userRole={user?.rol_admin === 'SUPER_ADMIN' ? 'Super Administrador' : 'Administrador'}
          profileRoute="/admin"
          notifRoute="/admin/cola"
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
