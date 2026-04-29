"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard, BookOpen, Plus, Search, Bell, Users2,
  Banknote, Star, X, ChevronRight, Trash2, AlertCircle,
  CheckCircle2, Loader2, Home, LogOut, Menu, Moon, Sun
} from "lucide-react";
import AuthGuard from "../../components/AuthGuard";
import CourseImage from "../../components/CourseImage";
import { useAuth } from "../../components/AuthProvider";
import { useTheme } from "../../components/ThemeProvider";
import api from "../../lib/api";

// ─── Toast Component ─────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white text-sm font-medium animate-in slide-in-from-bottom-4 ${type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
      {type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={16} /></button>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ activeView, onNavigate, user, onLogout, isMobileOpen, onCloseMobile }) {
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "create", label: "Create Course", icon: Plus },
  ];

  const handleNav = (id) => {
    onNavigate(id);
    onCloseMobile?.();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-[var(--border-color)] bg-[var(--surface-color)] hidden md:flex flex-col flex-shrink-0 z-20">
        <div className="h-16 flex items-center px-6 border-b border-[var(--border-color)]">
          <Link href="/" className="font-heading font-bold text-xl tracking-tight text-[var(--text-color)]">LearnHub</Link>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 mb-6 p-3 bg-indigo-50 dark:bg-slate-800 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() || "I"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--text-color)] truncate">{user?.name}</p>
              <p className="text-xs text-gray-500">Instructor</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeView === id ? "bg-indigo-50 text-[var(--color-primary)] dark:bg-slate-800 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[var(--text-color)]"}`}
              >
                <Icon size={18} /> {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 space-y-1">
          <Link href="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[var(--text-color)] transition-colors">
            <Home size={18} /> Home
          </Link>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onCloseMobile}
          />
          {/* Mobile Sidebar */}
          <aside className="fixed left-0 top-0 h-full w-64 bg-[var(--surface-color)] border-r border-[var(--border-color)] z-50 md:hidden flex flex-col transform transition-transform duration-300">
            <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--border-color)]">
              <Link href="/" className="font-heading font-bold text-xl tracking-tight text-[var(--text-color)]">LearnHub</Link>
              <button onClick={onCloseMobile} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-3 mb-6 p-3 bg-indigo-50 dark:bg-slate-800 rounded-xl">
                <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {user?.name?.charAt(0).toUpperCase() || "I"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-color)] truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500">Instructor</p>
                </div>
              </div>

              <nav className="space-y-1">
                {navItems.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleNav(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeView === id ? "bg-indigo-50 text-[var(--color-primary)] dark:bg-slate-800 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[var(--text-color)]"}`}
                  >
                    <Icon size={18} /> {label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-auto p-4 space-y-1">
              <Link href="/" onClick={onCloseMobile} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[var(--text-color)] transition-colors">
                <Home size={18} /> Home
              </Link>
              <button onClick={() => { onLogout(); onCloseMobile(); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <LogOut size={18} /> Log Out
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

// ─── Create Course Form ───────────────────────────────────────────────────────
function CreateCourseForm({ onSuccess, showToast }) {
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "", image: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (form.price === "" || isNaN(Number(form.price)) || Number(form.price) < 0) e.price = "Valid price is required";
    if (!form.category.trim()) e.category = "Category is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (!payload.image) delete payload.image;
      const res = await api.post("/courses", payload);
      showToast("Course created successfully! 🎉", "success");
      onSuccess(res.data?.data || res.data);
      setForm({ title: "", description: "", price: "", category: "", image: "" });
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create course", "error");
    } finally {
      setLoading(false);
    }
  };

  const field = (key, label, type = "text", placeholder = "") => (
    <div>
      <label className="block text-sm font-medium text-[var(--text-color)] mb-1">{label}</label>
      {key === "description" ? (
        <textarea
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          rows={4}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 border rounded-lg bg-[var(--bg-color)] text-[var(--text-color)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none ${errors[key] ? "border-red-400" : "border-[var(--border-color)]"}`}
        />
      ) : (
        <input
          type={type}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 border rounded-lg bg-[var(--bg-color)] text-[var(--text-color)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${errors[key] ? "border-red-400" : "border-[var(--border-color)]"}`}
        />
      )}
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-heading font-bold text-[var(--text-color)] mb-6">Create New Course</h2>
      <form onSubmit={handleSubmit} className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl p-8 space-y-5">
        {field("title", "Course Title", "text", "e.g. Complete React Developer Course")}
        {field("description", "Description", "textarea", "Describe what students will learn...")}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {field("price", "Price ($)", "number", "0 for free")}
          {field("category", "Category", "text", "e.g. Web Development")}
        </div>
        {field("image", "Course Image URL (optional)", "url", "https://...")}

        {/* Image Preview */}
        {form.image && (
          <div className="relative h-40 rounded-xl overflow-hidden border border-[var(--border-color)]">
            <img src={form.image} alt="Preview" className="w-full h-full object-cover" onError={e => e.target.style.display = "none"} />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 size={18} className="animate-spin" /> Creating...</> : <><Plus size={18} /> Create Course</>}
        </button>
      </form>
    </div>
  );
}

// ─── Add Lesson Form ──────────────────────────────────────────────────────────
function AddLessonForm({ courseId, existingCount, onSuccess, showToast }) {
  const [form, setForm] = useState({ title: "", videoUrl: "", duration: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.videoUrl.trim() || !form.duration) {
      showToast("All fields are required", "error"); return;
    }
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        videoUrl: form.videoUrl,
        duration: Number(form.duration),
        courseId,
        order: existingCount + 1,
      };
      const res = await api.post("/lessons", payload);
      showToast("Lesson added! ✅", "success");
      onSuccess(res.data?.data);
      setForm({ title: "", videoUrl: "", duration: "" });
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add lesson", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-5 bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 rounded-xl space-y-4">
      <h4 className="font-semibold text-[var(--text-color)]">Add New Lesson</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="Lesson title" required
          className="px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-color)] text-[var(--text-color)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        <input
          type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
          placeholder="Duration (minutes)" required min={1}
          className="px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-color)] text-[var(--text-color)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>
      <input
        type="url" value={form.videoUrl} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
        placeholder="Video URL (YouTube embed, etc.)" required
        className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-color)] text-[var(--text-color)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
      />
      <button type="submit" disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-60"
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
        {loading ? "Adding..." : "Add Lesson"}
      </button>
    </form>
  );
}

