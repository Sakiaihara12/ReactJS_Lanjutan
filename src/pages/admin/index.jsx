import { useEffect, useState } from "react";
import { getBooks } from "../../_services/books";
import { getTransactions } from "../../_services/transactions";
import { getUsers } from "../../_services/users";
import RankList from "../../components/rank-list";
import { formatRupiah } from "../../utils/format";
import { rankBy } from "../../utils/transactions";

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-800 p-5 ring-1 ring-gray-700/60">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-50">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState({ books: [], users: [], transactions: [] });
  const [failed, setFailed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const names = ["buku", "pengguna", "transaksi"];
      const results = await Promise.allSettled([getBooks(), getUsers(), getTransactions()]);
      setData({
        books: results[0].value ?? [],
        users: results[1].value ?? [],
        transactions: results[2].value ?? [],
      });
      setFailed(names.filter((_, i) => results[i].status === "rejected"));
      setLoading(false);
    };
    fetchData();
  }, []);

  const { books, users, transactions } = data;
  const revenue = transactions.reduce((sum, t) => sum + t.total, 0);
  const allItems = transactions.flatMap((t) => t.items);

  const topBooks = rankBy(allItems, (i) => i.judul, (i) => i.jumlah);
  const topBuyers = rankBy(transactions, (t) => t.user?.name ?? t.user?.email);

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-50">Dashboard</h1>
      <p className="mt-1 text-gray-400">Ringkasan toko Yozora Shelf.</p>

      {failed.length > 0 && (
        <p className="mt-4 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-300" role="status">
          Data {failed.join(", ")} belum bisa dimuat dari server, sehingga angkanya tampil kosong.
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total buku" value={loading ? "..." : books.length} />
        <StatCard label="Total pengguna" value={loading ? "..." : users.length} />
        <StatCard label="Total transaksi" value={loading ? "..." : transactions.length} />
        <StatCard label="Pendapatan" value={loading ? "..." : formatRupiah(revenue)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-gray-800 p-6 ring-1 ring-gray-700/60">
          <h2 className="mb-4 text-lg font-bold text-gray-50">Buku terlaris</h2>
          <RankList items={topBooks} unit="terjual" empty="Belum ada buku yang terjual." />
        </div>
        <div className="rounded-lg bg-gray-800 p-6 ring-1 ring-gray-700/60">
          <h2 className="mb-1 text-lg font-bold text-gray-50">Pelanggan teraktif</h2>
          <p className="mb-4 text-xs text-gray-400">Berdasarkan jumlah transaksi.</p>
          <RankList items={topBuyers} unit="transaksi" empty="Belum ada transaksi." />
        </div>
      </div>
    </>
  );
}
