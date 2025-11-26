"use client";

import { Providers } from "@/providers";
import "../styles/globals.css";
import { useHydrateAuth } from "@/hooks/useHydrateAuth";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useHydrateAuth(); // ⬅️ chạy sau khi client load

  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
