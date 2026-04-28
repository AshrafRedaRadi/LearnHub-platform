"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AuthGuard from "../../components/AuthGuard";
import CourseImage from "../../components/CourseImage";
import { useAuth } from "../../components/AuthProvider";
import { BookOpen, PlayCircle, Star, ArrowRight } from "lucide-react";
import api from "../../lib/api";

export default function MyLearningPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrolled = async () => {
      try {
        setLoading(true);
        // Use the profile endpoint which returns fully populated enrolledCourses
        const res = await api.get("/users/profile");
        const userData = res.data?.data || res.data;
        setCourses(userData.enrolledCourses || []);
      } catch (err) {
        setError("Failed to load your enrolled courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchEnrolled();
  }, [user]);

  return (
    <AuthGuard>
      <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-[var(--text-color)]">My Learning</h1>
            {!loading && !error && (
              <p className="text-gray-500 mt-1 text-sm">
                {courses.length} course{courses.length !== 1 ? "s" : ""} enrolled
              </p>
            )}
          </div>
          <Link href="/categories" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors">
            Browse More <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-200 dark:bg-gray-800" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                  <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full w-full mt-4" />
                  <div className="h-9 bg-gray-200 dark:bg-gray-800 rounded-lg mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl">
            <p className="text-red-600">{error}</p>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => {
              const courseId = course._id || course;
              const isObject = typeof course === "object";
              return (
                <div
                  key={courseId}
                  className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow"
                >
                  {/* Thumbnail */}
                  <div className="h-40 bg-slate-800 relative overflow-hidden flex items-center justify-center">
                    <CourseImage
                      src={isObject ? course.image : ""}
                      alt={isObject ? course.title : ""}
                      iconSize={36}
                    />
                    {isObject && course.category && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded">
                          {course.category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-heading font-bold text-base text-[var(--text-color)] line-clamp-2 mb-1">
                      {isObject ? course.title : "Course"}
                    </h3>
                    {isObject && (
                      <div className="flex items-center gap-3 mb-3">
                        {course.rating > 0 && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Star size={11} className="text-yellow-400" fill="currentColor" />
                            {course.rating?.toFixed(1)}
                          </span>
                        )}
                        {course.price !== undefined && (
                          <span className="text-xs font-semibold text-[var(--color-primary)]">
                            {course.price === 0 ? "Free" : `$${course.price}`}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-auto">
                      <Link
                        href={`/learn/${courseId}`}
                        className="w-full py-2.5 bg-[var(--color-primary)] text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[var(--color-primary-hover)] transition-colors"
                      >
                        <PlayCircle size={16} /> Continue Learning
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-[var(--text-color)] mb-2">No courses enrolled yet</h2>
            <p className="text-gray-500 mb-6">Discover expert-led courses and start learning today.</p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              Browse Courses <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
