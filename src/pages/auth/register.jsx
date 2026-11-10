import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../_services/auth";
import FormField from "../../components/form-field";
import Logo from "../../components/logo";
import PasswordStrength from "../../components/password-strength";
import { validateRegister } from "../../utils/validators";

const INITIAL_VALUES = {
  name: "",
  email: "",
  username: "",
  password: "",
  password_confirmation: "",
  terms: false,
};

const BENEFITS = [
  "Simpan dan kelola koleksi bukumu",
  "Jelajahi genre dan penulis favorit",
  "Gratis, tanpa biaya langganan",
];

export default function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Error validasi dihitung ulang setiap nilai form berubah.
  const clientErrors = useMemo(() => validateRegister(values), [values]);

  // Tampilkan error hanya jika field sudah disentuh / form sudah dikirim.
  const errorOf = (field) =>
    (touched[field] || submitted ? clientErrors[field] : "") || serverErrors[field]?.[0];

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setServerErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleBlur = (e) =>
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setMessage("");
    if (Object.keys(clientErrors).length > 0) return;

    setLoading(true);
    try {
      await register({
        name: values.name.trim(),
        email: values.email.trim(),
        username: values.username.trim(),
        password: values.password,
        password_confirmation: values.password_confirmation,
      });
      navigate("/login", {
        replace: true,
        state: { message: "Registrasi berhasil! Silakan masuk dengan akunmu." },
      });
    } catch (err) {
      if (err.response?.status === 422) {
        setServerErrors(err.response.data.errors ?? {});
        setMessage(err.response.data.message || "Periksa kembali data yang kamu isi.");
      } else if (err.response) {
        setMessage(err.response.data?.message || "Registrasi gagal. Coba lagi.");
      } else {
        setMessage("Tidak bisa terhubung ke server.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fieldProps = (id) => ({
    id,
    value: values[id],
    onChange: handleChange,
    onBlur: handleBlur,
    error: errorOf(id),
  });

  return (
    <main className="grid min-h-screen bg-gray-900 lg:grid-cols-2">
      {/* Panel brand: hanya tampil di layar besar */}
      <aside
        className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex"
        style={{
          background:
            "radial-gradient(circle at 20% 15%, rgba(212,175,55,0.22), transparent 45%), radial-gradient(circle at 85% 85%, rgba(61,99,221,0.25), transparent 50%), #0b0d14",
        }}
      >
        <Link to="/" aria-label="Kembali ke beranda">
          <Logo size="lg" />
        </Link>

        <div>
          <h2 className="font-display text-4xl font-bold leading-tight text-gray-50">
            Rak bukumu,
            <br />
            di bawah langit malam.
          </h2>
          <ul className="mt-8 space-y-4">
            {BENEFITS.map((text) => (
              <li key={text} className="flex items-center gap-3 text-gray-300">
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-400"
                >
                  ✓
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-gray-500">© Yozora Shelf</p>
      </aside>

      {/* Form registrasi */}
      <section className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 inline-block text-sm text-gray-400 hover:text-indigo-400">
            &larr; Kembali ke beranda
          </Link>
          <Link to="/" className="mb-6 block lg:hidden" aria-label="Yozora Shelf">
            <Logo />
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-gray-50 md:text-3xl">
            Buat akun baru
          </h1>
          <p className="mb-6 mt-2 text-sm text-gray-400">
            Isi data di bawah untuk mulai menggunakan Yozora Shelf.
          </p>

          {message && (
            <p className="mb-5 rounded-lg border border-vermilion-500/40 bg-vermilion-500/10 px-4 py-3 text-sm text-vermilion-400" role="alert">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <FormField {...fieldProps("name")} label="Nama lengkap" placeholder="Contoh: Dewi Lestari" autoComplete="name" />
            <FormField {...fieldProps("email")} label="Email" type="email" placeholder="nama@email.com" autoComplete="email" />
            <FormField
              {...fieldProps("username")}
              label="Username"
              placeholder="dewi_lestari"
              autoComplete="username"
              hint="4–20 karakter: huruf, angka, atau underscore."
            />
            <FormField
              {...fieldProps("password")}
              label="Password"
              type="password"
              placeholder="Minimal 8 karakter"
              autoComplete="new-password"
            >
              <PasswordStrength password={values.password} />
            </FormField>
            <FormField
              {...fieldProps("password_confirmation")}
              label="Konfirmasi password"
              type="password"
              placeholder="Ulangi password"
              autoComplete="new-password"
            />

            <div>
              <label htmlFor="terms" className="flex items-start gap-3 text-sm text-gray-400">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={values.terms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-0.5 h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-indigo-500"
                />
                <span>
                  Saya menyetujui{" "}
                  <a href="#" className="font-medium text-indigo-400 hover:underline">
                    Syarat dan Ketentuan
                  </a>
                </span>
              </label>
              {errorOf("terms") && (
                <p className="mt-1 text-xs text-vermilion-400" role="alert">{errorOf("terms")}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-500 px-5 py-2.5 text-center text-sm font-semibold text-gray-900 hover:bg-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-300/40 disabled:opacity-60"
            >
              {loading ? "Mendaftarkan..." : "Daftar"}
            </button>

            <p className="text-center text-sm text-gray-400">
              Sudah punya akun?{" "}
              <Link to="/login" className="font-medium text-indigo-400 hover:underline">
                Masuk di sini
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
