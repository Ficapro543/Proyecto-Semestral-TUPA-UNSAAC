import { createContext, useContext, useState, useCallback } from 'react';
import api, { setSession, clearSession, getStoredUser, getToken } from '../lib/api';

/**
 * Sesión simulada por rol: la pantalla de login deja elegir "estudiante" o
 * "administrativo" y precarga las credenciales de la cuenta de demo
 * correspondiente. El backend de autenticación no se modificó — se usa tal cual.
 */
export const DEMO_ACCOUNTS = {
  estudiante: {
    identifier: 'amilcar.estrada@unsaac.edu.pe',
    password: '123456',
    role: 'USER',
  },
  admin: {
    identifier: 'rosa.palomino@unsaac.edu.pe',
    password: '123456',
    role: 'ADMIN',
  },
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getToken());

  const login = useCallback(async (identifier, password, role) => {
    const result = await api.login(identifier, password, role);
    setSession(result.token, result.user);
    setToken(result.token);
    setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    localStorage.removeItem('tupa_wizard');
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    login,
    logout,
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

/** Nombre completo del usuario para mostrar en topbar/sidebar. */
export function displayName(user) {
  if (!user) return 'Invitado';
  return [user.nombres, user.ap_paterno].filter(Boolean).join(' ') || user.email_institucional;
}
