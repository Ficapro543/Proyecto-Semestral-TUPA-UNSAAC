import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Topbar from './Topbar';
import SharedFooter from './SharedFooter';

export default function AdminLayout() {
  return (
    <div className="app-layout">
      <AdminSidebar />
      <div className="main-content">
        <Topbar 
          title="Panel Administrativo" 
          userName="Alex Rivera" 
          userRole="Administrador"
          profileRoute="/admin"
          notifRoute="/admin/cola"
        />
        <div className="page-content">
          <Outlet />
        </div>
        <SharedFooter />
      </div>
    </div>
  );
}
