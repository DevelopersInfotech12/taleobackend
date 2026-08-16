"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { API } from "./api";

const AuthContext = createContext(null);

export async function authFetch(path, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const isForm = options.body instanceof FormData;
  const res = await fetch(`${API}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let json;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok) {
    throw new Error(json?.message || `Request failed (${res.status})`);
  }
  return json;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }
    try {
      const res = await authFetch("/auth/me");
      setUser(res.data);
      return res.data;
    } catch {
      localStorage.removeItem("auth_token");
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const setSession = useCallback((u, token) => {
    if (token) localStorage.setItem("auth_token", token);
    setUser(u);
  }, []);

  const register = useCallback(async ({ name, email, password, phone }) => {
    const res = await authFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, phone }),
    });
    setSession(res.data.user, res.data.token);
    return res.data.user;
  }, [setSession]);

  const login = useCallback(async ({ email, password }) => {
    const res = await authFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setSession(res.data.user, res.data.token);
    return res.data.user;
  }, [setSession]);

  const loginWithGoogle = useCallback(async (credential) => {
    const res = await authFetch("/auth/google", {
      method: "POST",
      body: JSON.stringify({ credential }),
    });
    setSession(res.data.user, res.data.token);
    return res.data.user;
  }, [setSession]);

  const logout = useCallback(async () => {
    await authFetch("/auth/logout", { method: "POST" }).catch(() => {});
    localStorage.removeItem("auth_token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
