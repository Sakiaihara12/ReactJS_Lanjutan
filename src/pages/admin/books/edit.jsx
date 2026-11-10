import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getBook, updateBook } from "../../../_services/books";
import Alert from "../../../components/alert";
import BookForm from "../../../components/book-form";

export default function BookEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setBook(await getBook(id));
      } catch (err) {
        console.error("Gagal ambil buku:", err);
        setError("Buku tidak ditemukan atau gagal dimuat.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (formData) => {
    await updateBook(id, formData);
    navigate("/admin/books");
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/admin/books" className="text-sm text-gray-400 hover:text-indigo-400">
        &larr; Kembali ke daftar buku
      </Link>
      <h1 className="mb-1 mt-3 text-2xl font-bold text-gray-50">Edit buku</h1>
      <p className="mb-6 text-sm text-gray-400">Perbarui data buku yang sudah ada.</p>

      <Alert className="mb-4">{error}</Alert>
      {loading && <p className="text-sm text-gray-400">Memuat data...</p>}
      {book && <BookForm book={book} submitLabel="Simpan perubahan" onSubmit={handleSubmit} />}
    </section>
  );
}
