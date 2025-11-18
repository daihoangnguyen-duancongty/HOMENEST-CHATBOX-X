'use client';
import { ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({
  children,
  requiredRole,
}: {
  children: ReactNode;
  requiredRole?: "admin" | "client" | "employee";
}) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFromStorage();
    setLoading(false);
  }, [loadFromStorage]);

  useEffect(() => {
    if (!loading) {
      if (!token || !user) {
        router.replace("/auth/login");
        return;
      }
      if (requiredRole && user.role !== requiredRole) {
        router.replace("/auth/login");
      }
    }
  }, [token, user, loading, requiredRole, router]);

  if (loading) return null;
  if (!token || !user) return null;

  return <>{children}</>;
}
