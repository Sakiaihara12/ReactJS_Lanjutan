// Tampilan halaman status penuh layar (403, 404, dst).
export default function StatusPage({ code, title, message, children }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 px-6 text-center">
      <p className="font-display text-7xl font-bold text-indigo-500">{code}</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-50">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-gray-400">{message}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>
    </main>
  );
}
