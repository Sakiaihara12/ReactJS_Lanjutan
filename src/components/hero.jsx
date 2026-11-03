import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-gray-900"
      style={{
        backgroundImage:
          "radial-gradient(60% 55% at 50% 0%, rgba(212,175,55,0.16), transparent 70%), radial-gradient(40% 45% at 92% 35%, rgba(61,99,221,0.16), transparent 70%)",
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-8 hidden select-none font-display text-[9rem] font-bold leading-none text-indigo-400/10 lg:block"
        style={{ writingMode: "vertical-rl" }}
      >
        夜空
      </span>

      <div className="relative mx-auto max-w-screen-xl px-4 py-16 text-center lg:px-12 lg:py-28">
        <Link
          to="/books"
          className="mb-8 inline-flex items-center rounded-full bg-gray-800 py-1 pl-1 pr-4 text-sm text-gray-200 ring-1 ring-gray-700 hover:bg-gray-700"
        >
          <span className="mr-3 rounded-full bg-night-500 px-4 py-1.5 text-xs font-semibold text-white">
            Baru
          </span>
          <span className="text-sm font-medium">
            Koleksi buku terbaru sudah tiba
          </span>
          <svg
            className="ml-2 h-4 w-4 text-indigo-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </Link>

        <h1 className="mx-auto mb-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-gray-50 md:text-5xl lg:text-6xl">
          Temukan ceritamu di bawah langit malam
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400 lg:text-xl">
          Yozora Shelf menghadirkan novel, sejarah, dan non-fiksi pilihan untuk
          menemani malam-malam panjangmu.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/books"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-6 py-3 text-base font-semibold text-gray-900 shadow-lg shadow-indigo-500/20 hover:bg-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-800"
          >
            Lihat Buku Terlaris
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-lg border border-gray-600 px-6 py-3 text-base font-medium text-gray-100 hover:border-indigo-500 hover:text-indigo-400 focus:outline-none focus:ring-4 focus:ring-gray-700"
          >
            Bergabung
          </Link>
        </div>
      </div>
    </section>
  );
}
