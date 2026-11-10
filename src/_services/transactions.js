import API from "../_api"
import { normalizeTransaction } from "../utils/transactions"

// Semua transaksi (khusus admin).
export const getTransactions = async () => {
  const { data } = await API.get("/transactions")
  return data.data.map(normalizeTransaction)
}

// Riwayat pembelian milik user yang sedang login.
export const getMyTransactions = async () => {
  const { data } = await API.get("/my-transactions")
  return data.data.map(normalizeTransaction)
}

// Beli satu atau beberapa buku. Setiap item dikirim sebagai satu transaksi
// (POST /transactions { book_id, quantity }); backend mengurangi stok-nya.
// Jika gagal di tengah jalan, error membawa `completed` (id buku yang sudah terbeli).
export const checkout = async (items) => {
  const completed = []
  try {
    for (const { book_id, jumlah } of items) {
      await API.post("/transactions", { book_id, quantity: jumlah })
      completed.push(book_id)
    }
  } catch (error) {
    error.completed = completed
    throw error
  }
  return completed
}
