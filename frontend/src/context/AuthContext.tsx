/* eslint-disable react-refresh/only-export-components */
import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useMemo, useState } from "react";

import { useAuthUser } from "@/features/auth/hooks";
import type { UserResponse } from "@/types";

type AuthContextValue = {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user?: UserResponse) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("access_token"),
  );

  const { data: user, isLoading: isFetching } = useAuthUser(!!token);

  // Derived state
  const isAuthenticated = !!token && !!user;
  const isLoading = token ? isFetching : false;

  const login = (newToken: string, userData?: UserResponse) => {
    localStorage.setItem("access_token", newToken);
    setToken(newToken);

    if (userData) {
      queryClient.setQueryData(["auth"], userData);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    queryClient.removeQueries({ queryKey: ["auth"] });
  };

  const value = useMemo(
    () => ({
      user: user || null,
      token,
      isAuthenticated,
      isLoading,
      login,
      logout,
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
