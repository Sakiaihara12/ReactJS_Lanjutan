import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkout } from "../_services/transactions";
import { useAuth } from "../hooks/use-auth";
import { useCart } from "../hooks/use-cart";
import { formatRupiah } from "../utils/format";
import ConfirmModal from "./confirm-modal";

// Tombol "Keranjang" dan "Beli" untuk satu buku. Tamu diarahkan ke login dulu.
export default function BookActions({ book, quantity = 1 }) {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  const soldOut = Number(book.stock) <= 0;
  const goLogin = () => navigate("/login", { state: { from: location.pathname } });

  const handleAdd = () => {
    if (!isAuthenticated) return goLogin();
    addItem(book, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuy = () => {
    if (!isAuthenticated) return goLogin();
    setError("");
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    setBuying(true);
    setError("");
    try {
      await checkout([{ book_id: book.id, jumlah: quantity }]);
      navigate("/history", { state: { message: `Pembelian "${book.judul_buku}" berhasil.` } });
    } catch (err) {
      setError(err.response?.data?.message || "Pembelian gagal. Coba lagi.");
    } finally {
      setBuying(false);
    }
  };

  if (soldOut) {
    return (
      <button type="button" disabled className="w-full rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-400">
        Stok habis
      </button>
    );
  }

  return (
    <>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 rounded-lg border border-indigo-500/60 px-3 py-2 text-sm font-semibold text-indigo-400 hover:bg-indigo-500/10 focus:outline-none focus:ring-4 focus:ring-indigo-300/30"
        >
          {added ? "Ditambahkan ✓" : "+ Keranjang"}
        </button>
        <button
          type="button"
          onClick={handleBuy}
          className="flex-1 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-300/40"
        >
          Beli
        </button>
      </div>

      <ConfirmModal
        open={modalOpen}
        variant="primary"
        title="Konfirmasi pembelian"
        message={`Beli ${quantity} × "${book.judul_buku}" seharga ${formatRupiah(Number(book.harga) * quantity)}? Pembayaran langsung dikonfirmasi dan stok buku berkurang.`}
        confirmLabel="Beli sekarang"
        loadingLabel="Memproses..."
        loading={buying}
        error={error}
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </>
  );
}
