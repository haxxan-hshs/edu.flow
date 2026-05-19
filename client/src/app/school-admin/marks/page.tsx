"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SchoolAdminLayout from "@/components/school/SchoolAdminLayout";
import { getStudents, getMarks, saveMarks, Student, MarksRecord } from "@/lib/schoolAdmin";

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Urdu", "Computer", "Islamiat", "Pakistan Studies"];
const EXAM_TYPES = ["Midterm", "Final", "Quiz", "Assignment", "Annual"];

export default function MarksPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<MarksRecord[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ studentId: "", subject: SUBJECTS[0], examType: EXAM_TYPES[0], marks: "", totalMarks: "100", date: new Date().toISOString().split("T")[0] });
  const [filterStudent, setFilterStudent] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("school_admin_auth")) { router.push("/school-admin"); return; }
    setStudents(getStudents().filter(s => s.status === "active"));
    setMarks(getMarks());
  }, [router]);

  function openAdd() {
    setEditId(null);
    setForm({ studentId: "", subject: SUBJECTS[0], examType: EXAM_TYPES[0], marks: "", totalMarks: "100", date: new Date().toISOString().split("T")[0] });
    setModal(true);
  }

  function openEdit(m: MarksRecord) {
    setEditId(m.id);
    setForm({ studentId: m.studentId, subject: m.subject, examType: m.examType, marks: String(m.marks), totalMarks: String(m.totalMarks), date: m.date });
    setModal(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const record: MarksRecord = {
      id: editId || "m" + Date.now(),
      studentId: form.studentId,
      subject: form.subject,
      examType: form.examType,
      marks: Number(form.marks),
      totalMarks: Number(form.totalMarks),
      date: form.date,
    };
    const updated = editId ? marks.map(m => m.id === editId ? record : m) : [record, ...marks];
    saveMarks(updated); setMarks(updated); setModal(false);
  }

  function handleDelete(id: string) {
    const updated = marks.filter(m => m.id !== id);
    saveMarks(updated); setMarks(updated);
  }

  const filtered = marks.filter(m =>
    (filterStudent === "all" || m.studentId === filterStudent) &&
    (filterSubject === "all" || m.subject === filterSubject)
  );

  function grade(pct: number) {
    if (pct >= 90) return { g: "A+", c: "text-emerald-400" };
    if (pct >= 80) return { g: "A", c: "text-green-400" };
    if (pct >= 70) return { g: "B", c: "text-blue-400" };
    if (pct >= 60) return { g: "C", c: "text-yellow-400" };
    if (pct >= 50) return { g: "D", c: "text-orange-400" };
    return { g: "F", c: "text-red-400" };
  }

  const inputCls = "w-full px-3 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <SchoolAdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Marks Entry 📝</h1>
            <p className="text-slate-400 text-sm mt-1">Students ke marks record karein</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-500/20 text-sm">
            ➕ Add Marks
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select value={filterStudent} onChange={e => setFilterStudent(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="all">Tamam Students</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name} (Roll {s.rollNo})</option>)}
          </select>
          <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="all">Tamam Subjects</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Marks Table */}
        <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 text-left">Student</th>
                  <th className="px-5 py-3 text-left">Subject</th>
                  <th className="px-5 py-3 text-left">Exam</th>
                  <th className="px-5 py-3 text-center">Marks</th>
                  <th className="px-5 py-3 text-center">%</th>
                  <th className="px-5 py-3 text-center">Grade</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => {
                  const student = students.find(s => s.id === m.studentId);
                  const pct = Math.round((m.marks / m.totalMarks) * 100);
                  const { g, c } = grade(pct);
                  return (
                    <tr key={m.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition">
                      <td className="px-5 py-3.5 text-white font-medium">{student?.name || "Unknown"}</td>
                      <td className="px-5 py-3.5 text-slate-300">{m.subject}</td>
                      <td className="px-5 py-3.5"><span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full border border-indigo-500/30">{m.examType}</span></td>
                      <td className="px-5 py-3.5 text-center text-white font-mono">{m.marks}/{m.totalMarks}</td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-800 rounded-full h-1.5"><div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${pct}%` }} /></div>
                          <span className="text-slate-300 text-xs w-8">{pct}%</span>
                        </div>
                      </td>
                      <td className={`px-5 py-3.5 text-center font-extrabold ${c}`}>{g}</td>
                      <td className="px-5 py-3.5 text-right flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(m)} className="text-xs bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 px-3 py-1.5 rounded-lg transition">✏️</button>
                        <button onClick={() => handleDelete(m.id)} className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-lg transition">🗑️</button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-500">Koi record nahi mila.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="font-bold text-white">{editId ? "✏️ Edit Marks" : "➕ Add Marks"}</h2>
              <button onClick={() => setModal(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Student</label>
                <select required value={form.studentId} onChange={e => setForm(p => ({ ...p, studentId: e.target.value }))} className={inputCls}>
                  <option value="">Student chunein...</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} (Roll {s.rollNo})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Subject</label>
                  <select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className={inputCls}>
                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Exam Type</label>
                  <select value={form.examType} onChange={e => setForm(p => ({ ...p, examType: e.target.value }))} className={inputCls}>
                    {EXAM_TYPES.map(e => <option key={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Marks Obtained</label>
                  <input type="number" required min={0} value={form.marks} onChange={e => setForm(p => ({ ...p, marks: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Total Marks</label>
                  <input type="number" required min={1} value={form.totalMarks} onChange={e => setForm(p => ({ ...p, totalMarks: e.target.value }))} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Date</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className={inputCls} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 border border-white/10 text-slate-400 rounded-xl hover:bg-white/5 transition text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition text-sm">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SchoolAdminLayout>
  );
}
