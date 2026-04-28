/**
 * Normalize course image URLs for <img src>.
 * - Absolute http(s) URLs are returned as-is (optional fix for protocol-relative //).
 * - Paths like /uploads/… are prefixed with the API origin from NEXT_PUBLIC_API_URL
 *   so the browser does not request http://localhost:3000/uploads/… by mistake.
 */
export function resolveCourseImageUrl(raw) {
  if (raw == null || typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const apiBase =
    typeof process.env.NEXT_PUBLIC_API_URL === "string" &&
    process.env.NEXT_PUBLIC_API_URL.trim()
      ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/i, "")
      : "http://localhost:5000";

  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${apiBase}${path}`;
}
