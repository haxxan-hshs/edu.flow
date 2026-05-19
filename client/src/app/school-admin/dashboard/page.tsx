"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SchoolAdminLayout from "@/components/school/SchoolAdminLayout";
import { seedData, getStudents, getAttendance, getMarks, getAnnouncements, getAllUserActivities, UserActivityProfile } from "@/lib/schoolAdmin";

export default function SchoolDashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [stats, setStats] = useState({ students: 0, present: 0, absent: 0, avgMarks: 0, announcements: 0 });
  const [recentStudents, setRecentStudents] = useState<{ name: string; class: string; rollNo: string; status: string }[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<{ name: string; status: string }[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivityProfile[]>([]);

  useEffect(() => {
    if (!localStorage.getItem("school_admin_auth")) { router.push("/school-admin"); return; }
    seedData();
    const students = getStudents();
    const today = new Date().toISOString().split("T")[0];
    const att = getAttendance().filter(a => a.date === today);
    const marks = getMarks();
    const avgMarks = marks.length ? Math.round(marks.reduce((s, m) => s + (m.marks / m.totalMarks) * 100, 0) / marks.length) : 0;
    setStats({
      students: students.length,
      present: att.filter(a => a.status === "present").length,
      absent: att.filter(a => a.status === "absent").length,
      avgMarks,
      announcements: getAnnouncements().length,
    });
    setRecentStudents(students.slice(0, 5).map(s => ({ name: s.name, class: s.class + "-" + s.section, rollNo: s.rollNo, status: s.status })));
    setTodayAttendance(att.slice(0, 5).map(a => ({
      name: students.find(s => s.id === a.studentId)?.name || "Unknown",
      status: a.status,
    })));
    setUserActivities(getAllUserActivities());
    setReady(true);
  }, [router]);

  if (!ready) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <svg className="w-8 h-8 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
    </div>
  );

  const statCards = [
    { label: "Total Students", value: stats.students, icon: "👨‍🎓", color: "from-indigo-600 to-indigo-400", shadow: "shadow-indigo-500/20" },
    { label: "Present Today", value: stats.present, icon: "✅", color: "from-green-600 to-emerald-400", shadow: "shadow-green-500/20" },
    { label: "Absent Today", value: stats.absent, icon: "❌", color: "from-red-600 to-rose-400", shadow: "shadow-red-500/20" },
    { label: "Avg Marks %", value: stats.avgMarks + "%", icon: "📝", color: "from-purple-600 to-violet-400", shadow: "shadow-purple-500/20" },
    { label: "Announcements", value: stats.announcements, icon: "📢", color: "from-amber-600 to-yellow-400", shadow: "shadow-amber-500/20" },
  ];

  const statusColor: Record<string, string> = {
    present: "bg-green-500/20 text-green-400 border border-green-500/30",
    absent: "bg-red-500/20 text-red-400 border border-red-500/30",
    late: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    active: "bg-green-500/20 text-green-400 border border-green-500/30",
    inactive: "bg-slate-500/20 text-slate-400 border border-slate-500/30",
  };

  return (
    <SchoolAdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Dashboard 🏫</h1>
          <p className="text-slate-400 text-sm mt-1">School ka aaj ka overview</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map(s => (
            <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 shadow-lg ${s.shadow}`}>
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className="text-2xl font-extrabold text-white">{s.value}</p>
              <p className="text-white/70 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Students */}
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">👨‍🎓 Recent Students</h2>
            <div className="space-y-3">
              {recentStudents.length === 0 && <p className="text-slate-500 text-sm">Koi student add nahi kiya gaya abhi tak.</p>}
              {recentStudents.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">{s.name[0]}</div>
                    <div>
                      <p className="text-sm font-medium text-white">{s.name}</p>
                      <p className="text-xs text-slate-500">Class {s.class} · Roll {s.rollNo}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${statusColor[s.status]}`}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Today Attendance */}
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">📋 Aaj ki Attendance</h2>
            <div className="space-y-3">
              {todayAttendance.length === 0 && <p className="text-slate-500 text-sm">Aaj ki attendance record nahi hai.</p>}
              {todayAttendance.map((a, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <p className="text-sm text-white">{a.name}</p>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${statusColor[a.status]}`}>{a.status === "present" ? "✅ Present" : a.status === "absent" ? "❌ Absent" : "⏰ Late"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live User Activity */}
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white flex items-center gap-2">📡 Live User Activity</h2>
            <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded-full">{userActivities.length} users</span>
          </div>
          {userActivities.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-slate-500 text-sm">Koi user activity nahi mili abhi tak.</p>
              <p className="text-slate-600 text-xs mt-1">Jab users dashboard par login kar ke subjects/study sessions add karenge — yahan nazar aayenge.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userActivities.slice(0, 6).map(u => (
                <div key={u.email} className="bg-slate-800/60 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                      {u.avatarUrl ? <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" /> : (u.firstName?.[0] || u.email[0]).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{u.firstName} {u.lastName}</p>
                      <p className="text-slate-400 text-xs truncate">{u.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="bg-slate-900 rounded-lg py-1.5">
                      <p className="text-indigo-400 font-bold text-xs">{u.subjects.length}</p>
                      <p className="text-slate-600 text-xs">Subjects</p>
                    </div>
                    <div className="bg-slate-900 rounded-lg py-1.5">
                      <p className="text-purple-400 font-bold text-xs">{u.studySessions.length}</p>
                      <p className="text-slate-600 text-xs">Sessions</p>
                    </div>
                    <div className="bg-slate-900 rounded-lg py-1.5">
                      <p className="text-amber-400 font-bold text-xs">{u.filesCount}</p>
                      <p className="text-slate-600 text-xs">Files</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {userActivities.length > 0 && (
            <a href="/school-admin/user-activity" className="mt-4 flex items-center justify-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition">
              Tamam users dekho → 
            </a>
          )}
        </div>
      </div>
    </SchoolAdminLayout>
  );
}
