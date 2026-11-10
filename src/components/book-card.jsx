import { Link } from "react-router-dom";
import { formatRupiah } from "../utils/format";
import BookActions from "./book-actions";
import BookCover from "./book-cover";

// Kartu buku di daftar buku. `showActions` = false untuk versi ringkas (beranda).
export default function BookCard({ book, index, showActions = true }) {
  const lowStock = book.stock > 0 && book.stock <= 5;

  return (
    <article className="flex flex-col">
      <Link to={`/books/${book.id}`} className="block transition-transform hover:-translate-y-1">
        <BookCover book={book} index={index} />
      </Link>
      <div className="flex flex-1 flex-col pt-4">
        <Link to={`/books/${book.id}`}>
          <h2 className="line-clamp-2 font-display text-lg font-bold leading-snug text-gray-50 hover:text-indigo-400">
            {book.judul_buku}
          </h2>
        </Link>
        <p className="mt-1 text-sm text-gray-400">
          {book.author?.nama_author} · {book.tahun_terbit}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-night-500/15 px-2.5 py-0.5 text-xs font-medium text-night-400 ring-1 ring-night-500/30">
            {book.genre?.nama_genre}
          </span>
          <p className="text-lg font-bold text-indigo-400">{formatRupiah(book.harga)}</p>
        </div>
        {lowStock && <p className="mt-2 text-xs text-vermilion-400">Tersisa {book.stock} buku</p>}
        {showActions && (
          <div className="mt-4 flex flex-1 items-end">
            <div className="w-full">
              <BookActions book={book} />
              <Link to={`/books/${book.id}`} className="mt-2 block text-center text-xs font-medium text-gray-400 hover:text-indigo-400">
                Lihat detail buku
              </Link>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
