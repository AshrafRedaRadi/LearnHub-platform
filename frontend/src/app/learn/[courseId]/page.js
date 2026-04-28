"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Trophy, User, X, CheckCircle2, PlayCircle, Lock,
  ChevronRight, ChevronDown, Check, ChevronLeft, Loader2, BookOpen
} from "lucide-react";
import AuthGuard from "../../../components/AuthGuard";
import { useAuth } from "../../../components/AuthProvider";
import api from "../../../lib/api";

export default function LessonPage() {
  const { courseId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch course + lessons
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseRes, lessonsRes] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get(`/courses/${courseId}/lessons`)
        ]);
        const courseData = courseRes.data?.data || courseRes.data;
        const lessonsData = lessonsRes.data?.data || [];
        setCourse(courseData);
        setLessons(lessonsData);

        // Auto-select lesson from URL param, or first lesson
        const lessonIdFromUrl = searchParams?.get("lesson");
        if (lessonIdFromUrl) {
          const found = lessonsData.find(l => l._id === lessonIdFromUrl);
          setActiveLesson(found || lessonsData[0] || null);
        } else {
          setActiveLesson(lessonsData[0] || null);
        }

        // Load user progress from API
        try {
          const profileRes = await api.get("/users/profile");
          const progress = profileRes.data?.data?.progress || [];
          const completed = new Set(progress.filter(p => p.completed).map(p =>
            typeof p.lesson === "string" ? p.lesson : p.lesson?._id?.toString()
          ));
          setCompletedLessons(completed);
        } catch { /* progress optional */ }

      } catch (err) {
        setError("Failed to load course content. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchData();
  }, [courseId]);

  // Update URL when active lesson changes
  useEffect(() => {
    if (activeLesson && courseId) {
      const url = `/learn/${courseId}?lesson=${activeLesson._id}`;
      window.history.replaceState({}, "", url);
    }
  }, [activeLesson, courseId]);

  const currentIndex = lessons.findIndex(l => l._id === activeLesson?._id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < lessons.length - 1;

  const goToLesson = useCallback((lesson) => {
    setActiveLesson(lesson);
    setActiveTab("overview");
  }, []);

  const goNext = () => { if (hasNext) goToLesson(lessons[currentIndex + 1]); };
  const goPrev = () => { if (hasPrev) goToLesson(lessons[currentIndex - 1]); };

  const markComplete = async () => {
    if (!activeLesson) return;
    try {
      await api.put("/users/profile", { completedLessonId: activeLesson._id });
      setCompletedLessons(prev => new Set([...prev, activeLesson._id]));
      // Auto-advance to next lesson
      if (hasNext) setTimeout(() => goNext(), 600);
    } catch { /* silent */ }
  };

  // Embed URL helper — convert YouTube watch URL to embed URL
  const getEmbedUrl = (url) => {
    if (!url) return null;
    // YouTube watch
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;
    // Already embed
    if (url.includes("embed")) return url;
    return url;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[var(--bg-color)]">
      <Loader2 size={40} className="animate-spin text-[var(--color-primary)]" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen bg-[var(--bg-color)]">
      <p className="text-red-500 mb-4">{error}</p>
      <Link href="/" className="text-[var(--color-primary)] hover:underline">Return Home</Link>
    </div>
  );

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-[var(--bg-color)]">

        {/* Top Navigation Bar */}
        <header className="h-14 border-b border-[var(--border-color)] bg-[var(--surface-color)] flex items-center justify-between px-4 sm:px-6 flex-shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[var(--text-color)] transition-colors flex-shrink-0">
              <ArrowLeft size={17} /> <span className="hidden sm:inline">Back</span>
            </button>
            <div className="h-5 border-l border-[var(--border-color)] mx-1 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:block">{course?.title}</p>
              <p className="text-sm font-semibold text-[var(--text-color)] truncate max-w-[160px] sm:max-w-xs">
                {activeLesson?.title || "Select a lesson"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
              <span className="font-medium text-[var(--text-color)]">{completedLessons.size}</span>
              / {lessons.length} completed
            </div>
            <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-[var(--color-primary)] px-3 py-1.5 rounded-full text-xs font-bold">
              <Trophy size={13} /> {completedLessons.size * 50} XP
            </div>
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="p-2 text-gray-500 hover:text-[var(--text-color)] transition-colors"
              title="Toggle sidebar"
            >
              {sidebarOpen ? <X size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </header>

        {/* Main Area */}
        <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">

          {/* Left: Video + Tabs */}
          <div className="flex-1 overflow-y-auto flex flex-col">
            <div className="p-4 sm:p-6 lg:p-8">

              {/* Video Player */}
              <div className="w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-xl">
                {activeLesson?.videoUrl && getEmbedUrl(activeLesson.videoUrl) ? (
                  <iframe
                    key={activeLesson._id}
                    src={getEmbedUrl(activeLesson.videoUrl)}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={activeLesson.title}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-slate-900">
                    <PlayCircle size={64} className="text-slate-600 mb-4" />
                    <p className="text-gray-500 text-sm">
                      {activeLesson ? "No video available for this lesson" : "Select a lesson from the sidebar"}
                    </p>
                  </div>
                )}
              </div>

              {/* Lesson Controls */}
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-heading font-bold text-[var(--text-color)]">
                    {activeLesson?.title || "No lesson selected"}
                  </h1>
                  {activeLesson && (
                    <p className="text-sm text-gray-500 mt-1">
                      Lesson {currentIndex + 1} of {lessons.length} · {activeLesson.duration} min
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Prev */}
                  <button
                    onClick={goPrev}
                    disabled={!hasPrev}
                    className="flex items-center gap-1.5 px-3 py-2 border border-[var(--border-color)] text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>

                  {/* Mark complete */}
                  {activeLesson && (
                    <button
                      onClick={completedLessons.has(activeLesson._id) ? undefined : markComplete}
                      className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        completedLessons.has(activeLesson._id)
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 cursor-default"
                          : "border border-[var(--border-color)] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {completedLessons.has(activeLesson._id) ? (
                        <><Check size={16} /> Completed</>
                      ) : (
                        <><CheckCircle2 size={16} /> Mark Complete</>
                      )}
                    </button>
                  )}

                  {/* Next */}
                  <button
                    onClick={goNext}
                    disabled={!hasNext}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-bold rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Content Tabs */}
              <div className="mt-8 border-b border-[var(--border-color)] flex gap-6">
                {["overview", "resources"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                      activeTab === tab
                        ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                        : "border-transparent text-gray-500 hover:text-[var(--text-color)]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="mt-6 pb-10">
                {activeTab === "overview" && (
                  <div className="max-w-2xl">
                    <h2 className="text-lg font-heading font-bold text-[var(--text-color)] mb-3">About this lesson</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {activeLesson?.title
                        ? `This lesson covers "${activeLesson.title}". Watch the video above to learn the key concepts. Mark this lesson as complete when you're ready to move on.`
                        : "Select a lesson from the curriculum to start learning."}
                    </p>
                  </div>
                )}
                {activeTab === "resources" && (
                  <div className="text-gray-500 text-sm">No additional resources for this lesson.</div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Curriculum Sidebar */}
          {sidebarOpen && (
            <div className="w-full lg:w-80 xl:w-96 border-l border-[var(--border-color)] bg-[var(--surface-color)] flex-shrink-0 flex flex-col h-auto lg:h-[calc(100vh-56px)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between sticky top-0 bg-[var(--surface-color)] z-10">
                <div>
                  <h2 className="font-heading font-bold text-base text-[var(--text-color)]">Course Curriculum</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{lessons.length} lessons · {completedLessons.size} completed</p>
                </div>
              </div>

              {/* Progress bar */}
              {lessons.length > 0 && (
                <div className="px-4 py-2 border-b border-[var(--border-color)]">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium text-[var(--text-color)]">{Math.round((completedLessons.size / lessons.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-[var(--color-primary)] h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${(completedLessons.size / lessons.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto py-2">
                {lessons.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    <BookOpen size={32} className="mx-auto text-gray-300 mb-2" />
                    No lessons available yet.
                  </div>
                ) : (
                  lessons.map((lesson, index) => {
                    const isActive = lesson._id === activeLesson?._id;
                    const isDone = completedLessons.has(lesson._id);
                    return (
                      <button
                        key={lesson._id}
                        onClick={() => goToLesson(lesson)}
                        className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors border-l-2 ${
                          isActive
                            ? "bg-indigo-50 dark:bg-indigo-900/20 border-[var(--color-primary)]"
                            : "border-transparent hover:bg-gray-50 dark:hover:bg-slate-800/30"
                        }`}
                      >
                        {/* Status icon */}
                        <div className="mt-0.5 flex-shrink-0">
                          {isDone ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                              <Check size={11} strokeWidth={3} className="text-white" />
                            </div>
                          ) : isActive ? (
                            <div className="w-5 h-5 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                              <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 text-white ml-0.5"><path d="M8 5v14l11-7z" /></svg>
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                              <span className="text-[9px] font-bold text-gray-400">{index + 1}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-snug ${
                            isActive
                              ? "font-semibold text-[var(--color-primary)]"
                              : isDone
                              ? "text-[var(--text-color)]"
                              : "text-gray-600 dark:text-gray-400"
                          }`}>
                            {lesson.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{lesson.duration} min</p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
