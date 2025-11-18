// src/api/admin.ts
import { fetcher } from "@/config/fetcher";
import type {DashboardStats} from '@/types/admin'

// Lấy dashboard stats
export async function getDashboardStats(): Promise<DashboardStats> {
  return fetcher<DashboardStats>("/dashboard"); // BASE_URL đã có /admin-api
}
