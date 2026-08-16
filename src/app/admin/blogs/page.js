"use client";
import { useState, useEffect, useCallback } from "react";
import { apiFetch, fmtDate } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import { Spinner, ErrorBanner, EmptyState, Toast, ConfirmDialog } from "../components/ui";
import BlogEditor from "../components/BlogEditor";

const TAGS = ["General", "Jewellery Care", "Style Guide", "Behind the Brand"];

export default function BlogsPage() {
  const { token } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [tag, setTag] = useState("");

  const [mode, setMode] = useState("list"); // "list" | "editor"
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchBlogs = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "10" });
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      if (tag) params.set("tag", tag);
      const res = await apiFetch(`/blogs?${params.toString()}`, token);
      setBlogs(res.data || []);
      setTotal(res.pagination?.total || 0);
      setPages(res.pagination?.pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, page, search, status, tag]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const openCreate = () => { setEditing(null); setMode("editor"); };
  const openEdit = (b) => { setEditing(b); setMode("editor"); };
  const closeEditor = () => { setMode("list"); setEditing(null); };
  const savedEditor = () => { setMode("list"); setEditing(null); fetchBlogs(); showToast(editing ? "Post updated" : "Post created"); };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/blogs/${deleteTarget._id}`, token, { method: "DELETE" });
      showToast("Post deleted");
      setDeleteTarget(null);
      fetchBlogs();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const resetFilters = () => { setSearchInput(""); setSearch(""); setStatus(""); setTag(""); setPage(1); };

  const published = blogs.filter(b => b.status === "published").length;
  const drafts = blogs.filter(b => b.status === "draft").length;

  const stats = [
    { label: "Total Posts", value: total },
    { label: "Published", value: published },
    { label: "Drafts", value: drafts },
    { label: "This Page", value: blogs.length },
  ];

  if (mode === "editor") {
    return (
      <div style={{ fontFamily: "'Inter', sans-serif" }}>
        <BlogEditor blog={editing} onSaved={savedEditor} onCancel={closeEditor} />
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Header ── */}
      <div className="flex items-end justify-between mb-8">
        <div>
          {/* Eyebrow */}
          <p style={{
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#c9a84c",
            fontWeight: 600,
            marginBottom: 6,
          }}>
            Content Management
          </p>
          <h1 style={{
            fontFamily: "'Georgia', serif",
            fontSize: 36,
            fontWeight: 700,
            color: "#1a1008",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            margin: 0,
          }}>
            Journal
          </h1>
        </div>

        <button
          onClick={openCreate}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "linear-gradient(135deg, #c9a84c 0%, #e8c97a 50%, #c9a84c 100%)",
            color: "#1a1008",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "0 22px",
            height: 40,
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 12px rgba(201,168,76,0.35)",
            transition: "opacity 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(201,168,76,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(201,168,76,0.35)"; }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New Post
        </button>
      </div>

      {/* ── Stat Strip ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {stats.map(({ label, value }, i) => (
          <div
            key={label}
            style={{
              background: i === 0
                ? "linear-gradient(135deg, #1a1008 0%, #2e1f0a 100%)"
                : "#fdfaf6",
              border: i === 0 ? "1px solid #3d2a10" : "1px solid #ede4d8",
              borderRadius: 10,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {i === 0 && (
              <span style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: 2,
                background: "linear-gradient(90deg, #c9a84c, #e8c97a, #c9a84c)",
              }} />
            )}
            <p style={{
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: i === 0 ? "#c9a84c" : "#9c8a78",
              margin: 0,
            }}>
              {label}
            </p>
            <p style={{
              fontFamily: "'Georgia', serif",
              fontSize: 28,
              fontWeight: 700,
              color: i === 0 ? "#f5ede0" : "#1a1008",
              margin: 0,
              lineHeight: 1,
            }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Filter Bar ── */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        alignItems: "flex-end",
        marginBottom: 16,
        padding: "14px 16px",
        background: "#fdfaf6",
        border: "1px solid #ede4d8",
        borderRadius: 10,
      }}>
        <div style={{ flex: 1, minWidth: 160 }}>
          <label style={{ display: "block", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9c8a78", fontWeight: 700, marginBottom: 5 }}>
            Search
          </label>
          <input
            style={{
              width: "100%",
              height: 34,
              border: "1px solid #ddd5c8",
              borderRadius: 6,
              padding: "0 12px",
              fontSize: 12,
              color: "#1a1008",
              background: "#fff",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.15s",
            }}
            placeholder="Search by title…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onFocus={e => e.target.style.borderColor = "#c9a84c"}
            onBlur={e => e.target.style.borderColor = "#ddd5c8"}
          />
        </div>

        {[
          {
            label: "Status", value: status, onChange: e => { setStatus(e.target.value); setPage(1); },
            options: [{ value: "", label: "All Status" }, { value: "published", label: "Published" }, { value: "draft", label: "Draft" }]
          },
          {
            label: "Tag", value: tag, onChange: e => { setTag(e.target.value); setPage(1); },
            options: [{ value: "", label: "All Tags" }, ...TAGS.map(t => ({ value: t, label: t }))]
          }
        ].map(({ label, value, onChange, options }) => (
          <div key={label}>
            <label style={{ display: "block", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9c8a78", fontWeight: 700, marginBottom: 5 }}>
              {label}
            </label>
            <select
              style={{
                height: 34,
                border: "1px solid #ddd5c8",
                borderRadius: 6,
                padding: "0 12px",
                fontSize: 12,
                color: "#1a1008",
                background: "#fff",
                outline: "none",
                minWidth: 140,
                cursor: "pointer",
              }}
              value={value}
              onChange={onChange}
            >
              {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        ))}

        <button
          onClick={resetFilters}
          style={{
            height: 34,
            padding: "0 16px",
            background: "transparent",
            border: "1px solid #ddd5c8",
            borderRadius: 6,
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#7a6a5a",
            fontWeight: 600,
            cursor: "pointer",
            transition: "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#c9a84c"; e.currentTarget.style.color = "#c9a84c"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd5c8"; e.currentTarget.style.color = "#7a6a5a"; }}
        >
          Clear
        </button>
      </div>

      <ErrorBanner message={error} />

      {/* ── Table ── */}
      <div style={{
        background: "#fff",
        border: "1px solid #ede4d8",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(26,16,8,0.04)",
      }}>
        {loading ? <Spinner /> : blogs.length === 0 ? <EmptyState message="No posts found" /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: "34%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "11%" }} />
              </colgroup>
              <thead>
                <tr style={{ background: "#fdfaf6", borderBottom: "1px solid #ede4d8" }}>
                  {["Title", "Tag", "Author", "Status", "Created", "Actions"].map(h => (
                    <th key={h} style={{
                      textAlign: "left",
                      padding: "11px 16px",
                      fontSize: 9,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#b8a898",
                      fontWeight: 700,
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {blogs.map((b, idx) => (
                  <TableRow
                    key={b._id}
                    b={b}
                    idx={idx}
                    onEdit={() => openEdit(b)}
                    onDelete={() => setDeleteTarget(b)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderTop: "1px solid #f0e8dc",
          background: "#fdfaf6",
        }}>
          <span style={{ fontSize: 11, color: "#b8a898", letterSpacing: "0.05em" }}>
            {Math.min((page - 1) * 10 + 1, total)}–{Math.min(page * 10, total)} of {total} posts
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  height: 28,
                  minWidth: 28,
                  padding: "0 8px",
                  borderRadius: 5,
                  fontSize: 11,
                  fontWeight: 600,
                  border: p === page ? "1px solid #c9a84c" : "1px solid #ede4d8",
                  background: p === page ? "#1a1008" : "#fff",
                  color: p === page ? "#c9a84c" : "#7a6a5a",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete post?"
        message={`"${deleteTarget?.title}" will be permanently deleted.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

