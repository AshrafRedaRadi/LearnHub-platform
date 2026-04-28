"use client";
import React from "react";
import { usePathname } from "next/navigation";

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const isLearnPage = pathname && pathname.startsWith("/learn");
  const isDashboardPage = pathname && pathname.startsWith("/dashboard");

  if (isLearnPage || isDashboardPage) {
    return <main className="flex-1 w-full flex flex-col">{children}</main>;
  }

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </main>
  );
}
