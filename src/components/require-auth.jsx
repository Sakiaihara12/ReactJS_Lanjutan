import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../_services/auth";

// Halaman di dalamnya hanya bisa dibuka kalau sudah login.
export default function RequireAuth({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
