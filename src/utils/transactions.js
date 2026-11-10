// Bentuk data transaksi dari backend bisa berbeda-beda (satu baris per buku, atau
// transaksi dengan banyak item). Fungsi ini menyeragamkannya untuk dipakai di UI.

export const normalizeTransaction = (t) => {
  const rawItems =
    t.items ?? t.details ?? t.detail_transactions ?? t.detail_transaksi ?? t.transaction_details;

  const source = rawItems ?? [
    { book: t.book, book_id: t.book_id, jumlah: t.jumlah ?? t.quantity ?? t.qty, harga: t.harga ?? t.price },
  ];

  const items = source.map((i) => ({
    book_id: i.book_id ?? i.book?.id,
    judul: i.book?.judul_buku ?? i.judul_buku ?? `Buku #${i.book_id ?? "?"}`,
    jumlah: Number(i.jumlah ?? i.quantity ?? i.qty ?? 1),
    harga: Number(i.harga ?? i.price ?? i.book?.harga ?? 0),
  }));

  // Jika total dari backend kosong/0, hitung dari harga buku x jumlah.
  const computed = items.reduce((sum, i) => sum + i.harga * i.jumlah, 0);
  const total = Number(t.total_amount ?? t.total ?? t.total_harga ?? t.total_price) || computed;

  return {
    id: t.id,
    orderNumber: t.order_number ?? `#${t.id}`,
    tanggal: t.created_at ?? t.tanggal,
    user: t.user ?? null,
    items,
    total,
  };
};

// Hitung total per kunci, urut terbesar. Dipakai untuk "buku terlaris" dan "pembeli teraktif".
export const rankBy = (list, getKey, getValue = () => 1, limit = 5) => {
  const totals = new Map();
  list.forEach((entry) => {
    const key = getKey(entry);
    if (key) totals.set(key, (totals.get(key) ?? 0) + getValue(entry));
  });
  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
};
