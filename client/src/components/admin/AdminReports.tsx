"use client";

function exportCSV(rows: Record<string, string | number>[], filename: string) {
  const headers = Object.keys(rows[0]).join(",");
  const body = rows.map(r => Object.values(r).map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([headers + "\n" + body], { type: "text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
}

function exportPDF(title: string, rows: Record<string, string | number>[]) {
  const html = `<html><head><title>${title}</title><style>
    body{font-family:Arial,sans-serif;padding:24px;color:#1e293b}
    h1{color:#4f46e5;margin-bottom:16px}
    table{width:100%;border-collapse:collapse}
    th{background:#4f46e5;color:white;padding:10px 12px;text-align:left;font-size:12px}
    td{padding:9px 12px;border-bottom:1px solid #e2e8f0;font-size:12px}
    tr:nth-child(even){background:#f8fafc}
    .footer{margin-top:24px;font-size:11px;color:#94a3b8}
  </style></head><body>
    <h1>${title}</h1>
    <p style="color:#64748b;font-size:12px;margin-bottom:16px">Generated: ${new Date().toLocaleString()} · EduFlow Admin</p>
    <table><thead><tr>${Object.keys(rows[0]).map(k => `<th>${k}</th>`).join("")}</tr></thead>
    <tbody>${rows.map(r => `<tr>${Object.values(r).map(v => `<td>${v}</td>`).join("")}</tr>`).join("")}</tbody></table>
    <div class="footer">EduFlow Platform Report · Confidential</div>
  </body></html>`;
  const w = window.open("", "_blank");
  if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 500); }
}

const REPORTS = [
  {
    id: "users",
    title: "User Report",
    description: "All registered users with roles, status, and enrollment data.",
    icon: "👥",
    color: "from-blue-600 to-blue-700",
    rows: [
      { Name: "Alice Johnson",    Email: "alice@example.com",   Role: "Student", Status: "Active",  Courses: 5,  Joined: "2025-01-10" },
      { Name: "Dr. James Wilson", Email: "james@example.com",   Role: "Teacher", Status: "Active",  Courses: 8,  Joined: "2025-02-14" },
      { Name: "Carlos Mendez",    Email: "carlos@example.com",  Role: "Student", Status: "Active",  Courses: 3,  Joined: "2025-03-01" },
      { Name: "Emily Chen",       Email: "emily@example.com",   Role: "Teacher", Status: "Active",  Courses: 4,  Joined: "2025-01-20" },
      { Name: "Spam Bot",         Email: "spam@bot.com",        Role: "Student", Status: "Banned",  Courses: 0,  Joined: "2025-04-05" },
    ],
  },
  {
    id: "revenue",
    title: "Revenue Report",
    description: "Monthly revenue breakdown, total sales, and income per course.",
    icon: "💰",
    color: "from-green-600 to-emerald-700",
    rows: [
      { Month: "January",  Revenue: "$32,400", Sales: 412, AvgOrder: "$78.64" },
      { Month: "February", Revenue: "$38,200", Sales: 489, AvgOrder: "$78.12" },
      { Month: "March",    Revenue: "$41,500", Sales: 521, AvgOrder: "$79.65" },
      { Month: "April",    Revenue: "$39,800", Sales: 498, AvgOrder: "$79.92" },
      { Month: "May",      Revenue: "$48,290", Sales: 601, AvgOrder: "$80.35" },
    ],
  },
  {
    id: "courses",
    title: "Course Report",
    description: "All courses with approval status, enrollment numbers, and revenue.",
    icon: "📚",
    color: "from-indigo-600 to-purple-700",
    rows: [
      { Title: "Python Bootcamp",       Instructor: "Dr. James Wilson", Status: "Approved",  Students: 18500, Revenue: "$142,300" },
      { Title: "React & Next.js",       Instructor: "Sarah Johnson",    Status: "Featured",  Students: 12300, Revenue: "$98,400" },
      { Title: "Machine Learning A-Z",  Instructor: "Prof. Alex Kumar", Status: "Approved",  Students: 22000, Revenue: "$176,000" },
      { Title: "UI/UX Masterclass",     Instructor: "Emily Chen",       Status: "Approved",  Students: 9800,  Revenue: "$68,600" },
      { Title: "Node.js Backend",       Instructor: "Marcus Lee",       Status: "Approved",  Students: 8700,  Revenue: "$65,200" },
    ],
  },
  {
    id: "analytics",
    title: "Analytics Report",
    description: "Platform engagement, completion rates, and active user metrics.",
    icon: "📊",
    color: "from-amber-600 to-orange-700",
    rows: [
      { Category: "Web Development",  CompletionRate: "78%", Students: 18400, AvgRating: "4.8" },
      { Category: "Data Science",     CompletionRate: "65%", Students: 12300, AvgRating: "4.7" },
      { Category: "UI/UX Design",     CompletionRate: "82%", Students: 9800,  AvgRating: "4.9" },
      { Category: "Machine Learning", CompletionRate: "58%", Students: 14200, AvgRating: "4.7" },
      { Category: "Mobile Dev",       CompletionRate: "71%", Students: 7600,  AvgRating: "4.6" },
    ],
  },
];

export default function AdminReports() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">Reports & Export</h1>
        <p className="text-slate-400 text-sm">Generate and download platform reports as CSV or PDF.</p>
      </div>

      {/* Report cards */}
      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {REPORTS.map(report => (
          <div key={report.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className={`bg-gradient-to-r ${report.color} p-5 flex items-center gap-3`}>
              <span className="text-3xl">{report.icon}</span>
              <div>
                <h3 className="text-white font-bold">{report.title}</h3>
                <p className="text-white/70 text-xs mt-0.5">{report.description}</p>
              </div>
            </div>

            {/* Preview table */}
            <div className="p-4">
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-800">
                      {Object.keys(report.rows[0]).map(k => (
                        <th key={k} className="text-left text-slate-500 font-semibold uppercase tracking-wider pb-2 pr-3">{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {report.rows.slice(0, 3).map((row, i) => (
                      <tr key={i} className="border-b border-slate-800/50 last:border-0">
                        {Object.values(row).map((v, j) => (
                          <td key={j} className="text-slate-300 py-2 pr-3 truncate max-w-[100px]">{String(v)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {report.rows.length > 3 && <p className="text-slate-600 text-xs mt-2">+{report.rows.length - 3} more rows...</p>}
              </div>

              {/* Export buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => exportCSV(report.rows, `${report.id}-report.csv`)}
                  className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 py-2.5 rounded-xl transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Export CSV
                </button>
                <button
                  onClick={() => exportPDF(report.title, report.rows)}
                  className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold text-white bg-slate-700 hover:bg-slate-600 py-2.5 rounded-xl transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Export all */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-white font-bold text-lg mb-1">Export Full Platform Report</h3>
          <p className="text-indigo-200 text-sm">Download all data in one comprehensive report.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => exportCSV([...REPORTS[0].rows, ...REPORTS[1].rows], "full-platform-report.csv")}
            className="flex items-center gap-2 text-sm font-bold text-indigo-700 bg-white hover:bg-indigo-50 px-5 py-3 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Full CSV
          </button>
          <button
            onClick={() => exportPDF("EduFlow Full Platform Report", REPORTS[1].rows)}
            className="flex items-center gap-2 text-sm font-bold text-white bg-white/20 hover:bg-white/30 border border-white/30 px-5 py-3 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Full PDF
          </button>
        </div>
      </div>
    </div>
  );
}
