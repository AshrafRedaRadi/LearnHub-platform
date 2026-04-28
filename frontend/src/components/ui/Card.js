import React from "react";

export default function Card({ children, className = "", hover = true, ...props }) {
  return (
    <div
      className={`bg-[var(--surface-color)] rounded-2xl border border-[var(--border-color)] overflow-hidden ${
        hover ? "hover:shadow-lg hover:border-[var(--color-primary)]/50 transition-all duration-300" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
