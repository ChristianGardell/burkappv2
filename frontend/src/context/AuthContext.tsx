import { createContext, useContext, useEffect, useMemo, useState } from "react";
import validateToken from "@/api/user/validate-token";
import type { UserResponse } from "@/types";

type AuthContextValue = {
  // just a type
  user: UserResponse | null;
  setUser: React.Dispatch<React.SetStateAction<UserResponse | null>>;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user?: UserResponse) => void;
  logout: () => void;
  refresh: () => Promise<void>;

  //actual logic
};
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("access_token"),
  );
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated: boolean = !!token && !!user;

  const login = (newToken: string, userData?: UserResponse) => {
    localStorage.setItem("access_token", newToken);
    setToken(newToken);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const refresh = async () => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const me = await validateToken();
      setUser(me);
      localStorage.setItem("user", JSON.stringify(me));
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      token,
      isAuthenticated,
      isLoading,
      login,
      logout,
      refresh,
    }),
    [user, token, isAuthenticated, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
