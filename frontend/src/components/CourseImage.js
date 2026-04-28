"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { resolveCourseImageUrl } from "@/lib/images";

/**
 * Course thumbnail: resolves API-relative URLs, avoids flaky hotlink behavior,
 * and shows a gradient placeholder when missing or failed to load.
 */
export default function CourseImage({
  src,
  alt,
  imgClassName = "w-full h-full object-cover",
  placeholderIcon: PlaceholderIcon = BookOpen,
  iconSize = 40,
}) {
  const url = resolveCourseImageUrl(src);
  const [broken, setBroken] = useState(false);
  const showImg = Boolean(url) && !broken;

  return (
    <>
      {showImg ? (
        <img
          src={url}
          alt={alt || ""}
          className={imgClassName}
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          onError={() => setBroken(true)}
        />
      ) : null}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900 to-slate-900 ${
          showImg ? "hidden" : "flex"
        }`}
      >
        <PlaceholderIcon size={iconSize} className="text-slate-600" />
      </div>
    </>
  );
}
