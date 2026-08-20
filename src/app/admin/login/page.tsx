import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginScreen } from "@/components/admin/LoginScreen";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginScreen />
    </Suspense>
  );
}
