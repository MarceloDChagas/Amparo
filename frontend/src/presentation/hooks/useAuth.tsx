"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  AuthResponse,
  authService,
  LoginParams,
  RegisterParams,
} from "@/services/auth-service";

interface AuthContextType {
  user: AuthResponse["user"] | null;
  login: (credentials: LoginParams) => Promise<void>;
  register: (data: RegisterParams) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      // eslint-disable-next-line
      setUser(JSON.parse(storedUser));
    }
    setTimeout(() => setIsLoading(false), 0);
  }, []);

  const login = async (credentials: LoginParams) => {
    const data = await authService.login(credentials);
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = async (data: RegisterParams) => {
    const response = await authService.register(data);
    localStorage.setItem("token", response.access_token);
    localStorage.setItem("user", JSON.stringify(response.user));
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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
