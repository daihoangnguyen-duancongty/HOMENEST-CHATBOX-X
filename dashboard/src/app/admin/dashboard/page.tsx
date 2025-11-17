// frontend/src/app/admin/dashboard/page.tsx
"use client";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { role } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (role !== "admin") router.push("/admin/login");
  }, [role]);

  return <div>Admin Dashboard</div>;
}
