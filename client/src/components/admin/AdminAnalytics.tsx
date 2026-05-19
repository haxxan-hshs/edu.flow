"use client";

const activeUsers = [
  { day: "Mon", users: 3200 }, { day: "Tue", users: 4100 }, { day: "Wed", users: 3800 },
  { day: "Thu", users: 4600 }, { day: "Fri", users: 5200 }, { day: "Sat", users: 3900 }, { day: "Sun", users: 2800 },
];

const completionByCategory = [
  { category: "Web Development", rate: 78, students: 18400, color: "bg-blue-500" },
  { category: "Data Science",    rate: 65, students: 12300, color: "bg-purple-500" },
  { category: "UI/UX Design",    rate: 82, students: 9800,  color: "bg-pink-500" },
  { category: "Machine Learning",rate: 58, students: 14200, color: "bg-indigo-500" },
  { category: "Mobile Dev",      rate: 71, students: 7600,  color: "bg-green-500" },
  { category: "Cybersecurity",   rate: 69, students: 5400,  color: "bg-red-500" },
];

const platformStats = [
  { label: "Daily Active Users",  value: "5,200",  change: "+8%",  icon: "👥", color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20" },
  { label: "Avg Session Duration",value: "42 min", change: "+3%",  icon: "⏱️", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { label: "Overall Completion",  value: "73%",    change: "+5%",  icon: "🏆", color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/20" },
  { label: "New Signups (7d)",    value: "1,240",  change: "+18%", icon: "🚀", color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/20" },
  { label: "Churn Rate",          value: "2.4%",   change: "-0.3%",icon: "📉", color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/20" },
  { label: "NPS Score",           value: "72",     change: "+4",   icon: "⭐", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
];

const maxUsers = Math.max(...activeUsers.map(d => d.users));

export default function AdminAnalytics() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">Platform Analytics</h1>
        <p className="text-slate-400 text-sm">Active users, completion rates, and engagement metrics.</p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {platformStats.map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{s.icon}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full bg-white/5 ${s.color}`}>{s.change}</span>
            </div>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-slate-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Active users chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
        <h2 className="text-white font-bold mb-6">Active Users — Last 7 Days</h2>
        <div className="flex items-end gap-3 h-36">
          {activeUsers.map(d => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs text-blue-400 font-semibold">{(d.users/1000).toFixed(1)}k</span>
              <div className="w-full bg-slate-800 rounded-t-lg" style={{ height: "90px" }}>
                <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg" style={{ height: `${(d.users / maxUsers) * 100}%`, marginTop: `${90 - (d.users / maxUsers) * 90}px` }} />
              </div>
              <span className="text-xs text-slate-400">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Completion rates */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-white font-bold mb-6">Completion Rates by Category</h2>
        <div className="space-y-4">
          {completionByCategory.sort((a,b) => b.rate - a.rate).map(c => (
            <div key={c.category}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-white font-medium">{c.category}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{c.students.toLocaleString()} students</span>
                  <span className="text-sm font-bold text-white w-10 text-right">{c.rate}%</span>
                </div>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5">
                <div className={`${c.color} h-2.5 rounded-full transition-all`} style={{ width: `${c.rate}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
