"use client";
import { useState } from "react";
import { apiFetch } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/auth/login", null, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (res.data?.user?.role !== "admin") throw new Error("Admin access only");
      login(res.data.user, res.data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5efe8] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-[#1a1008]" style={{ fontFamily: "Georgia, serif" }}>Taleo</h1>
          <p className="text-[11px] tracking-widest uppercase text-[#8b6914] mt-1">Admin Portal</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-[#ede4d8] p-8">
          <h2 className="text-[15px] font-semibold text-[#1a1008] mb-6">Sign in to continue</h2>
          {error && (
            <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-700">{error}</div>
          )}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#9c8a78] mb-1.5">Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-[#e0d4c4] rounded-lg px-3 py-2.5 text-[13px] text-[#1a1008] focus:outline-none focus:border-[#c9a84c] bg-[#fdfaf6]"
                placeholder="admin@"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#9c8a78] mb-1.5">Password</label>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full border border-[#e0d4c4] rounded-lg px-3 py-2.5 text-[13px] text-[#1a1008] focus:outline-none focus:border-[#c9a84c] bg-[#fdfaf6]"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-[#1a1008] text-[#e8d5b0] py-2.5 rounded-lg text-[12px] uppercase tracking-widest font-medium hover:bg-[#3d2a1a] transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
