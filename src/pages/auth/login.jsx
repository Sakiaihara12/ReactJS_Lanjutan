import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { isLoggedIn, login } from "../../_services/auth";
import Logo from "../../components/logo";

const inputClass =
  "block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-gray-50 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  if (isLoggedIn()) {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setMessage("");
    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate("/admin", { replace: true });
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors ?? {});
      } else if (err.response) {
        setMessage(err.response.data?.message || "Email atau password salah.");
      } else {
        setMessage(err.message || "Tidak bisa terhubung ke server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-900">
      <div className="mx-auto flex min-h-screen flex-col items-center justify-center px-6 py-8">
        <Link to="/" className="mb-6">
          <Logo size="lg" />
        </Link>

        <div className="w-full rounded-lg bg-gray-800 shadow ring-1 ring-gray-700/60 sm:max-w-md">
          <div className="space-y-5 p-6 sm:p-8">
            <h1 className="text-xl font-bold tracking-tight text-gray-50 md:text-2xl">
              Masuk ke akun admin
            </h1>

            {message && (
              <p className="rounded-lg border border-vermilion-500/40 bg-vermilion-500/10 px-4 py-3 text-sm text-vermilion-400" role="alert">
                {message}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-50">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  autoComplete="email"
                  required
                  className={inputClass}
                />
                {errors.email && <p className="mt-1 text-xs text-vermilion-400">{errors.email[0]}</p>}
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-50">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className={inputClass}
                />
                {errors.password && <p className="mt-1 text-xs text-vermilion-400">{errors.password[0]}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-indigo-500 px-5 py-2.5 text-center text-sm font-semibold text-gray-900 hover:bg-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-300/40 disabled:opacity-60"
              >
                {loading ? "Memproses..." : "Masuk"}
              </button>

              <p className="text-sm font-light text-gray-400">
                Belum punya akun?{" "}
                <Link to="/register" className="font-medium text-indigo-400 hover:underline">
                  Daftar
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
