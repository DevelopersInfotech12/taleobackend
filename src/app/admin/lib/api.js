export const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function apiFetch(path, token, options = {}) {
  const isForm = options.body instanceof FormData;
  const hasBody = options.body != null;
  const res = await fetch(`${API}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(!isForm && hasBody ? { "Content-Type": "application/json" } : {}),
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

export const fmtCurrency = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const fmtDateTime = (d) =>
  new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export const imgUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API.replace("/api/v1", "")}${path}`;
};