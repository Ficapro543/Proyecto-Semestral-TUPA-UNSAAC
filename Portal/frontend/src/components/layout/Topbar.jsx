import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, HelpCircle, Search } from 'lucide-react';

export default function Topbar({ title = '' }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="topbar">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {title && (
          <>
            <span className="text-sm font-semibold text-primary whitespace-nowrap">{title}</span>
            <div className="w-px h-7 bg-gray-200" />
          </>
        )}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar tramites, expedientes..."
            className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(user?.role === 'admin' ? '/admin/notifications' : '/student/notifications')}
          className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button
          onClick={() => navigate('/help')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <HelpCircle className="w-5 h-5 text-gray-600" />
        </button>
        <div className="w-px h-7 bg-gray-200 mx-1" />
        <button
          onClick={() => navigate(user?.role === 'admin' ? '/admin/profile' : '/student/profile')}
          className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 transition-colors"
        >
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-sm font-semibold text-gray-800">{user?.firstName} {user?.lastName}</div>
            <div className="text-xs text-gray-500">{user?.role === 'admin' ? 'Administrador' : 'Estudiante'}</div>
          </div>
        </button>
      </div>
    </header>
  );
}
