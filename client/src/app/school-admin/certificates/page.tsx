"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SchoolAdminLayout from "@/components/school/SchoolAdminLayout";
import { getAllUserActivities, UserActivityProfile, adminSendCertificate, adminRevokeCertificate, UserCertificate } from "@/lib/schoolAdmin";

function fmtSec(s: number) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return `${s}s`;
}

const GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "Pass"];

export default function CertificatesPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserActivityProfile[]>([]);
  const [selected, setSelected] = useState<UserActivityProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ courseTitle: "", grade: "A", message: "" });
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("school_admin_auth")) { router.push("/school-admin"); return; }
    (async () => {
      setUsers(await getAllUserActivities());
      setReady(true);
    })();
  }, [router]);

  async function refresh() { const all = await getAllUserActivities(); setUsers(all); if (selected) setSelected(all.find(u => u.email === selected.email) || null); }

  function openCertModal(u: UserActivityProfile) { setSelected(u); setForm({ courseTitle: "", grade: "A", message: "" }); setModal(true); }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !form.courseTitle.trim()) return;
    setSending(true);
    const cert: UserCertificate = { id: "cert_" + Date.now(), courseTitle: form.courseTitle.trim(), issuedBy: "School Admin", issuedAt: new Date().toISOString(), grade: form.grade, message: form.message.trim() };
    const ok = await adminSendCertificate(selected.email, cert);
    setTimeout(() => {
      setSending(false);
      setModal(false);
      if (ok) { setToast("✅ Certificate bhej diya gaya!"); refresh(); }
      else setToast("❌ User nahi mila.");
      setTimeout(() => setToast(null), 3000);
    }, 600);
  }

  async function handleRevoke(userEmail: string, certId: string) {
    await adminRevokeCertificate(userEmail, certId);
    refresh();
    setToast("Certificate revoke ho gaya.");
    setTimeout(() => setToast(null), 2500);
  }

  if (!ready) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><svg className="w-8 h-8 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>;

  return (
    <SchoolAdminLayout>
      <div className="space-y-6">
        {/* Toast */}
        {toast && <div className="fixed top-4 right-4 z-50 bg-slate-800 border border-white/10 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium animate-bounce">{toast}</div>}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Certificate Management 🏆</h1>
            <p className="text-slate-400 text-sm mt-1">Users ko certificates bhejein unki progress ke mutabiq</p>
          </div>
          <button onClick={refresh} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-500/20 text-sm">🔄 Refresh</button>
        </div>

        {users.length === 0 ? (
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-16 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-slate-400 text-sm">Koi registered user nahi mila. Users dashboard par login karein to yahan nazar aayenge.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: User List */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Registered Users</h2>
              {users.map(u => {
                const totalStudy = u.studySessions.reduce((a, s) => a + s.durationSeconds, 0);
                const completedCourses = (u.readingRecords || []).filter(r => r.targetHours > 0 && r.studiedSeconds >= r.targetHours * 3600).length;
                return (
                  <div key={u.email} className={`bg-slate-900 border rounded-2xl p-4 cursor-pointer transition hover:border-amber-500/50 ${selected?.email === u.email ? "border-amber-500 ring-1 ring-amber-500/30" : "border-white/5"}`}
                    onClick={() => setSelected(u)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                          {u.avatarUrl ? <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" /> : (u.firstName?.[0] || u.email[0]).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm truncate">{u.firstName} {u.lastName}</p>
                          <p className="text-slate-400 text-xs truncate">{u.email}</p>
                        </div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); openCertModal(u); }}
                        className="flex items-center gap-1.5 text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-lg transition">
                        🏆 Send Cert
                      </button>
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                      {[
                        { label: "Courses", value: (u.readingRecords || []).length, color: "text-indigo-400" },
                        { label: "Completed", value: completedCourses, color: "text-green-400" },
                        { label: "Study", value: fmtSec(totalStudy), color: "text-purple-400" },
                        { label: "Certs", value: (u.certificates || []).length, color: "text-amber-400" },
                      ].map(s => (
                        <div key={s.label} className="bg-slate-800 rounded-lg py-1.5">
                          <p className={`font-bold text-sm ${s.color}`}>{s.value}</p>
                          <p className="text-slate-600 text-xs">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: User Detail + Certificates */}
            <div>
              {!selected ? (
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-16 text-center">
                  <div className="text-5xl mb-3">👈</div>
                  <p className="text-slate-400 text-sm">Kisi user ka naam click karein detail dekhne ke liye</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* User Progress Summary */}
                  <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">📊 {selected.firstName || selected.email} ki Progress</h3>
                    <div className="space-y-3">
                      {(selected.readingRecords || []).length === 0
                        ? <p className="text-slate-500 text-sm">User ne koi course add nahi kiya abhi tak.</p>
                        : (selected.readingRecords || []).map(r => {
                          const pct = r.targetHours > 0 ? Math.min(100, Math.round((r.studiedSeconds / (r.targetHours * 3600)) * 100)) : 0;
                          return (
                            <div key={r.id} className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm flex-shrink-0">📚</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-sm text-white font-medium truncate">{r.title}</p>
                                  <span className={`text-xs font-bold ml-2 ${pct >= 100 ? 'text-green-400' : 'text-indigo-400'}`}>{pct}%</span>
                                </div>
                                <div className="bg-slate-700 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${pct >= 100 ? 'bg-green-500' : 'bg-indigo-500'}`} style={{ width: `${pct}%` }} /></div>
                                <p className="text-xs text-slate-500 mt-0.5">{fmtSec(r.studiedSeconds)} studied {r.targetHours > 0 ? `/ ${r.targetHours}h target` : ""}</p>
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                    <button onClick={() => openCertModal(selected)} className="mt-4 w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl transition text-sm">🏆 Is User Ko Certificate Bhejein</button>
                  </div>

                  {/* Existing Certificates */}
                  <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4">Bheje Gaye Certificates ({(selected.certificates || []).length})</h3>
                    {(selected.certificates || []).length === 0
                      ? <p className="text-slate-500 text-sm">Koi certificate nahi bheja gaya abhi tak.</p>
                      : <div className="space-y-3">
                          {(selected.certificates || []).map(c => (
                            <div key={c.id} className="bg-slate-800/60 border border-white/5 rounded-xl p-4 flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-amber-400 font-extrabold text-lg">{c.grade}</span>
                                  <p className="text-white font-semibold text-sm">{c.courseTitle}</p>
                                </div>
                                {c.message && <p className="text-slate-400 text-xs italic">&ldquo;{c.message}&rdquo;</p>}
                                <p className="text-slate-600 text-xs mt-1">{new Date(c.issuedAt).toLocaleDateString("en-PK")}</p>
                              </div>
                              <button onClick={() => handleRevoke(selected.email, c.id)} className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded-lg transition flex-shrink-0">Revoke</button>
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

      {/* Send Certificate Modal */}
      {modal && selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="font-bold text-white">🏆 Certificate Bhejein</h2>
              <button onClick={() => setModal(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={handleSend} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Student</label>
                <p className="text-white font-semibold">{selected.firstName} {selected.lastName} ({selected.email})</p>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Course / Subject</label>
                <input type="text" required value={form.courseTitle} onChange={e => setForm(p => ({ ...p, courseTitle: e.target.value }))}
                  placeholder="e.g. Mathematics Final Exam"
                  className="w-full px-3 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Grade</label>
                <select value={form.grade} onChange={e => setForm(p => ({ ...p, grade: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                  {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Personal Message (optional)</label>
                <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="e.g. Shahbash! Aapne bohat mehnat ki..."
                  rows={3}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
              </div>
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 border border-white/10 text-slate-400 rounded-xl hover:bg-white/5 transition text-sm">Cancel</button>
                <button type="submit" disabled={sending} className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-white font-bold rounded-xl transition text-sm">
                  {sending ? "Bhej raha hun..." : "🏆 Certificate Bhejein"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SchoolAdminLayout>
  );
}
