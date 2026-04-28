"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Star, BookOpen, ChevronLeft, ChevronRight, X } from "lucide-react";
import Card from "../../components/ui/Card";
import CourseImage from "../../components/CourseImage";
import api from "../../lib/api";

// Debounce hook
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function CategoriesPageContent() {
  const searchParams = useSearchParams();
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & search — pre-populate from URL ?search=
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams?.get("category") || "All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 9;

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/courses");
        setAllCourses(res.data?.data || res.data || []);
      } catch (err) {
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Build unique categories from real data
  const categories = ["All", ...Array.from(new Set(allCourses.map(c => c.category).filter(Boolean)))];

  // Filter & sort
  const filtered = allCourses
    .filter(course => {
      const matchCat = selectedCategory === "All" || course.category === selectedCategory;
      const q = debouncedSearch.toLowerCase();
      const matchSearch = !q ||
        course.title?.toLowerCase().includes(q) ||
        course.category?.toLowerCase().includes(q) ||
        course.description?.toLowerCase().includes(q) ||
        course.instructor?.name?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "price-asc") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-desc") return (b.price || 0) - (a.price || 0);
      // newest — by createdAt or default order
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset to page 1 whenever filters change
  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("newest");
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "All" || sortBy !== "newest";

  return (
    <div className="py-8 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-[var(--text-color)]">Browse All Courses</h1>
        <p className="text-gray-500 mt-2">Explore {allCourses.length} courses across {categories.length - 1} categories.</p>
      </div>

      {/* Search + Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by title, category, instructor..."
            className="w-full pl-10 pr-10 py-2.5 border border-[var(--border-color)] rounded-lg bg-[var(--surface-color)] text-[var(--text-color)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          )}
        </div>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-4 py-2.5 border border-[var(--border-color)] rounded-lg bg-[var(--surface-color)] text-[var(--text-color)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
        >
          <option value="newest">Newest</option>
          <option value="rating">Highest Rated</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-red-600 bg-red-50 dark:bg-red-900/20 dark:border-red-900/40 text-sm font-medium hover:bg-red-100 transition-colors"
          >
            <X size={14} /> Clear Filters
          </button>
        )}
      </div>

      {/* Category Pills */}
      {!loading && categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                selectedCategory === cat
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm"
                  : "border-[var(--border-color)] text-[var(--text-color)] bg-[var(--surface-color)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="flex flex-col animate-pulse">
              <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-t-xl" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
                <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mt-2" />
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-20 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl">
          <Search size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-[var(--text-color)] mb-2">No courses found</h2>
          <p className="text-gray-500 mb-6">Try adjusting your search or filter.</p>
          <button onClick={clearFilters} className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors">
            <X size={16} /> Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Showing <span className="font-semibold text-[var(--text-color)]">{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""}
            {selectedCategory !== "All" && <> in <span className="font-semibold text-[var(--color-primary)]">{selectedCategory}</span></>}
            {debouncedSearch && <> for "<span className="font-semibold">{debouncedSearch}</span>"</>}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginated.map(course => (
              <Link key={course._id} href={`/courses/${course._id}`}>
                <Card className="flex flex-col h-full group cursor-pointer hover:shadow-lg transition-shadow">
                  {/* Course Image */}
                  <div className="h-40 bg-slate-800 relative overflow-hidden flex items-center justify-center">
                    <CourseImage
                      src={course.image}
                      alt={course.title}
                      imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      iconSize={40}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-[var(--color-primary)]/90 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                        {course.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-heading font-bold text-[var(--text-color)] line-clamp-2 mb-1 group-hover:text-[var(--color-primary)] transition-colors leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{course.description}</p>
                    <p className="text-xs text-gray-500 mb-3">
                      By <span className="font-medium">{course.instructor?.name || "Expert Instructor"}</span>
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
                      <div className="flex items-center gap-1">
                        <Star size={13} className="text-yellow-400" fill="currentColor" />
                        <span className="text-sm font-bold text-[var(--text-color)]">{course.rating?.toFixed(1) || "N/A"}</span>
                        <span className="text-xs text-gray-400">({course.students?.length || 0})</span>
                      </div>
                      <span className="text-lg font-bold text-[var(--color-primary)]">
                        {course.price === 0 ? "Free" : `$${course.price}`}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-lg border border-[var(--border-color)] flex items-center justify-center text-gray-500 hover:bg-[var(--surface-color)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
                    page === currentPage
                      ? "bg-[var(--color-primary)] text-white"
                      : "border border-[var(--border-color)] text-[var(--text-color)] hover:bg-[var(--surface-color)]"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-lg border border-[var(--border-color)] flex items-center justify-center text-gray-500 hover:bg-[var(--surface-color)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-8 pb-24 animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4" />
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            ))}
          </div>
        </div>
      }
    >
      <CategoriesPageContent />
    </Suspense>
  );
}
