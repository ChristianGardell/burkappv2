
import { Navigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

interface OwnerRouteProps {
  children: React.ReactNode;
}

const OwnerRoute = ({ children }: OwnerRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user?.owner) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default OwnerRoute;
