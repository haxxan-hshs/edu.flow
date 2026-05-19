"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SchoolAdminLayout from "@/components/school/SchoolAdminLayout";
import { getAllUserActivities, UserActivityProfile } from "@/lib/schoolAdmin";

function fmt(s: number) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return `${s}s`;
}

export default function UserActivityPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserActivityProfile[]>([]);
  const [selected, setSelected] = useState<UserActivityProfile | null>(null);
  const [search, setSearch] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("school_admin_auth")) { router.push("/school-admin"); return; }
    setUsers(getAllUserActivities());
    setReady(true);
  }, [router]);

  function refresh() { setUsers(getAllUserActivities()); }

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.firstName.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName.toLowerCase().includes(search.toLowerCase())
  );

  if (!ready) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <svg className="w-8 h-8 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
    </div>
  );

  const totalStudy = users.reduce((a, u) => a + u.totalStudySeconds, 0);
  const totalSubjects = users.reduce((a, u) => a + u.subjects.length, 0);
  const totalFiles = users.reduce((a, u) => a + u.filesCount, 0);

  return (
    <SchoolAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">User Activity Monitor 📡</h1>
            <p className="text-slate-400 text-sm mt-1">Registered users ki activity aur data dekhein</p>
          </div>
          <button onClick={refresh} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-500/20 text-sm">
            🔄 Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: users.length, icon: "👥", color: "from-indigo-600 to-indigo-400", shadow: "shadow-indigo-500/20" },
            { label: "Total Study Time", value: fmt(totalStudy), icon: "⏱️", color: "from-purple-600 to-violet-400", shadow: "shadow-purple-500/20" },
            { label: "Subjects Added", value: totalSubjects, icon: "📚", color: "from-green-600 to-emerald-400", shadow: "shadow-green-500/20" },
            { label: "Files Uploaded", value: totalFiles, icon: "📁", color: "from-amber-600 to-yellow-400", shadow: "shadow-amber-500/20" },
          ].map(s => (
            <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 shadow-lg ${s.shadow}`}>
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className="text-2xl font-extrabold text-white">{s.value}</p>
              <p className="text-white/70 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search by name or email..."
          className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />

        {users.length === 0 ? (
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-16 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-white font-bold text-lg mb-2">Koi User Activity Nahi Mili</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">Jab koi user EduFlow dashboard par login karke apna profile, subjects, ya study sessions add karega — woh yahan nazar aayega.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* User List */}
            <div className="lg:col-span-1 space-y-3">
              {filtered.map(u => (
                <button key={u.email} onClick={() => setSelected(u)}
                  className={`w-full text-left bg-slate-900 border rounded-2xl p-4 transition hover:border-indigo-500/50 ${selected?.email === u.email ? "border-indigo-500 ring-1 ring-indigo-500/30" : "border-white/5"}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                      {u.avatarUrl
                        ? <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" />
                        : (u.firstName?.[0] || u.email[0]).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{u.firstName} {u.lastName}</p>
                      <p className="text-slate-400 text-xs truncate">{u.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-800 rounded-lg py-1.5">
                      <p className="text-indigo-400 font-bold text-sm">{u.subjects.length}</p>
                      <p className="text-slate-500 text-xs">Subjects</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg py-1.5">
                      <p className="text-purple-400 font-bold text-sm">{fmt(u.totalStudySeconds)}</p>
                      <p className="text-slate-500 text-xs">Study</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg py-1.5">
                      <p className="text-amber-400 font-bold text-sm">{u.filesCount}</p>
                      <p className="text-slate-500 text-xs">Files</p>
                    </div>
                  </div>
                  <p className="text-slate-600 text-xs mt-2">Last seen: {new Date(u.lastSeen).toLocaleString("en-PK")}</p>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-slate-500 text-sm text-center py-8">Koi user nahi mila</p>
              )}
            </div>

            {/* User Detail Panel */}
            <div className="lg:col-span-2">
              {!selected ? (
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-16 text-center">
                  <div className="text-5xl mb-3">👈</div>
                  <p className="text-slate-400 text-sm">Kisi user ka naam click karein detail dekhne ke liye</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Profile Card */}
                  <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-2xl flex-shrink-0 overflow-hidden">
                        {selected.avatarUrl
                          ? <img src={selected.avatarUrl} alt="" className="w-full h-full object-cover" />
                          : (selected.firstName?.[0] || selected.email[0]).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-xl font-extrabold text-white">{selected.firstName} {selected.lastName}</h2>
                        <p className="text-slate-400 text-sm">{selected.email}</p>
                        <p className="text-slate-600 text-xs mt-0.5">Last active: {new Date(selected.lastSeen).toLocaleString("en-PK")}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Total Study", value: fmt(selected.totalStudySeconds), icon: "⏱️", color: "text-purple-400" },
                        { label: "Sessions", value: selected.studySessions.length, icon: "📅", color: "text-indigo-400" },
                        { label: "Files", value: selected.filesCount, icon: "📁", color: "text-amber-400" },
                      ].map(s => (
                        <div key={s.label} className="bg-slate-800 rounded-xl p-3 text-center">
                          <div className="text-2xl mb-1">{s.icon}</div>
                          <p className={`font-extrabold text-lg ${s.color}`}>{s.value}</p>
                          <p className="text-slate-500 text-xs">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">📚 Subjects ({selected.subjects.length})</h3>
                    {selected.subjects.length === 0
                      ? <p className="text-slate-500 text-sm">User ne koi subject add nahi kiya.</p>
                      : <div className="flex flex-wrap gap-2">
                          {selected.subjects.map(s => (
                            <span key={s.id} className="flex items-center gap-1.5 bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-full text-sm">
                              📖 {s.name}
                              {s.hoursPerWeek > 0 && <span className="text-indigo-400/70 text-xs">({s.hoursPerWeek}h/wk)</span>}
                            </span>
                          ))}
                        </div>
                    }
                  </div>

                  {/* Study Sessions */}
                  <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">📅 Study Sessions ({selected.studySessions.length})</h3>
                    {selected.studySessions.length === 0
                      ? <p className="text-slate-500 text-sm">User ne koi study session complete nahi kiya.</p>
                      : <div className="space-y-2 max-h-60 overflow-y-auto">
                          {selected.studySessions.map((s, i) => (
                            <div key={s.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">#{i + 1}</div>
                                <div>
                                  <p className="text-sm text-white font-medium">{s.title || "Study Session"}</p>
                                  <p className="text-xs text-slate-500">{s.date}</p>
                                </div>
                              </div>
                              <span className="text-sm font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-lg">{fmt(s.durationSeconds)}</span>
                            </div>
                          ))}
                        </div>
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </SchoolAdminLayout>
  );
}
