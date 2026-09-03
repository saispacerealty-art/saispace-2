import type { Metadata } from "next";
import { ArrowRight, Handshake, LineChart, Mail, Sparkles, Users } from "lucide-react";
import { repo } from "@/lib/repository";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join Sai Space Realty — build your career in real estate with a team that invests in your growth.",
};

const PERKS = [
  {
    icon: LineChart,
    title: "Uncapped Earnings",
    description: "Competitive base pay plus performance incentives — your effort sets your ceiling, not a pay band.",
  },
  {
    icon: Users,
    title: "Hands-On Mentorship",
    description: "Learn directly from advisors who've closed hundreds of deals across residential and commercial real estate.",
  },
  {
    icon: Handshake,
    title: "Collaborative Culture",
    description: "A close-knit team that shares leads, market intel, and wins — not a place where you compete alone.",
  },
  {
    icon: Sparkles,
    title: "Real Local Impact",
    description: "Help families and businesses make one of the biggest decisions of their lives, backed by a trusted name.",
  },
];

const OPEN_ROLES = [
  {
    title: "Property Consultant",
    type: "Full-time · Pune / Mumbai",
    description: "Guide buyers and tenants from first visit to closed deal. Prior sales experience preferred; real estate background a plus, not a must.",
  },
  {
    title: "Marketing Associate",
    type: "Full-time · Pune",
    description: "Own listing photography coordination, social content, and campaign performance across our digital channels.",
  },
  {
    title: "Client Relations Executive",
    type: "Full-time · Pune",
    description: "Be the first voice a client hears — qualify inbound enquiries, schedule site visits, and keep our CRM sharp.",
  },
];

export default async function CareersPage() {
  const settings = await repo.getSettings();
  const applyHref = (role: string) =>
    `mailto:${settings.email}?subject=${encodeURIComponent(`Application: ${role}`)}`;
  const generalApplyHref = `mailto:${settings.email}?subject=${encodeURIComponent("General Application")}`;

  return (
    <>
      <section className="bg-navy-950 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">Careers</p>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl">
            Build your career, one client relationship at a time.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/60">
            We&apos;re a growing team of advisors, marketers, and client-relations specialists who believe real
            estate is a people business first. If that sounds like you, we&apos;d like to meet you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">Why Join Us</p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          What it&apos;s like to work here
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-2xl border border-navy-900/8 bg-white p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900">
                <Icon className="h-6 w-6 text-gold-400" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-navy-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-900/60">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ivory-100 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">Open Roles</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
            Current openings
          </h2>

          <div className="mt-10 space-y-4">
            {OPEN_ROLES.map((role) => (
              <div
                key={role.title}
                className="flex flex-col gap-4 rounded-2xl border border-navy-900/8 bg-white p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-display text-lg font-semibold text-navy-900">{role.title}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gold-600">{role.type}</p>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-900/60">{role.description}</p>
                </div>
                <a
                  href={applyHref(role.title)}
                  className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
                >
                  Apply Now <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-navy-950 px-8 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gold-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
          <p className="relative text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">Don&apos;t See Your Role?</p>
          <h2 className="relative mx-auto mt-4 max-w-xl font-display text-3xl font-semibold text-white sm:text-4xl">
            We&apos;re always open to meeting good people.
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-sm text-white/60">
            Send us your resume and a note on what you&apos;re looking for — we&apos;ll reach out when the right fit comes up.
          </p>
          <div className="relative mt-8 flex justify-center">
            <a
              href={generalApplyHref}
              className="flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400"
            >
              <Mail className="h-4 w-4" /> Email Your Resume
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
