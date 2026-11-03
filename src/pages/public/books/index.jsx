import { useEffect, useState } from "react";
import { getBooks } from "../../../_services/books";
import { formatRupiah } from "../../../utils/format";

// Sampul dibuat dari CSS karena data buku belum punya gambar.
const COVERS = [
  { from: "#2b2412", to: "#0c0c0e", accent: "#d4af37" }, // emas
  { from: "#10224f", to: "#0a0a12", accent: "#6b8cf0" }, // biru
  { from: "#3a0f18", to: "#0c0a0b", accent: "#e5586b" }, // merah
  { from: "#2f2509", to: "#0b0b0d", accent: "#f5c84b" }, // kuning
];

function BookCover({ title, author, index }) {
  const c = COVERS[index % COVERS.length];

  return (
    <div
      className="relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden rounded-md p-5 shadow-lg shadow-black/40 ring-1 ring-white/5"
      style={{ background: `linear-gradient(160deg, ${c.from}, ${c.to})` }}
    >
      <span
        aria-hidden="true"
        className="absolute -bottom-4 -right-2 select-none font-display text-8xl font-bold leading-none"
        style={{ color: c.accent, opacity: 0.1 }}
      >
        本
      </span>
      <span
        aria-hidden="true"
        className="h-0.5 w-10"
        style={{ backgroundColor: c.accent }}
      />
      <h3 className="relative line-clamp-4 font-display text-xl font-bold leading-snug text-gray-50">
        {title}
      </h3>
      <p className="relative text-xs font-medium" style={{ color: c.accent }}>
        {author}
      </p>
    </div>
  );
}

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setBooks(await getBooks());
      } catch (err) {
        console.error("Gagal ambil buku:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="bg-gray-900 py-10 md:py-14">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-50 md:text-4xl">
            Buku Terlaris
          </h1>
          <p className="mt-2 text-gray-400">
            Koleksi pilihan dari rak Yozora Shelf.
          </p>
        </div>

        {loading && <p className="text-gray-400">Memuat buku...</p>}

        {error && (
          <p className="rounded-lg border border-vermilion-500/40 bg-vermilion-500/10 px-4 py-3 text-sm text-vermilion-400">
            Gagal memuat buku. Pastikan server Laravel sedang berjalan.
          </p>
        )}

        {!loading && !error && books.length === 0 && (
          <p className="text-gray-400">Belum ada buku.</p>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book, i) => (
            <article key={book.id} className="group">
              <BookCover
                title={book.judul_buku}
                author={book.author?.nama_author}
                index={i}
              />
              <div className="pt-4">
                <h2 className="line-clamp-2 font-display text-lg font-bold leading-snug text-gray-50">
                  {book.judul_buku}
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  {book.author?.nama_author} · {book.tahun_terbit}
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-night-500/15 px-2.5 py-0.5 text-xs font-medium text-night-400 ring-1 ring-night-500/30">
                    {book.genre?.nama_genre}
                  </span>
                  <p className="text-lg font-bold text-indigo-400">
                    {formatRupiah(book.harga)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
