"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import clsx from "clsx";
import { Logo } from "./Logo";
import type { NavLink, SiteSettings } from "@/lib/types";

export function Header({ settings, navLinks }: { settings: SiteSettings; navLinks: NavLink[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <header
      className={clsx("sticky top-0 z-50 bg-[#3b4a5a] transition-shadow", scrolled && "shadow-md")}
    >
      <div className="hidden border-b border-navy-900/5 bg-navy-950 text-ivory-100 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs tracking-wide">
          <span className="text-white/70">{settings.officeHours}</span>
          <div className="flex items-center gap-5">
            <a href={`mailto:${settings.email}`} className="text-white/70 hover:text-gold-300">
              {settings.email}
            </a>
            <a href={`tel:${settings.phone}`} className="flex items-center gap-1.5 font-medium text-gold-300 hover:text-gold-200">
              <Phone className="h-3.5 w-3.5" /> {settings.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Logo variant="dark" />

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.id}
                href={link.href}
                className={clsx(
                  "text-sm font-medium tracking-wide transition-colors",
                  active ? "text-white" : "text-white/65 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/contact"
            className="rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400"
          >
            Enquire Now
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#3b4a5a] px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 rounded-full bg-gold-500 px-5 py-2.5 text-center text-sm font-semibold text-navy-950"
            >
              Enquire Now
            </Link>
            <a href={`tel:${settings.phone}`} className="mt-1 flex items-center gap-2 px-3 py-2 text-sm text-white/70">
              <Phone className="h-4 w-4" /> {settings.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
