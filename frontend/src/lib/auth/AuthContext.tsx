"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { api, type User, type LoginPayload, type RegisterPayload } from "@/lib/api/client";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const userData = await api.user();
      setUser(userData);
    } catch {
      setToken(null);
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);
    // eslint-disable-next-line react-compiler/react-compiler
  }, []);

  // Fetch user when token changes
  useEffect(() => {
    if (token) {
      fetchUser();
    }
    // eslint-disable-next-line react-compiler/react-compiler
  }, [token, fetchUser]);

  const login = useCallback(async (data: LoginPayload) => {
    const response = await api.login(data);
    localStorage.setItem("token", response.token);
    setToken(response.token);
    setUser(response.user);
  }, []);

  const register = useCallback(async (data: RegisterPayload) => {
    const response = await api.register(data);
    localStorage.setItem("token", response.token);
    setToken(response.token);
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  }, []);

  const googleLogin = useCallback(async (credential: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    const response = await fetch(`${API_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "Error al iniciar sesión con Google");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        googleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
