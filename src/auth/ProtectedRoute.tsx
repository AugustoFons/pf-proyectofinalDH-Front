import type { JSX } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: JSX.Element;
};

export default function ProtectedRoute({ children }: Props) {
  const isAdmin = localStorage.getItem("devAdmin") === "true";

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
