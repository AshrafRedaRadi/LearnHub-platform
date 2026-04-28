"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on auth pages and full-screen layout pages
  if (pathname === "/login" || pathname === "/register" || (pathname && (pathname.startsWith("/learn") || pathname.startsWith("/dashboard")))) {
    return null;
  }

  return (
    <footer className="w-full border-t border-[var(--border-color)] bg-[var(--surface-color)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} LearnHub. All rights reserved.
      </div>
    </footer>
  );
}
