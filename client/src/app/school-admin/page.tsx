"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SchoolAdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        localStorage.setItem("school_admin_auth", "true");
        router.push("/school-admin/dashboard");
      } else {
        setError("Galat username ya password. (admin / admin123)");
        setLoading(false);
      }
    }, 800);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute rounded-full opacity-10 blur-3xl"
            style={{ width: `${200 + i * 80}px`, height: `${200 + i * 80}px`, background: i % 2 === 0 ? "#6366f1" : "#8b5cf6", top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }} />
        ))}
      </div>
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/30 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-white">School Admin</h1>
          <p className="text-slate-400 mt-1 text-sm">EduFlow Management System</p>
        </div>
        <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="admin"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div className="relative">
              <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition pr-12" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition">
                {show ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          {error && <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl">⚠️ {error}</div>}
          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Logging in...</> : "🔐 Login"}
          </button>
          <p className="text-center text-xs text-slate-500">Default: admin / admin123</p>
        </form>
      </div>
    </div>
  );
}
