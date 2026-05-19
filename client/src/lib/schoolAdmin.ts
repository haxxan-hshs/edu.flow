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

// Seed demo data
export function seedData() {
  if (!localStorage.getItem("school_students")) {
    const students: Student[] = [
      { id: "s1", name: "Ali Hassan", rollNo: "001", class: "10", section: "A", phone: "0300-1234567", email: "ali@example.com", guardian: "Mr. Hassan", joinDate: "2023-04-01", status: "active" },
      { id: "s2", name: "Fatima Khan", rollNo: "002", class: "10", section: "A", phone: "0300-2345678", email: "fatima@example.com", guardian: "Mr. Khan", joinDate: "2023-04-01", status: "active" },
      { id: "s3", name: "Usman Malik", rollNo: "003", class: "10", section: "B", phone: "0300-3456789", email: "usman@example.com", guardian: "Mr. Malik", joinDate: "2023-04-01", status: "active" },
      { id: "s4", name: "Ayesha Raza", rollNo: "004", class: "9", section: "A", phone: "0300-4567890", email: "ayesha@example.com", guardian: "Mr. Raza", joinDate: "2024-04-01", status: "active" },
      { id: "s5", name: "Bilal Ahmed", rollNo: "005", class: "9", section: "B", phone: "0300-5678901", email: "bilal@example.com", guardian: "Mr. Ahmed", joinDate: "2024-04-01", status: "inactive" },
    ];
    localStorage.setItem("school_students", JSON.stringify(students));
  }
  if (!localStorage.getItem("school_attendance")) {
    const today = new Date().toISOString().split("T")[0];
    const records: AttendanceRecord[] = [
      { id: "a1", studentId: "s1", date: today, status: "present" },
      { id: "a2", studentId: "s2", date: today, status: "present" },
      { id: "a3", studentId: "s3", date: today, status: "absent" },
      { id: "a4", studentId: "s4", date: today, status: "late" },
      { id: "a5", studentId: "s5", date: today, status: "absent" },
    ];
    localStorage.setItem("school_attendance", JSON.stringify(records));
  }
  if (!localStorage.getItem("school_marks")) {
    const marks: MarksRecord[] = [
      { id: "m1", studentId: "s1", subject: "Mathematics", examType: "Midterm", marks: 88, totalMarks: 100, date: "2025-05-01" },
      { id: "m2", studentId: "s1", subject: "Physics", examType: "Midterm", marks: 75, totalMarks: 100, date: "2025-05-02" },
      { id: "m3", studentId: "s2", subject: "Mathematics", examType: "Midterm", marks: 92, totalMarks: 100, date: "2025-05-01" },
      { id: "m4", studentId: "s2", subject: "Physics", examType: "Midterm", marks: 85, totalMarks: 100, date: "2025-05-02" },
      { id: "m5", studentId: "s3", subject: "Mathematics", examType: "Midterm", marks: 60, totalMarks: 100, date: "2025-05-01" },
      { id: "m6", studentId: "s4", subject: "Mathematics", examType: "Midterm", marks: 78, totalMarks: 100, date: "2025-05-01" },
    ];
    localStorage.setItem("school_marks", JSON.stringify(marks));
  }
  if (!localStorage.getItem("school_announcements")) {
    const announcements: Announcement[] = [
      { id: "an1", title: "Annual Exams Schedule", body: "Annual exams 10 June se shuru honge. Tamam students tayyari karein.", category: "exam", date: "2025-05-15", priority: "high" },
      { id: "an2", title: "Eid Holiday", body: "School 29 May se 4 June tak band rahega.", category: "holiday", date: "2025-05-12", priority: "medium" },
    ];
    localStorage.setItem("school_announcements", JSON.stringify(announcements));
  }
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
