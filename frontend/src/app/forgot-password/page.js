"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import Button from "../../components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Simulate API call
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-heading font-extrabold text-[var(--text-color)]">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Or{" "}
          <Link href="/login" className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
            return to sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[var(--surface-color)] py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-[var(--border-color)]">
          {isSubmitted ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-[var(--text-color)] mb-2">Check your email</h3>
              <p className="text-sm text-gray-500 mb-6">
                We've sent a password reset link to <span className="font-medium">{email}</span>.
              </p>
              <Button fullWidth onClick={() => setIsSubmitted(false)}>
                Back to reset password
              </Button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--text-color)] mb-1">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-color)] text-[var(--text-color)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <Button type="submit" fullWidth>
                  Send reset link
                </Button>
              </div>
            </form>
          )}
          
          <div className="mt-6">
            <Link href="/login" className="flex items-center justify-center text-sm font-medium text-gray-500 hover:text-[var(--text-color)] transition-colors">
              <ArrowLeft size={16} className="mr-1" /> Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
