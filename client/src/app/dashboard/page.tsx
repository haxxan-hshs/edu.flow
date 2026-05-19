"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import FileVault from "@/components/FileVault";

// ── Types ──────────────────────────────────────────────────────────────────────
interface StudySession { id: string; title: string; duration: number; date: string; }
interface Certificate { id: string; course: string; issuedAt: string; grade: string; }
interface ReadingRecord { id: string; title: string; type: string; progress: number; lastRead: string; }
type FileCategory = "All" | "PDF" | "Image" | "Document" | "Other";
interface UploadedFile {
  id: string; name: string; size: string; sizeBytes: number;
  type: string; category: FileCategory; uploadedAt: string;
  dataUrl: string; folder: string; note: string;
}
type Tab = "overview" | "profile" | "timer" | "history" | "certificates" | "files";

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmt(s: number) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}
function fmtShort(s: number) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
function exportCSV(rows: Record<string, string | number>[], filename: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]).join(",");
  const body = rows.map(r => Object.values(r).map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([headers + "\n" + body], { type: "text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
  a.download = filename; a.click();
}

// ── NavItem ────────────────────────────────────────────────────────────────────
function NavItem({ icon, label, tab, active, onClick }: { icon: React.ReactNode; label: string; tab: Tab; active: boolean; onClick: (t: Tab) => void; }) {
  return (
    <button onClick={() => onClick(tab)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
      {icon}{label}
    </button>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // profile
  const [firstName, setFirstName] = useState(""); const [lastName, setLastName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false); const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  // timer
  const [timerRunning, setTimerRunning] = useState(false); const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerTitle, setTimerTitle] = useState(""); const [sessions, setSessions] = useState<StudySession[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // files
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(() => {
    if (typeof window !== "undefined") {
      try { return JSON.parse(localStorage.getItem("eduflow_files") || "[]"); } catch { return []; }
    }
    return [];
  });
  const [folders, setFolders] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try { return JSON.parse(localStorage.getItem("eduflow_folders") || "[\"General\"]"); } catch { return ["General"]; }
    }
    return ["General"];
  });
  const [fileFolder, setFileFolder] = useState<string>("All");
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [newFolder, setNewFolder] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);
  // suppress unused var warnings — used in FileVault handlers
  void setFileFolder; void previewFile; void setPreviewFile; void renamingId; void setRenamingId; void renameValue; void setRenameValue; void newFolder; void setNewFolder; void showFolderInput; void setShowFolderInput;
  // mock data
  const [certificates] = useState<Certificate[]>([
    { id: "1", course: "Complete Python Bootcamp", issuedAt: "2025-03-15", grade: "A+" },
    { id: "2", course: "React & Next.js Guide", issuedAt: "2025-04-20", grade: "A" },
  ]);
  const [readingHistory] = useState<ReadingRecord[]>([
    { id: "1", title: "Complete Python Bootcamp", type: "Course", progress: 100, lastRead: "2025-05-10" },
    { id: "2", title: "React & Next.js Guide", type: "Course", progress: 85, lastRead: "2025-05-15" },
    { id: "3", title: "Machine Learning A-Z", type: "Course", progress: 42, lastRead: "2025-05-18" },
    { id: "4", title: "UI/UX Design Masterclass", type: "Course", progress: 20, lastRead: "2025-05-19" },
  ]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      setUser(data.user);
      const m = data.user.user_metadata;
      setFirstName(m?.first_name || ""); setLastName(m?.last_name || ""); setAvatarUrl(m?.avatar_url || null);
      setLoading(false);
    });
  }, [router]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerRunning(false);
    if (timerSeconds > 0) setSessions(p => [{ id: Date.now().toString(), title: timerTitle || "Study Session", duration: timerSeconds, date: new Date().toLocaleDateString() }, ...p]);
    setTimerSeconds(0); setTimerTitle("");
  }, [timerSeconds, timerTitle]);

  const startTimer = () => { setTimerRunning(true); timerRef.current = setInterval(() => setTimerSeconds(s => s + 1), 1000); };
  const pauseTimer = () => { if (timerRef.current) clearInterval(timerRef.current); setTimerRunning(false); };
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = ev => setAvatarPreview(ev.target?.result as string); r.readAsDataURL(f);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    files.forEach(f => {
      const r = new FileReader();
      r.onload = ev => {
        const ext = f.name.split(".").pop()?.toLowerCase() || "";
        const category: FileCategory =
          ext === "pdf" ? "PDF" :
          ["png","jpg","jpeg","gif","webp","svg"].includes(ext) ? "Image" :
          ["doc","docx","txt","ppt","pptx","xls","xlsx"].includes(ext) ? "Document" : "Other";
        const newFile: UploadedFile = {
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          name: f.name,
          size: f.size > 1024*1024 ? (f.size/1024/1024).toFixed(1)+" MB" : (f.size/1024).toFixed(1)+" KB",
          sizeBytes: f.size,
          type: ext.toUpperCase() || "FILE",
          category,
          uploadedAt: new Date().toLocaleDateString(),
          dataUrl: ev.target?.result as string,
          folder: fileFolder === "All" ? "General" : fileFolder,
          note: "",
        };
        setUploadedFiles(prev => {
          const updated = [newFile, ...prev];
          localStorage.setItem("eduflow_files", JSON.stringify(updated));
          return updated;
        });
      };
      r.readAsDataURL(f);
    });
    e.target.value = "";
  }

  function deleteFile(id: string) {
    setUploadedFiles(prev => {
      const updated = prev.filter(f => f.id !== id);
      localStorage.setItem("eduflow_files", JSON.stringify(updated));
      return updated;
    });
    if (previewFile?.id === id) setPreviewFile(null);
  }

  function saveRename(id: string) {
    setUploadedFiles(prev => {
      const updated = prev.map(f => f.id === id ? { ...f, name: renameValue || f.name } : f);
      localStorage.setItem("eduflow_files", JSON.stringify(updated));
      return updated;
    });
    setRenamingId(null); setRenameValue("");
  }

  function updateNote(id: string, note: string) {
    setUploadedFiles(prev => {
      const updated = prev.map(f => f.id === id ? { ...f, note } : f);
      localStorage.setItem("eduflow_files", JSON.stringify(updated));
      return updated;
    });
  }

  function moveToFolder(id: string, folder: string) {
    setUploadedFiles(prev => {
      const updated = prev.map(f => f.id === id ? { ...f, folder } : f);
      localStorage.setItem("eduflow_files", JSON.stringify(updated));
      return updated;
    });
  }

  function addFolder() {
    const name = newFolder.trim();
    if (!name || folders.includes(name)) return;
    const updated = [...folders, name];
    setFolders(updated);
    localStorage.setItem("eduflow_folders", JSON.stringify(updated));
    setNewFolder(""); setShowFolderInput(false);
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault(); setProfileSaving(true); setProfileMsg(null);
    const supabase = createClient();
    const updates: Record<string, string> = { first_name: firstName, last_name: lastName };
    if (avatarPreview) updates.avatar_url = avatarPreview;
    const { error } = await supabase.auth.updateUser({ data: updates });
    if (error) setProfileMsg("Error: " + error.message);
    else { setProfileMsg("Profile updated!"); if (avatarPreview) { setAvatarUrl(avatarPreview); setAvatarPreview(null); } }
    setProfileSaving(false); setTimeout(() => setProfileMsg(null), 3000);
  }

  async function handleSignOut() { const s = createClient(); await s.auth.signOut(); router.push("/"); }

  const totalStudySeconds = sessions.reduce((a, s) => a + s.duration, 0);
  const displayName = firstName || user?.email?.split("@")[0] || "Learner";
  const currentAvatar = avatarPreview || avatarUrl;

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg className="w-8 h-8 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    </div>
  );

  const navItems: { icon: React.ReactNode; label: string; tab: Tab }[] = [
    { tab: "overview", label: "Overview", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { tab: "profile", label: "My Profile", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
    { tab: "timer", label: "Study Timer", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { tab: "history", label: "Reading History", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
    { tab: "certificates", label: "Certificates", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> },
    { tab: "files", label: "My Files", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><span className="text-white font-bold text-sm">E</span></div>
              <span className="text-xl font-bold text-slate-900 hidden sm:block">Edu<span className="text-indigo-600">Flow</span></span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 hidden sm:block">{user?.email}</span>
            <button onClick={() => setActiveTab("profile")} className="w-9 h-9 rounded-full overflow-hidden border-2 border-indigo-200 hover:border-indigo-400 transition-colors flex-shrink-0">
              {currentAvatar ? <img src={currentAvatar} alt="avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">{displayName[0]?.toUpperCase()}</div>}
            </button>
            <button onClick={handleSignOut} className="text-sm font-medium text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors">Sign Out</button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-slate-100 flex flex-col pt-4 pb-6 px-3 transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 mt-16 lg:mt-0`}>
          <div className="flex items-center gap-3 px-3 py-4 mb-4 bg-indigo-50 rounded-2xl">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-200 flex-shrink-0">
              {currentAvatar ? <img src={currentAvatar} alt="avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">{displayName[0]?.toUpperCase()}</div>}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 text-sm truncate">{firstName} {lastName}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1 flex-1">
            {navItems.map(item => <NavItem key={item.tab} {...item} active={activeTab === item.tab} onClick={t => { setActiveTab(t); setSidebarOpen(false); }} />)}
          </nav>
          <Link href="/" className="flex items-center gap-2 px-4 py-3 text-sm text-slate-500 hover:text-indigo-600 transition-colors mt-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Home
          </Link>
        </aside>
        {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-10 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Welcome back, {displayName}! 👋</h1>
              <p className="text-slate-500 text-sm mb-8">Here&apos;s your learning summary.</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Courses Viewed", value: readingHistory.length, icon: "📚", color: "text-indigo-600", bg: "bg-indigo-50" },
                  { label: "Study Time", value: fmtShort(totalStudySeconds), icon: "⏱️", color: "text-purple-600", bg: "bg-purple-50" },
                  { label: "Certificates", value: certificates.length, icon: "🏆", color: "text-amber-600", bg: "bg-amber-50" },
                  { label: "Files Uploaded", value: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("eduflow_files") || "[]").length : 0, icon: "📁", color: "text-green-600", bg: "bg-green-50" },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} rounded-2xl p-5 text-center`}>
                    <div className="text-3xl mb-2">{s.icon}</div>
                    <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                    <p className="text-slate-500 text-xs mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <h2 className="font-bold text-slate-900 mb-4">📖 Recently Viewed</h2>
                  <div className="space-y-3">
                    {readingHistory.slice(0, 3).map(r => (
                      <div key={r.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">📚</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{r.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 bg-slate-100 rounded-full h-1.5"><div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${r.progress}%` }} /></div>
                            <span className="text-xs text-slate-400 flex-shrink-0">{r.progress}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setActiveTab("history")} className="mt-4 text-xs text-indigo-600 font-semibold hover:underline">View all →</button>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <h2 className="font-bold text-slate-900 mb-4">⏱️ Recent Study Sessions</h2>
                  {sessions.length === 0 ? (
                    <div className="text-center py-6"><p className="text-slate-400 text-sm">No sessions yet.</p><button onClick={() => setActiveTab("timer")} className="mt-2 text-xs text-indigo-600 font-semibold hover:underline">Start a session →</button></div>
                  ) : sessions.slice(0, 3).map(s => (
                    <div key={s.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <div><p className="text-sm font-medium text-slate-900">{s.title}</p><p className="text-xs text-slate-400">{s.date}</p></div>
                      <span className="text-sm font-bold text-indigo-600">{fmtShort(s.duration)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="max-w-2xl">
              <h1 className="text-2xl font-extrabold text-slate-900 mb-1">My Profile</h1>
              <p className="text-slate-500 text-sm mb-8">Update your personal information and profile picture.</p>
              <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-100 shadow-lg">
                      {currentAvatar ? <img src={currentAvatar} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-4xl">{displayName[0]?.toUpperCase()}</div>}
                    </div>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 w-9 h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-md transition-colors" aria-label="Upload photo">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </div>
                  <p className="text-xs text-slate-400">Click the camera icon to upload a photo</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label><input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label><input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" /></div>
                </div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label><input type="email" value={user?.email || ""} disabled className="w-full px-4 py-3 border border-slate-100 rounded-xl text-slate-400 bg-slate-50 cursor-not-allowed" /><p className="text-xs text-slate-400 mt-1">Email cannot be changed here.</p></div>
                {profileMsg && <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl ${profileMsg.startsWith("Error") ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}><svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={profileMsg.startsWith("Error") ? "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" : "M5 13l4 4L19 7"} /></svg>{profileMsg}</div>}
                <button type="submit" disabled={profileSaving} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                  {profileSaving ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</> : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {/* TIMER */}
          {activeTab === "timer" && (
            <div className="max-w-2xl">
              <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Study Timer</h1>
              <p className="text-slate-500 text-sm mb-8">Track your study sessions and build a learning habit.</p>
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-center text-white mb-6 shadow-xl">
                <input type="text" value={timerTitle} onChange={e => setTimerTitle(e.target.value)} placeholder="What are you studying? (optional)" disabled={timerRunning} className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 text-center px-4 py-2 rounded-xl mb-8 focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-60 text-sm" />
                <div className="font-mono text-7xl font-extrabold tracking-tight mb-8 tabular-nums">
                  {String(Math.floor(timerSeconds / 3600)).padStart(2, "0")}:{String(Math.floor((timerSeconds % 3600) / 60)).padStart(2, "0")}:{String(timerSeconds % 60).padStart(2, "0")}
                </div>
                <div className="flex items-center justify-center gap-4">
                  {!timerRunning ? (
                    <button onClick={startTimer} className="flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      {timerSeconds > 0 ? "Resume" : "Start"}
                    </button>
                  ) : (
                    <button onClick={pauseTimer} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold px-8 py-3 rounded-xl transition-colors border border-white/30">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>Pause
                    </button>
                  )}
                  {timerSeconds > 0 && <button onClick={stopTimer} className="flex items-center gap-2 bg-red-500/80 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z" /></svg>Stop & Save</button>}
                </div>
                {timerRunning && <p className="mt-4 text-white/60 text-xs animate-pulse">● Session in progress...</p>}
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6 shadow-sm flex items-center justify-between">
                <div><p className="text-sm text-slate-500">Total Study Time</p><p className="text-2xl font-extrabold text-indigo-600">{fmt(totalStudySeconds)}</p></div>
                <div className="text-4xl">📊</div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-slate-900">Session History</h2>
                  {sessions.length > 0 && <button onClick={() => exportCSV(sessions.map(s => ({ Title: s.title, Duration: fmtShort(s.duration), Date: s.date })), "study-sessions.csv")} className="text-xs text-indigo-600 font-semibold bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>Export CSV</button>}
                </div>
                {sessions.length === 0 ? <p className="text-slate-400 text-sm text-center py-6">No sessions yet. Start your first session above!</p> : sessions.map((s, i) => (
                  <div key={s.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-xs">#{sessions.length - i}</div>
                      <div><p className="text-sm font-medium text-slate-900">{s.title}</p><p className="text-xs text-slate-400">{s.date}</p></div>
                    </div>
                    <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{fmtShort(s.duration)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HISTORY */}
          {activeTab === "history" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-extrabold text-slate-900 mb-1">Reading History</h1><p className="text-slate-500 text-sm">All courses and materials you&apos;ve accessed.</p></div>
                <button onClick={() => exportCSV(readingHistory.map(r => ({ Title: r.title, Type: r.type, Progress: r.progress + "%", LastRead: r.lastRead })), "reading-history.csv")} className="flex items-center gap-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>Export CSV</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Viewed", value: readingHistory.length, color: "text-indigo-600", bg: "bg-indigo-50" },
                  { label: "Completed", value: readingHistory.filter(r => r.progress === 100).length, color: "text-green-600", bg: "bg-green-50" },
                  { label: "In Progress", value: readingHistory.filter(r => r.progress > 0 && r.progress < 100).length, color: "text-amber-600", bg: "bg-amber-50" },
                  { label: "Avg Progress", value: Math.round(readingHistory.reduce((a, r) => a + r.progress, 0) / readingHistory.length) + "%", color: "text-purple-600", bg: "bg-purple-50" },
                ].map(s => <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}><p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p><p className="text-slate-500 text-xs mt-1">{s.label}</p></div>)}
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <div className="col-span-5">Course</div><div className="col-span-2 text-center">Type</div><div className="col-span-3">Progress</div><div className="col-span-2 text-right">Last Accessed</div>
                </div>
                {readingHistory.map(r => (
                  <div key={r.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-50 last:border-0 items-center hover:bg-slate-50 transition-colors">
                    <div className="col-span-5 flex items-center gap-3"><div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">📚</div><span className="text-sm font-medium text-slate-900 truncate">{r.title}</span></div>
                    <div className="col-span-2 text-center"><span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{r.type}</span></div>
                    <div className="col-span-3"><div className="flex items-center gap-2"><div className="flex-1 bg-slate-100 rounded-full h-2"><div className={`h-2 rounded-full ${r.progress === 100 ? "bg-green-500" : "bg-indigo-500"}`} style={{ width: `${r.progress}%` }} /></div><span className={`text-xs font-semibold flex-shrink-0 ${r.progress === 100 ? "text-green-600" : "text-indigo-600"}`}>{r.progress}%</span></div></div>
                    <div className="col-span-2 text-right text-xs text-slate-400">{r.lastRead}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATES */}
          {activeTab === "certificates" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-extrabold text-slate-900 mb-1">My Certificates</h1><p className="text-slate-500 text-sm">Certificates earned by completing courses.</p></div>
                {certificates.length > 0 && <button onClick={() => exportCSV(certificates.map(c => ({ Course: c.course, Grade: c.grade, IssuedAt: c.issuedAt })), "certificates.csv")} className="flex items-center gap-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>Export CSV</button>}
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {certificates.map(cert => (
                  <div key={cert.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center">
                      <div className="text-4xl mb-2">🏆</div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200 mb-1">Certificate of Completion</p>
                      <h3 className="text-lg font-extrabold">{cert.course}</h3>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div><p className="text-xs text-slate-400">Issued to</p><p className="font-bold text-slate-900">{firstName} {lastName}</p></div>
                        <div className="text-right"><p className="text-xs text-slate-400">Grade</p><p className="font-extrabold text-green-600 text-lg">{cert.grade}</p></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div><p className="text-xs text-slate-400">Date Issued</p><p className="text-sm font-medium text-slate-700">{cert.issuedAt}</p></div>
                        <button className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>Download</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FILES */}
          {activeTab === "files" && <FileVault uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} folders={folders} setFolders={setFolders} uploadInputRef={uploadInputRef} handleFileUpload={handleFileUpload} exportCSV={exportCSV} />}

        </main>
      </div>
    </div>
  );
}
