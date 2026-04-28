export { auth as middleware } from "./auth";

export const config = {
  // Only run the middleware on auth-related paths
  // Don't run on static files, API routes, etc.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
