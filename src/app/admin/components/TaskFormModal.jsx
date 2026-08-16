"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import { Modal, Field, inputCls, selectCls, PrimaryButton, SecondaryButton } from "./ui";

const emptyForm = {
  title: "", description: "", priority: "medium", status: "todo", dueDate: "", assignedTo: "",
};

export default function TaskFormModal({ open, onClose, task, onSaved, showToast }) {
  const { token } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        status: task.status || "todo",
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
        assignedTo: task.assignedTo || "",
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [task, open]);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required"); return; }
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: form.title,
        description: form.description,
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate || null,
        assignedTo: form.assignedTo,
      };
      if (task) {
        await apiFetch(`/tasks/${task._id}`, token, { method: "PUT", body: JSON.stringify(payload) });
        showToast("Task updated");
      } else {
        await apiFetch("/tasks", token, { method: "POST", body: JSON.stringify(payload) });
        showToast("Task created");
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={task ? "Edit Task" : "Create Task"} width="max-w-lg">
      {error && <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-700">{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        <Field label="Title">
          <input required className={inputCls} value={form.title} onChange={e => update("title", e.target.value)} placeholder="e.g. Follow up with supplier" />
        </Field>
        <Field label="Description">
          <textarea rows={3} className={inputCls} value={form.description} onChange={e => update("description", e.target.value)} placeholder="Task details…" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Priority">
            <select className={selectCls} value={form.priority} onChange={e => update("priority", e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </Field>
          <Field label="Status">
            <select className={selectCls} value={form.status} onChange={e => update("status", e.target.value)}>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Due Date">
            <input type="date" className={inputCls} value={form.dueDate} onChange={e => update("dueDate", e.target.value)} />
          </Field>
          <Field label="Assigned To">
            <input className={inputCls} value={form.assignedTo} onChange={e => update("assignedTo", e.target.value)} placeholder="Optional" />
          </Field>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton type="submit" disabled={saving}>{saving ? "Saving…" : task ? "Update Task" : "Create Task"}</PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
