import { Link } from "react-router-dom";
import StatusPage from "../components/status-page";

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      title="Halaman tidak ditemukan"
      message="Alamat yang kamu buka tidak ada atau sudah dipindahkan."
    >
      <Link
        to="/"
        className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-indigo-400"
      >
        Kembali ke beranda
      </Link>
    </StatusPage>
  );
}
