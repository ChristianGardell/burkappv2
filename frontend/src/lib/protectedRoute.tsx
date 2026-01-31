// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import validateToken from "../api/validate-token";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateAsync = async () => {
      const token =  localStorage.getItem("access_token");
      if (!token) {
        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }
      try {
        const response = await validateToken();
        localStorage.setItem("user", JSON.stringify(response));
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.removeItem("access_token");
      } finally {
        setIsValidating(false);
      }
    };
    validateAsync();
  }, []);

  if (isValidating) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
