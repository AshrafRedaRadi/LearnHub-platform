"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut as nextAuthSignOut } from "next-auth/react";
import api from "../lib/api";
import { getToken, saveToken, removeToken } from "../lib/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user on mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        setUser(response.data.data || response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      
      // Axios returns the parsed JSON in response.data
      // Backend wraps the user object inside a "data" property
      const token = response.data?.data?.token || response.data?.token;
      
      if (token) {
        saveToken(token);
      }
      
      // Fetch the current user immediately after login
      const userRes = await api.get("/auth/me");
      const userData = userRes.data.data || userRes.data;
      setUser(userData);
      
      // Navigate to dashboard based on role
      router.push(userData.role === "instructor" ? "/dashboard" : "/");
      
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const registerUser = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      const token = response.data?.data?.token || response.data?.token;
      
      if (token) {
        saveToken(token);
      }
      
      const userRes = await api.get("/auth/me");
      const newUserData = userRes.data.data || userRes.data;
      setUser(newUserData);
      
      router.push(newUserData.role === "instructor" ? "/dashboard" : "/");
      
      return newUserData;
    } catch (error) {
      throw error;
    }
  };

  // Called by OAuthBridge when NextAuth (GitHub) delivers a session
  const setUserFromOAuth = (backendUser, backendToken) => {
    if (backendToken) {
      saveToken(backendToken);
    }
    setUser(backendUser);
    // Navigate based on role
    if (backendUser?.role === "instructor") {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  /** Clears NextAuth cookie first so OAuthBridge cannot re-sync the session after token removal */
  const logout = async () => {
    try {
      await nextAuthSignOut({ redirect: false });
    } catch {
      /* ignore — still clear local session */
    }
    removeToken();
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, registerUser, logout, setUserFromOAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to consume the AuthContext
export const useAuth = () => useContext(AuthContext);
