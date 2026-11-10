import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import * as authService from "../_services/auth";
import { ROLES } from "../utils/roles";
import { authStorage } from "../utils/storage";

export const AuthContext = createContext(null);

// Menyimpan sesi login (token + user + role) dan membagikannya ke seluruh aplikasi.
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => authStorage.getToken());
  const [user, setUser] = useState(() => authStorage.getUser());
  // Ada token tapi data user belum tersimpan (mis. sesi lama): ambil profil dulu.
  const [initializing, setInitializing] = useState(
    () => !!authStorage.getToken() && !authStorage.getUser(),
  );

  useEffect(() => {
    if (!initializing) return;
    let active = true;
    authService
      .fetchProfile()
      .then((profile) => {
        if (!active) return;
        authStorage.save(token, profile);
        setUser(profile);
      })
      .catch(() => {
        if (!active) return;
        authStorage.clear();
        setToken(null);
      })
      .finally(() => active && setInitializing(false));
    return () => {
      active = false;
    };
  }, [initializing, token]);

  const login = useCallback(async (credentials) => {
    const { token: newToken, user: newUser } = await authService.login(credentials);
    authStorage.save(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    authStorage.clear();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: !!token,
      isAdmin: user?.role === ROLES.ADMIN,
      initializing,
      login,
      logout,
    }),
    [user, token, initializing, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
