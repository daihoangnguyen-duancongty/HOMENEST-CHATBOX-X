"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";

export default function useProtectedRoute(requiredRole?: string) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);

  // Load token từ localStorage khi refresh page
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Redirect nếu chưa login hoặc role không đúng
  useEffect(() => {
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    if (requiredRole && user && user.role !== requiredRole) {
      router.replace("/auth/login");
    }
  }, [token, user, requiredRole, router]);
}
