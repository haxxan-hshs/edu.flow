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

import { createClient } from "./supabase/client";

export async function getAllUserActivities(): Promise<UserActivityProfile[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("user_activities").select("*");
  if (error || !data) return [];
  return data.map(d => ({
    email: d.email,
    firstName: d.first_name,
    lastName: d.last_name,
    avatarUrl: d.avatar_url,
    subjects: d.subjects || [],
    readingRecords: d.reading_records || [],
    studySessions: d.study_sessions || [],
    totalStudySeconds: d.total_study_seconds || 0,
    filesCount: d.files_count || 0,
    certificates: d.certificates || [],
    lastSeen: d.last_seen,
  }));
}

export async function saveUserActivity(profile: UserActivityProfile) {
  const supabase = createClient();
  const { error } = await supabase
    .from("user_activities")
    .upsert({
      email: profile.email,
      first_name: profile.firstName,
      last_name: profile.lastName,
      avatar_url: profile.avatarUrl,
      subjects: profile.subjects,
      reading_records: profile.readingRecords,
      study_sessions: profile.studySessions,
      total_study_seconds: profile.totalStudySeconds,
      files_count: profile.filesCount,
      certificates: profile.certificates,
      last_seen: profile.lastSeen,
    });
  
  if (error) {
    console.error("Error saving to Supabase:", error);
  }
}

export async function getUserActivity(email: string): Promise<UserActivityProfile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_activities")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) return null;

  return {
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    avatarUrl: data.avatar_url,
    subjects: data.subjects || [],
    readingRecords: data.reading_records || [],
    studySessions: data.study_sessions || [],
    totalStudySeconds: data.total_study_seconds || 0,
    filesCount: data.files_count || 0,
    certificates: data.certificates || [],
    lastSeen: data.last_seen,
  };
}

// Admin sends a certificate to a specific user
export async function adminSendCertificate(userEmail: string, cert: UserCertificate) {
  const profile = await getUserActivity(userEmail);
  if (!profile) return false;
  profile.certificates = [cert, ...(profile.certificates || [])];
  await saveUserActivity(profile);
  return true;
}

// Admin revokes a certificate
export async function adminRevokeCertificate(userEmail: string, certId: string) {
  const profile = await getUserActivity(userEmail);
  if (!profile) return false;
  profile.certificates = (profile.certificates || []).filter(c => c.id !== certId);
  await saveUserActivity(profile);
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
