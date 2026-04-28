"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, AlertCircle, GitBranch } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../components/AuthProvider";
import { signIn as nextAuthSignIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [oauthMsg, setOauthMsg] = useState("");
  const { login } = useAuth();

  const handleOAuth = async (provider) => {
    if (provider === "GitHub") {
      await nextAuthSignIn("github", { callbackUrl: "/" });
      return;
    }
    if (provider === "Google") {
      await nextAuthSignIn("google", { callbackUrl: "/" });
      return;
    }
    setOauthMsg(`${provider} sign-in is not configured.`);
    setTimeout(() => setOauthMsg(""), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await login(email, password);
      // Navigation is handled in the auth provider
    } catch (err) {
      const apiError = err.response?.data?.message || err.response?.data;
      setError(typeof apiError === 'string' ? apiError : "Login failed. Please check your credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Centered Login Card */}
      <div className="w-full max-w-md space-y-8 bg-[var(--surface-color)] p-8 rounded-2xl border border-[var(--border-color)] shadow-sm">
        
        {/* Header section */}
        <div className="text-center">
          <h2 className="text-3xl font-heading font-bold tracking-tight text-[var(--text-color)]">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Please enter your details to sign in.
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle size={18} className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] bg-[var(--bg-color)]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500">
                Remember for 30 days
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </div>
        </form>

        {/* Separator */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-color)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[var(--surface-color)] px-2 text-gray-500">or</span>
            </div>
          </div>
        </div>

        {/* Social Login Buttons */}
        {oauthMsg && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-700 dark:text-amber-400 text-center">
            {oauthMsg}
          </div>
        )}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleOAuth("Google")}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-color)] hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-[var(--text-color)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuth("GitHub")}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-color)] hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-[var(--text-color)]"
          >
            <GitBranch size={18} />
            GitHub
          </button>
        </div>

        {/* Footer Link */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/register" className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
