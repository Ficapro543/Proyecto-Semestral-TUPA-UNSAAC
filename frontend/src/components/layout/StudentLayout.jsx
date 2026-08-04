import { Outlet } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import Topbar from './Topbar';
import SharedFooter from './SharedFooter';

export default function StudentLayout() {
  return (
    <div className="app-layout">
      <StudentSidebar />
      <div className="main-content">
        <Topbar title="Portal Estudiantil" />
        <div className="page-content">
          <Outlet />
        </div>
        <SharedFooter />
      </div>
    </div>
  );
}
