"use client";
import { useState } from "react";

type CourseStatus = "Pending" | "Approved" | "Rejected" | "Featured";

interface Course {
  id: string; title: string; instructor: string; category: string;
  status: CourseStatus; price: number; students: number; submitted: string;
}

const INITIAL: Course[] = [
  { id: "1", title: "Complete Python Bootcamp",        instructor: "Dr. James Wilson", category: "Programming", status: "Approved",  price: 89.99,  students: 18500, submitted: "2025-01-05" },
  { id: "2", title: "React & Next.js Guide",           instructor: "Sarah Johnson",    category: "Web Dev",     status: "Featured",  price: 79.99,  students: 12300, submitted: "2025-01-20" },
  { id: "3", title: "Advanced Machine Learning",       instructor: "Prof. Alex Kumar", category: "AI/ML",       status: "Pending",   price: 99.99,  students: 0,     submitted: "2025-05-10" },
  { id: "4", title: "UI/UX Design Masterclass",        instructor: "Emily Chen",       category: "Design",      status: "Approved",  price: 69.99,  students: 9800,  submitted: "2025-02-14" },
  { id: "5", title: "Blockchain Development",          instructor: "Marcus Lee",       category: "Web3",        status: "Pending",   price: 119.99, students: 0,     submitted: "2025-05-15" },
  { id: "6", title: "Digital Marketing Crash Course",  instructor: "Rachel Torres",    category: "Marketing",   status: "Rejected",  price: 49.99,  students: 0,     submitted: "2025-04-30" },
  { id: "7", title: "Node.js & Express Backend",       instructor: "Marcus Lee",       category: "Web Dev",     status: "Approved",  price: 74.99,  students: 8700,  submitted: "2025-03-01" },
];

function exportCSV(rows: Record<string, string | number>[], filename: string) {
  const headers = Object.keys(rows[0]).join(",");
  const body = rows.map(r => Object.values(r).map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([headers + "\n" + body], { type: "text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
}

const STATUS_STYLE: Record<CourseStatus, string> = {
  Pending:  "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Approved: "bg-green-500/20 text-green-400 border-green-500/30",
  Rejected: "bg-red-500/20 text-red-400 border-red-500/30",
  Featured: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
};

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>(INITIAL);
  const [filter, setFilter] = useState<"All" | CourseStatus>("All");

  function setStatus(id: string, status: CourseStatus) {
    setCourses(c => c.map(x => x.id === id ? { ...x, status } : x));
  }

  const filtered = filter === "All" ? courses : courses.filter(c => c.status === filter);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">Course Management</h1>
          <p className="text-slate-400 text-sm">Approve, reject, or feature courses.</p>
        </div>
        <button onClick={() => exportCSV(filtered.map(c => ({ Title: c.title, Instructor: c.instructor, Category: c.category, Status: c.status, Price: c.price, Students: c.students })), "courses.csv")}
          className="flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {(["Pending","Approved","Featured","Rejected"] as CourseStatus[]).map(s => (
          <div key={s} className={`border rounded-xl p-4 text-center cursor-pointer transition-all ${filter === s ? "ring-2 ring-indigo-500" : ""} ${STATUS_STYLE[s].replace("text-", "border-").split(" ")[0]} bg-slate-900`}
            onClick={() => setFilter(filter === s ? "All" : s)}>
            <p className={`text-2xl font-extrabold ${STATUS_STYLE[s].split(" ")[1]}`}>{courses.filter(c => c.status === s).length}</p>
            <p className="text-slate-400 text-xs mt-1">{s}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(["All","Pending","Approved","Featured","Rejected"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${filter === f ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"}`}>{f}</button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-slate-800/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="col-span-4">Course</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-1 text-center">Price</div>
          <div className="col-span-1 text-center">Students</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>
        {filtered.map(c => (
          <div key={c.id} className="grid grid-cols-12 gap-2 px-5 py-4 border-t border-slate-800 items-center hover:bg-slate-800/30 transition-colors">
            <div className="col-span-4 min-w-0">
              <p className="text-sm text-white font-medium truncate">{c.title}</p>
              <p className="text-xs text-slate-500 truncate">by {c.instructor}</p>
            </div>
            <div className="col-span-2"><span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-full">{c.category}</span></div>
            <div className="col-span-1 text-center text-sm font-bold text-green-400">${c.price}</div>
            <div className="col-span-1 text-center text-xs text-slate-400">{c.students.toLocaleString()}</div>
            <div className="col-span-1 text-center"><span className={`text-xs px-2 py-1 rounded-full font-medium border ${STATUS_STYLE[c.status]}`}>{c.status}</span></div>
            <div className="col-span-3 flex items-center justify-end gap-1 flex-wrap">
              {c.status === "Pending" && <>
                <button onClick={() => setStatus(c.id, "Approved")} className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-lg">Approve</button>
                <button onClick={() => setStatus(c.id, "Rejected")} className="text-xs bg-red-600/80 hover:bg-red-600 text-white px-2 py-1 rounded-lg">Reject</button>
              </>}
              {c.status === "Approved" && <button onClick={() => setStatus(c.id, "Featured")} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded-lg">⭐ Feature</button>}
              {c.status === "Featured" && <button onClick={() => setStatus(c.id, "Approved")} className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded-lg">Unfeature</button>}
              {c.status === "Rejected" && <button onClick={() => setStatus(c.id, "Pending")} className="text-xs bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 rounded-lg">Re-review</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
