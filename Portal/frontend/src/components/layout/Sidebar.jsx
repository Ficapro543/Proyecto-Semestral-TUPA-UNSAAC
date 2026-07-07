import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Search,
  Bell,
  User,
  BookOpen,
  LogOut,
  Plus,
  HelpCircle,
  Settings,
} from 'lucide-react';

export default function Sidebar({ type = 'student' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const studentLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student' },
    { icon: BookOpen, label: 'Catalogo TUPA', path: '/catalog' },
    { icon: FileText, label: 'Mis Tramites', path: '/student/procedures' },
    { icon: Search, label: 'Rastrear Tramite', path: '/student/track' },
    { icon: Bell, label: 'Notificaciones', path: '/student/notifications' },
  ];

  const adminLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: FileText, label: 'Gestion de Tramites', path: '/admin/procedures' },
    { icon: User, label: 'Usuarios', path: '/admin/users' },
    { icon: BookOpen, label: 'Catalogo TUPA', path: '/catalog' },
  ];

  const links = type === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-primary">account_balance</span>
        </div>
        <div>
          <div className="font-bold text-white">TUPA {type === 'admin' ? 'Admin' : 'Student'}</div>
          <div className="text-xs text-white/60">Portal {type === 'admin' ? 'Administrativo' : 'Estudiantil'}</div>
        </div>
      </div>

      {type === 'student' && (
        <button
          onClick={() => navigate('/catalog')}
          className="mx-4 mt-4 py-2.5 bg-tertiary text-primary rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Nuevo Tramite
        </button>
      )}

      <nav className="flex-1 px-3 mt-4">
        <div className="text-xs font-semibold text-white/40 uppercase tracking-wider px-4 mb-2">
          Principal
        </div>
        {links.map((link) => (
          <a
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`sidebar-link ${isActive(link.path) ? 'active' : ''}`}
          >
            <link.icon className="w-5 h-5" />
            <span>{link.label}</span>
          </a>
        ))}
      </nav>

      <div className="px-3 pb-4 border-t border-white/10 pt-4">
        <div className="text-xs font-semibold text-white/40 uppercase tracking-wider px-4 mb-2">
          Cuenta
        </div>
        <a
          onClick={() => navigate(type === 'admin' ? '/admin/profile' : '/student/profile')}
          className="sidebar-link"
        >
          <User className="w-5 h-5" />
          <span>Mi Perfil</span>
        </a>
        <a
          onClick={() => navigate('/help')}
          className="sidebar-link"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Centro de Ayuda</span>
        </a>
        <a
          onClick={() => { logout(); navigate('/login'); }}
          className="sidebar-link text-white/40 hover:text-red-400"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesion</span>
        </a>
      </div>
    </aside>
  );
}
