// Pengatur jumlah (- 1 +) dengan batas minimal 1 dan maksimal sesuai stok.
export default function QuantityInput({ value, max, onChange, label = "Jumlah" }) {
  const set = (next) => onChange(Math.max(1, Math.min(Number(next) || 1, max)));
  const btn =
    "flex h-9 w-9 items-center justify-center text-lg text-gray-200 hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-transparent";

  return (
    <div className="inline-flex items-center overflow-hidden rounded-lg border border-gray-600" role="group" aria-label={label}>
      <button type="button" className={btn} onClick={() => set(value - 1)} disabled={value <= 1} aria-label="Kurangi jumlah">
        −
      </button>
      <input
        type="number"
        min="1"
        max={max}
        value={value}
        onChange={(e) => set(e.target.value)}
        aria-label={label}
        className="h-9 w-12 border-x border-gray-600 bg-gray-800 text-center text-sm text-gray-50 [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button type="button" className={btn} onClick={() => set(value + 1)} disabled={value >= max} aria-label="Tambah jumlah">
        +
      </button>
    </div>
  );
}
