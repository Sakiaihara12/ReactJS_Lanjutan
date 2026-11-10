export const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const formatTanggal = (value) =>
  value
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "-";

const STORAGE_URL = "http://127.0.0.1:8000/storage";

// Cover dari backend bisa berupa URL penuh atau path relatif di storage Laravel.
export const coverUrl = (cover) => {
  if (!cover) return null;
  if (/^(https?:|data:|blob:)/.test(cover)) return cover;
  return `${STORAGE_URL}/${String(cover).replace(/^\/?(storage\/)?/, "")}`;
};
