import React from "react";

// Reusable Input component with label support
export default function Input({
  label,
  id,
  type = "text",
  className = "",
  icon: Icon, // Optional lucide-react icon component
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-[var(--text-color)] mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`block w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] px-3 py-2 text-[var(--text-color)] placeholder-gray-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all sm:text-sm ${
            Icon ? "pl-10" : ""
          } ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}
