import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// These pages read live admin data (properties, inquiries, settings, etc.)
// straight from the repository with no dynamic-API usage to signal that —
// without this, Next prerenders them once at build time and every admin
// view keeps showing that frozen snapshot in production until the next deploy.
export const dynamic = "force-dynamic";

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
