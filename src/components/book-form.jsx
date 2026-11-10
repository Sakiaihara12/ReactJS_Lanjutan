import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAuthors } from "../_services/authors";
import { getGenres } from "../_services/genres";
import { coverUrl } from "../utils/format";
import { validateBook } from "../utils/validators";
import Alert from "./alert";
import FormField from "./form-field";

const EMPTY = { judul_buku: "", genre_id: "", author_id: "", tahun_terbit: "", harga: "", stock: "", deskripsi: "" };
const MAX_COVER_MB = 2;
const inputClass =
  "block w-full rounded-lg border bg-gray-700 p-2.5 text-sm text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-1";
const ok = "border-gray-600 focus:border-indigo-500 focus:ring-indigo-500";
const bad = "border-vermilion-500 focus:border-vermilion-500 focus:ring-vermilion-500";

// Form buku untuk tambah dan edit. `book` terisi saat edit.
// `onSubmit(formData)` harus mengembalikan promise; jika sukses, parent yang berpindah halaman.
export default function BookForm({ book, submitLabel, onSubmit }) {
  const [values, setValues] = useState(() =>
    book
      ? {
          judul_buku: book.judul_buku ?? "",
          genre_id: String(book.genre_id ?? book.genre?.id ?? ""),
          author_id: String(book.author_id ?? book.author?.id ?? ""),
          tahun_terbit: String(book.tahun_terbit ?? ""),
          harga: String(book.harga ?? ""),
          stock: String(book.stock ?? ""),
          deskripsi: book.deskripsi ?? "",
        }
      : EMPTY,
  );
  const [cover, setCover] = useState(null);
  const [coverError, setCoverError] = useState("");
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const loadOptions = useCallback(async () => {
    setOptionsLoading(true);
    try {
      const [g, a] = await Promise.all([getGenres(), getAuthors()]);
      setGenres(g);
      setAuthors(a);
    } catch (err) {
      console.error("Gagal ambil genre/author:", err);
      setMessage("Daftar genre atau author gagal dimuat.");
    } finally {
      setOptionsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  const preview = useMemo(
    () => (cover ? URL.createObjectURL(cover) : coverUrl(book?.cover)),
    [cover, book],
  );
  useEffect(() => () => cover && URL.revokeObjectURL(preview), [cover, preview]);

  const clientErrors = useMemo(() => validateBook(values), [values]);
  const errorOf = (field) =>
    (touched[field] || submitted ? clientErrors[field] : "") || serverErrors[field]?.[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setServerErrors((prev) => ({ ...prev, [name]: undefined }));
  };
  const handleBlur = (e) => setTouched((prev) => ({ ...prev, [e.target.name]: true }));

  const handleCover = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return setCoverError("File harus berupa gambar (JPG, PNG, atau WebP).");
    if (file.size > MAX_COVER_MB * 1024 * 1024) return setCoverError(`Ukuran cover maksimal ${MAX_COVER_MB} MB.`);
    setCoverError("");
    setCover(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setMessage("");
    if (Object.keys(clientErrors).length > 0) return;

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, typeof value === "string" ? value.trim() : value));
    if (cover) formData.append("cover", cover);

    setSaving(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      if (err.response?.status === 422) {
        setServerErrors(err.response.data.errors ?? {});
        setMessage(err.response.data.message || "Periksa kembali data yang kamu isi.");
      } else {
        setMessage(err.response?.data?.message || "Gagal menyimpan buku. Coba lagi.");
      }
    } finally {
      setSaving(false);
    }
  };

  const fieldProps = (id) => ({ id, value: values[id], onChange: handleChange, onBlur: handleBlur, error: errorOf(id) });
  const missingOptions = !optionsLoading && (genres.length === 0 || authors.length === 0);

  const select = (id, label, list, labelKey, emptyText, createPath, createLabel) => (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-50">{label}</label>
      <select
        id={id}
        name={id}
        value={values[id]}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={optionsLoading}
        aria-invalid={!!errorOf(id)}
        className={`${inputClass} ${errorOf(id) ? bad : ok}`}
      >
        <option value="">{optionsLoading ? "Memuat..." : `Pilih ${label.toLowerCase()}`}</option>
        {list.map((item) => (
          <option key={item.id} value={item.id}>{item[labelKey]}</option>
        ))}
      </select>
      {errorOf(id) && <p className="mt-1 text-xs text-vermilion-400" role="alert">{errorOf(id)}</p>}
      <p className="mt-1 text-xs text-gray-400">
        {list.length === 0 && !optionsLoading ? `${emptyText} ` : ""}
        <Link to={createPath} target="_blank" rel="noreferrer" className="font-medium text-indigo-400 hover:underline">
          {createLabel}
        </Link>
      </p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-lg bg-gray-800 p-6 ring-1 ring-gray-700/60">
      <Alert>{message}</Alert>
      {missingOptions && (
        <Alert tone="warning">
          Genre dan penulis harus sudah ada sebelum menambah buku. Tambahkan lewat tautan di bawah kolom
          terkait, lalu klik{" "}
          <button type="button" onClick={loadOptions} className="font-semibold underline">
            segarkan daftar
          </button>
          .
        </Alert>
      )}

      <FormField {...fieldProps("judul_buku")} label="Judul buku" placeholder="Contoh: Laskar Pelangi" />

      <div className="grid gap-5 sm:grid-cols-2">
        {select("genre_id", "Genre utama", genres, "nama_genre", "Belum ada genre.", "/admin/genres/create", "+ Tambah genre baru")}
        {select("author_id", "Penulis", authors, "nama_author", "Belum ada penulis.", "/admin/authors/create", "+ Tambah penulis baru")}
      </div>
      <button type="button" onClick={loadOptions} className="-mt-2 text-xs text-gray-400 hover:text-indigo-400">
        ↻ Segarkan daftar genre & penulis
      </button>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField {...fieldProps("tahun_terbit")} label="Tahun terbit" type="number" placeholder="2024" />
        <FormField {...fieldProps("harga")} label="Harga (Rp)" type="number" min="0" step="1000" placeholder="75000" />
        <FormField {...fieldProps("stock")} label="Stok" type="number" min="0" placeholder="20" />
      </div>

      <div>
        <label htmlFor="deskripsi" className="mb-2 block text-sm font-medium text-gray-50">
          Deskripsi <span className="font-normal text-gray-400">(opsional)</span>
        </label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          rows="5"
          value={values.deskripsi}
          onChange={handleChange}
          placeholder="Ringkasan atau sinopsis buku..."
          className={`${inputClass} ${ok}`}
        />
        {serverErrors.deskripsi && <p className="mt-1 text-xs text-vermilion-400">{serverErrors.deskripsi[0]}</p>}
      </div>

      <div>
        <label htmlFor="cover" className="mb-2 block text-sm font-medium text-gray-50">
          Cover buku <span className="font-normal text-gray-400">(JPG/PNG/WebP, maks. {MAX_COVER_MB} MB)</span>
        </label>
        <div className="flex items-start gap-4">
          <div className="flex h-32 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-700 ring-1 ring-gray-600">
            {preview ? (
              <img src={preview} alt="Pratinjau cover" className="h-full w-full object-cover" />
            ) : (
              <span className="font-display text-3xl text-gray-500" aria-hidden="true">本</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <input
              id="cover"
              name="cover"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleCover}
              className="block w-full cursor-pointer rounded-lg border border-gray-600 bg-gray-700 text-sm text-gray-300 file:mr-4 file:cursor-pointer file:border-0 file:bg-indigo-500 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-gray-900 hover:file:bg-indigo-400"
            />
            {(coverError || serverErrors.cover) && (
              <p className="mt-1 text-xs text-vermilion-400" role="alert">{coverError || serverErrors.cover[0]}</p>
            )}
            {book?.cover && !cover && <p className="mt-1 text-xs text-gray-400">Kosongkan jika tidak ingin mengganti cover.</p>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || optionsLoading || missingOptions}
          className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-300/40 disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : submitLabel}
        </button>
        <Link to="/admin/books" className="rounded-lg border border-gray-600 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700">
          Batal
        </Link>
      </div>
    </form>
  );
}
