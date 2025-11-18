"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Chỉ redirect khi client-side
    router.replace("/auth/login");
  }, [router]);

  return null;
}
