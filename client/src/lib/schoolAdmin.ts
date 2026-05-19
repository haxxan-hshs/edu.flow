// Shared types for School Admin panel
export interface Student {
  id: string;
  name: string;
  rollNo: string;
  class: string;
  section: string;
  phone: string;
  email: string;
  guardian: string;
  joinDate: string;
  status: "active" | "inactive";
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: "present" | "absent" | "late";
}

export interface MarksRecord {
  id: string;
  studentId: string;
  subject: string;
  examType: string;
  marks: number;
  totalMarks: number;
  date: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: "general" | "exam" | "event" | "holiday";
  date: string;
  priority: "low" | "medium" | "high";
}

// No demo data — admin adds everything manually
export function seedData() {
  // intentionally empty
}

export function getStudents(): Student[] {
  try { return JSON.parse(localStorage.getItem("school_students") || "[]"); } catch { return []; }
}
export function saveStudents(s: Student[]) { localStorage.setItem("school_students", JSON.stringify(s)); }
export function getAttendance(): AttendanceRecord[] {
  try { return JSON.parse(localStorage.getItem("school_attendance") || "[]"); } catch { return []; }
}
export function saveAttendance(a: AttendanceRecord[]) { localStorage.setItem("school_attendance", JSON.stringify(a)); }
export function getMarks(): MarksRecord[] {
  try { return JSON.parse(localStorage.getItem("school_marks") || "[]"); } catch { return []; }
}
export function saveMarks(m: MarksRecord[]) { localStorage.setItem("school_marks", JSON.stringify(m)); }
export function getAnnouncements(): Announcement[] {
  try { return JSON.parse(localStorage.getItem("school_announcements") || "[]"); } catch { return []; }
}
export function saveAnnouncements(a: Announcement[]) { localStorage.setItem("school_announcements", JSON.stringify(a)); }
