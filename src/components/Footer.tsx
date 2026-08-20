import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "./SocialIcons";
import type { SiteSettings } from "@/lib/types";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo variant="dark" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">{settings.tagline}</p>
          <div className="mt-6 flex items-center gap-3">
            {[
              { icon: FacebookIcon, href: settings.socials.facebook },
              { icon: InstagramIcon, href: settings.socials.instagram },
              { icon: LinkedinIcon, href: settings.socials.linkedin },
              { icon: YoutubeIcon, href: settings.socials.youtube },
            ].map(({ icon: Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-gold-500 hover:text-navy-950"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-gold-300">Explore</h4>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/properties" className="hover:text-white">Properties</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-gold-300">Property Types</h4>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            <li><Link href="/properties?type=Apartment" className="hover:text-white">Apartments</Link></li>
            <li><Link href="/properties?type=Villa" className="hover:text-white">Villas</Link></li>
            <li><Link href="/properties?type=Commercial" className="hover:text-white">Commercial</Link></li>
            <li><Link href="/properties?type=Plot" className="hover:text-white">Plots &amp; Land</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-gold-300">Contact</h4>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" /> {settings.address}</li>
            <li className="flex gap-3"><Phone className="h-4 w-4 shrink-0 text-gold-400" /> {settings.phone}</li>
            <li className="flex gap-3"><Mail className="h-4 w-4 shrink-0 text-gold-400" /> {settings.email}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-white/50 sm:flex-row">
          <span>© {new Date().getFullYear()} {settings.siteName}. All rights reserved.</span>
          <Link href="/admin" className="hover:text-white/80">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
