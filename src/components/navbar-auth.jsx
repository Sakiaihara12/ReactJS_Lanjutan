import { Link } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import { useCart } from "../hooks/use-cart";

const ghost = "rounded-lg px-3 py-2 text-sm font-medium text-gray-200 hover:bg-gray-800 hover:text-white";
const solid =
  "rounded-lg bg-indigo-500 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm shadow-indigo-500/20 hover:bg-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-800";

// Tombol akun di navbar: berbeda untuk tamu, user biasa, dan admin.
export default function NavbarAuth() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { count } = useCart();

  if (!isAuthenticated) {
    return (
      <>
        <Link to="/login" className={ghost}>Masuk</Link>
        <Link to="/register" className={solid}>Bergabung</Link>
      </>
    );
  }

  return (
    <>
      <Link to="/cart" className={`${ghost} relative`} aria-label={`Keranjang, ${count} buku`}>
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4zm.75-3H7.5M11 7H6.312" />
        </svg>
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-vermilion-500 px-1 text-[10px] font-bold text-white">
            {count}
          </span>
        )}
      </Link>
      <Link to="/profile" className={`${ghost} flex items-center gap-2`}>
        <span
          aria-hidden="true"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-400"
        >
          {(user?.name ?? "U").charAt(0).toUpperCase()}
        </span>
        <span className="hidden sm:inline">Profil</span>
      </Link>
      {isAdmin && <Link to="/admin" className={solid}>Admin Panel</Link>}
      <button type="button" onClick={logout} className={ghost}>
        Sign out
      </button>
    </>
  );
}
