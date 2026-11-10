import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import { homeByRole, isPathAllowed } from "../utils/roles";
import PageLoader from "./page-loader";

// Route guard untuk halaman login/register: yang sudah login diarahkan sesuai rolenya.
export default function GuestRoute() {
  const { isAuthenticated, initializing, role } = useAuth();
  const location = useLocation();

  if (initializing) return <PageLoader />;

  if (isAuthenticated) {
    const from = location.state?.from;
    const target = from && isPathAllowed(from, role) ? from : homeByRole(role);
    return <Navigate to={target} replace />;
  }

  return <Outlet />;
}
