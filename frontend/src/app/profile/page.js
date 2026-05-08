"use client";

import React, { useState } from "react";
import AuthGuard from "../../components/AuthGuard";
import { useAuth } from "../../components/AuthProvider";
import { User, Mail, Shield, LogOut, BookOpen, LayoutDashboard, Pencil, X, Save, Trash2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import api from "../../lib/api";

export default function ProfilePage() {
  const { user, logout, setUser } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Edit mode state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
  };

  const startEdit = () => {
    setEditName(user?.name || "");
    setEditEmail(user?.email || "");
    setEditError("");
    setEditSuccess("");
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditError("");
    setEditSuccess("");
  };

  const saveEdit = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      setEditError("Name and email are required.");
      return;
    }
    setEditLoading(true);
    setEditError("");
    try {
      const res = await api.put("/users/profile", { name: editName.trim(), email: editEmail.trim() });
      const updated = res.data?.data;
      if (updated && setUser) setUser(prev => ({ ...prev, name: updated.name, email: updated.email }));
      setEditSuccess("Profile updated successfully!");
      setEditing(false);
      setTimeout(() => setEditSuccess(""), 3000);
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setEditLoading(false);
    }
  };

  const deleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await api.delete("/users/profile");
      logout();
    } catch (err) {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
      alert(err.response?.data?.message || "Failed to delete account.");
    }
  };

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <AuthGuard>
      <div className="py-10 max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold text-[var(--text-color)] mb-8">My Profile</h1>

        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <>
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
              <div className="bg-[var(--surface-color)] border border-red-300 dark:border-red-800 rounded-2xl p-7 max-w-sm w-full shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle size={20} className="text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-color)]">Delete Account</h3>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  This action is <span className="font-semibold text-red-500">permanent</span> and cannot be undone. All your data will be deleted.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleteLoading}
                    className="flex-1 py-2.5 border border-[var(--border-color)] rounded-xl text-sm font-medium text-[var(--text-color)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteAccount}
                    disabled={deleteLoading}
                    className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {deleteLoading ? "Deleting..." : <><Trash2 size={15} /> Delete Account</>}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

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
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-8">
              <div className="flex-1">
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
              {!editing && (
                <button
                  onClick={startEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-[var(--color-primary)] rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors self-start"
                >
                  <Pencil size={15} /> Edit Profile
                </button>
              )}
            </div>

            {/* Success / Error messages */}
            {editSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                {editSuccess}
              </div>
            )}
            {editError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400 font-medium">
                {editError}
              </div>
            )}

            {/* Account Details */}
            <div className="space-y-4 border-t border-[var(--border-color)] pt-6">
              <h3 className="font-semibold text-[var(--text-color)] mb-3">Account Details</h3>

              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-color)] text-[var(--text-color)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={e => setEditEmail(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-color)] text-[var(--text-color)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={saveEdit}
                      disabled={editLoading}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-sm font-bold hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-60"
                    >
                      <Save size={15} /> {editLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      disabled={editLoading}
                      className="flex items-center gap-2 px-5 py-2.5 border border-[var(--border-color)] rounded-xl text-sm font-medium text-[var(--text-color)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <X size={15} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1.5"><User size={12} /> Full Name</div>
                    <p className="font-semibold text-[var(--text-color)] text-sm">{user?.name || "—"}</p>
                  </div>
                  <div className="p-4 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1.5"><Mail size={12} /> Email Address</div>
                    <p className="font-semibold text-[var(--text-color)] text-sm">{user?.email || "—"}</p>
                  </div>
                  <div className="p-4 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1.5"><Shield size={12} /> Role</div>
                    <p className="font-semibold text-[var(--text-color)] text-sm capitalize">{user?.role || "student"}</p>
                  </div>
                  <div className="p-4 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1.5"><Shield size={12} /> Member Since</div>
                    <p className="font-semibold text-[var(--text-color)] text-sm">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Active member"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="mt-6 border-t border-[var(--border-color)] pt-6">
              <h3 className="font-semibold text-[var(--text-color)] mb-3">Quick Links</h3>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/my-learning"
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-[var(--color-primary)] rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                >
                  <BookOpen size={16} /> My Learning
                </Link>
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

            {/* Danger Zone + Logout */}
            <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-5 py-2.5 border border-red-200 dark:border-red-900/40 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 size={15} /> Delete Account
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-5 py-2.5 border border-[var(--border-color)] text-gray-500 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
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
