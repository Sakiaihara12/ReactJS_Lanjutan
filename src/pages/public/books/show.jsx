import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBook } from "../../../_services/books";
import Alert from "../../../components/alert";
import BookActions from "../../../components/book-actions";
import BookCover from "../../../components/book-cover";
import QuantityInput from "../../../components/quantity-input";
import { formatRupiah } from "../../../utils/format";

export default function ShowBook() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setBook(await getBook(id));
      } catch (err) {
        console.error("Gagal ambil buku:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p className="px-4 py-16 text-center text-gray-400">Memuat buku...</p>;

  if (error || !book) {
    return (
      <section className="mx-auto max-w-screen-xl px-4 py-16">
        <Alert>Buku tidak ditemukan atau gagal dimuat.</Alert>
        <Link to="/books" className="mt-4 inline-block text-sm text-indigo-400 hover:underline">
          &larr; Kembali ke koleksi buku
        </Link>
      </section>
    );
  }

  const stock = Number(book.stock);
  const details = [
    ["Penulis", book.author?.nama_author],
    ["Negara penulis", book.author?.negara],
    ["Genre", book.genre?.nama_genre],
    ["Tahun terbit", book.tahun_terbit],
    ["Stok", stock > 0 ? `${stock} buku` : "Habis"],
  ];

  return (
    <section className="bg-gray-900 py-8 md:py-14">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <Link to="/books" className="text-sm text-gray-400 hover:text-indigo-400">
          &larr; Kembali ke koleksi buku
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-14">
          <div className="mx-auto w-full max-w-xs lg:max-w-none">
            <BookCover book={book} />
          </div>

          <div>
            <span className="rounded-full bg-night-500/15 px-2.5 py-0.5 text-xs font-medium text-night-400 ring-1 ring-night-500/30">
              {book.genre?.nama_genre}
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-gray-50 md:text-4xl">
              {book.judul_buku}
            </h1>
            <p className="mt-1 text-gray-400">oleh {book.author?.nama_author}</p>
            <p className="mt-5 text-3xl font-extrabold text-indigo-400">{formatRupiah(book.harga)}</p>

            {stock > 0 && (
              <div className="mt-6 flex items-center gap-4">
                <QuantityInput value={quantity} max={stock} onChange={setQuantity} />
                <span className="text-sm text-gray-400">Total {formatRupiah(Number(book.harga) * quantity)}</span>
              </div>
            )}
            <div className="mt-4 max-w-sm">
              <BookActions book={book} quantity={quantity} />
            </div>

            <hr className="my-8 border-gray-700" />

            <h2 className="text-lg font-bold text-gray-50">Deskripsi</h2>
            <p className="mt-2 whitespace-pre-line text-gray-300">
              {book.deskripsi || "Belum ada deskripsi untuk buku ini."}
            </p>

            <h2 className="mb-2 mt-8 text-lg font-bold text-gray-50">Informasi buku</h2>
            <dl className="divide-y divide-gray-700 rounded-lg bg-gray-800 px-4 ring-1 ring-gray-700/60">
              {details.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 py-3 text-sm">
                  <dt className="text-gray-400">{label}</dt>
                  <dd className="font-medium text-gray-50">{value || "-"}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
