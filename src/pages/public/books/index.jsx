import { useEffect, useState } from "react";
import { getBooks } from "../../../_services/books";
import Alert from "../../../components/alert";
import BookCard from "../../../components/book-card";

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
          <h1 className="text-3xl font-bold text-gray-50 md:text-4xl">Koleksi Buku</h1>
          <p className="mt-2 text-gray-400">Pilih buku favoritmu, beli langsung atau masukkan ke keranjang.</p>
        </div>

        {loading && <p className="text-gray-400">Memuat buku...</p>}
        {error && <Alert>Gagal memuat buku. Pastikan server Laravel sedang berjalan.</Alert>}
        {!loading && !error && books.length === 0 && <p className="text-gray-400">Belum ada buku.</p>}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
