// Aturan validasi form registrasi. Tiap fungsi mengembalikan pesan error atau "" jika valid.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_REGEX = /^[\p{L}\s.'-]+$/u;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

export const rules = {
  name: (v) => {
    const value = v.trim();
    if (!value) return "Nama lengkap wajib diisi.";
    if (value.length < 3) return "Nama lengkap minimal 3 karakter.";
    if (!NAME_REGEX.test(value)) return "Nama hanya boleh berisi huruf dan spasi.";
    return "";
  },
  email: (v) => {
    const value = v.trim();
    if (!value) return "Email wajib diisi.";
    if (!EMAIL_REGEX.test(value)) return "Format email tidak valid.";
    return "";
  },
  username: (v) => {
    const value = v.trim();
    if (!value) return "Username wajib diisi.";
    if (value.length < 4) return "Username minimal 4 karakter.";
    if (value.length > 20) return "Username maksimal 20 karakter.";
    if (!USERNAME_REGEX.test(value)) return "Hanya huruf, angka, dan underscore (_).";
    return "";
  },
  password: (v) => {
    if (!v) return "Password wajib diisi.";
    if (v.length < 8) return "Password minimal 8 karakter.";
    if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return "Password harus mengandung huruf dan angka.";
    return "";
  },
  password_confirmation: (v, values) => {
    if (!v) return "Konfirmasi password wajib diisi.";
    if (v !== values.password) return "Konfirmasi password tidak cocok.";
    return "";
  },
  terms: (v) => (v ? "" : "Kamu harus menyetujui syarat dan ketentuan."),
};

// Menghasilkan objek { namaField: pesanError } hanya untuk field yang tidak valid.
export const validateRegister = (values) =>
  Object.keys(rules).reduce((errors, field) => {
    const message = rules[field](values[field], values);
    return message ? { ...errors, [field]: message } : errors;
  }, {});

// Skor kekuatan password 0-4 untuk indikator di form.
export const passwordStrength = (password) => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
};

// ---- Validasi form buku ----

const toNumber = (v) => (v === "" || v === null || v === undefined ? NaN : Number(v));

export const bookRules = {
  judul_buku: (v) => {
    const value = v.trim();
    if (!value) return "Judul buku wajib diisi.";
    if (value.length < 2) return "Judul buku minimal 2 karakter.";
    return "";
  },
  genre_id: (v) => (v ? "" : "Pilih genre utama buku."),
  author_id: (v) => (v ? "" : "Pilih penulis buku."),
  tahun_terbit: (v) => {
    const year = toNumber(v);
    const max = new Date().getFullYear() + 1;
    if (Number.isNaN(year)) return "Tahun terbit wajib diisi.";
    if (!Number.isInteger(year) || year < 1000 || year > max) return `Tahun terbit harus antara 1000 dan ${max}.`;
    return "";
  },
  harga: (v) => {
    const price = toNumber(v);
    if (Number.isNaN(price)) return "Harga wajib diisi.";
    if (price <= 0) return "Harga harus lebih dari 0.";
    return "";
  },
  stock: (v) => {
    const stock = toNumber(v);
    if (Number.isNaN(stock)) return "Stok wajib diisi.";
    if (!Number.isInteger(stock) || stock < 0) return "Stok harus bilangan bulat 0 atau lebih.";
    return "";
  },
};

export const validateBook = (values) =>
  Object.keys(bookRules).reduce((errors, field) => {
    const message = bookRules[field](values[field]);
    return message ? { ...errors, [field]: message } : errors;
  }, {});
