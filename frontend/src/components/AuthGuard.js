"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function AuthGuard({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Wait until the authentication check is complete
    if (loading) return;

    if (!user) {
      // User is not authenticated, redirect to login
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (allowedRoles && !allowedRoles.includes(user.role)) {
      // User does not have the required role, redirect to home
      router.push("/");
    } else {
      // User is authenticated and has required role
      setIsAuthorized(true);
    }
  }, [user, loading, router, pathname, allowedRoles]);

  // Show a loading spinner while checking auth status
  if (loading || !isAuthorized) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-(--color-primary)"></div>
      </div>
    );
  }

  // Once authorized, render the protected components
  return <>{children}</>;
}
