import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteBook, getBooks } from "../../../_services/books";
import Alert from "../../../components/alert";
import BookCover from "../../../components/book-cover";
import ConfirmModal from "../../../components/confirm-modal";
import { formatRupiah } from "../../../utils/format";

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
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
        setBooks(await getBooks());
      } catch (err) {
        console.error("Gagal ambil buku:", err);
        setError("Data buku gagal dimuat. Pastikan server API berjalan.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = books.filter((b) =>
    `${b.judul_buku} ${b.author?.nama_author ?? ""} ${b.genre?.nama_genre ?? ""}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  const closeModal = () => {
    setTarget(null);
    setDeleteError("");
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteBook(target.id);
      setBooks((prev) => prev.filter((b) => b.id !== target.id));
      setNotice(`Buku "${target.judul_buku}" berhasil dihapus.`);
      setTarget(null);
    } catch (err) {
      console.error("Gagal hapus buku:", err);
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;
      setDeleteError(
        status === 404
          ? "Data sudah tidak ada di server."
          : serverMessage
            ? `Gagal menghapus (${status}): ${serverMessage}`
            : "Gagal menghapus. Buku mungkin sudah pernah dibeli (tercatat di transaksi).",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="p-3 sm:p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-50">Books</h1>
          <p className="mt-1 text-sm text-gray-400">Kelola koleksi buku, harga, dan stok.</p>
        </div>
        <Link
          to="/admin/books/create"
          className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-300/40"
        >
          + Tambah buku
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg bg-gray-800 shadow-md ring-1 ring-gray-700/60">
        <div className="space-y-3 p-4">
          <label htmlFor="search-book" className="sr-only">Cari buku</label>
          <input
            id="search-book"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul, penulis, atau genre..."
            className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-gray-50 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 md:w-1/2"
          />
          <Alert tone="success">{notice}</Alert>
          <Alert>{error}</Alert>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-700 text-xs uppercase text-gray-300">
              <tr>
                <th scope="col" className="px-4 py-3">Buku</th>
                <th scope="col" className="px-4 py-3">Tahun</th>
                <th scope="col" className="px-4 py-3">Harga</th>
                <th scope="col" className="px-4 py-3">Stok</th>
                <th scope="col" className="px-4 py-3">Genre</th>
                <th scope="col" className="px-4 py-3">Penulis</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Aksi</span></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center">Memuat data...</td></tr>
              ) : filtered.length > 0 ? (
                filtered.map((book) => (
                  <tr key={book.id} className="border-b border-gray-700 hover:bg-gray-700/40">
                    <th scope="row" className="px-4 py-3 font-medium text-gray-50">
                      <span className="flex items-center gap-3">
                        <span className="w-9 shrink-0"><BookCover book={book} compact /></span>
                        <span className="line-clamp-2 min-w-40">{book.judul_buku}</span>
                      </span>
                    </th>
                    <td className="px-4 py-3">{book.tahun_terbit}</td>
                    <td className="whitespace-nowrap px-4 py-3">{formatRupiah(book.harga)}</td>
                    <td className={`px-4 py-3 ${Number(book.stock) <= 5 ? "font-semibold text-vermilion-400" : ""}`}>
                      {book.stock}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-night-500/15 px-2.5 py-0.5 text-xs font-medium text-night-400 ring-1 ring-night-500/30">
                        {book.genre?.nama_genre}
                      </span>
                    </td>
                    <td className="px-4 py-3">{book.author?.nama_author}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link to={`/admin/books/${book.id}/edit`} className="font-medium text-indigo-400 hover:underline">
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setNotice("");
                            setTarget(book);
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
                <tr><td colSpan={7} className="px-4 py-8 text-center">Data tidak ditemukan</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="p-4 text-sm text-gray-400">
          Total <span className="font-semibold text-gray-50">{filtered.length}</span> buku
        </p>
      </div>

      <ConfirmModal
        open={!!target}
        title="Hapus buku?"
        message={`Buku "${target?.judul_buku}" akan dihapus permanen dan tidak bisa dikembalikan.`}
        loading={deleting}
        loadingLabel="Menghapus..."
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </section>
  );
}
