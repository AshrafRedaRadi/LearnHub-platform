"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "./AuthProvider";
import {
  Menu, X, Search, Bell, Moon, Sun, BookOpen, LogOut, ChevronDown
} from "lucide-react";

// Navbar component
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      router.push(`/categories?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch("");
      setIsMobileMenuOpen(false);
    }
  };

  const isStudent = user?.role === "student";
  const isAuthenticated = !!user;

  // User initials for avatar
  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  // Hide Navbar on lesson & dashboard pages
  if (pathname && (pathname.startsWith("/learn") || pathname.startsWith("/dashboard"))) {
    return null;
  }

  const navLink = (href, label) => (
    <Link
      href={href}
      className={`hover:text-[var(--color-primary)] transition-colors ${pathname === href || (href !== "/" && pathname?.startsWith(href)) ? "text-[var(--color-primary)] font-semibold" : ""}`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--border-color)] bg-[var(--surface-color)]/90 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-[var(--color-primary)] text-white p-1.5 rounded-lg group-hover:bg-[var(--color-primary-hover)] transition-colors">
                <BookOpen size={22} />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-[var(--text-color)]">
                LearnHub
              </span>
            </Link>
          </div>

          {/* Search — Desktop */}
          <div className="hidden md:flex flex-1 items-center justify-center px-8">
            <form onSubmit={handleNavSearch} className="w-full max-w-lg relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={navSearch}
                onChange={e => setNavSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-[var(--border-color)] rounded-full leading-5 bg-[var(--bg-color)] text-[var(--text-color)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] sm:text-sm transition-all"
                placeholder="Search courses, skills, instructors..."
              />
            </form>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-5">
            {/* Nav Links */}
            <div className="flex items-center gap-5 text-sm font-medium text-[var(--text-color)]">
              {navLink("/", "Home")}
              {navLink("/categories", "Courses")}
              {isAuthenticated && isStudent && navLink("/my-learning", "My Learning")}
              {isAuthenticated && user?.role === "instructor" && navLink("/dashboard", "Dashboard")}
            </div>

            {/* Dark mode */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-[var(--bg-color)] text-[var(--text-color)] transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Notifications Bell → /notifications */}
                <Link
                  href="/notifications"
                  className="relative p-2 text-[var(--text-color)] hover:text-[var(--color-primary)] transition-colors rounded-full hover:bg-[var(--bg-color)]"
                  title="Notifications"
                >
                  <Bell size={19} />
                </Link>

                {/* Profile avatar dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(o => !o)}
                    className="flex items-center gap-2 h-9 pl-1 pr-2 rounded-full border border-[var(--border-color)] hover:border-[var(--color-primary)] bg-[var(--bg-color)] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {initials}
                    </div>
                    <ChevronDown size={14} className={`text-gray-500 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {profileOpen && (
                    <>
                      {/* Backdrop */}
                      <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                      {/* Dropdown */}
                      <div className="absolute right-0 mt-2 w-56 z-20 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl shadow-xl overflow-hidden">
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-[var(--border-color)]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[var(--text-color)] truncate">{user?.name}</p>
                              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu items */}
                        <div className="py-1.5">
                          <Link
                            href="/profile"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-color)] hover:bg-[var(--bg-color)] transition-colors"
                          >
                            <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-[var(--color-primary)]">{initials}</span>
                            </div>
                            My Profile
                          </Link>

                          {isStudent && (
                            <Link
                              href="/my-learning"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-color)] hover:bg-[var(--bg-color)] transition-colors"
                            >
                              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                <BookOpen size={13} className="text-blue-600 dark:text-blue-400" />
                              </div>
                              My Learning
                            </Link>
                          )}

                          {user?.role === "instructor" && (
                            <Link
                              href="/dashboard"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-color)] hover:bg-[var(--bg-color)] transition-colors"
                            >
                              <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs">📊</span>
                              </div>
                              Dashboard
                            </Link>
                          )}

                          <Link
                            href="/notifications"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-color)] hover:bg-[var(--bg-color)] transition-colors"
                          >
                            <div className="w-7 h-7 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                              <Bell size={13} className="text-yellow-600 dark:text-yellow-400" />
                            </div>
                            Notifications
                          </Link>

                          <div className="border-t border-[var(--border-color)] mt-1.5 pt-1.5">
                            <button
                              onClick={() => { setProfileOpen(false); logout(); }}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors"
                            >
                              <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                                <LogOut size={13} className="text-red-500" />
                              </div>
                              Log Out
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium text-[var(--text-color)] hover:text-[var(--color-primary)] transition-colors px-3 py-2">
                  Sign In
                </Link>
                <Link href="/register" className="text-sm font-medium bg-[var(--color-primary)] text-white px-5 py-2 rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors shadow-sm">
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: dark mode + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <button onClick={toggleDarkMode} className="p-2 rounded-full text-[var(--text-color)]">
              {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            {isAuthenticated && (
              <Link href="/profile" className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </Link>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[var(--text-color)] p-2"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[var(--surface-color)] border-t border-[var(--border-color)]">
          <div className="px-4 pt-3 pb-4 space-y-1">
            {/* Mobile Search */}
            <form onSubmit={handleNavSearch} className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={navSearch}
                  onChange={e => setNavSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-[var(--border-color)] rounded-full text-sm bg-[var(--bg-color)] text-[var(--text-color)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="Search courses..."
                />
              </div>
            </form>

            {isAuthenticated ? (
              <>
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-color)] hover:bg-[var(--bg-color)]">Home</Link>
                <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-color)] hover:bg-[var(--bg-color)]">Courses</Link>
                {isStudent && (
                  <Link href="/my-learning" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-color)] hover:bg-[var(--bg-color)]">My Learning</Link>
                )}
                {user.role === "instructor" && (
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-color)] hover:bg-[var(--bg-color)]">Dashboard</Link>
                )}
                <Link href="/notifications" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-color)] hover:bg-[var(--bg-color)]">Notifications</Link>

                <div className="border-t border-[var(--border-color)] mt-2 pt-2">
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-color)] hover:bg-[var(--bg-color)]">
                    <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-bold">{initials}</div>
                    My Profile
                  </Link>
                  <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full">
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-color)] hover:bg-[var(--bg-color)]">Home</Link>
                <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-color)] hover:bg-[var(--bg-color)]">Courses</Link>
                <div className="flex flex-col gap-2 pt-3 border-t border-[var(--border-color)]">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center text-sm font-medium text-[var(--text-color)] bg-[var(--bg-color)] border border-[var(--border-color)] px-4 py-2.5 rounded-xl">
                    Sign In
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center text-sm font-medium bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-xl">
                    Join Now
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
