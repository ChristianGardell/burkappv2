// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

interface RedirectHomeProps {
  children: React.ReactNode;
}

const RedirectHome = ({ children }: RedirectHomeProps) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default RedirectHome;
