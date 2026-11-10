import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import Logo from "./logo";
import NavbarAuth from "./navbar-auth";

// `to` kosong = belum ada halamannya, jadi klik tidak pindah ke mana-mana.
const LINKS = [
  { label: "Home", to: "/", end: true },
  { label: "Buku", to: "/books" },
  { label: "Blog" },
  { label: "Layanan" },
];

const linkBase =
  "block py-2 text-sm font-medium transition-colors lg:border-b-2 lg:py-1.5";
const linkIdle =
  "border-transparent text-gray-300 hover:text-indigo-400 lg:hover:border-indigo-400/40";
const linkActive = "border-indigo-500 text-indigo-400";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  // Riwayat pembelian hanya muncul setelah login.
  const links = isAuthenticated ? [...LINKS, { label: "Riwayat", to: "/history" }] : LINKS;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-700/60 bg-gray-900/85 backdrop-blur">
      <nav className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between px-4 py-3 lg:px-6">
        <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <div className="flex items-center gap-2 lg:order-2">
          <NavbarAuth />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-controls="main-menu"
            aria-expanded={open}
            className="ml-1 inline-flex items-center rounded-lg p-2 text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 lg:hidden"
          >
            <span className="sr-only">Buka menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        <div
          id="main-menu"
          className={`${open ? "block" : "hidden"} w-full lg:order-1 lg:block lg:w-auto`}
        >
          <ul className="mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-8">
            {links.map((item) => (
              <li key={item.label}>
                {item.to ? (
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? linkActive : linkIdle}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ) : (
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className={`${linkBase} ${linkIdle}`}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
