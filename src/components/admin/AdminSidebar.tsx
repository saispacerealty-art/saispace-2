"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  Newspaper,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Home,
  Users,
  Wrench,
  Compass,
  Gift,
  Briefcase,
  BookOpen,
} from "lucide-react";
import clsx from "clsx";
import { LogoMark } from "@/components/Logo";

const NAV_GROUPS: { label: string; links: { href: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] }[] = [
  {
    label: "Overview",
    links: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Listings",
    links: [
      { href: "/admin/properties", label: "Properties", icon: Building2 },
      { href: "/admin/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/blog", label: "Blog Posts", icon: Newspaper },
    ],
  },
  {
    label: "Site Content",
    links: [
      { href: "/admin/content/homepage", label: "Homepage", icon: Home },
      { href: "/admin/content/about", label: "About Page", icon: Users },
      { href: "/admin/content/services", label: "Services Page", icon: Wrench },
      { href: "/admin/content/careers", label: "Careers Page", icon: Briefcase },
      { href: "/admin/content/referral", label: "Referral Page", icon: Gift },
      { href: "/admin/content/navigation", label: "Navigation", icon: Compass },
      { href: "/admin/settings", label: "General Settings", icon: Settings },
    ],
  },
  {
    label: "Communication",
    links: [
      { href: "/admin/messages", label: "Messages", icon: MessageSquare },
      { href: "/admin/referrals", label: "Referrals", icon: Gift },
    ],
  },
  {
    label: "Help",
    links: [{ href: "/admin/manual", label: "User Manual", icon: BookOpen }],
  },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-5 px-3">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="px-3.5 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/30">
            {group.label}
          </p>
          <div className="flex flex-col gap-1">
            {group.links.map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  className={clsx(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                    active ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex h-full flex-col bg-navy-950 py-6">
      <div className="flex items-center gap-3 px-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ivory-100 shadow-sm">
          <LogoMark className="h-7 w-7" />
        </span>
        <div className="leading-tight">
          <p className="font-display text-sm font-semibold text-white">Sai Space Realty</p>
          <p className="text-[10px] uppercase tracking-widest text-gold-300">Admin Console</p>
        </div>
      </div>

      <div className="mt-8">
        <NavLinks pathname={pathname} onNavigate={onNavigate} />
      </div>

      <div className="mt-auto space-y-1 px-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/55 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-[18px] w-[18px]" /> View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/55 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-[18px] w-[18px]" /> Log Out
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed h-screen w-64">
          <SidebarContent />
        </div>
      </aside>

      <div className="flex items-center justify-between border-b border-navy-900/10 bg-navy-950 px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ivory-100 shadow-sm">
            <LogoMark className="h-6 w-6" />
          </span>
          <span className="font-display text-sm font-semibold text-white">Admin Console</span>
        </div>
        <button onClick={() => setOpen(true)} className="text-white" aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
            >
              <div className="relative h-full">
                <button
                  onClick={() => setOpen(false)}
                  className="absolute right-3 top-3 text-white/70 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
                <SidebarContent onNavigate={() => setOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
