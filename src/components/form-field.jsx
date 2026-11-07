import { useState } from "react";

const baseInput =
  "block w-full rounded-lg border bg-gray-700 p-2.5 text-sm text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-1";

// Input dengan label, pesan error, dan (untuk type="password") tombol lihat/sembunyikan.
export default function FormField({
  id,
  label,
  type = "text",
  error,
  hint,
  children,
  ...inputProps
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-50">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={isPassword && visible ? "text" : type}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`${baseInput} ${isPassword ? "pr-16" : ""} ${
            error
              ? "border-vermilion-500 focus:border-vermilion-500 focus:ring-vermilion-500"
              : "border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
          }`}
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-gray-400 hover:text-indigo-400"
            aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
          >
            {visible ? "Sembunyi" : "Lihat"}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-vermilion-400" role="alert">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1 text-xs text-gray-400">
            {hint}
          </p>
        )
      )}
      {children}
    </div>
  );
}
