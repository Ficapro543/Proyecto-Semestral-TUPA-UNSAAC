import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth, displayName, rutaPanel } from '../../context/AuthContext';

export default function PublicTopbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { key: 'home',        label: 'Inicio',         route: '/' },
    { key: 'catalogo',    label: 'Catálogo',       route: '/catalogo' },
    { key: 'seguimiento', label: 'Rastrear',       route: '/seguimiento' },
    { key: 'ayuda',       label: 'Ayuda',          route: '/ayuda' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="public-topbar" role="banner">
      <div className="public-topbar-inner">
        <Link to="/" className="public-topbar-brand" style={{ textDecoration: 'none' }}>
          <div className="brand-icon">
            <span className="material-symbols-outlined icon-filled" style={{ color: 'white' }}>account_balance</span>
          </div>
          <span className="brand-name">TUPA UNSAAC</span>
        </Link>
        <nav className="public-topbar-nav hide-mobile" aria-label="Navegación principal">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.route}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated ? (
            <>
              <Link
                to={rutaPanel(user)}
                className="btn btn-primary btn-sm"
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>dashboard</span>
                <span>Mi Panel ({displayName(user)})</span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                title="Cerrar sesión"
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
                <span className="hide-mobile">Salir</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm" style={{ textDecoration: 'none' }}>
                <span className="material-symbols-outlined">login</span>
                Ingresar
              </Link>
              <Link to="/registro" className="btn btn-primary btn-sm hide-mobile" style={{ textDecoration: 'none' }}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
