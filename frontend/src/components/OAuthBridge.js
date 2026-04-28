"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "./AuthProvider";

/**
 * OAuthBridge — Listens for a NextAuth session (GitHub OAuth success)
 * and syncs the backend JWT + user into our custom AuthProvider.
 *
 * This must be rendered inside both <SessionProvider> and <AuthProvider>.
 */
export default function OAuthBridge() {
  const { data: session, status } = useSession();
  const { user, setUserFromOAuth } = useAuth();

  useEffect(() => {
    // Hydrate JWT user from OAuth after redirect. Requires an Auth session.
    // If logout() clears only localStorage without next-auth signOut(), this would
    // wrongly re-login the user — AuthProvider.logout awaits signOut() first.
    if (
      status === "authenticated" &&
      session?.backendToken &&
      session?.backendUser &&
      !user
    ) {
      setUserFromOAuth(session.backendUser, session.backendToken);
    }
  }, [session, status, user, setUserFromOAuth]);

  return null; // This is a logic-only component, renders nothing
}
