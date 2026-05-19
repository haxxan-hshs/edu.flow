"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SchoolAdminLayout from "@/components/school/SchoolAdminLayout";
import { getStudents, getAttendance, getMarks, Student, AttendanceRecord, MarksRecord } from "@/lib/schoolAdmin";

interface StudentReport {
  student: Student;
  totalDays: number;
  presentDays: number;
  attendancePct: number;
  avgMarks: number;
  grade: string;
  gradeColor: string;
  subjects: { subject: string; avg: number }[];
}

function calcGrade(pct: number): { grade: string; color: string } {
  if (pct >= 90) return { grade: "A+", color: "text-emerald-400" };
  if (pct >= 80) return { grade: "A", color: "text-green-400" };
  if (pct >= 70) return { grade: "B", color: "text-blue-400" };
  if (pct >= 60) return { grade: "C", color: "text-yellow-400" };
  if (pct >= 50) return { grade: "D", color: "text-orange-400" };
  return { grade: "F", color: "text-red-400" };
}

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<StudentReport[]>([]);
  const [selected, setSelected] = useState<StudentReport | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "marks" | "attendance">("name");

  useEffect(() => {
    if (!localStorage.getItem("school_admin_auth")) { router.push("/school-admin"); return; }
    const students = getStudents();
    const attendance: AttendanceRecord[] = getAttendance();
    const marks: MarksRecord[] = getMarks();

    const allDates = [...new Set(attendance.map(a => a.date))];
    const totalDays = allDates.length || 1;

    const reps: StudentReport[] = students.map(s => {
      const sAtt = attendance.filter(a => a.studentId === s.id);
      const presentDays = sAtt.filter(a => a.status === "present").length;
      const attPct = Math.round((presentDays / totalDays) * 100);

      const sMarks = marks.filter(m => m.studentId === s.id);
      const avgMarks = sMarks.length
        ? Math.round(sMarks.reduce((sum, m) => sum + (m.marks / m.totalMarks) * 100, 0) / sMarks.length)
        : 0;

      // Per subject averages
      const subjectMap: Record<string, number[]> = {};
      sMarks.forEach(m => {
        if (!subjectMap[m.subject]) subjectMap[m.subject] = [];
        subjectMap[m.subject].push((m.marks / m.totalMarks) * 100);
      });
      const subjects = Object.entries(subjectMap).map(([subject, vals]) => ({
        subject, avg: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
      }));

      const { grade, color } = calcGrade(avgMarks);
      return { student: s, totalDays, presentDays, attendancePct: attPct, avgMarks, grade, gradeColor: color, subjects };
    });

    setReports(reps);
  }, [router]);

  const sorted = [...reports].sort((a, b) => {
    if (sortBy === "marks") return b.avgMarks - a.avgMarks;
    if (sortBy === "attendance") return b.attendancePct - a.attendancePct;
    return a.student.name.localeCompare(b.student.name);
  });

  const overallAvgMarks = reports.length ? Math.round(reports.reduce((s, r) => s + r.avgMarks, 0) / reports.length) : 0;
  const overallAttPct = reports.length ? Math.round(reports.reduce((s, r) => s + r.attendancePct, 0) / reports.length) : 0;
  const topStudent = [...reports].sort((a, b) => b.avgMarks - a.avgMarks)[0];
  const failCount = reports.filter(r => r.avgMarks < 50).length;

  return (
    <SchoolAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Performance Reports 📊</h1>
          <p className="text-slate-400 text-sm mt-1">Tamam students ki complete performance</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Students", value: reports.length, icon: "👨‍🎓", color: "from-indigo-600 to-indigo-400" },
            { label: "Class Avg Marks", value: overallAvgMarks + "%", icon: "📝", color: "from-purple-600 to-violet-400" },
            { label: "Avg Attendance", value: overallAttPct + "%", icon: "📋", color: "from-green-600 to-emerald-400" },
            { label: "Failing Students", value: failCount, icon: "⚠️", color: "from-red-600 to-rose-400" },
          ].map(s => (
            <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 shadow-lg`}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <p className="text-2xl font-extrabold text-white">{s.value}</p>
              <p className="text-white/70 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {topStudent && (
          <div className="bg-gradient-to-r from-amber-600/20 to-yellow-600/10 border border-amber-500/30 rounded-2xl p-5 flex items-center gap-4">
            <span className="text-4xl">🏆</span>
            <div>
              <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">Top Student</p>
              <p className="text-white font-extrabold text-lg">{topStudent.student.name}</p>
              <p className="text-slate-400 text-sm">Avg: {topStudent.avgMarks}% · Grade: <span className={topStudent.gradeColor}>{topStudent.grade}</span></p>
            </div>
          </div>
        )}

        {/* Sort */}
        <div className="flex items-center gap-3">
          <span className="text-slate-500 text-sm">Sort by:</span>
          {(["name", "marks", "attendance"] as const).map(opt => (
            <button key={opt} onClick={() => setSortBy(opt)}
              className={`text-xs px-3 py-1.5 rounded-lg transition capitalize ${sortBy === opt ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 border border-white/10 hover:border-white/20"}`}>
              {opt}
            </button>
          ))}
        </div>

        {/* Report Table */}
        <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 text-left">Student</th>
                  <th className="px-5 py-3 text-left">Class</th>
                  <th className="px-5 py-3 text-center">Avg Marks</th>
                  <th className="px-5 py-3 text-center">Grade</th>
                  <th className="px-5 py-3 text-center">Attendance</th>
                  <th className="px-5 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(r => (
                  <tr key={r.student.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">{r.student.name[0]}</div>
                        <div>
                          <p className="text-white font-medium">{r.student.name}</p>
                          <p className="text-slate-500 text-xs">Roll {r.student.rollNo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">{r.student.class}-{r.student.section}</td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-800 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${r.avgMarks}%` }} />
                        </div>
                        <span className="text-white text-xs w-8">{r.avgMarks}%</span>
                      </div>
                    </td>
                    <td className={`px-5 py-3.5 text-center font-extrabold ${r.gradeColor}`}>{r.grade}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.attendancePct >= 75 ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                        {r.presentDays}/{r.totalDays} ({r.attendancePct}%)
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => setSelected(r)} className="text-xs bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 px-3 py-1.5 rounded-lg transition">📋 View</button>
                    </td>
                  </tr>
                ))}
                {sorted.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-slate-500">Koi data nahi hai.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 sticky top-0 bg-slate-900 z-10">
              <h2 className="font-bold text-white">📋 {selected.student.name}</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>
            <div className="p-6 space-y-5">
              {/* Info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Roll No", value: selected.student.rollNo },
                  { label: "Class", value: `${selected.student.class}-${selected.student.section}` },
                  { label: "Guardian", value: selected.student.guardian },
                  { label: "Phone", value: selected.student.phone },
                ].map(f => (
                  <div key={f.label} className="bg-slate-800 rounded-xl p-3">
                    <p className="text-xs text-slate-500">{f.label}</p>
                    <p className="text-white text-sm font-medium mt-0.5">{f.value}</p>
                  </div>
                ))}
              </div>
              {/* Overall */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-extrabold text-indigo-400">{selected.avgMarks}%</p>
                  <p className="text-slate-400 text-xs mt-1">Avg Marks</p>
                </div>
                <div className={`rounded-xl p-4 text-center border ${selected.grade === "F" ? "bg-red-500/10 border-red-500/20" : "bg-green-500/10 border-green-500/20"}`}>
                  <p className={`text-2xl font-extrabold ${selected.gradeColor}`}>{selected.grade}</p>
                  <p className="text-slate-400 text-xs mt-1">Grade</p>
                </div>
                <div className={`rounded-xl p-4 text-center border ${selected.attendancePct >= 75 ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}>
                  <p className={`text-2xl font-extrabold ${selected.attendancePct >= 75 ? "text-green-400" : "text-red-400"}`}>{selected.attendancePct}%</p>
                  <p className="text-slate-400 text-xs mt-1">Attendance</p>
                </div>
              </div>
              {/* Subject Breakdown */}
              {selected.subjects.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold text-sm mb-3">Subject-wise Performance</h3>
                  <div className="space-y-2">
                    {selected.subjects.map(sub => {
                      const { grade: sg, color: sc } = calcGrade(sub.avg);
                      return (
                        <div key={sub.subject} className="flex items-center gap-3">
                          <p className="text-slate-400 text-xs w-28 flex-shrink-0">{sub.subject}</p>
                          <div className="flex-1 bg-slate-800 rounded-full h-2">
                            <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${sub.avg}%` }} />
                          </div>
                          <span className="text-xs text-white w-8">{sub.avg}%</span>
                          <span className={`text-xs font-bold w-5 ${sc}`}>{sg}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {selected.subjects.length === 0 && <p className="text-slate-500 text-sm text-center py-4">Is student ke marks nahi hain abhi.</p>}
            </div>
          </div>
        </div>
      )}
    </SchoolAdminLayout>
  );
}
