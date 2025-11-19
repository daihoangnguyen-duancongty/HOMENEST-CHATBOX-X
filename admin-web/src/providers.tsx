// src/providers.tsx
"use client";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>; // sau này có thể bọc Zustand, React Query, ThemeProvider, etc.
}
