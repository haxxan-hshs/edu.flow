"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SchoolAdminLayout from "@/components/school/SchoolAdminLayout";
import { getAnnouncements, saveAnnouncements, Announcement } from "@/lib/schoolAdmin";

const CATEGORIES: Announcement["category"][] = ["general", "exam", "event", "holiday"];
const PRIORITIES: Announcement["priority"][] = ["low", "medium", "high"];

const EMPTY: Omit<Announcement, "id"> = {
  title: "", body: "", category: "general", priority: "medium",
  date: new Date().toISOString().split("T")[0],
};

const categoryIcon: Record<string, string> = { general: "📣", exam: "📚", event: "🎉", holiday: "🏖️" };
const priorityStyle: Record<string, string> = {
  high: "bg-red-500/20 text-red-400 border border-red-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  low: "bg-slate-500/20 text-slate-400 border border-slate-500/30",
};

export default function AnnouncementsPage() {
  const router = useRouter();
  const [list, setList] = useState<Announcement[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Omit<Announcement, "id">>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("school_admin_auth")) { router.push("/school-admin"); return; }
    setList(getAnnouncements());
  }, [router]);

  function openAdd() { setEditId(null); setForm(EMPTY); setModal(true); }
  function openEdit(a: Announcement) {
    setEditId(a.id);
    setForm({ title: a.title, body: a.body, category: a.category, priority: a.priority, date: a.date });
    setModal(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const item: Announcement = { ...form, id: editId || "an" + Date.now() };
    const updated = editId ? list.map(a => a.id === editId ? item : a) : [item, ...list];
    saveAnnouncements(updated); setList(updated); setModal(false);
  }

  function handleDelete(id: string) {
    const updated = list.filter(a => a.id !== id);
    saveAnnouncements(updated); setList(updated); setDeleteId(null);
  }

  const inputCls = "w-full px-3 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <SchoolAdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Announcements 📢</h1>
            <p className="text-slate-400 text-sm mt-1">School ke notices aur khabar</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-500/20 text-sm">
            ➕ New Announcement
          </button>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.map(cat => (
            <div key={cat} className="bg-slate-900 border border-white/5 rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">{categoryIcon[cat]}</span>
              <div>
                <p className="text-white font-bold text-lg">{list.filter(a => a.category === cat).length}</p>
                <p className="text-slate-500 text-xs capitalize">{cat}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {list.map(a => (
            <div key={a.id} className="bg-slate-900 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{categoryIcon[a.category]}</span>
                  <h3 className="font-bold text-white text-sm leading-tight">{a.title}</h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full capitalize flex-shrink-0 ${priorityStyle[a.priority]}`}>{a.priority}</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{a.body}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-lg capitalize">{a.category}</span>
                  <span className="text-xs text-slate-600">{a.date}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(a)} className="text-xs bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 px-3 py-1.5 rounded-lg transition">✏️</button>
                  <button onClick={() => setDeleteId(a.id)} className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-lg transition">🗑️</button>
                </div>
              </div>
            </div>
          ))}
          {list.length === 0 && (
            <div className="col-span-2 text-center py-16 text-slate-500">
              <p className="text-4xl mb-3">📢</p>
              <p>Abhi koi announcement nahi hai.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="font-bold text-white">{editId ? "✏️ Edit" : "➕ New"} Announcement</h2>
              <button onClick={() => setModal(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Title</label>
                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Annual Exams Schedule" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Details</label>
                <textarea required rows={4} value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
                  placeholder="Puri information likhein..." className={inputCls + " resize-none"} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as Announcement["category"] }))} className={inputCls}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{categoryIcon[c]} {c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Priority</label>
                  <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as Announcement["priority"] }))} className={inputCls}>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className={inputCls} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
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
            <h3 className="text-white font-bold mb-2">Delete Karein?</h3>
            <p className="text-slate-400 text-sm mb-6">Ye announcement hamesha ke liye delete ho jayegi.</p>
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
