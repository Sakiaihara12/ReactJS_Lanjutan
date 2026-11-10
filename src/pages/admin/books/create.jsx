import { Link, useNavigate } from "react-router-dom";
import { createBook } from "../../../_services/books";
import BookForm from "../../../components/book-form";

export default function BookCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    await createBook(formData);
    navigate("/admin/books");
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/admin/books" className="text-sm text-gray-400 hover:text-indigo-400">
        &larr; Kembali ke daftar buku
      </Link>
      <h1 className="mb-1 mt-3 text-2xl font-bold text-gray-50">Tambah buku</h1>
      <p className="mb-6 text-sm text-gray-400">Isi data buku baru untuk koleksi Yozora Shelf.</p>
      <BookForm submitLabel="Simpan buku" onSubmit={handleSubmit} />
    </section>
  );
}
