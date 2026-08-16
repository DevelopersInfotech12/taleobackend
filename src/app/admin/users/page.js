"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { apiFetch, fmtDate } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import {
  Spinner, ErrorBanner, EmptyState, Badge, Pagination, Toast, ConfirmDialog,
  PageHeader, StatStrip, FilterBar, filterInputCls, filterSelectCls, FilterLabel, ResetButton,
  TableShell, Thead, rowCls, AccentCell, editBtnCls, selectCls,
} from "../components/ui";

export default function UsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  // filters
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");

  const [toggleTarget, setToggleTarget] = useState(null);
  const [working, setWorking] = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "10" });
      if (search) params.set("search", search);
      if (role) params.set("role", role);
      const res = await apiFetch(`/users?${params.toString()}`, token);
      setUsers(res.data.users || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, page, search, role]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = useMemo(() => {
    let list = users.filter(u => {
      if (status === "active" && !u.isActive) return false;
      if (status === "inactive" && u.isActive) return false;
      return true;
    });
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "oldest") list = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [users, status, sort]);

  const confirmToggle = async () => {
    setWorking(true);
    try {
      await apiFetch(`/users/${toggleTarget._id}/toggle`, token, { method: "PATCH" });
      showToast(toggleTarget.isActive ? "User deactivated" : "User activated");
      setToggleTarget(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setWorking(false);
    }
  };

  const changeRole = async (u, newRole) => {
    if (newRole === u.role) return;
    try {
      await apiFetch(`/users/${u._id}/role`, token, { method: "PATCH", body: JSON.stringify({ role: newRole }) });
      showToast("Role updated");
      fetchUsers();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const resetFilters = () => { setSearchInput(""); setSearch(""); setRole(""); setStatus(""); setSort("newest"); setPage(1); };

  const initials = (name) => (name || "").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const admins = users.filter(u => u.role === "admin").length;
  const active = users.filter(u => u.isActive).length;

  return (
    <>
      <PageHeader eyebrow="Customer Management" title="Users" />

      <StatStrip stats={[
        { label: "Total", value: total },
        { label: "This Page", value: users.length },
        { label: "Admins", value: admins },
        { label: "Active", value: active },
      ]} />

      <FilterBar>
        <div className="flex-1 min-w-[160px]">
          <FilterLabel>Search</FilterLabel>
          <input className={filterInputCls} placeholder="Name or email…" value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        </div>
        <div>
          <FilterLabel>Role</FilterLabel>
          <select className={filterSelectCls + " min-w-[120px]"} value={role} onChange={e => { setRole(e.target.value); setPage(1); }}>
            <option value="">All</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <FilterLabel>Status</FilterLabel>
          <select className={filterSelectCls + " min-w-[120px]"} value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <FilterLabel>Sort</FilterLabel>
          <select className={filterSelectCls + " min-w-[140px]"} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
        <ResetButton onClick={resetFilters} />
      </FilterBar>

      <ErrorBanner message={error} />

      <TableShell>
        {loading ? <Spinner /> : filtered.length === 0 ? <EmptyState message="No users found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <Thead headers={["User", "Phone", "Role", "Addresses", "Joined", "Status", "Actions"]} />
              <tbody>
                {filtered.map((u) => (
                  <tr key={u._id} className={rowCls}>
                    <AccentCell className="pl-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#e8d5b0] text-[#8b6914] flex items-center justify-center text-[11px] font-semibold flex-shrink-0">
                          {initials(u.name)}
                        </div>
                        <div>
                          <p className="text-[#1a1008] font-semibold text-[12.5px]">{u.name}</p>
                          <p className="text-[10px] text-[#9c8a78]">{u.email}</p>
                        </div>
                      </div>
                    </AccentCell>
                    <td className="px-4 py-3 text-[#5c4f42]">{u.phone || "—"}</td>
                    <td className="px-4 py-3">
                      <select className={selectCls + " text-[11px] py-1"} value={u.role} onChange={e => changeRole(u, e.target.value)}>
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-[#5c4f42]">{u.addresses?.length || 0}</td>
                    <td className="px-4 py-3 text-[#9c8a78]">{fmtDate(u.createdAt)}</td>
                    <td className="px-4 py-3"><Badge status={u.isActive ? "active" : "inactive"} label={u.isActive ? "Active" : "Inactive"} /></td>
                    <td className="px-4 py-3">
                      <button onClick={() => setToggleTarget(u)} className={editBtnCls}>
                        {u.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} pages={pages} total={total} onChange={setPage} />
      </TableShell>

      <ConfirmDialog
        open={!!toggleTarget}
        title={toggleTarget?.isActive ? "Deactivate user?" : "Activate user?"}
        message={`"${toggleTarget?.name}" will be ${toggleTarget?.isActive ? "deactivated and unable to log in" : "reactivated"}.`}
        onConfirm={confirmToggle}
        onCancel={() => setToggleTarget(null)}
        loading={working}
        confirmLabel={toggleTarget?.isActive ? "Deactivate" : "Activate"}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
