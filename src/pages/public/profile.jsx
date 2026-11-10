import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { ROLES } from "../../utils/roles";

const FIELDS = [
  { label: "Nama lengkap", key: "name" },
  { label: "Email", key: "email" },
  { label: "Username", key: "username" },
];

// Halaman profil: bisa dibuka semua user yang sudah login (user maupun admin).
export default function Profile() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-xl bg-gray-800 p-6 ring-1 ring-gray-700/60 sm:p-8">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 text-2xl font-bold text-gray-900"
          >
            {(user?.name ?? "U").charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-50">{user?.name ?? "Pengguna"}</h1>
            <span
              className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${
                isAdmin
                  ? "bg-indigo-500/15 text-indigo-400 ring-indigo-500/30"
                  : "bg-night-500/15 text-night-400 ring-night-500/30"
              }`}
            >
              {isAdmin ? ROLES.ADMIN : ROLES.USER}
            </span>
          </div>
        </div>

        <dl className="mt-8 divide-y divide-gray-700">
          {FIELDS.map(({ label, key }) => (
            <div key={key} className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
              <dt className="text-sm text-gray-400">{label}</dt>
              <dd className="text-sm font-medium text-gray-50">{user?.[key] || "-"}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-indigo-400"
            >
              Buka Admin Panel
            </Link>
          )}
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-gray-600 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700"
          >
            Keluar
          </button>
        </div>
      </div>
    </section>
  );
}
