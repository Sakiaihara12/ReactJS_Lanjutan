// Daftar peringkat dengan batang proporsional (buku terlaris, pembeli teraktif).
export default function RankList({ items, unit, empty = "Belum ada data." }) {
  if (items.length === 0) return <p className="text-sm text-gray-400">{empty}</p>;
  const max = Math.max(...items.map((i) => i.value));

  return (
    <ol className="space-y-4">
      {items.map((item, index) => (
        <li key={item.label}>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2 text-gray-50">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-400">
                {index + 1}
              </span>
              <span className="truncate">{item.label}</span>
            </span>
            <span className="shrink-0 text-gray-400">{item.value} {unit}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-gray-700">
            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ol>
  );
}
