import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteUser, getUsers } from "../../../_services/users";
import Alert from "../../../components/alert";
import ConfirmModal from "../../../components/confirm-modal";
import { useAuth } from "../../../hooks/use-auth";
import { formatTanggal } from "../../../utils/format";
import { normalizeRole, ROLES } from "../../../utils/roles";

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setUsers(await getUsers());
      } catch (err) {
        console.error("Gagal ambil users:", err);
        setError("Data pengguna gagal dimuat. Pastikan endpoint GET /api/users tersedia untuk admin.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = users.filter((u) =>
    `${u.name} ${u.email} ${u.username ?? ""}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const closeModal = () => {
    setTarget(null);
    setDeleteError("");
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteUser(target.id);
      setUsers((prev) => prev.filter((u) => u.id !== target.id));
      setNotice(`Akun "${target.name}" berhasil dihapus.`);
      setTarget(null);
    } catch (err) {
      console.error("Gagal hapus user:", err);
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;
      setDeleteError(
        status === 404
          ? "Data sudah tidak ada di server."
          : serverMessage
            ? `Gagal menghapus (${status}): ${serverMessage}`
            : `Gagal menghapus (${status ?? "tanpa response"}). Akun mungkin punya riwayat transaksi.`,
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="p-3 sm:p-5">
      <h1 className="text-2xl font-bold text-gray-50">Users</h1>
      <p className="mb-5 mt-1 text-sm text-gray-400">Akun yang sudah terdaftar di Yozora Shelf.</p>

      <div className="overflow-hidden rounded-lg bg-gray-800 shadow-md ring-1 ring-gray-700/60">
        <div className="space-y-3 p-4">
          <label htmlFor="search-user" className="sr-only">Cari pengguna</label>
          <input
            id="search-user"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama, email, atau username..."
            className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-gray-50 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 md:w-1/2"
          />
          <Alert tone="success">{notice}</Alert>
          <Alert>{error}</Alert>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-700 text-xs uppercase text-gray-300">
              <tr>
                <th scope="col" className="px-4 py-3">Pengguna</th>
                <th scope="col" className="px-4 py-3">Username</th>
                <th scope="col" className="px-4 py-3">Role</th>
                <th scope="col" className="px-4 py-3">Terdaftar</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Aksi</span></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center">Memuat data...</td></tr>
              ) : filtered.length > 0 ? (
                filtered.map((u) => {
                  const isAdmin = normalizeRole(u) === ROLES.ADMIN;
                  const isMe = u.id === me?.id;
                  return (
                    <tr key={u.id} className="border-b border-gray-700 hover:bg-gray-700/40">
                      <th scope="row" className="px-4 py-3 font-medium text-gray-50">
                        <span className="flex items-center gap-3">
                          <span
                            aria-hidden="true"
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-sm font-bold text-indigo-400 ring-1 ring-indigo-500/30"
                          >
                            {(u.name ?? "?").charAt(0).toUpperCase()}
                          </span>
                          <span>
                            <span className="block">{u.name} {isMe && <span className="text-xs text-gray-400">(kamu)</span>}</span>
                            <span className="block text-xs font-normal text-gray-400">{u.email}</span>
                          </span>
                        </span>
                      </th>
                      <td className="px-4 py-3">{u.username || "-"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${
                            isAdmin
                              ? "bg-indigo-500/15 text-indigo-400 ring-indigo-500/30"
                              : "bg-night-500/15 text-night-400 ring-night-500/30"
                          }`}
                        >
                          {isAdmin ? ROLES.ADMIN : ROLES.USER}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">{formatTanggal(u.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-3">
                          <Link to={`/admin/users/${u.id}/edit`} className="font-medium text-indigo-400 hover:underline">
                            Edit
                          </Link>
                          {!isMe && (
                            <button
                              type="button"
                              onClick={() => {
                                setNotice("");
                                setTarget(u);
                              }}
                              className="font-medium text-vermilion-400 hover:underline"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={5} className="px-4 py-8 text-center">Data tidak ditemukan</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="p-4 text-sm text-gray-400">
          Total <span className="font-semibold text-gray-50">{filtered.length}</span> pengguna
        </p>
      </div>

      <ConfirmModal
        open={!!target}
        title="Hapus akun pengguna?"
        message={`Akun "${target?.name}" (${target?.email}) akan dihapus permanen dan tidak bisa dikembalikan.`}
        loading={deleting}
        loadingLabel="Menghapus..."
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </section>
  );
}
