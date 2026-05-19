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

// ── User Activity Bridge (user dashboard → admin panel) ─────────────────────
export interface UserSubject {
  id: string;
  name: string;
  hoursPerWeek: number;
  addedAt: string;
}

export interface UserStudySession {
  id: string;
  title: string;
  subjectId: string; // links to a ReadingRecord
  durationSeconds: number;
  date: string;
}

// User-managed reading/course records (replaces hardcoded data)
export interface ReadingRecord {
  id: string;
  title: string;         // course/subject name
  targetHours: number;   // how many hours user wants to study
  studiedSeconds: number; // actual time tracked via timer
  addedAt: string;
  lastStudied: string | null;
}

// Certificates sent from admin to user
export interface UserCertificate {
  id: string;
  courseTitle: string;
  issuedBy: string;      // admin name
  issuedAt: string;
  grade: string;         // A+, A, B, etc.
  message: string;       // personal message from admin
}

export interface UserActivityProfile {
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  subjects: UserSubject[];
  readingRecords: ReadingRecord[];  // user's self-added courses
  studySessions: UserStudySession[];
  totalStudySeconds: number;
  filesCount: number;
  certificates: UserCertificate[];  // sent by admin
  lastSeen: string;
}

const ACTIVITY_KEY = "eduflow_user_activities";

export function getAllUserActivities(): UserActivityProfile[] {
  try { return JSON.parse(localStorage.getItem(ACTIVITY_KEY) || "[]"); } catch { return []; }
}

export function saveUserActivity(profile: UserActivityProfile) {
  const all = getAllUserActivities();
  const idx = all.findIndex(p => p.email === profile.email);
  if (idx >= 0) all[idx] = profile; else all.unshift(profile);
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(all));
}

export function getUserActivity(email: string): UserActivityProfile | null {
  return getAllUserActivities().find(p => p.email === email) || null;
}

// Admin sends a certificate to a specific user
export function adminSendCertificate(userEmail: string, cert: UserCertificate) {
  const all = getAllUserActivities();
  const idx = all.findIndex(p => p.email === userEmail);
  if (idx < 0) return false;
  all[idx].certificates = [cert, ...(all[idx].certificates || [])];
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(all));
  return true;
}

// Admin revokes a certificate
export function adminRevokeCertificate(userEmail: string, certId: string) {
  const all = getAllUserActivities();
  const idx = all.findIndex(p => p.email === userEmail);
  if (idx < 0) return false;
  all[idx].certificates = (all[idx].certificates || []).filter(c => c.id !== certId);
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(all));
  return true;
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
