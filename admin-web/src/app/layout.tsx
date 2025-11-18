import "../styles/globals.css";
import "../sentry.client.config"; // Nếu dùng Sentry
import { Providers } from "./providers";
import ProtectedLayout from "@/components/ProtectedLayout";

export const metadata = {
  title: "Admin Panel",
  description: "Dashboard quản lý",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {/* Bọc children bằng ProtectedLayout để bảo vệ route */}
          <ProtectedLayout requiredRole="admin">
            {children}
          </ProtectedLayout>
        </Providers>
      </body>
    </html>
  );
}
