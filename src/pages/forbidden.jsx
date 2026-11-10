import { Link } from "react-router-dom";
import StatusPage from "../components/status-page";
import { useAuth } from "../hooks/use-auth";
import { homeByRole } from "../utils/roles";

export default function Forbidden() {
  const { role, logout } = useAuth();

  return (
    <StatusPage
      code="403"
      title="Akses ditolak"
      message="Akunmu tidak memiliki izin untuk membuka halaman ini. Halaman tersebut khusus untuk administrator."
    >
      <Link
        to={homeByRole(role)}
        className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-indigo-400"
      >
        Kembali ke beranda
      </Link>
      <button
        type="button"
        onClick={logout}
        className="rounded-lg border border-gray-600 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800"
      >
        Ganti akun
      </button>
    </StatusPage>
  );
}
