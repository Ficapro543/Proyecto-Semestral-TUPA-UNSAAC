import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Envuelve las zonas que necesitan sesión. Sin esto se podía entrar a
 * /admin o /estudiante escribiendo la URL, y las pantallas disparaban
 * peticiones sin token que devolvían 401.
 */
export default function RequireAuth({ role, children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (role && user?.role !== role) {
    // Sesión válida pero del rol equivocado: al panel que sí le corresponde.
    return <Navigate to={user?.role === 'ADMIN' ? '/admin' : '/estudiante'} replace />;
  }

  return children;
}
