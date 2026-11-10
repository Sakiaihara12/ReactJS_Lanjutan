import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getMyTransactions } from "../../_services/transactions";
import Alert from "../../components/alert";
import { formatRupiah, formatTanggal } from "../../utils/format";

export default function History() {
  const successMessage = useLocation().state?.message;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyTransactions();
        setTransactions([...data].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)));
      } catch (err) {
        console.error("Gagal ambil riwayat:", err);
        setError("Riwayat pembelian gagal dimuat.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-50">Riwayat Pembelian</h1>
      <p className="mt-1 text-gray-400">Semua buku yang pernah kamu beli.</p>

      <div className="mt-6 space-y-4">
        <Alert tone="success">{successMessage}</Alert>
        <Alert>{error}</Alert>
        {loading && <p className="text-gray-400">Memuat riwayat...</p>}

        {!loading && !error && transactions.length === 0 && (
          <div className="rounded-lg bg-gray-800 p-8 text-center ring-1 ring-gray-700/60">
            <p className="text-gray-400">Kamu belum pernah membeli buku.</p>
            <Link to="/books" className="mt-4 inline-block text-sm font-medium text-indigo-400 hover:underline">
              Jelajahi buku
            </Link>
          </div>
        )}

        {transactions.map((t) => (
          <article key={t.id} className="rounded-lg bg-gray-800 p-5 ring-1 ring-gray-700/60">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span className="font-medium text-gray-50">{t.orderNumber}</span>
              <span>{formatTanggal(t.tanggal)}</span>
            </div>
            <ul className="mt-3 divide-y divide-gray-700">
              {t.items.map((item, i) => (
                <li key={i} className="flex items-center justify-between gap-4 py-2 text-sm">
                  <span className="text-gray-50">
                    {item.judul} <span className="text-gray-400">× {item.jumlah}</span>
                  </span>
                  <span className="text-gray-300">{formatRupiah(item.harga * item.jumlah)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 flex justify-between border-t border-gray-700 pt-3 font-bold text-gray-50">
              <span>Total</span>
              <span className="text-indigo-400">{formatRupiah(t.total)}</span>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
