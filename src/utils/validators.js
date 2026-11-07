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
