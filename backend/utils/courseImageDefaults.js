/**
 * Default cover URLs when no image is stored (same host/cdn as seed).
 * Keys are matched case-insensitively; unknown categories use `default`.
 */
const CATEGORY_IMAGES = {
  default: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
  "web development": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
  "web design": "https://images.unsplash.com/photo-1581291518066-10499e46a74b?w=800&q=80",
  design: "https://images.unsplash.com/photo-1581291518066-10499e46a74b?w=800&q=80",
  development: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
  business: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
  marketing: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  "data science": "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
};

function getDefaultCourseImage(category) {
  if (!category || typeof category !== "string") {
    return CATEGORY_IMAGES.default;
  }
  const key = category.trim().toLowerCase();
  return CATEGORY_IMAGES[key] || CATEGORY_IMAGES.default;
}

/** True when DB has no usable image URL */
function isMissingCourseImage(image) {
  return image == null || (typeof image === "string" && !image.trim());
}

/**
 * Returns a plain course object with `image` set to a default when missing.
 * Use on every API response so the UI always receives a URL.
 */
function ensureCourseImage(course) {
  if (!course) return course;
  const plain =
    typeof course.toObject === "function"
      ? course.toObject({ virtuals: true })
      : { ...course };
  if (isMissingCourseImage(plain.image)) {
    plain.image = getDefaultCourseImage(plain.category);
  }
  return plain;
}

module.exports = {
  CATEGORY_IMAGES,
  getDefaultCourseImage,
  isMissingCourseImage,
  ensureCourseImage,
};
