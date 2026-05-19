import type { AdminTab } from "@/app/admin/page";

const stats = [
  { label: "Total Users",     value: "52,340", change: "+12%", icon: "👥", color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20" },
  { label: "Active Courses",  value: "487",    change: "+8%",  icon: "📚", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  { label: "Monthly Revenue", value: "$48,290",change: "+23%", icon: "💰", color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/20" },
  { label: "Completion Rate", value: "73%",    change: "+5%",  icon: "🏆", color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/20" },
  { label: "Pending Courses", value: "14",     change: "new",  icon: "⏳", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  { label: "Banned Users",    value: "23",     change: "total",icon: "🚫", color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/20" },
];

const recentActivity = [
  { action: "New user registered",       user: "alice@example.com",  time: "2 min ago",  type: "user" },
  { action: "Course submitted for review",user: "Dr. James Wilson",  time: "15 min ago", type: "course" },
  { action: "Payment received",          user: "carlos@example.com", time: "1 hr ago",   type: "payment" },
  { action: "Teacher approved",          user: "emily@example.com",  time: "2 hr ago",   type: "approve" },
  { action: "User banned",               user: "spam@bot.com",       time: "3 hr ago",   type: "ban" },
  { action: "Course featured",           user: "React & Next.js",    time: "5 hr ago",   type: "feature" },
];

export default function AdminOverview({ setActiveTab }: { setActiveTab: (t: AdminTab) => void }) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white mb-1">Admin Overview</h1>
        <p className="text-slate-400 text-sm">Platform summary at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full bg-white/5 ${s.color}`}>{s.change}</span>
            </div>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-slate-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Manage Users",    tab: "users" as AdminTab,     color: "from-blue-600 to-blue-700",    icon: "👥" },
          { label: "Review Courses",  tab: "courses" as AdminTab,   color: "from-indigo-600 to-purple-600",icon: "📚" },
          { label: "View Revenue",    tab: "revenue" as AdminTab,   color: "from-green-600 to-emerald-600",icon: "💰" },
        ].map(a => (
          <button key={a.tab} onClick={() => setActiveTab(a.tab)} className={`bg-gradient-to-r ${a.color} rounded-2xl p-5 text-left hover:opacity-90 transition-opacity`}>
            <div className="text-3xl mb-2">{a.icon}</div>
            <p className="text-white font-bold">{a.label}</p>
            <p className="text-white/60 text-xs mt-1">Click to manage →</p>
          </button>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-white font-bold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-800 last:border-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                a.type === "ban" ? "bg-red-500/20 text-red-400" :
                a.type === "approve" ? "bg-green-500/20 text-green-400" :
                a.type === "payment" ? "bg-amber-500/20 text-amber-400" :
                "bg-indigo-500/20 text-indigo-400"
              }`}>
                {a.type === "ban" ? "🚫" : a.type === "approve" ? "✅" : a.type === "payment" ? "💳" : a.type === "feature" ? "⭐" : "📌"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium">{a.action}</p>
                <p className="text-xs text-slate-500 truncate">{a.user}</p>
              </div>
              <span className="text-xs text-slate-500 flex-shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
