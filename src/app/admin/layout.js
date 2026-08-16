"use client";
import { AuthProvider, useAuth } from "./lib/AdminAuthContext";
import LoginScreen from "./components/LoginScreen";
import AdminShell from "./components/AdminShell";
import { Spinner } from "./components/ui";

function Gate({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[#f5efe8]"><Spinner label="Loading…" /></div>;
  if (!user) return <LoginScreen />;
  return <AdminShell>{children}</AdminShell>;
}

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <Gate>{children}</Gate>
    </AuthProvider>
  );
}
