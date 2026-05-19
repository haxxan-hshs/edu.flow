"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/school-admin/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/school-admin/students", label: "Students", icon: "👨‍🎓" },
  { href: "/school-admin/attendance", label: "Attendance", icon: "📋" },
  { href: "/school-admin/marks", label: "Marks", icon: "📝" },
  { href: "/school-admin/announcements", label: "Announcements", icon: "📢" },
  { href: "/school-admin/reports", label: "Reports", icon: "📊" },
];

export default function SchoolAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function logout() {
    localStorage.removeItem("school_admin_auth");
    router.push("/school-admin");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-white/5 flex flex-col transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm shadow-lg">E</div>
          <div>
            <p className="font-extrabold text-white text-sm">EduFlow</p>
            <p className="text-xs text-slate-500">School Admin</p>
          </div>
        </div>
        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${pathname === item.href ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
              <span className="text-lg">{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>
        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/5">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
            <span className="text-lg">🚪</span> Logout
          </button>
        </div>
      </aside>
      {mobileOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />}
      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur border-b border-white/5 px-4 sm:px-6 h-14 flex items-center justify-between">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-slate-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-slate-400">Admin Online</span>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
