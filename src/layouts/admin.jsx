import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import Logo from "../components/logo";

const ICONS = {
  chart: (
    <><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" /></>
  ),
  list: (
    <><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></>
  ),
  bag: (
    <><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></>
  ),
  help: (
    <><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" /></>
  ),
};

// Menu tanpa `to` belum punya halaman: kliknya tetap di tempat.
const MENU_MAIN = [
  { label: "Dashboard", to: "/admin", end: true, icon: "chart" },
  { label: "Users", to: "/admin/users", icon: "list" },
  { label: "Authors", to: "/admin/authors", icon: "list" },
  { label: "Genres", to: "/admin/genres", icon: "list" },
];

const MENU_SECOND = [
  { label: "Books", to: "/admin/books", icon: "list" },
  { label: "Transactions", to: "/admin/transactions", icon: "bag" },
  { label: "Help", icon: "help" },
];

const itemBase =
  "group flex items-center rounded-lg border-l-2 p-2 text-base font-medium transition-colors";
const itemIdle =
  "border-transparent text-gray-300 hover:bg-gray-700/60 hover:text-white";
const itemActive = "border-indigo-500 bg-gray-700 text-white";

function MenuIcon({ name, active }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-6 w-6 shrink-0 transition-colors ${
        active ? "text-indigo-400" : "text-gray-500 group-hover:text-indigo-400"
      }`}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      {ICONS[name]}
    </svg>
  );
}

function MenuItem({ item, onNavigate }) {
  if (!item.to) {
    return (
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className={`${itemBase} ${itemIdle}`}
      >
        <MenuIcon name={item.icon} />
        <span className="ml-3">{item.label}</span>
      </a>
    );
  }

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `${itemBase} ${isActive ? itemActive : itemIdle}`
      }
    >
      {({ isActive }) => (
        <>
          <MenuIcon name={item.icon} active={isActive} />
          <span className="ml-3">{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const { user, logout } = useAuth();
  const initial = (user?.name ?? "A").charAt(0).toUpperCase();
  // Setelah sesi dihapus, ProtectedRoute otomatis mengarahkan ke /login.
  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
  };
  const closeSidebar = () => setSidebarOpen(false);

  // Tutup menu user saat klik di luar.
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 antialiased">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-700/60 bg-gray-800 px-4 py-2.5">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-controls="drawer-navigation"
              aria-expanded={sidebarOpen}
              className="mr-2 rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-600 md:hidden"
            >
              <span className="sr-only">Buka sidebar</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {sidebarOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h10M4 17h16" />
                )}
              </svg>
            </button>
            <Link to="/admin" className="mr-4 flex items-center">
              <Logo />
            </Link>
            <Link
              to="/"
              className="hidden items-center gap-1.5 rounded-lg border border-gray-600 px-3 py-1.5 text-sm font-medium text-gray-200 hover:bg-gray-700 sm:inline-flex"
            >
              &larr; Ke beranda
            </Link>
          </div>

          <div className="relative flex items-center" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((v) => !v)}
              aria-expanded={userMenuOpen}
              className="mx-3 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-600 md:mr-0"
            >
              <span className="sr-only">Buka menu user</span>{initial}
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-3 w-56 divide-y divide-gray-600 rounded-xl bg-gray-700 shadow-lg ring-1 ring-black/30">
                <div className="px-4 py-3">
                  <span className="block text-sm font-semibold text-white">
                    {user?.name ?? "Administrator"}
                  </span>
                  <span className="block truncate text-sm text-gray-400">
                    {user?.email ?? "Yozora Shelf"}
                  </span>
                </div>
                <ul className="py-1 text-gray-300">
                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-600 hover:text-white"
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="drawer-navigation"
        aria-label="Sidenav"
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-700/60 bg-gray-800 pt-14 transition-transform md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto px-3 py-5">
          <ul className="space-y-2">
            {MENU_MAIN.map((item) => (
              <li key={item.label}>
                <MenuItem item={item} onNavigate={closeSidebar} />
              </li>
            ))}
          </ul>

          <ul className="mt-5 space-y-2 border-t border-gray-700 pt-5">
            {MENU_SECOND.map((item) => (
              <li key={item.label}>
                <MenuItem item={item} onNavigate={closeSidebar} />
              </li>
            ))}
          </ul>

          <Link
            to="/"
            onClick={closeSidebar}
            className="mt-5 flex items-center justify-center rounded-lg border border-gray-600 px-3 py-2 text-sm font-medium text-gray-200 hover:bg-gray-700"
          >
            &larr; Kembali ke beranda
          </Link>
        </div>
      </aside>

      <main className="h-auto p-4 pt-20 md:ml-64">
        <div className="h-auto rounded-lg border-2 border-dashed border-gray-600 px-4 pb-6 pt-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