// ─── My Courses View ──────────────────────────────────────────────────────────
function MyCoursesView({ courses, loading, onDelete, showToast }) {
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [courseLessons, setCourseLessons] = useState({});
  const [lessonLoading, setLessonLoading] = useState(null);

  const toggleCourse = async (courseId) => {
    if (expandedCourse === courseId) { setExpandedCourse(null); return; }
    setExpandedCourse(courseId);
    if (!courseLessons[courseId]) {
      setLessonLoading(courseId);
      try {
        const res = await api.get(`/courses/${courseId}/lessons`);
        setCourseLessons(prev => ({ ...prev, [courseId]: res.data?.data || [] }));
      } catch { setCourseLessons(prev => ({ ...prev, [courseId]: [] })); }
      finally { setLessonLoading(null); }
    }
  };

  const handleLessonAdded = (courseId, lesson) => {
    setCourseLessons(prev => ({ ...prev, [courseId]: [...(prev[courseId] || []), lesson] }));
  };

  if (loading) return (
    <div className="space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />)}
    </div>
  );

  if (courses.length === 0) return (
    <div className="text-center py-20 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl">
      <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
      <h3 className="font-bold text-[var(--text-color)] mb-2">No courses yet</h3>
      <p className="text-gray-500 text-sm">Create your first course to get started.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-heading font-bold text-[var(--text-color)] mb-6">My Courses</h2>
      {courses.map(course => (
        <div key={course._id} className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl overflow-hidden">
          <div className="flex items-center gap-4 p-5">
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 relative">
              <CourseImage src={course.image} alt={course.title} imgClassName="w-full h-full object-cover" iconSize={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[var(--text-color)] truncate">{course.title}</h3>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded font-medium">{course.category}</span>
                <span className="flex items-center gap-1"><Users2 size={12} /> {course.students?.length || 0} students</span>
                <span className="flex items-center gap-1"><Star size={12} className="text-yellow-400" fill="currentColor" /> {course.rating?.toFixed(1) || "N/A"}</span>
                <span className="font-semibold text-[var(--color-primary)]">{course.price === 0 ? "Free" : `$${course.price}`}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => toggleCourse(course._id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[var(--border-color)] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {expandedCourse === course._id ? "Collapse" : "Lessons"} <ChevronRight size={14} className={`transition-transform ${expandedCourse === course._id ? "rotate-90" : ""}`} />
              </button>
              <button onClick={() => onDelete(course._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Lessons Panel */}
          {expandedCourse === course._id && (
            <div className="border-t border-[var(--border-color)] p-5">
              {lessonLoading === course._id ? (
                <div className="flex items-center gap-2 text-gray-500 text-sm"><Loader2 size={16} className="animate-spin" /> Loading lessons...</div>
              ) : (
                <>
                  {(courseLessons[course._id] || []).length > 0 ? (
                    <ol className="space-y-2 mb-4">
                      {(courseLessons[course._id] || []).map((lesson, idx) => (
                        <li key={lesson._id} className="flex items-center gap-3 text-sm p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                          <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{idx+1}</span>
                          <span className="flex-1 text-[var(--text-color)]">{lesson.title}</span>
                          <span className="text-gray-500 text-xs">{lesson.duration} min</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-sm text-gray-500 mb-4">No lessons yet. Add the first one below.</p>
                  )}
                  <AddLessonForm
                    courseId={course._id}
                    existingCount={(courseLessons[course._id] || []).length}
                    onSuccess={(lesson) => handleLessonAdded(course._id, lesson)}
                    showToast={showToast}
                  />
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Overview Stats ───────────────────────────────────────────────────────────
function OverviewView({ courses, user }) {
  const totalStudents = courses.reduce((sum, c) => sum + (c.students?.length || 0), 0);
  const avgRating = courses.length > 0
    ? (courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length).toFixed(1)
    : "N/A";

  const colorStyles = {
    indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
    orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400",
  };

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold text-[var(--text-color)] mb-2">
        Welcome back, {user?.name?.split(" ")[0]}! 👋
      </h2>
      <p className="text-gray-500 mb-8">Here's an overview of your teaching performance.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Courses", value: courses.length, icon: BookOpen, color: "indigo" },
          { label: "Total Students", value: totalStudents, icon: Users2, color: "blue" },
          { label: "Avg. Rating", value: avgRating, icon: Star, color: "orange" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
                <h3 className="text-4xl font-extrabold text-[var(--text-color)]">{value}</h3>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorStyles[color]}`}>
                <Icon size={20} fill={color === "orange" ? "currentColor" : "none"} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length > 0 && (
        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
          <h3 className="font-heading font-bold text-lg text-[var(--text-color)] mb-4">Recent Courses</h3>
          <div className="space-y-3">
            {courses.slice(0, 5).map(course => (
              <div key={course._id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex-shrink-0 overflow-hidden relative">
                  <CourseImage src={course.image} alt={course.title} imgClassName="w-full h-full object-cover" iconSize={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-color)] truncate">{course.title}</p>
                  <p className="text-xs text-gray-500">{course.students?.length || 0} students</p>
                </div>
                <span className="text-sm font-bold text-[var(--color-primary)]">{course.price === 0 ? "Free" : `$${course.price}`}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard Page ──────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const router = useRouter();
  const [activeView, setActiveView] = useState("overview");
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [toast, setToast] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  // Fetch instructor's own courses
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;
      try {
        setLoadingCourses(true);
        const res = await api.get("/courses");
        const all = res.data?.data || res.data || [];
        const mine = all.filter(c =>
          (typeof c.instructor === "string" ? c.instructor : c.instructor?._id?.toString()) === user._id?.toString()
        );
        setCourses(mine);
      } catch { /* silent */ }
      finally { setLoadingCourses(false); }
    };
    fetchCourses();
  }, [user]);

  const handleCourseCreated = (course) => {
    setCourses(prev => [...prev, course]);
    setActiveView("courses");
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm("Delete this course? This cannot be undone.")) return;
    try {
      await api.delete(`/courses/${courseId}`);
      setCourses(prev => prev.filter(c => c._id !== courseId));
      showToast("Course deleted", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete", "error");
    }
  };

  return (
    <AuthGuard allowedRoles={["instructor", "admin"]}>
      <div className="flex h-screen bg-[var(--bg-color)] overflow-hidden">
        {/* Toast */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <Sidebar activeView={activeView} onNavigate={setActiveView} user={user} onLogout={logout} isMobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />

        {/* Main */}
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top bar */}
          <header className="h-16 border-b border-[var(--border-color)] bg-[var(--surface-color)]/90 backdrop-blur-md flex items-center justify-between px-6 lg:px-10 flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 text-gray-500 hover:text-[var(--color-primary)] transition-colors"
              >
                <Menu size={24} />
              </button>
              <h1 className="font-heading font-bold text-lg text-[var(--text-color)] capitalize">{activeView === "overview" ? "Dashboard" : activeView === "create" ? "Create Course" : "My Courses"}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleDarkMode}
                className="p-2 text-gray-500 hover:text-[var(--color-primary)] transition-colors relative"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button className="p-2 text-gray-500 hover:text-[var(--color-primary)] transition-colors relative">
                <Bell size={20} />
              </button>
              <button
                onClick={() => setActiveView("create")}
                className="flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                <Plus size={16} /> New Course
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-10">
            {activeView === "overview" && <OverviewView courses={courses} user={user} />}
            {activeView === "courses" && (
              <MyCoursesView courses={courses} loading={loadingCourses} onDelete={handleDeleteCourse} showToast={showToast} />
            )}
            {activeView === "create" && (
              <CreateCourseForm onSuccess={handleCourseCreated} showToast={showToast} />
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
