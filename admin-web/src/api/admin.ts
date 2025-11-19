// ADMIN API Client



import type { DashboardStats } from "@/types/admin";

// Client gọi server API route
export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch("/api/admin/dashboard");
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch dashboard stats");
  }
  return res.json();
}