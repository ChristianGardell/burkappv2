// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";

import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated || !user?.admin) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
