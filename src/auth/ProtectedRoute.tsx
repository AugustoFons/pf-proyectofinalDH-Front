import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

type Props = {
  children: JSX.Element;
  requiredRole?: string;
};

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/acceso" replace />;
  }

  if (requiredRole && !user?.roles.includes(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
