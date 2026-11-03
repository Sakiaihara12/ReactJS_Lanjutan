import { Link } from "react-router-dom";
import Logo from "./logo";

const LINKS = [
  { label: "Tentang" },
  { label: "Buku Terlaris", to: "/books" },
  { label: "Blog" },
  { label: "Layanan" },
  { label: "Kontak" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-700/60 bg-gray-800 p-6 md:p-10">
      <div className="mx-auto max-w-screen-xl text-center">
        <Link to="/" className="mb-6 inline-flex">
          <Logo />
        </Link>
        <ul className="mb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-300">
          {LINKS.map((item) => (
            <li key={item.label}>
              {item.to ? (
                <Link to={item.to} className="hover:text-indigo-400">
                  {item.label}
                </Link>
              ) : (
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-indigo-400"
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
        <span className="text-sm text-gray-500">
          © 2026 Yozora Shelf. Hak cipta dilindungi.
        </span>
      </div>
    </footer>
  );
}
