export default function Logo({ size = "md", showText = true }) {
  const box = size === "lg" ? "h-11 w-11 text-2xl" : "h-9 w-9 text-xl";

  return (
    <span className="inline-flex items-center gap-3">
      <span
        aria-hidden="true"
        className={`relative inline-flex shrink-0 items-center justify-center rounded-lg font-display font-bold text-gray-900 ${box}`}
        style={{
          background:
            "linear-gradient(135deg, #f0d27a 0%, #d4af37 55%, #a8841c 100%)",
        }}
      >
        本
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-vermilion-500 ring-2 ring-gray-800" />
      </span>
      {showText && (
        <span className="whitespace-nowrap font-display text-xl font-bold tracking-wide text-gray-50">
          Yozora Shelf
        </span>
      )}
    </span>
  );
}
