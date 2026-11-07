import { passwordStrength } from "../utils/validators";

const LEVELS = [
  { label: "", color: "bg-gray-600" },
  { label: "Lemah", color: "bg-vermilion-500" },
  { label: "Cukup", color: "bg-indigo-500" },
  { label: "Kuat", color: "bg-emerald-500" },
  { label: "Sangat kuat", color: "bg-emerald-400" },
];

export default function PasswordStrength({ password }) {
  if (!password) return null;
  const score = passwordStrength(password);
  const level = LEVELS[Math.max(score, 1)];

  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= Math.max(score, 1) ? level.color : "bg-gray-600"}`}
          />
        ))}
      </div>
      <p className="mt-1 text-xs text-gray-400">Kekuatan password: {level.label}</p>
    </div>
  );
}
