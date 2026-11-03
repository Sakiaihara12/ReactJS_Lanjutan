import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createAuthor } from "../../../_services/authors";

const inputClass =
  "block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-gray-50 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500";

export default function AuthorCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nama_author: "", negara: "" });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setMessage("");
    try {
      await createAuthor({
        nama_author: form.nama_author.trim(),
        negara: form.negara.trim(),
      });
      navigate("/admin/authors");
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors ?? {});
      } else {
        setMessage("Gagal menyimpan author. Coba lagi.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-8">
      <Link to="/admin/authors" className="text-sm text-gray-400 hover:text-indigo-400">
        &larr; Kembali ke daftar author
      </Link>
      <h1 className="mb-1 mt-3 text-2xl font-bold text-gray-50">Tambah author</h1>
      <p className="mb-6 text-sm text-gray-400">Daftarkan penulis baru untuk koleksi buku.</p>

      {message && (
        <p className="mb-4 rounded-lg border border-vermilion-500/40 bg-vermilion-500/10 px-4 py-3 text-sm text-vermilion-400" role="alert">
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-lg bg-gray-800 p-6 ring-1 ring-gray-700/60">
        <div>
          <label htmlFor="nama_author" className="mb-2 block text-sm font-medium text-gray-50">
            Nama author
          </label>
          <input
            id="nama_author"
            name="nama_author"
            type="text"
            value={form.nama_author}
            onChange={handleChange}
            placeholder="Contoh: Tere Liye"
            required
            className={inputClass}
          />
          {errors.nama_author && <p className="mt-1 text-xs text-vermilion-400">{errors.nama_author[0]}</p>}
        </div>

        <div>
          <label htmlFor="negara" className="mb-2 block text-sm font-medium text-gray-50">
            Negara
          </label>
          <input
            id="negara"
            name="negara"
            type="text"
            value={form.negara}
            onChange={handleChange}
            placeholder="Contoh: Indonesia"
            required
            className={inputClass}
          />
          {errors.negara && <p className="mt-1 text-xs text-vermilion-400">{errors.negara[0]}</p>}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-300/40 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan author"}
          </button>
          <Link to="/admin/authors" className="rounded-lg border border-gray-600 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700">
            Batal
          </Link>
        </div>
      </form>
    </section>
  );
}
