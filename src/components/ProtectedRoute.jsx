import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    // Token nahi mila to admin-login par redirect
    return <Navigate to="/admin-login"/>;
  }

  return children;
}
