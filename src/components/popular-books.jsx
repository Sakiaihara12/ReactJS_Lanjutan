import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPopularBooks } from "../_services/books";
import BookCard from "./book-card";

// Bagian "Buku Terlaris" di beranda, terbuka untuk semua pengunjung.
export default function PopularBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPopularBooks(4)
      .then(setBooks)
      .catch((err) => console.error("Gagal ambil buku populer:", err))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && books.length === 0) return null;

  return (
    <section className="bg-gray-900 py-14">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-50 md:text-3xl">Buku Terlaris</h2>
            <p className="mt-1 text-gray-400">Paling sering dibaca dan dicari pengunjung.</p>
          </div>
          <Link to="/books" className="shrink-0 text-sm font-medium text-indigo-400 hover:underline">
            Lihat semua &rarr;
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-400">Memuat buku...</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {books.map((book, i) => (
              <BookCard key={book.id} book={book} index={i} showActions={false} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
