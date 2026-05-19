"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SchoolAdminLayout from "@/components/school/SchoolAdminLayout";
import { getStudents, saveStudents, Student } from "@/lib/schoolAdmin";

const EMPTY: Omit<Student, "id"> = { name: "", rollNo: "", class: "", section: "", phone: "", email: "", guardian: "", joinDate: new Date().toISOString().split("T")[0], status: "active" };

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState<Omit<Student, "id">>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("school_admin_auth")) { router.push("/school-admin"); return; }
    setStudents(getStudents());
  }, [router]);

  function openAdd() { setEditing(null); setForm(EMPTY); setModal(true); }
  function openEdit(s: Student) { setEditing(s); setForm({ name: s.name, rollNo: s.rollNo, class: s.class, section: s.section, phone: s.phone, email: s.email, guardian: s.guardian, joinDate: s.joinDate, status: s.status }); setModal(true); }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    let updated: Student[];
    if (editing) {
      updated = students.map(s => s.id === editing.id ? { ...form, id: editing.id } : s);
    } else {
      updated = [{ ...form, id: "s" + Date.now() }, ...students];
    }
    saveStudents(updated); setStudents(updated); setModal(false);
  }

  function handleDelete(id: string) {
    const updated = students.filter(s => s.id !== id);
    saveStudents(updated); setStudents(updated); setDeleteId(null);
  }

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.includes(search) || s.class.includes(search)
  );

  return (
    <SchoolAdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Student Management 👨‍🎓</h1>
            <p className="text-slate-400 text-sm mt-1">{students.length} students enrolled</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-500/20 text-sm">
            ➕ Add Student
          </button>
        </div>

        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by name, roll no, class..."
          className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />

        <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 text-left">Student</th>
                  <th className="px-5 py-3 text-left">Roll No</th>
                  <th className="px-5 py-3 text-left">Class</th>
                  <th className="px-5 py-3 text-left">Phone</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm flex-shrink-0">{s.name[0]}</div>
                        <div><p className="text-white font-medium">{s.name}</p><p className="text-slate-500 text-xs">{s.email}</p></div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">{s.rollNo}</td>
                    <td className="px-5 py-3.5 text-slate-300">{s.class}-{s.section}</td>
                    <td className="px-5 py-3.5 text-slate-300">{s.phone}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${s.status === "active" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-slate-500/20 text-slate-400 border border-slate-500/30"}`}>{s.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(s)} className="text-xs bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 px-3 py-1.5 rounded-lg transition">✏️ Edit</button>
                      <button onClick={() => setDeleteId(s.id)} className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-lg transition">🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-slate-500">Koi student nahi mila.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="font-bold text-white">{editing ? "✏️ Edit Student" : "➕ New Student"}</h2>
              <button onClick={() => setModal(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 grid grid-cols-2 gap-4">
              {(["name", "rollNo", "class", "section", "phone", "email", "guardian", "joinDate"] as const).map(field => (
                <div key={field} className={field === "name" || field === "email" || field === "guardian" ? "col-span-2" : ""}>
                  <label className="block text-xs text-slate-400 mb-1 capitalize">{field === "rollNo" ? "Roll No" : field === "joinDate" ? "Join Date" : field}</label>
                  <input type={field === "joinDate" ? "date" : "text"} required value={(form as Record<string, string>)[field]}
                    onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as "active" | "inactive" }))}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="col-span-2 flex gap-3 mt-2">
                <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 border border-white/10 text-slate-400 rounded-xl hover:bg-white/5 transition text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition text-sm">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl">
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="text-white font-bold text-lg mb-2">Student Delete Karein?</h3>
            <p className="text-slate-400 text-sm mb-6">Ye action undo nahi ho sakta.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-white/10 text-slate-400 rounded-xl hover:bg-white/5 transition text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </SchoolAdminLayout>
  );
}
