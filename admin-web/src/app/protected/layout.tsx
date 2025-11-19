"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { decodeToken } from "@/config/token";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const rehydrated = useAuthStore((state) => state.rehydrated);

  if (!rehydrated) return null;

  if (!token) {
    router.replace("/auth/login");
    return null;
  }

  const decoded = decodeToken(token);
  if (!decoded) {
    router.replace("/auth/login");
    return null;
  }

  return <>{children}</>;
}
