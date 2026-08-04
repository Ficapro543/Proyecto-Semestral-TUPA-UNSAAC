import { NavLink, Link } from 'react-router-dom';

export default function PublicTopbar() {
  const navItems = [
    { key: 'home',        label: 'Inicio',         route: '/' },
    { key: 'catalogo',    label: 'Catálogo',       route: '/catalogo' },
    { key: 'seguimiento', label: 'Rastrear',       route: '/seguimiento' },
    { key: 'ayuda',       label: 'Ayuda',          route: '/ayuda' },
  ];

  return (
    <header className="public-topbar" role="banner">
      <div className="public-topbar-inner">
        <Link to="/" className="public-topbar-brand" style={{textDecoration: 'none'}}>
          <div className="brand-icon">
            <span className="material-symbols-outlined icon-filled" style={{color: 'white'}}>account_balance</span>
          </div>
          <span className="brand-name">TUPA UNSAAC</span>
        </Link>
        <nav className="public-topbar-nav hide-mobile" aria-label="Navegación principal">
          {navItems.map(item => (
            <NavLink 
              key={item.key}
              to={item.route}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Link to="/login" className="btn btn-outline btn-sm" style={{textDecoration: 'none'}}>
            <span className="material-symbols-outlined">login</span>
            Ingresar
          </Link>
          <button className="btn btn-primary btn-sm hide-mobile">
            Registrarse
          </button>
        </div>
      </div>
    </header>
  );
}
