import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  authService,
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
  type AuthResponse,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
} from "../services/authService";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    return null;
  }
}

function persistSession(session: AuthResponse) {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, session.token);
  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(session.user));
}

function clearSession() {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_USER_STORAGE_KEY);
}

export function AuthProvider({ children }: { children: import("react").ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(AUTH_TOKEN_STORAGE_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    authService
      .me(storedToken)
      .then((currentUser) => {
        setToken(storedToken);
        setUser(currentUser);
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(currentUser));
      })
      .catch(() => {
        clearSession();
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (payload: LoginPayload) => {
    const session = await authService.login(payload);
    persistSession(session);
    setToken(session.token);
    setUser(session.user);
  };

  const register = async (payload: RegisterPayload) => {
    const session = await authService.register(payload);
    persistSession(session);
    setToken(session.token);
    setUser(session.user);
  };

  const logout = () => {
    clearSession();
    setToken(null);
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(() => {
    const isAuthenticated = Boolean(token && user);
    const isAdmin = Boolean(user?.roles?.includes("ROLE_ADMIN"));

    return {
      user,
      token,
      isAuthenticated,
      isAdmin,
      isLoading,
      login,
      register,
      logout,
    };
  }, [isLoading, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
