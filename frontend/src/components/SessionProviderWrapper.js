"use client";

import { SessionProvider } from "next-auth/react";
import OAuthBridge from "./OAuthBridge";

/**
 * Wraps the app with NextAuth's SessionProvider.
 * Also mounts OAuthBridge which syncs the GitHub session into our AuthProvider.
 * Must be a Client Component because SessionProvider uses React context.
 */
export default function SessionProviderWrapper({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
