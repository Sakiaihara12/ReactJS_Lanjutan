import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/use-auth";

export const CartContext = createContext(null);

const clampQty = (qty, stock) => Math.max(1, Math.min(Number(qty) || 1, stock || 1));

const readCart = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? [];
  } catch {
    return [];
  }
};

// Keranjang disimpan per akun di localStorage, jadi tidak tercampur antar user.
export function CartProvider({ children }) {
  const { user } = useAuth();
  const storageKey = user ? `cart:${user.id ?? user.email}` : null;
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(storageKey ? readCart(storageKey) : []);
  }, [storageKey]);

  const commit = useCallback(
    (next) => {
      setItems(next);
      if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next));
    },
    [storageKey],
  );

  const addItem = useCallback(
    (book, qty = 1) => {
      const existing = items.find((i) => i.id === book.id);
      if (existing) {
        commit(items.map((i) => (i.id === book.id ? { ...i, stock: book.stock, qty: clampQty(i.qty + qty, book.stock) } : i)));
      } else {
        commit([
          ...items,
          {
            id: book.id,
            judul_buku: book.judul_buku,
            harga: Number(book.harga),
            stock: Number(book.stock),
            cover: book.cover ?? null,
            author: book.author?.nama_author ?? "",
            qty: clampQty(qty, book.stock),
          },
        ]);
      }
    },
    [items, commit],
  );

  const setQty = useCallback(
    (id, qty) => commit(items.map((i) => (i.id === id ? { ...i, qty: clampQty(qty, i.stock) } : i))),
    [items, commit],
  );

  const removeItem = useCallback((id) => commit(items.filter((i) => i.id !== id)), [items, commit]);
  const clear = useCallback(() => commit([]), [commit]);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, i) => sum + i.qty, 0),
      total: items.reduce((sum, i) => sum + i.harga * i.qty, 0),
      addItem,
      setQty,
      removeItem,
      clear,
    }),
    [items, addItem, setQty, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
