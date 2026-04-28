import React from "react";

// Reusable Button component with different variants
export default function Button({
  children,
  variant = "primary", // primary, outline, ghost
  fullWidth = false,
  className = "",
  ...props
}) {
  // Base classes for all buttons
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg px-4 py-2.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  // Specific classes based on the chosen variant
  const variants = {
    primary:
      "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus:ring-[var(--color-primary)]",
    outline:
      "border border-[var(--border-color)] bg-transparent text-[var(--text-color)] hover:bg-[var(--bg-color)] focus:ring-[var(--border-color)]",
    ghost:
      "bg-transparent text-[var(--text-color)] hover:bg-[var(--bg-color)] focus:ring-gray-200",
  };

  // Combine classes logically
  const widthClass = fullWidth ? "w-full" : "";
  const combinedClasses = `${baseClasses} ${variants[variant]} ${widthClass} ${className}`;

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
