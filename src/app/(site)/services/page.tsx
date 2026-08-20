import type { Metadata } from "next";
import Link from "next/link";
import {
  Home,
  Megaphone,
  KeyRound,
  ScrollText,
  LineChart,
  Landmark,
  ArrowRight,
  Check,
} from "lucide-react";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Services",
  description: "End-to-end real estate services from Sai Space Realty — buying, selling, renting, legal support and more.",
};

const SERVICES = [
  {
    icon: Home,
    title: "Buying Assistance",
    desc: "Personalized property shortlisting, site visits, and negotiation support so you find the right home at the right price.",
    points: ["Curated shortlists", "Accompanied site visits", "Price negotiation"],
  },
  {
    icon: Megaphone,
    title: "Selling & Marketing",
    desc: "Professional listing photography, targeted marketing, and qualified buyer introductions to sell faster and for more.",
    points: ["Professional photography", "Multi-channel marketing", "Qualified buyer leads"],
  },
  {
    icon: KeyRound,
    title: "Rental Management",
    desc: "From tenant sourcing to lease agreements, we handle the details so your rental income stays hassle-free.",
    points: ["Tenant screening", "Lease documentation", "Rent collection support"],
  },
  {
    icon: ScrollText,
    title: "Legal & Documentation",
    desc: "Title verification, RERA checks, and registration support to keep every transaction fully compliant.",
    points: ["Title & RERA verification", "Registration assistance", "Documentation review"],
  },
  {
    icon: LineChart,
    title: "Investment Advisory",
    desc: "Data-backed insights on emerging micro-markets to help you make confident, high-return investment decisions.",
    points: ["Market trend analysis", "ROI projections", "Portfolio planning"],
  },
  {
    icon: Landmark,
    title: "Home Loan Assistance",
    desc: "We coordinate with leading banks and NBFCs to help you secure the best rates with minimal paperwork.",
    points: ["Bank & NBFC tie-ups", "Eligibility guidance", "Paperwork support"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-navy-950 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">What We Offer</p>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl">
            Real estate services built around you
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/60">
            From your first search to the final signature, our team supports every stage of your
            real estate journey.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, desc, points }) => (
            <div key={title} className="rounded-2xl border border-navy-900/8 bg-white p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900">
                <Icon className="h-6 w-6 text-gold-400" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-navy-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-900/60">{desc}</p>
              <ul className="mt-4 space-y-2">
                {points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-xs font-medium text-navy-900/70">
                    <Check className="h-3.5 w-3.5 shrink-0 text-gold-600" /> {p}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-gold-600"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
