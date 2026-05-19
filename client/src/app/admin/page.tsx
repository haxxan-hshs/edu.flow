"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminCourses from "@/components/admin/AdminCourses";
import AdminRevenue from "@/components/admin/AdminRevenue";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminReports from "@/components/admin/AdminReports";

export type AdminTab = "overview" | "users" | "courses" | "revenue" | "analytics" | "reports";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      setLoading(false);
    });
  }, [router]);

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg className="w-8 h-8 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-slate-400 text-sm">Loading Admin Panel...</p>
      </div>
    </div>
  );

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === "overview"   && <AdminOverview  setActiveTab={setActiveTab} />}
      {activeTab === "users"      && <AdminUsers />}
      {activeTab === "courses"    && <AdminCourses />}
      {activeTab === "revenue"    && <AdminRevenue />}
      {activeTab === "analytics"  && <AdminAnalytics />}
      {activeTab === "reports"    && <AdminReports />}
    </AdminLayout>
  );
}
