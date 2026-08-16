"use client";
import { useState, useEffect, useCallback } from "react";
import { apiFetch, fmtDate } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import {
  Spinner, ErrorBanner, EmptyState, Badge, Pagination, Toast, ConfirmDialog,
  PageHeader, HeaderButton, StatStrip, FilterBar, filterInputCls, filterSelectCls, FilterLabel, ResetButton,
  TableShell, Thead, rowCls, AccentCell, editBtnCls, delBtnCls, selectCls,
} from "../components/ui";
import TaskFormModal from "../components/TaskFormModal";

const PRIORITY_BADGE = { low: "active", medium: "pending", high: "failed" };
const STATUS_LABEL = { todo: "To Do", in_progress: "In Progress", done: "Done" };
const STATUS_BADGE = { todo: "pending", in_progress: "processing", done: "delivered" };

export default function TasksPage() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchTasks = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "10" });
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      if (priority) params.set("priority", priority);
      const res = await apiFetch(`/tasks?${params.toString()}`, token);
      setTasks(res.data.tasks || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, page, search, status, priority]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const resetFilters = () => { setSearchInput(""); setSearch(""); setStatus(""); setPriority(""); setPage(1); };

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (t) => { setEditing(t); setModalOpen(true); };

  const quickStatus = async (task, newStatus) => {
    if (newStatus === task.status) return;
    try {
      await apiFetch(`/tasks/${task._id}`, token, { method: "PUT", body: JSON.stringify({ status: newStatus }) });
      showToast("Task status updated");
      fetchTasks();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/tasks/${deleteTarget._id}`, token, { method: "DELETE" });
      showToast("Task deleted");
      setDeleteTarget(null);
      fetchTasks();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const todoCount = tasks.filter(t => t.status === "todo").length;
  const doneCount = tasks.filter(t => t.status === "done").length;

  const isOverdue = (t) => t.dueDate && t.status !== "done" && new Date(t.dueDate) < new Date(new Date().toDateString());

  return (
    <>
      <PageHeader
        eyebrow="Team Workflow"
        title="Tasks"
        action={<HeaderButton onClick={openCreate}>+ Create Task</HeaderButton>}
      />

      <StatStrip stats={[
        { label: "Total", value: total },
        { label: "This Page", value: tasks.length },
        { label: "To Do", value: todoCount },
        { label: "Done", value: doneCount },
      ]} />

      <FilterBar>
        <div className="flex-1 min-w-[160px]">
          <FilterLabel>Search</FilterLabel>
          <input className={filterInputCls} placeholder="Task title…" value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        </div>
        <div>
          <FilterLabel>Status</FilterLabel>
          <select className={filterSelectCls + " min-w-[130px]"} value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <FilterLabel>Priority</FilterLabel>
          <select className={filterSelectCls + " min-w-[120px]"} value={priority} onChange={e => { setPriority(e.target.value); setPage(1); }}>
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <ResetButton onClick={resetFilters} />
      </FilterBar>

      <ErrorBanner message={error} />

      <TableShell>
        {loading ? <Spinner /> : tasks.length === 0 ? <EmptyState message="No tasks found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <Thead headers={["Task", "Priority", "Status", "Due Date", "Assigned To", "Created", "Actions"]} />
              <tbody>
                {tasks.map((t) => (
                  <tr key={t._id} className={rowCls}>
                    <AccentCell className="pl-5">
                      <p className="text-[#1a1008] font-semibold text-[12.5px]">{t.title}</p>
                      {t.description && <p className="text-[10px] text-[#9c8a78] truncate max-w-[260px]">{t.description}</p>}
                    </AccentCell>
                    <td className="px-4 py-3"><Badge status={PRIORITY_BADGE[t.priority]} label={t.priority} /></td>
                    <td className="px-4 py-3">
                      <select className={selectCls + " text-[11px] py-1"} value={t.status} onChange={e => quickStatus(t, e.target.value)}>
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </td>
                    <td className={`px-4 py-3 ${isOverdue(t) ? "text-red-600 font-semibold" : "text-[#9c8a78]"}`}>
                      {t.dueDate ? fmtDate(t.dueDate) : "—"}
                    </td>
                    <td className="px-4 py-3 text-[#5c4f42]">{t.assignedTo || "—"}</td>
                    <td className="px-4 py-3 text-[#9c8a78]">{fmtDate(t.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button onClick={() => openEdit(t)} className={editBtnCls}>Edit</button>
                        <button onClick={() => setDeleteTarget(t)} className={delBtnCls}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} pages={pages} total={total} onChange={setPage} />
      </TableShell>

      <TaskFormModal open={modalOpen} onClose={() => setModalOpen(false)} task={editing} onSaved={fetchTasks} showToast={showToast} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete task?"
        message={`"${deleteTarget?.title}" will be permanently deleted.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
        confirmLabel="Delete"
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
