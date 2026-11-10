import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteAuthor, getAuthors } from "../../../_services/authors";
import ConfirmModal from "../../../components/confirm-modal";
import { formatTanggal } from "../../../utils/format";

export default function AdminAuthors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setAuthors(await getAuthors());
      } catch (err) {
        console.error("Gagal ambil author:", err);
        setError("Data author gagal dimuat. Pastikan server API berjalan.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const closeModal = () => {
    setTarget(null);
    setDeleteError("");
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteAuthor(target.id);
      setAuthors((prev) => prev.filter((item) => item.id !== target.id));
      setNotice(`Author "${target.nama_author}" berhasil dihapus.`);
      setTarget(null);
    } catch (err) {
      console.error("Gagal hapus author:", err);
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;
      console.log("Response error dari server:", err.response?.data);
      setDeleteError(
        status === 404
          ? "Data sudah tidak ada di server."
          : serverMessage
            ? `Gagal menghapus (${status}): ${serverMessage}`
            : `Gagal menghapus (${status ?? "tanpa response"}). Cek tab Network untuk detailnya.`,
      );
    } finally {
      setDeleting(false);
    }
  };

  const filtered = authors.filter((a) =>
    `${a.nama_author} ${a.negara ?? ""}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  return (
    <section className="p-3 sm:p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-50">Authors</h1>
          <p className="mt-1 text-sm text-gray-400">
            Penulis buku yang terdaftar di Yozora Shelf.
          </p>
        </div>
        <Link
          to="/admin/authors/create"
          className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-300/40"
        >
          <svg className="mr-2 h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          Tambah author
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg bg-gray-800 shadow-md ring-1 ring-gray-700/60">
        <div className="p-4">
          <label htmlFor="search-author" className="sr-only">Cari author</label>
          <input
            id="search-author"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau negara..."
            className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-gray-50 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 md:w-1/2"
          />
        </div>

        {notice && (
          <p className="mx-4 mb-4 rounded-lg border border-night-500/40 bg-night-500/10 px-4 py-3 text-sm text-night-400" role="status">
            {notice}
          </p>
        )}

        {error && (
          <p className="mx-4 mb-4 rounded-lg border border-vermilion-500/40 bg-vermilion-500/10 px-4 py-3 text-sm text-vermilion-400" role="alert">
            {error}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-700 text-xs uppercase text-gray-300">
              <tr>
                <th scope="col" className="px-4 py-3">No</th>
                <th scope="col" className="px-4 py-3">Nama author</th>
                <th scope="col" className="px-4 py-3">Negara</th>
                <th scope="col" className="px-4 py-3">Dibuat</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Aksi</span></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center">Memuat data...</td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((author, i) => (
                  <tr key={author.id} className="border-b border-gray-700 hover:bg-gray-700/40">
                    <td className="px-4 py-3">{i + 1}</td>
                    <th scope="row" className="whitespace-nowrap px-4 py-3 font-medium text-gray-50">
                      <span className="inline-flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/15 text-sm font-bold text-indigo-400 ring-1 ring-indigo-500/30"
                        >
                          {author.nama_author.charAt(0).toUpperCase()}
                        </span>
                        {author.nama_author}
                      </span>
                    </th>
                    <td className="px-4 py-3">{author.negara || "-"}</td>
                    <td className="whitespace-nowrap px-4 py-3">{formatTanggal(author.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          to={`/admin/authors/${author.id}/edit`}
                          className="font-medium text-indigo-400 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setNotice("");
                            setTarget(author);
                          }}
                          className="font-medium text-vermilion-400 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center">Data tidak ditemukan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="p-4 text-sm text-gray-400">
          Total <span className="font-semibold text-gray-50">{filtered.length}</span> author
        </p>
      </div>

      <ConfirmModal
        open={!!target}
        title="Hapus author?"
        message={`Author "${target?.nama_author}" akan dihapus permanen dan tidak bisa dikembalikan.`}
        loading={deleting}
        loadingLabel="Menghapus..."
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </section>
  );
}