/* ── Row extracted to manage hover state cleanly ── */
function TableRow({ b, idx, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: "1px solid #f5ece0",
        background: hovered ? "#fdfaf6" : "#fff",
        transition: "background 0.12s",
        position: "relative",
      }}
    >
      {/* Title */}
      <td style={{ padding: "14px 16px", paddingLeft: 20, position: "relative", overflow: "hidden" }}>
        <span style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0,
          width: 3,
          background: "linear-gradient(180deg, #c9a84c, #e8c97a)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.15s",
        }} />
        <span style={{
          fontSize: 13.5,
          fontWeight: 600,
          color: "#1a1008",
          display: "block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          letterSpacing: "-0.01em",
        }}>
          {b.title}
        </span>
      </td>

      {/* Tag */}
      <td style={{ padding: "14px 16px" }}>
        <span style={{
          display: "inline-block",
          background: "#f5ece0",
          color: "#7a5c2e",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.06em",
          padding: "3px 10px",
          borderRadius: 20,
          border: "1px solid #e8d8c0",
        }}>
          {b.tag}
        </span>
      </td>

      {/* Author */}
      <td style={{ padding: "14px 16px", fontSize: 12, color: "#5c4f42", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {b.author?.name || b.author || "—"}
      </td>

      {/* Status */}
      <td style={{ padding: "14px 16px" }}>
        {b.status === "published" ? (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#edf7f1",
            color: "#1e6640",
            fontSize: 10.5,
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: 20,
            border: "1px solid #c3e6d0",
            letterSpacing: "0.04em",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#28a05a", display: "inline-block" }} />
            Published
          </span>
        ) : (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#f5f0e8",
            color: "#7a6a4a",
            fontSize: 10.5,
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: 20,
            border: "1px solid #e0d4bb",
            letterSpacing: "0.04em",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#a08040", display: "inline-block" }} />
            Draft
          </span>
        )}
      </td>

      {/* Date */}
      <td style={{ padding: "14px 16px", fontSize: 11.5, color: "#a89888", letterSpacing: "0.02em" }}>
        {b.createdAt ? fmtDate(b.createdAt) : "—"}
      </td>

      {/* Actions */}
      <td style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <ActionBtn onClick={onEdit} color="#c9a84c" hoverColor="#8b6914" label="Edit" />
          <ActionBtn onClick={onDelete} color="#d4756a" hoverColor="#a34030" label="Del" />
        </div>
      </td>
    </tr>
  );
}

function ActionBtn({ onClick, color, hoverColor, label }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: hov ? hoverColor : color,
        transition: "color 0.12s",
      }}
    >
      {label}
    </button>
  );
}