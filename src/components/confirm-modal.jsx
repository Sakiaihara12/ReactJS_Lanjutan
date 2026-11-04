import { useEffect } from "react";

// Dialog konfirmasi hapus. Ditutup dengan tombol Batal, klik latar, atau Esc.
export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Hapus",
  loading = false,
  error = "",
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && !loading && onCancel();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
      onClick={() => !loading && onCancel()}
      role="presentation"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl bg-gray-800 p-6 shadow-xl ring-1 ring-gray-700"
      >
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-vermilion-500/15 text-vermilion-400">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
          </svg>
        </div>
        <h2 id="confirm-title" className="text-lg font-bold text-gray-50">{title}</h2>
        <p id="confirm-message" className="mt-2 text-sm text-gray-400">{message}</p>

        {error && (
          <p className="mt-4 rounded-lg border border-vermilion-500/40 bg-vermilion-500/10 px-3 py-2 text-sm text-vermilion-400" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-60"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-vermilion-500 px-4 py-2 text-sm font-semibold text-white hover:bg-vermilion-600 focus:outline-none focus:ring-4 focus:ring-vermilion-500/40 disabled:opacity-60"
          >
            {loading ? "Menghapus..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
