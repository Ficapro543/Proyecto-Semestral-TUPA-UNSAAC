import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export default function PublicHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Catalogo', path: '/catalog' },
    { label: 'Rastrear', path: '/track' },
    { label: 'Ayuda', path: '/help' },
  ];

  return (
    <header className="public-header">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-xl">account_balance</span>
        </div>
        <span className="text-lg font-bold text-primary font-display">TUPA UNSAAC</span>
      </div>

      <nav className="hidden md:flex items-center h-full gap-1">
        {navItems.map((item) => (
          <a
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`h-full flex items-center px-4 text-sm font-medium transition-colors cursor-pointer border-b-3 ${
              isActive(item.path)
                ? 'text-primary border-primary font-semibold'
                : 'text-gray-600 border-transparent hover:text-primary'
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        {user ? (
          <Button onClick={() => navigate(user.role === 'admin' ? '/admin' : '/student')}>
            Mi Panel
          </Button>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
              Ingresar
            </Button>
            <Button size="sm" className="hidden sm:inline-flex" onClick={() => navigate('/register')}>
              Registrarse
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
