import { Navigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

import Loading from "@/components/Loading";

interface OwnerRouteProps {
  children: React.ReactNode;
}

const OwnerRoute = ({ children }: OwnerRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated || !user?.owner) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default OwnerRoute;
