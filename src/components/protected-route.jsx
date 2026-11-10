import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import PageLoader from "./page-loader";

// Route guard: hanya untuk yang sudah login.
// Jika `allowedRoles` diisi, role user juga harus termasuk di dalamnya.
export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, initializing, role } = useAuth();
  const location = useLocation();

  if (initializing) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
