"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Star, Monitor, TrendingUp, Palette, Code, BookOpen } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import CourseImage from "../components/CourseImage";
import api from "../lib/api";
import { useAuth } from "../components/AuthProvider";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get("/courses");
        setCourses(response.data?.data || response.data || []);
      } catch (err) {
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Derive categories from real course data
  const categories = Array.from(new Set(courses.map(c => c.category).filter(Boolean)));

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/categories?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex flex-col gap-16 py-8 pb-24">
      
      {/* 1. Hero Section */}
      <section className="flex flex-col items-center text-center max-w-4xl mx-auto mt-8 md:mt-12 px-4">
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--text-color)] tracking-tight leading-tight">
          What do you want to learn today?
        </h1>
        <p className="text-lg md:text-xl text-gray-500 mt-6 max-w-2xl mx-auto">
          Dive into thousands of courses designed to elevate your professional skills and accelerate your career path.
        </p>
        
        {/* Working Search Bar */}
        <form onSubmit={handleSearch} className="mt-10 w-full max-w-2xl relative shadow-sm rounded-full bg-[var(--surface-color)] border border-[var(--border-color)] flex items-center p-1.5 focus-within:ring-2 focus-within:ring-[var(--color-primary)] transition-shadow">
          <div className="pl-4">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 w-full pl-3 pr-4 py-3 bg-transparent text-[var(--text-color)] placeholder-gray-400 focus:outline-none sm:text-base"
            placeholder="Search for courses, skills, or instructors..."
          />
          <Button type="submit" className="!rounded-full px-6 py-3 font-semibold hidden sm:block">
            Explore
          </Button>
        </form>

        {/* Quick search tags from real categories */}
        {!loading && categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {categories.slice(0, 5).map(cat => (
              <button
                key={cat}
                onClick={() => router.push(`/categories?search=${encodeURIComponent(cat)}`)}
                className="text-xs px-3 py-1.5 rounded-full border border-[var(--border-color)] text-gray-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors bg-[var(--surface-color)]"
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 2. Top Categories Section — built from real API data */}
      <section className="px-4 sm:px-0">
        <div className="mb-6">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-color)]">
            Top Categories
          </h2>
          <p className="text-sm text-gray-500 mt-1">Explore specialized fields to advance your career.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-28 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-gray-400 border border-[var(--border-color)] rounded-2xl">
            No categories yet.
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {categories.map((cat, i) => {
              const colors = [
                "from-blue-900 to-slate-900 text-white",
                "from-indigo-600 to-purple-700 text-white",
                "from-teal-700 to-cyan-800 text-white",
                "from-orange-600 to-red-700 text-white",
                "from-emerald-700 to-green-800 text-white",
                "from-pink-700 to-rose-800 text-white",
              ];
              const color = colors[i % colors.length];
              return (
                <Link
                  key={cat}
                  href={`/categories?search=${encodeURIComponent(cat)}`}
                  className={`flex-1 min-w-[140px] bg-gradient-to-br ${color} rounded-2xl p-5 flex flex-col justify-end group hover:scale-[1.02] transition-transform overflow-hidden relative`}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <h3 className="font-heading font-bold text-lg relative z-10">{cat}</h3>
                  <p className="text-xs opacity-70 relative z-10">
                    {courses.filter(c => c.category === cat).length} course{courses.filter(c => c.category === cat).length !== 1 ? "s" : ""}
                  </p>
                </Link>
              );
            })}
            <Link href="/categories" className="flex-1 min-w-[140px] border-2 border-dashed border-[var(--border-color)] rounded-2xl p-5 flex items-center justify-center text-gray-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors group">
              <span className="text-sm font-medium group-hover:underline">View All →</span>
            </Link>
          </div>
        )}
      </section>

      {/* 3. Trending Courses Section */}
      <section className="px-4 sm:px-0">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-color)]">
              Trending Courses
            </h2>
            <p className="text-sm text-gray-500 mt-1">Highly rated programs students are taking right now.</p>
          </div>
          <Link href="/categories" className="hidden sm:flex text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] items-center gap-1 transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="flex flex-col h-[320px] animate-pulse">
                <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-t-xl w-full" />
                <div className="p-5 flex-1 flex flex-col gap-4">
                  <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                  <div className="mt-auto flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-900/30">
            {error}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No courses available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.slice(0, 4).map(course => (
              <Link key={course._id} href={`/courses/${course._id}`}>
                <Card className="group cursor-pointer flex flex-col relative overflow-hidden h-full hover:shadow-lg transition-shadow">
                  {/* Image */}
                  <div className="h-40 bg-slate-800 relative overflow-hidden flex items-center justify-center">
                    <CourseImage
                      src={course.image}
                      alt={course.title}
                      placeholderIcon={Code}
                      imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      iconSize={40}
                    />
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded">
                        {course.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-heading font-semibold text-[var(--text-color)] line-clamp-2 mb-1 group-hover:text-[var(--color-primary)] transition-colors text-sm leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">{course.instructor?.name || "Expert Instructor"}</p>

                    <div className="mt-auto">
                      <div className="flex items-center gap-1 mb-2">
                        <Star size={12} className="text-yellow-400" fill="currentColor" />
                        <span className="text-xs font-bold text-[var(--text-color)]">{course.rating?.toFixed(1) || "N/A"}</span>
                        <span className="text-xs text-gray-400">({course.students?.length || 0})</span>
                      </div>
                      <span className="text-base font-bold text-[var(--color-primary)]">
                        {course.price === 0 ? "Free" : `$${course.price}`}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 4. CTA Section */}
      <section className="px-4 sm:px-0">
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-indigo-600 rounded-3xl p-10 md:p-16 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent)]" />
          <div className="relative z-10">
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-4">
              {user ? `Welcome back, ${user.name?.split(" ")[0]}!` : "Start Learning Today"}
            </h2>
            <p className="text-indigo-100 mb-8 max-w-lg mx-auto">
              {user
                ? "Continue your journey and discover new skills."
                : "Join thousands of learners building in-demand skills with expert-led courses."}
            </p>
            <Link
              href={user ? "/my-learning" : "/register"}
              className="inline-flex items-center gap-2 bg-white text-[var(--color-primary)] font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
            >
              {user ? "My Learning" : "Get Started Free"} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
