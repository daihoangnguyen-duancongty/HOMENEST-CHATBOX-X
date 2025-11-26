"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authSlice";

export function useHydrateAuth() {
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        login(token, JSON.parse(userStr));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [login]);
}
