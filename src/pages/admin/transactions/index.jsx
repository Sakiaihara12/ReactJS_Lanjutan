import { useEffect, useState } from "react";
import { getTransactions } from "../../../_services/transactions";
import Alert from "../../../components/alert";
import { formatRupiah, formatTanggal } from "../../../utils/format";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTransactions();
        setTransactions([...data].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)));
      } catch (err) {
        console.error("Gagal ambil transaksi:", err);
        setError("Data transaksi gagal dimuat. Pastikan endpoint GET /api/transactions tersedia untuk admin.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = transactions.filter((t) =>
    `${t.orderNumber} ${t.user?.name ?? ""} ${t.user?.email ?? ""} ${t.items.map((i) => i.judul).join(" ")}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  const revenue = filtered.reduce((sum, t) => sum + t.total, 0);
  const sold = filtered.reduce((sum, t) => sum + t.items.reduce((s, i) => s + i.jumlah, 0), 0);

  return (
    <section className="p-3 sm:p-5">
      <h1 className="text-2xl font-bold text-gray-50">Transactions</h1>
      <p className="mb-5 mt-1 text-sm text-gray-400">Riwayat pembelian buku oleh pengguna.</p>

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        {[
          ["Transaksi", filtered.length],
          ["Buku terjual", sold],
          ["Pendapatan", formatRupiah(revenue)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-gray-800 p-4 ring-1 ring-gray-700/60">
            <p className="text-sm text-gray-400">{label}</p>
            <p className="mt-1 text-xl font-bold text-gray-50">{value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg bg-gray-800 shadow-md ring-1 ring-gray-700/60">
        <div className="space-y-3 p-4">
          <label htmlFor="search-trx" className="sr-only">Cari transaksi</label>
          <input
            id="search-trx"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari no. order, pembeli, atau judul buku..."
            className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-gray-50 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 md:w-1/2"
          />
          <Alert>{error}</Alert>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-700 text-xs uppercase text-gray-300">
              <tr>
                <th scope="col" className="px-4 py-3">No. Order</th>
                <th scope="col" className="px-4 py-3">Tanggal</th>
                <th scope="col" className="px-4 py-3">Pembeli</th>
                <th scope="col" className="px-4 py-3">Buku dibeli</th>
                <th scope="col" className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center">Memuat data...</td></tr>
              ) : filtered.length > 0 ? (
                filtered.map((t) => (
                  <tr key={t.id} className="border-b border-gray-700 align-top hover:bg-gray-700/40">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-50">{t.orderNumber}</td>
                    <td className="whitespace-nowrap px-4 py-3">{formatTanggal(t.tanggal)}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-50">{t.user?.name ?? "-"}</p>
                      <p className="text-xs">{t.user?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <ul className="space-y-1">
                        {t.items.map((item, i) => (
                          <li key={i} className="text-gray-300">
                            {item.judul} <span className="text-gray-500">× {item.jumlah}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-indigo-400">
                      {formatRupiah(t.total)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="px-4 py-8 text-center">Belum ada transaksi</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
