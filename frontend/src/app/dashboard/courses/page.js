"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AuthGuard from "../../../components/AuthGuard";
import CourseImage from "../../../components/CourseImage";
import { useAuth } from "../../../components/AuthProvider";
import api from "../../../lib/api";
import { Plus, Search, BookOpen, Users, Edit, Trash2, Star, X } from "lucide-react";

export default function InstructorCoursesPage() {
  const { user } = useAuth();
  const [allCourses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: ""
  });

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        setLoading(true);
        const res = await api.get("/courses");
        const all = res.data?.data || res.data || [];
        const mine = all.filter(c =>
          (typeof c.instructor === "string" ? c.instructor : c.instructor?._id?.toString()) === user?._id?.toString()
        );
        setCourses(mine);
      } catch (err) {
        setError("Failed to load your courses.");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMyCourses();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price) || 0,
        instructor: user._id
      };
      const res = await api.post("/courses", payload);
      setCourses(prev => [res.data?.data || res.data, ...prev]);
      setIsModalOpen(false);
      setFormData({ title: "", description: "", price: "", category: "", image: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.delete(`/courses/${courseId}`);
      setCourses(prev => prev.filter(c => c._id !== courseId));
    } catch (err) {
      alert("Failed to delete course. You may not have permission.");
    }
  };

  const filtered = allCourses.filter(c => {
    const matchSearch = !searchQuery || c.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  return (
    <AuthGuard allowedRoles={["instructor", "admin"]}>
      <div className="flex h-screen bg-[var(--bg-color)] overflow-hidden">

        {/* Sidebar */}
        <aside className="w-64 border-r border-[var(--border-color)] bg-[var(--surface-color)] hidden md:flex flex-col flex-shrink-0 z-20">
          <div className="h-16 flex items-center px-6 border-b border-[var(--border-color)]">
            <Link href="/" className="font-heading font-bold text-xl tracking-tight text-[var(--text-color)]">
              LearnHub
            </Link>
          </div>
          <div className="p-4">
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-[var(--text-color)] transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
              <span className="text-sm font-medium">← Back to Dashboard</span>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          <header className="h-16 border-b border-[var(--border-color)] bg-[var(--surface-color)]/90 flex items-center justify-between px-6 lg:px-10">
            <h1 className="font-heading font-bold text-xl text-[var(--text-color)]">My Courses</h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              <Plus size={18} /> Create Course
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-6 lg:p-10">

            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search your courses..."
                  className="w-full pl-10 pr-10 py-2 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-900/30">
                {error}
              </div>
            ) : (
              <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl overflow-hidden">
                {filtered.length === 0 ? (
                  <div className="text-center py-16">
                    <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">
                      {searchQuery ? `No courses match "${searchQuery}"` : "You haven't created any courses yet."}
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-[var(--border-color)]">
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Students</th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {filtered.map(course => (
                        <tr key={course._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-slate-800 rounded-lg flex-shrink-0 overflow-hidden relative">
                                <CourseImage src={course.image} alt={course.title} imgClassName="w-full h-full object-cover" iconSize={18} />
                              </div>
                              <Link href={`/courses/${course._id}`} className="font-semibold text-[var(--text-color)] text-sm hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                                {course.title}
                              </Link>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {course.category || "—"}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                              <Users size={14} /> {course.students?.length || 0}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-1 text-sm">
                              <Star size={13} className="text-yellow-400" fill="currentColor" />
                              <span className="font-medium text-[var(--text-color)]">{course.rating?.toFixed(1) || "N/A"}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm font-medium text-[var(--text-color)]">
                            {course.price === 0 ? "Free" : `$${course.price}`}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/courses/${course._id}`} className="p-1.5 text-gray-500 hover:text-[var(--color-primary)] transition-colors rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30" title="View">
                                <Edit size={16} />
                              </Link>
                              <button
                                onClick={() => handleDelete(course._id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--surface-color)] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg text-[var(--text-color)]">Create New Course</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-[var(--text-color)]">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Master React in 30 Days"
                  className="w-full px-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What will students learn?"
                  rows={3}
                  className="w-full px-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price ($)</label>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0 for Free"
                    className="w-full px-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                  <input
                    required
                    type="text"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Development"
                    className="w-full px-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-[var(--border-color)] text-gray-600 dark:text-gray-400 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
