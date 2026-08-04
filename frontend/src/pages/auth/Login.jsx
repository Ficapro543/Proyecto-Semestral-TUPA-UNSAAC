import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const ROLE_MAP = {
  estudiante: 'USER',
  admin: 'ADMIN',
};

export default function Login() {
  const [selectedRole, setSelectedRole] = useState('estudiante');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();

  // Si ya está autenticado, redirigir al panel correcto
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'ADMIN' ? '/admin' : '/estudiante', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const selectRole = (role) => {
    setSelectedRole(role);
    setError(null);
  };

  // Efecto Parallax para los orbes del panel izquierdo
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      document.querySelectorAll('.login-left-orb').forEach(orb => {
        orb.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
      });
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { user } = await login(identifier, password, ROLE_MAP[selectedRole]);
      const from = location.state?.from;
      navigate(from || (user.role === 'ADMIN' ? '/admin' : '/estudiante'), { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      {/* ── LEFT PANEL ─────────────────────────────────────── */}
      <div className="login-left" aria-hidden="true">
        <div className="login-left-orb" style={{ top: '-120px', right: '-120px', width: '400px', height: '400px', background: 'rgba(255,255,255,1)' }}></div>
        <div className="login-left-orb" style={{ bottom: '-80px', left: '-80px', width: '280px', height: '280px', background: 'rgba(137,245,231,1)' }}></div>

        <div className="login-left-brand">
          <div className="brand-logo">
            <span className="material-symbols-outlined icon-filled">account_balance</span>
          </div>
          <div>
            <div className="brand-text-title">TUPA UNSAAC</div>
            <div className="brand-text-sub">Portal Administrativo Digital</div>
          </div>
        </div>

        <div className="login-left-content">
          <h2>Gestiona tus trámites universitarios en un solo lugar</h2>
          <p>Accede al catálogo completo de procedimientos, rastrea el estado de tus expedientes y recibe notificaciones en tiempo real.</p>
          <div className="login-features">
            <div className="login-feature">
              <div className="login-feature-icon"><span className="material-symbols-outlined">bolt</span></div>
              <div className="login-feature-text">
                <div className="label">Trámites 100% Digitales</div>
                <div className="sublabel">Sin colas, sin papel, sin esperas</div>
              </div>
            </div>
            <div className="login-feature">
              <div className="login-feature-icon"><span className="material-symbols-outlined">timeline</span></div>
              <div className="login-feature-text">
                <div className="label">Seguimiento en Tiempo Real</div>
                <div className="sublabel">Estado actualizado de cada expediente</div>
              </div>
            </div>
            <div className="login-feature">
              <div className="login-feature-icon"><span className="material-symbols-outlined">verified_user</span></div>
              <div className="login-feature-text">
                <div className="label">Acceso Seguro e Institucional</div>
                <div className="sublabel">Cifrado SSL y autenticación UNSAAC</div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-left-footer">
          <div className="left-footer-stat">
            <div className="num">103+</div>
            <div className="lbl">Procedimientos</div>
          </div>
          <div className="left-footer-stat">
            <div className="num">24/7</div>
            <div className="lbl">Disponibilidad</div>
          </div>
          <div className="left-footer-stat">
            <div className="num">15K+</div>
            <div className="lbl">Usuarios</div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (FORM) ─────────────────────────────── */}
      <div className="login-right">
        <div className="login-card animate-slide-up">

          <div className="login-card-header">
            <div className="login-card-icon">
              <span className="material-symbols-outlined icon-filled">account_balance</span>
            </div>
            <h1>TUPA Central</h1>
            <p>Gestión de Procedimientos Administrativos · UNSAAC</p>
          </div>

          <p className="text-label-sm" style={{ color: 'var(--clr-secondary)', marginBottom: 'var(--sp-sm)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tipo de acceso</p>
          <div className="role-selector" role="group" aria-label="Seleccionar tipo de usuario">
            <div
              className={`role-btn ${selectedRole === 'estudiante' ? 'selected' : ''}`}
              onClick={() => selectRole('estudiante')}
              role="radio" aria-checked={selectedRole === 'estudiante'} tabIndex={0}
            >
              <span className="material-symbols-outlined icon-filled">school</span>
              <span className="role-label">Estudiante</span>
              <span className="role-desc">Pregrado / Posgrado</span>
            </div>
            <div
              className={`role-btn ${selectedRole === 'admin' ? 'selected' : ''}`}
              onClick={() => selectRole('admin')}
              role="radio" aria-checked={selectedRole === 'admin'} tabIndex={0}
            >
              <span className="material-symbols-outlined icon-filled">admin_panel_settings</span>
              <span className="role-label">Administrativo</span>
              <span className="role-desc">Personal UNSAAC</span>
            </div>
          </div>

          <form className="login-form" onSubmit={handleLogin} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="username">
                {selectedRole === 'admin' ? 'Correo institucional o código de trabajador' : 'Correo institucional o CUI'}
              </label>
              <div className="form-input-icon">
                <span className="material-symbols-outlined">person</span>
                <input
                  className="form-input" type="text" id="username" name="username"
                  placeholder={selectedRole === 'admin' ? 'ej. admin@unsaac.edu.pe' : 'ej. nombre.apellido@unsaac.edu.pe'}
                  autoComplete="username" required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="password">Contraseña</label>
                <Link to="/recuperar-password" style={{ fontSize: '12px', color: 'var(--clr-primary)', fontWeight: 600, textDecoration: 'none' }}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="form-input-icon">
                <span className="material-symbols-outlined">lock</span>
                <input
                  className="form-input" type="password" id="password" name="password"
                  placeholder="••••••••" autoComplete="current-password" required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="alert alert-error" role="alert">
                <span className="material-symbols-outlined">error</span>
                <div>{error}</div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-sm)' }}>
              <label className="form-check" htmlFor="remember">
                <input type="checkbox" id="remember" name="remember" />
                <span style={{ fontSize: '13px', color: 'var(--clr-secondary)' }}>Mantener sesión iniciada</span>
              </label>
            </div>

            <button className="btn btn-primary w-full btn-lg" type="submit" disabled={loading || !identifier.trim() || !password}>
              {loading ? 'Verificando...' : 'Iniciar Sesión'}
              {!loading && <span className="material-symbols-outlined">login</span>}
              {loading && (
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.416" strokeDashoffset="10"/>
                </svg>
              )}
            </button>
          </form>

          <div className="login-divider"><span>o continuar con</span></div>

          <button className="sso-btn" type="button">
            <img src="https://www.google.com/favicon.ico" alt="" aria-hidden="true" />
            <span>Google Workspace UNSAAC</span>
          </button>

          <div className="login-footer">
            ¿No tienes cuenta?
            <Link to="/registro"> Solicitar acceso institucional</Link>
          </div>

          <div className="security-badges">
            <div className="sec-badge">
              <span className="material-symbols-outlined icon-filled">verified_user</span>
              Acceso SSL Seguro
            </div>
            <div className="sec-badge">
              <span className="material-symbols-outlined">gavel</span>
              Uso Institucional
            </div>
            <div className="sec-badge">
              <span className="material-symbols-outlined">privacy_tip</span>
              Datos Protegidos
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--sp-md)' }}>
            <Link to="/" style={{ fontSize: '12px', color: 'var(--clr-outline)', textDecoration: 'none' }}>
              ← Volver al portal principal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
