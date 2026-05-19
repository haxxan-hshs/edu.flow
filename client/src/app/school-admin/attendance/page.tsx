"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SchoolAdminLayout from "@/components/school/SchoolAdminLayout";
import { getStudents, getAttendance, saveAttendance, Student, AttendanceRecord } from "@/lib/schoolAdmin";

export default function AttendancePage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("school_admin_auth")) { router.push("/school-admin"); return; }
    setStudents(getStudents().filter(s => s.status === "active"));
    setAttendance(getAttendance());
  }, [router]);

  function getStatus(studentId: string): AttendanceRecord["status"] {
    return attendance.find(a => a.studentId === studentId && a.date === date)?.status || "present";
  }

  function setStatus(studentId: string, status: AttendanceRecord["status"]) {
    setAttendance(prev => {
      const existing = prev.find(a => a.studentId === studentId && a.date === date);
      if (existing) return prev.map(a => a.studentId === studentId && a.date === date ? { ...a, status } : a);
      return [...prev, { id: "att" + Date.now() + studentId, studentId, date, status }];
    });
    setSaved(false);
  }

  function handleSave() {
    saveAttendance(attendance);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const todayRec = attendance.filter(a => a.date === date);
  const presentCount = todayRec.filter(a => a.status === "present").length;
  const absentCount = todayRec.filter(a => a.status === "absent").length;
  const lateCount = todayRec.filter(a => a.status === "late").length;

  const btnClass = (active: boolean, color: string) =>
    `px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${active ? color : "border-white/10 text-slate-500 hover:border-white/20"}`;

  return (
    <SchoolAdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Attendance 📋</h1>
            <p className="text-slate-400 text-sm mt-1">Har din ki haazri record karein</p>
          </div>
          <div className="flex items-center gap-3">
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <button onClick={handleSave}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-lg flex items-center gap-2 ${saved ? "bg-green-600 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20"}`}>
              {saved ? "✅ Saved!" : "💾 Save"}
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Present", value: presentCount, color: "from-green-700 to-emerald-500", icon: "✅" },
            { label: "Absent", value: absentCount, color: "from-red-700 to-rose-500", icon: "❌" },
            { label: "Late", value: lateCount, color: "from-yellow-700 to-amber-500", icon: "⏰" },
          ].map(s => (
            <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-center shadow-lg`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="text-2xl font-extrabold text-white">{s.value}</p>
              <p className="text-white/70 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Attendance Table */}
        <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-semibold text-white text-sm">Students — {new Date(date + "T00:00:00").toLocaleDateString("ur-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</h2>
            <div className="flex gap-2">
              <button onClick={() => students.forEach(s => setStatus(s.id, "present"))} className="text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1.5 rounded-lg transition border border-green-500/20">All Present</button>
              <button onClick={() => students.forEach(s => setStatus(s.id, "absent"))} className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-lg transition border border-red-500/20">All Absent</button>
            </div>
          </div>
          <div className="divide-y divide-white/5">
            {students.map(s => {
              const status = getStatus(s.id);
              return (
                <div key={s.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/2 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">{s.name[0]}</div>
                    <div>
                      <p className="text-white text-sm font-medium">{s.name}</p>
                      <p className="text-slate-500 text-xs">Roll {s.rollNo} · Class {s.class}-{s.section}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setStatus(s.id, "present")}
                      className={btnClass(status === "present", "bg-green-500/20 border-green-500/40 text-green-400")}>✅ Present</button>
                    <button onClick={() => setStatus(s.id, "absent")}
                      className={btnClass(status === "absent", "bg-red-500/20 border-red-500/40 text-red-400")}>❌ Absent</button>
                    <button onClick={() => setStatus(s.id, "late")}
                      className={btnClass(status === "late", "bg-yellow-500/20 border-yellow-500/40 text-yellow-400")}>⏰ Late</button>
                  </div>
                </div>
              );
            })}
            {students.length === 0 && <p className="px-5 py-10 text-center text-slate-500">Koi active student nahi hai.</p>}
          </div>
        </div>
      </div>
    </SchoolAdminLayout>
  );
}
