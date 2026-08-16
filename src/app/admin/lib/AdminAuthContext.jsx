"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { apiFetch } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    if (!t) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await apiFetch("/auth/me", t);
        if (res.data?.role !== "admin") throw new Error("Admin access only");
        setUser(res.data);
        setToken(t);
      } catch {
        localStorage.removeItem("admin_token");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback((u, t) => {
    localStorage.setItem("admin_token", t);
    setUser(u);
    setToken(t);
  }, []);

  const logout = useCallback(async () => {
    await apiFetch("/auth/logout", token, { method: "POST" }).catch(() => {});
    localStorage.removeItem("admin_token");
    setUser(null);
    setToken(null);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
