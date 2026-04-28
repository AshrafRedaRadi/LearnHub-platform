"use client";

import React, { useState } from "react";
import AuthGuard from "../../components/AuthGuard";
import { useAuth } from "../../components/AuthProvider";
import { User, Mail, Shield, LogOut, BookOpen, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
  };

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <AuthGuard>
      <div className="py-10 max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold text-[var(--text-color)] mb-8">My Profile</h1>

        <div className="bg-[var(--surface-color)] rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden">
          {/* Header Banner */}
          <div className="h-28 bg-gradient-to-r from-[var(--color-primary)] to-indigo-500 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-full ring-4 ring-[var(--surface-color)] bg-gradient-to-tr from-indigo-500 to-[var(--color-primary)] flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-white">{initials}</span>
              </div>
            </div>
          </div>

          <div className="pt-16 pb-8 px-8">
            {/* Name and Role Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[var(--text-color)]">{user?.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    user?.role === "instructor"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                  }`}>
                    <Shield size={10} />
                    {user?.role || "student"}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="space-y-4 border-t border-[var(--border-color)] pt-6">
              <h3 className="font-semibold text-[var(--text-color)] mb-3">Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1.5">
                    <User size={12} /> Full Name
                  </div>
                  <p className="font-semibold text-[var(--text-color)] text-sm">{user?.name || "—"}</p>
                </div>
                <div className="p-4 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1.5">
                    <Mail size={12} /> Email Address
                  </div>
                  <p className="font-semibold text-[var(--text-color)] text-sm">{user?.email || "—"}</p>
                </div>
                <div className="p-4 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1.5">
                    <Shield size={12} /> Role
                  </div>
                  <p className="font-semibold text-[var(--text-color)] text-sm capitalize">{user?.role || "student"}</p>
                </div>
                <div className="p-4 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1.5">
                    <Shield size={12} /> Member Since
                  </div>
                  <p className="font-semibold text-[var(--text-color)] text-sm">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Active member"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-6 border-t border-[var(--border-color)] pt-6">
              <h3 className="font-semibold text-[var(--text-color)] mb-3">Quick Links</h3>
              <div className="flex flex-wrap gap-3">
                {user?.role === "student" && (
                  <Link
                    href="/my-learning"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-[var(--color-primary)] rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                  >
                    <BookOpen size={16} /> My Learning
                  </Link>
                )}
                {user?.role === "instructor" && (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                )}
                <Link
                  href="/categories"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Browse Courses
                </Link>
              </div>
            </div>

            {/* Logout */}
            <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex justify-end">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-5 py-2.5 border border-red-200 dark:border-red-900/40 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
              >
                <LogOut size={16} />
                {isLoggingOut ? "Logging out..." : "Log Out"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
