"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authSlice";
import { getToken } from "@/config/token";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, logout } = useAuthStore();

  useEffect(() => {
    const storedToken = token || getToken();
    if (!storedToken) {
      logout();
      router.replace("/auth/login");
    }
  }, [token, logout, router]);

  return <>{children}</>;
}
