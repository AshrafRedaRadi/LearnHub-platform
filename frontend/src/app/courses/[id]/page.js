"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Star, Users, Globe, PlayCircle, CheckCircle2,
  MonitorPlay, Infinity, Smartphone, Award,
  ChevronDown, ChevronUp, Play, Code, Loader2,
  BookOpen, AlertCircle, CheckCircle, ArrowRight
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import CourseImage from "../../../components/CourseImage";
import api from "../../../lib/api";
import { useAuth } from "../../../components/AuthProvider";

// Toast component
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white text-sm font-medium ${type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
      {type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      {message}
    </div>
  );
}

export default function CourseDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModule, setOpenModule] = useState(1);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const courseRes = await api.get(`/courses/${id}`);
        const courseData = courseRes.data?.data || courseRes.data;
        setCourse(courseData);

        // Check if current user is already enrolled
        if (user) {
          const isEnrolled = courseData.students?.some(s =>
            (typeof s === "string" ? s : s._id?.toString()) === user._id?.toString()
          );
          setEnrolled(isEnrolled);
        }

        // Fetch lessons
        try {
          const lessonsRes = await api.get(`/courses/${id}/lessons`);
          setLessons(lessonsRes.data?.data || []);
        } catch {
          setLessons([]);
        }
      } catch (err) {
        setError("Failed to load course details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCourseData();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) { router.push(`/login?redirect=/courses/${id}`); return; }
    setEnrolling(true);
    try {
      await api.post(`/courses/${id}/enroll`);
      setEnrolled(true);
      setCourse(prev => ({ ...prev, students: [...(prev.students || []), user._id] }));
      showToast("Successfully enrolled! 🎉 Start learning now.", "success");
    } catch (err) {
      const msg = err.response?.data?.message || "Enrollment failed";
      if (msg.toLowerCase().includes("already")) {
        setEnrolled(true);
        showToast("You're already enrolled in this course!", "success");
      } else {
        showToast(msg, "error");
      }
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartLearning = () => {
    if (lessons.length > 0) {
      router.push(`/learn/${course._id}?lesson=${lessons[0]._id}`);
    } else {
      router.push(`/learn/${course._id}`);
    }
  };

  if (loading) return (
    <div className="py-20 flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
    </div>
  );

  if (error || !course) return (
    <div className="py-20 text-center">
      <div className="text-red-500 bg-red-50 dark:bg-red-900/10 p-6 rounded-xl inline-block border border-red-200 dark:border-red-900/30">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error || "Course not found"}</p>
        <Button className="mt-4" onClick={() => router.push("/")}>Return to Home</Button>
      </div>
    </div>
  );

  return (
    <div className="py-6 pb-20">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Breadcrumbs */}
      <div className="text-sm text-[var(--color-primary)] font-medium mb-6 flex gap-2 items-center flex-wrap">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="text-gray-400">›</span>
        <Link href="/categories" className="hover:underline">Courses</Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-600 dark:text-gray-300 truncate max-w-xs">{course.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* LEFT: Main Content */}
        <div className="flex-1 lg:max-w-3xl">
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-[var(--text-color)] tracking-tight leading-tight mb-4">
            {course.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{course.description}</p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
            <div className="flex items-center gap-1">
              <span className="font-bold text-orange-600 dark:text-orange-500">{course.rating?.toFixed(1) || "N/A"}</span>
              <div className="flex text-yellow-400">
                {[1,2,3,4,5].map(i => <Star key={i} size={13} fill="currentColor" />)}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--text-color)]">
              <Users size={16} className="text-gray-400" />
              <span>{course.students?.length || 0} students</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe size={16} className="text-gray-400" />
              <span>English</span>
            </div>
            <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded text-xs font-semibold">
              {course.category}
            </span>
          </div>

          <div className="text-sm text-[var(--text-color)] mb-10">
            By <a href="#instructor" className="text-[var(--color-primary)] font-medium hover:underline">{course.instructor?.name || "Expert Instructor"}</a>
          </div>

          {/* Course Content / Lessons */}
          <div className="mb-10">
            <div className="flex items-end justify-between mb-6">
              <h2 className="font-heading text-2xl font-bold text-[var(--text-color)]">Course Content</h2>
              <span className="text-sm text-gray-500">{lessons.length} lesson{lessons.length !== 1 ? "s" : ""}</span>
            </div>

            <div className="border border-[var(--border-color)] rounded-xl overflow-hidden bg-[var(--surface-color)]">
              <button
                onClick={() => setOpenModule(openModule === 1 ? null : 1)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  {openModule === 1 ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
                  <span className="font-semibold text-[var(--text-color)]">All Lessons</span>
                </div>
                <span className="text-sm text-gray-500">{lessons.length} lessons</span>
              </button>
              {openModule === 1 && (
                <div className="p-4">
                  {lessons.length > 0 ? (
                    <ul className="space-y-3">
                      {lessons.map((lesson, index) => (
                        <li
                          key={lesson._id}
                          className="flex items-center justify-between text-sm group cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
                          onClick={() => {
                            if (enrolled || user) {
                              router.push(`/learn/${course._id}?lesson=${lesson._id}`);
                            } else {
                              showToast("Please enroll to access lessons", "error");
                            }
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-bold">{index + 1}</span>
                            <PlayCircle size={15} className="text-[var(--color-primary)] flex-shrink-0" />
                            <span className="text-[var(--text-color)] group-hover:text-[var(--color-primary)] transition-colors">{lesson.title}</span>
                          </div>
                          <span className="text-gray-500">{lesson.duration} min</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">No lessons available yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Instructor Section */}
          <div id="instructor" className="mb-10">
            <h2 className="font-heading text-2xl font-bold mb-6 text-[var(--text-color)]">Instructor</h2>
            <div className="border border-[var(--border-color)] rounded-xl p-6 bg-[var(--surface-color)] flex gap-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-teal-400 to-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-white">
                  {(course.instructor?.name || "I").charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-[var(--color-primary)] mb-1">{course.instructor?.name || "Expert Instructor"}</h3>
                <p className="text-sm text-gray-500 mb-3">{course.instructor?.email}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Star size={14} className="text-yellow-400" fill="currentColor" /> Top Rated</span>
                  <span className="flex items-center gap-1"><Award size={14} className="text-orange-500" /> Expert</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Sticky Sidebar */}
        <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
          <div className="sticky top-24">
            <Card hover={false} className="overflow-hidden shadow-xl border-[var(--border-color)]">
              {/* Course Thumbnail */}
              <div className="relative h-48 bg-slate-800 flex items-center justify-center group overflow-hidden">
                <CourseImage
                  src={course.image}
                  alt={course.title}
                  placeholderIcon={Code}
                  imgClassName="w-full h-full object-cover relative z-10"
                  iconSize={48}
                />
                {lessons.length > 0 && (enrolled || !user) && (
                  <div
                    onClick={enrolled ? handleStartLearning : undefined}
                    className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-full bg-white/90 shadow-lg flex items-center justify-center">
                      <Play size={22} className="text-[var(--color-primary)] ml-1" fill="currentColor" />
                    </div>
                  </div>
                )}
              </div>

              {/* Price + Actions */}
              <div className="p-6">
                <div className="flex items-end gap-3 mb-4">
                  <h2 className="text-4xl font-extrabold text-[var(--text-color)] tracking-tight">
                    {course.price === 0 ? "Free" : `$${course.price}`}
                  </h2>
                </div>

                <div className="space-y-3 mb-6">
                  {enrolled ? (
                    <button
                      onClick={handleStartLearning}
                      className="w-full py-3.5 text-base font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                      <PlayCircle size={20} /> Continue Learning
                    </button>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full py-3.5 text-base font-bold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
                    >
                      {enrolling ? <><Loader2 size={18} className="animate-spin" /> Enrolling...</> : <>{user ? "Enroll Now" : "Sign Up to Enroll"} <ArrowRight size={18} /></>}
                    </button>
                  )}

                  {enrolled && (
                    <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium justify-center">
                      <CheckCircle size={16} /> You're enrolled in this course
                    </div>
                  )}
                </div>

                {/* Includes */}
                <div>
                  <h4 className="font-semibold text-[var(--text-color)] mb-3">This course includes:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300"><MonitorPlay size={16} /> {lessons.length} on-demand video lessons</li>
                    <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300"><Infinity size={16} /> Full lifetime access</li>
                    <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300"><Smartphone size={16} /> Access on mobile and TV</li>
                    <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300"><Award size={16} /> Certificate of completion</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
