import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory-100 lg:flex">
      <AdminSidebar />
      <div className="flex-1">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">{children}</div>
      </div>
    </div>
  );
}
