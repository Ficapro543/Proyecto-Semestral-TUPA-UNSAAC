import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api, {
  setSession,
  clearSession,
  getStoredUser,
  getToken,
  getRefreshToken,
  onSessionExpired,
} from '../lib/api';

/**
 * Sesión real contra el backend: login con credenciales, registro con
 * verificación por correo y recuperación de contraseña.
 *
 * El usuario se guarda en localStorage para que un refresco de página no
 * "deslogueé" visualmente; el access token se renueva solo desde lib/api.js.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getToken());

  // Cuando el refresh token también muere, lib/api limpia y avisa aquí.
  useEffect(() => {
    onSessionExpired(() => {
      setToken(null);
      setUser(null);
    });
  }, []);

  const login = useCallback(async (identifier, password, role) => {
    const result = await api.login(identifier, password, role);
    setSession(result);
    setToken(result.accessToken);
    setUser(result.user);
    return result;
  }, []);

  const register = useCallback((datos) => api.register(datos), []);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    // Revocar en el servidor es mejor esfuerzo: la sesión local se cierra igual.
    try {
      if (refreshToken) await api.logout(refreshToken);
    } catch {
      /* sin conexión: se limpia igual */
    }
    clearSession();
    setToken(null);
    setUser(null);
  }, []);

  /** Refresca los datos del usuario tras editar el perfil. */
  const actualizarUsuario = useCallback((parcial) => {
    setUser((prev) => {
      const siguiente = { ...prev, ...parcial };
      setSession({ user: siguiente });
      return siguiente;
    });
  }, []);

  const value = {
    user,
    token,
    login,
    register,
    logout,
    actualizarUsuario,
    isAuthenticated: Boolean(token),
    isAdmin: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}

/** Nombre para mostrar en topbar/sidebar. */
export function displayName(user) {
  if (!user) return 'Invitado';
  return [user.nombres, user.ap_paterno].filter(Boolean).join(' ') || user.email_institucional;
}

/** Ruta del panel que corresponde al rol. */
export function rutaPanel(user) {
  return user?.role === 'ADMIN' ? '/admin' : '/estudiante';
}

/**
 * Reglas de contraseña, espejo de las del backend (auth.service.js).
 * Se validan también aquí para dar feedback inmediato al escribir.
 */
export const REGLAS_PASSWORD = [
  { id: 'largo', texto: 'Entre 8 y 64 caracteres', test: (p) => p.length >= 8 && p.length <= 64 },
  { id: 'minus', texto: 'Una letra minúscula', test: (p) => /[a-z]/.test(p) },
  { id: 'mayus', texto: 'Una letra mayúscula', test: (p) => /[A-Z]/.test(p) },
  { id: 'num', texto: 'Un número', test: (p) => /\d/.test(p) },
  { id: 'simbolo', texto: 'Un símbolo (@ $ ! % * ? & . - _ #)', test: (p) => /[@$!%*?&.\-_#]/.test(p) },
];

export function passwordCumple(password) {
  return REGLAS_PASSWORD.every((r) => r.test(password || ''));
}
