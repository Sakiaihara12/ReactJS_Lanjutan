// Peran pengguna dan aturan akses berbasis role (dipakai oleh route guard).

export const ROLES = { ADMIN: "admin", USER: "user" };

// Semua role (termasuk admin) masuk ke beranda dulu setelah login.
// Admin membuka panel lewat tombol "Admin Panel" di navbar.
export const homeByRole = () => "/";

// Area /admin hanya boleh dibuka admin; selain itu terbuka untuk semua yang login.
export const isPathAllowed = (path, role) =>
  !path.startsWith("/admin") || role === ROLES.ADMIN;

// Backend bisa mengirim role sebagai string ("admin"), objek ({ name }), array roles, atau flag is_admin.
// Hasilnya selalu dinormalkan menjadi "admin" atau "user".
export const normalizeRole = (user) => {
  const raw = user?.role ?? user?.roles?.[0] ?? (user?.is_admin ? ROLES.ADMIN : "");
  const name = String(raw?.name ?? raw ?? "").toLowerCase();
  return name === "admin" || name === "administrator" ? ROLES.ADMIN : ROLES.USER;
};
