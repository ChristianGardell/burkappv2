import { Navigate, Outlet } from "react-router-dom";

import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";

interface RedirectHomeProps {
  children?: React.ReactNode;
}

const RedirectHome = ({ children }: RedirectHomeProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default RedirectHome;
