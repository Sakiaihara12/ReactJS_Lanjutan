import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkout } from "../../_services/transactions";
import Alert from "../../components/alert";
import BookCover from "../../components/book-cover";
import ConfirmModal from "../../components/confirm-modal";
import QuantityInput from "../../components/quantity-input";
import { useCart } from "../../hooks/use-cart";
import { formatRupiah } from "../../utils/format";

export default function Cart() {
  const { items, count, total, setQty, removeItem, clear } = useCart();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setPaying(true);
    setError("");
    try {
      await checkout(items.map((i) => ({ book_id: i.id, jumlah: i.qty })));
      clear();
      navigate("/history", { state: { message: "Checkout berhasil! Pesananmu sudah dibayar." } });
    } catch (err) {
      // Item yang sudah berhasil dibeli sebelum error dihapus dari keranjang.
      err.completed?.forEach(removeItem);
      setError(err.response?.data?.message || "Checkout gagal. Periksa stok buku lalu coba lagi.");
    } finally {
      setPaying(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-screen-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-50">Keranjangmu kosong</h1>
        <p className="mt-2 text-gray-400">Yuk, cari buku yang ingin kamu baca.</p>
        <Link
          to="/books"
          className="mt-6 inline-block rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-indigo-400"
        >
          Jelajahi buku
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-gray-900 py-10">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h1 className="text-3xl font-bold text-gray-50">Keranjang</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 rounded-lg bg-gray-800 p-4 ring-1 ring-gray-700/60">
                <Link to={`/books/${item.id}`} className="w-20 shrink-0 sm:w-24">
                  <BookCover book={{ ...item, author: { nama_author: item.author } }} compact />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link to={`/books/${item.id}`} className="line-clamp-2 font-display text-lg font-bold text-gray-50 hover:text-indigo-400">
                    {item.judul_buku}
                  </Link>
                  <p className="text-sm text-gray-400">{item.author}</p>
                  <p className="mt-1 text-sm text-indigo-400">{formatRupiah(item.harga)}</p>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                    <div className="flex items-center gap-3">
                      <QuantityInput value={item.qty} max={item.stock} onChange={(q) => setQty(item.id, q)} />
                      <span className="text-xs text-gray-500">Stok {item.stock}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-gray-50">{formatRupiah(item.harga * item.qty)}</span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-sm font-medium text-vermilion-400 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-lg bg-gray-800 p-6 ring-1 ring-gray-700/60 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-gray-50">Ringkasan</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <dt>Jumlah buku</dt>
                <dd>{count}</dd>
              </div>
              <div className="flex justify-between border-t border-gray-700 pt-3 text-base font-bold text-gray-50">
                <dt>Total</dt>
                <dd className="text-indigo-400">{formatRupiah(total)}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => {
                setError("");
                setModalOpen(true);
              }}
              className="mt-6 w-full rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-300/40"
            >
              Checkout
            </button>
            <Alert className="mt-4">{!modalOpen && error}</Alert>
          </aside>
        </div>
      </div>

      <ConfirmModal
        open={modalOpen}
        variant="primary"
        title="Konfirmasi checkout"
        message={`Bayar ${count} buku dengan total ${formatRupiah(total)}? Pembayaran langsung dikonfirmasi dan stok buku berkurang.`}
        confirmLabel="Konfirmasi & bayar"
        loading={paying}
        error={error}
        onConfirm={handleCheckout}
        onCancel={() => setModalOpen(false)}
      />
    </section>
  );
}
