"use client";

function exportCSV(rows: Record<string, string | number>[], filename: string) {
  const headers = Object.keys(rows[0]).join(",");
  const body = rows.map(r => Object.values(r).map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([headers + "\n" + body], { type: "text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
}

const monthly = [
  { month: "Jan", revenue: 32400, sales: 412 },
  { month: "Feb", revenue: 38200, sales: 489 },
  { month: "Mar", revenue: 41500, sales: 521 },
  { month: "Apr", revenue: 39800, sales: 498 },
  { month: "May", revenue: 48290, sales: 601 },
];

const topTeachers = [
  { name: "Dr. James Wilson",  courses: 8, students: 18500, revenue: 142300, avatar: "JW", color: "from-yellow-400 to-orange-500" },
  { name: "Sarah Johnson",     courses: 5, students: 12300, revenue: 98400,  avatar: "SJ", color: "from-cyan-400 to-blue-500" },
  { name: "Prof. Alex Kumar",  courses: 6, students: 22000, revenue: 176000, avatar: "AK", color: "from-violet-400 to-indigo-500" },
  { name: "Emily Chen",        courses: 4, students: 9800,  revenue: 68600,  avatar: "EC", color: "from-pink-400 to-purple-500" },
  { name: "Marcus Lee",        courses: 3, students: 8700,  revenue: 65200,  avatar: "ML", color: "from-green-400 to-teal-500" },
];

const recentSales = [
  { student: "Alice Johnson",  course: "Python Bootcamp",    amount: 89.99,  date: "2025-05-19", status: "Completed" },
  { student: "Carlos Mendez",  course: "Machine Learning A-Z",amount: 94.99, date: "2025-05-19", status: "Completed" },
  { student: "Priya Sharma",   course: "UI/UX Masterclass",  amount: 69.99,  date: "2025-05-18", status: "Completed" },
  { student: "James O'Brien",  course: "React & Next.js",    amount: 79.99,  date: "2025-05-18", status: "Refunded" },
  { student: "Yuki Tanaka",    course: "Node.js Backend",    amount: 74.99,  date: "2025-05-17", status: "Completed" },
];

const maxRevenue = Math.max(...monthly.map(m => m.revenue));

export default function AdminRevenue() {
  const totalRevenue = monthly.reduce((a, m) => a + m.revenue, 0);
  const totalSales   = monthly.reduce((a, m) => a + m.sales, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">Revenue Analytics</h1>
          <p className="text-slate-400 text-sm">Total sales, monthly income, and top teachers.</p>
        </div>
        <button onClick={() => exportCSV(monthly.map(m => ({ Month: m.month, Revenue: m.revenue, Sales: m.sales })), "revenue.csv")}
          className="flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export CSV
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue",   value: `$${(totalRevenue/1000).toFixed(1)}k`, icon: "💰", color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/20" },
          { label: "Total Sales",     value: totalSales,                            icon: "🛒", color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20" },
          { label: "This Month",      value: `$${(monthly[monthly.length-1].revenue/1000).toFixed(1)}k`, icon: "📅", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
          { label: "Avg Order Value", value: `$${(totalRevenue/totalSales).toFixed(2)}`, icon: "📊", color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/20" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-slate-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
        <h2 className="text-white font-bold mb-6">Monthly Revenue</h2>
        <div className="flex items-end gap-4 h-40">
          {monthly.map(m => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs text-green-400 font-semibold">${(m.revenue/1000).toFixed(1)}k</span>
              <div className="w-full bg-slate-800 rounded-t-lg overflow-hidden" style={{ height: "100px" }}>
                <div className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all" style={{ height: `${(m.revenue / maxRevenue) * 100}%`, marginTop: `${100 - (m.revenue / maxRevenue) * 100}%` }} />
              </div>
              <span className="text-xs text-slate-400">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top teachers */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-white font-bold mb-4">🏆 Top Teachers by Revenue</h2>
          <div className="space-y-3">
            {topTeachers.sort((a,b) => b.revenue - a.revenue).map((t, i) => (
              <div key={t.name} className="flex items-center gap-3">
                <span className="text-slate-500 text-xs w-4 font-bold">#{i+1}</span>
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>{t.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.students.toLocaleString()} students · {t.courses} courses</p>
                </div>
                <span className="text-sm font-bold text-green-400">${(t.revenue/1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent sales */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-white font-bold mb-4">💳 Recent Sales</h2>
          <div className="space-y-3">
            {recentSales.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium truncate">{s.student}</p>
                  <p className="text-xs text-slate-500 truncate">{s.course} · {s.date}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.status === "Completed" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{s.status}</span>
                  <span className="text-sm font-bold text-white">${s.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
