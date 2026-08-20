"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import clsx from "clsx";
import { Logo } from "./Logo";
import type { SiteSettings } from "@/lib/types";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact Us" },
];

export function Header({ settings }: { settings: SiteSettings }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 transition-all",
        scrolled ? "bg-white/95 shadow-sm backdrop-blur" : "bg-white/80 backdrop-blur"
      )}
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
        <Logo />

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "text-sm font-medium tracking-wide transition-colors",
                  active ? "text-navy-900" : "text-navy-900/60 hover:text-navy-900"
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
            className="rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
          >
            Enquire Now
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-navy-900 lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-navy-900/10 bg-white px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-navy-900 hover:bg-ivory-100"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 rounded-full bg-navy-900 px-5 py-2.5 text-center text-sm font-semibold text-white"
            >
              Enquire Now
            </Link>
            <a href={`tel:${settings.phone}`} className="mt-1 flex items-center gap-2 px-3 py-2 text-sm text-navy-900/70">
              <Phone className="h-4 w-4" /> {settings.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
