import { Link } from 'react-router-dom';

export default function Topbar({ 
  title = '', 
  userName = 'Usuario', 
  userRole = 'Rol', 
  notifCount = 0,
  profileRoute = '/estudiante/perfil',
  notifRoute = '/estudiante/notificaciones'
}) {
  return (
    <header className="topbar" role="banner">
      <div className="topbar-left">
        {title && (
          <>
            <span className="topbar-title">{title}</span>
            <div className="topbar-divider"></div>
          </>
        )}
        <div className="topbar-search">
          <span className="material-symbols-outlined">search</span>
          <input type="text" placeholder="Buscar trámites, expedientes..." aria-label="Buscar" autoComplete="off" />
        </div>
      </div>
      <div className="topbar-right">
        <Link to={notifRoute} className="topbar-icon-btn" aria-label="Notificaciones" title="Notificaciones">
          <span className="material-symbols-outlined">notifications</span>
          {notifCount > 0 && <span className="dot" aria-hidden="true"></span>}
        </Link>
        <button className="topbar-icon-btn" aria-label="Ayuda" title="Ayuda">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
        <div className="topbar-divider"></div>
        <Link to={profileRoute} className="topbar-user" role="button" tabIndex="0" aria-label="Perfil de usuario" style={{ textDecoration: 'none' }}>
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdNZNqAGjEbbysJ3e6HQEaBbCWNr3cllurvNCfzTbxvmULXt7YBDEyj4adVi7enfpjQk_ovZgmIe4MdhfGH4KI8keorAumFafeMuQjGph706x3H_cowOaC6gcNFGh5AK4LQJwm2iWLosh09vqmJjx3PlhDOMiUm1CRSjpNLmptH_DO6H4NVjT5GvaAzii5phVRCdb4PPd5QCurWbRvWwnYd1f5JqdDeYwwRA2rgSxliqrQB12hFQ2V5OD-C1Zr-YXFPk093ib_vV0"
            alt={`Foto de perfil de ${userName}`} 
          />
          <div className="topbar-user-info hide-mobile">
            <div className="topbar-user-name">{userName}</div>
            <div className="topbar-user-role">{userRole}</div>
          </div>
        </Link>
      </div>
    </header>
  );
}
