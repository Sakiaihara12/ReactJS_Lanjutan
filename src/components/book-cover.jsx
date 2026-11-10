import { coverUrl } from "../utils/format";

// Sampul bawaan (CSS) dipakai kalau buku belum punya gambar cover.
const COVERS = [
  { from: "#2b2412", to: "#0c0c0e", accent: "#d4af37" },
  { from: "#10224f", to: "#0a0a12", accent: "#6b8cf0" },
  { from: "#3a0f18", to: "#0c0a0b", accent: "#e5586b" },
  { from: "#2f2509", to: "#0b0b0d", accent: "#f5c84b" },
];

// compact = versi kecil (thumbnail tabel/keranjang): tanpa teks judul.
export default function BookCover({ book, index = 0, compact = false, className = "" }) {
  const image = coverUrl(book?.cover);
  const c = COVERS[(book?.id ?? index) % COVERS.length];
  const frame = `relative aspect-[3/4] w-full overflow-hidden rounded-md shadow-lg shadow-black/40 ring-1 ring-white/5 ${className}`;

  if (image) {
    return (
      <div className={frame}>
        <img src={image} alt={`Sampul ${book.judul_buku}`} loading="lazy" className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`${frame} flex flex-col justify-between ${compact ? "p-1.5" : "p-5"}`}
      style={{ background: `linear-gradient(160deg, ${c.from}, ${c.to})` }}
      role="img"
      aria-label={`Sampul ${book?.judul_buku ?? "buku"}`}
    >
      <span
        aria-hidden="true"
        className={`absolute select-none font-display font-bold leading-none ${compact ? "inset-0 flex items-center justify-center text-2xl" : "-bottom-4 -right-2 text-8xl"}`}
        style={{ color: c.accent, opacity: compact ? 0.5 : 0.1 }}
      >
        本
      </span>
      {!compact && (
        <>
          <span aria-hidden="true" className="h-0.5 w-10" style={{ backgroundColor: c.accent }} />
          <h3 className="relative line-clamp-4 font-display text-xl font-bold leading-snug text-gray-50">
            {book.judul_buku}
          </h3>
          <p className="relative text-xs font-medium" style={{ color: c.accent }}>
            {book.author?.nama_author}
          </p>
        </>
      )}
    </div>
  );
}
