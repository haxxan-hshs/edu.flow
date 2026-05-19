"use client";
import { useState } from "react";

type UserRole = "Student" | "Teacher" | "Admin";
type UserStatus = "Active" | "Banned" | "Pending";

interface AppUser {
  id: string; name: string; email: string; role: UserRole;
  status: UserStatus; joined: string; courses: number;
}

const INITIAL_USERS: AppUser[] = [
  { id: "1", name: "Alice Johnson",   email: "alice@example.com",   role: "Student", status: "Active",  joined: "2025-01-10", courses: 5 },
  { id: "2", name: "Dr. James Wilson",email: "james@example.com",   role: "Teacher", status: "Pending", joined: "2025-02-14", courses: 8 },
  { id: "3", name: "Carlos Mendez",   email: "carlos@example.com",  role: "Student", status: "Active",  joined: "2025-03-01", courses: 3 },
  { id: "4", name: "Emily Chen",      email: "emily@example.com",   role: "Teacher", status: "Active",  joined: "2025-01-20", courses: 4 },
  { id: "5", name: "Spam Bot",        email: "spam@bot.com",        role: "Student", status: "Banned",  joined: "2025-04-05", courses: 0 },
  { id: "6", name: "Priya Sharma",    email: "priya@example.com",   role: "Student", status: "Active",  joined: "2025-02-28", courses: 7 },
  { id: "7", name: "Marcus Lee",      email: "marcus@example.com",  role: "Teacher", status: "Pending", joined: "2025-05-01", courses: 2 },
  { id: "8", name: "Rachel Torres",   email: "rachel@example.com",  role: "Student", status: "Active",  joined: "2025-03-15", courses: 6 },
];

function exportCSV(rows: Record<string, string | number>[], filename: string) {
  const headers = Object.keys(rows[0]).join(",");
  const body = rows.map(r => Object.values(r).map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([headers + "\n" + body], { type: "text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
}

const STATUS_STYLE: Record<UserStatus, string> = {
  Active:  "bg-green-500/20 text-green-400 border-green-500/30",
  Banned:  "bg-red-500/20 text-red-400 border-red-500/30",
  Pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};
const ROLE_STYLE: Record<UserRole, string> = {
  Student: "bg-blue-500/20 text-blue-400",
  Teacher: "bg-purple-500/20 text-purple-400",
  Admin:   "bg-red-500/20 text-red-400",
};

export default function AdminUsers() {
  const [users, setUsers] = useState<AppUser[]>(INITIAL_USERS);
  const [filter, setFilter] = useState<"All" | UserRole | UserStatus>("All");
  const [search, setSearch] = useState("");

  function toggleBan(id: string) {
    setUsers(u => u.map(x => x.id === id ? { ...x, status: x.status === "Banned" ? "Active" : "Banned" } : x));
  }
  function approveTeacher(id: string) {
    setUsers(u => u.map(x => x.id === id ? { ...x, status: "Active" } : x));
  }

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || u.role === filter || u.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">User Management</h1>
          <p className="text-slate-400 text-sm">Ban users, approve teachers, manage students.</p>
        </div>
        <button onClick={() => exportCSV(filtered.map(u => ({ Name: u.name, Email: u.email, Role: u.role, Status: u.status, Joined: u.joined, Courses: u.courses })), "users.csv")}
          className="flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64" />
        {(["All","Student","Teacher","Active","Banned","Pending"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${filter === f ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"}`}>{f}</button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total", value: users.length, color: "text-white" },
          { label: "Pending Teachers", value: users.filter(u => u.role === "Teacher" && u.status === "Pending").length, color: "text-amber-400" },
          { label: "Banned", value: users.filter(u => u.status === "Banned").length, color: "text-red-400" },
        ].map(s => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-slate-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-slate-800/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="col-span-3">User</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Joined</div>
          <div className="col-span-1 text-center">Courses</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        {filtered.map(u => (
          <div key={u.id} className="grid grid-cols-12 gap-2 px-5 py-4 border-t border-slate-800 items-center hover:bg-slate-800/30 transition-colors">
            <div className="col-span-3 flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">{u.name[0]}</div>
              <div className="min-w-0"><p className="text-sm text-white font-medium truncate">{u.name}</p><p className="text-xs text-slate-500 truncate">{u.email}</p></div>
            </div>
            <div className="col-span-2"><span className={`text-xs px-2 py-1 rounded-full font-medium ${ROLE_STYLE[u.role]}`}>{u.role}</span></div>
            <div className="col-span-2"><span className={`text-xs px-2 py-1 rounded-full font-medium border ${STATUS_STYLE[u.status]}`}>{u.status}</span></div>
            <div className="col-span-2 text-xs text-slate-400">{u.joined}</div>
            <div className="col-span-1 text-center text-sm font-bold text-slate-300">{u.courses}</div>
            <div className="col-span-2 flex items-center justify-end gap-1">
              {u.role === "Teacher" && u.status === "Pending" && (
                <button onClick={() => approveTeacher(u.id)} className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-lg transition-colors">Approve</button>
              )}
              <button onClick={() => toggleBan(u.id)} className={`text-xs px-2 py-1 rounded-lg transition-colors ${u.status === "Banned" ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-red-600/80 hover:bg-red-600 text-white"}`}>
                {u.status === "Banned" ? "Unban" : "Ban"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
