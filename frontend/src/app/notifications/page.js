"use client";

import React, { useState } from "react";
import Link from "next/link";
import AuthGuard from "../../components/AuthGuard";
import { useAuth } from "../../components/AuthProvider";
import {
  Bell, BookOpen, Star, Award, CheckCheck, Trash2, BellOff, ChevronRight
} from "lucide-react";

// Mock notifications since there's no backend notification system yet.
// In production, replace this with a GET /api/notifications API call.
const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    type: "enrollment",
    title: "Welcome to LearnHub! 🎉",
    message: "Your account has been created successfully. Start exploring courses.",
    time: "Just now",
    read: false,
    icon: "🎓",
    href: "/categories"
  },
  {
    id: "2",
    type: "course",
    title: "New courses available",
    message: "Check out the latest courses added to your areas of interest.",
    time: "1 hour ago",
    read: false,
    icon: "📚",
    href: "/categories"
  },
  {
    id: "3",
    type: "achievement",
    title: "Keep learning!",
    message: "Enroll in a course and start your learning journey today.",
    time: "2 days ago",
    read: true,
    icon: "⭐",
    href: "/categories"
  }
];

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState("all"); // "all" | "unread"

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => setNotifications([]);

  const displayed = filter === "unread"
    ? notifications.filter(n => !n.read)
    : notifications;

  return (
    <AuthGuard>
      <div className="py-10 max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-[var(--text-color)] flex items-center gap-3">
              <Bell size={28} className="text-[var(--color-primary)]" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "All caught up!"}
            </p>
          </div>

          {notifications.length > 0 && (
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                >
                  <CheckCheck size={16} /> Mark all read
                </button>
              )}
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 size={16} /> Clear all
              </button>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-6 border-b border-[var(--border-color)]">
          {[
            { key: "all", label: `All (${notifications.length})` },
            { key: "unread", label: `Unread (${unreadCount})` }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                filter === tab.key
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-transparent text-gray-500 hover:text-[var(--text-color)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notification List */}
        {displayed.length === 0 ? (
          <div className="text-center py-20 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl">
            <BellOff size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-lg font-bold text-[var(--text-color)] mb-2">
              {filter === "unread" ? "No unread notifications" : "No notifications yet"}
            </h2>
            <p className="text-gray-500 text-sm">
              {filter === "unread"
                ? "You're all caught up!"
                : "Enroll in courses and we'll keep you updated here."}
            </p>
            {filter === "unread" && notifications.length > 0 && (
              <button
                onClick={() => setFilter("all")}
                className="mt-4 text-sm text-[var(--color-primary)] hover:underline"
              >
                View all notifications
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {displayed.map(notification => (
              <div
                key={notification.id}
                className={`relative flex items-start gap-4 p-4 rounded-xl border transition-colors group ${
                  notification.read
                    ? "bg-[var(--surface-color)] border-[var(--border-color)]"
                    : "bg-indigo-50/60 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-900/40"
                }`}
              >
                {/* Unread dot */}
                {!notification.read && (
                  <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] flex-shrink-0" />
                )}

                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 border border-[var(--border-color)] flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                  {notification.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={notification.href}
                    onClick={() => markRead(notification.id)}
                    className="block group/link"
                  >
                    <p className={`text-sm font-semibold text-[var(--text-color)] group-hover/link:text-[var(--color-primary)] transition-colors ${!notification.read ? "font-bold" : ""}`}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{notification.message}</p>
                  </Link>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-400">{notification.time}</span>
                    {!notification.read && (
                      <button
                        onClick={() => markRead(notification.id)}
                        className="text-xs text-[var(--color-primary)] hover:underline font-medium"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={notification.href}
                    onClick={() => markRead(notification.id)}
                    className="p-1.5 text-gray-400 hover:text-[var(--color-primary)] rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                    title="View"
                  >
                    <ChevronRight size={16} />
                  </Link>
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer tip */}
        {notifications.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-8">
            Notifications are kept for 30 days.
          </p>
        )}
      </div>
    </AuthGuard>
  );
}
