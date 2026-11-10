const TONES = {
  error: "border-vermilion-500/40 bg-vermilion-500/10 text-vermilion-400",
  success: "border-night-500/40 bg-night-500/10 text-night-400",
  warning: "border-indigo-500/40 bg-indigo-500/10 text-indigo-300",
};

export default function Alert({ tone = "error", children, className = "" }) {
  if (!children) return null;
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-lg border px-4 py-3 text-sm ${TONES[tone]} ${className}`}
    >
      {children}
    </p>
  );
}
