import { ShieldCheck, Handshake, Search, Building2 } from "lucide-react";

const POINTS = [
  {
    icon: Search,
    title: "Curated Listings",
    desc: "Every property is personally verified for title clarity, quality, and fair pricing before it reaches you.",
  },
  {
    icon: Handshake,
    title: "End-to-End Support",
    desc: "From shortlisting to paperwork and handover, our advisors stay with you through the entire journey.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Dealings",
    desc: "No hidden charges, no surprises — just clear documentation and honest advice at every step.",
  },
  {
    icon: Building2,
    title: "Local Market Expertise",
    desc: "Deep on-ground knowledge across every micro-market we operate in, updated in real time.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">Why Sai Space Realty</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">
          Real estate, handled with real care
        </h2>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {POINTS.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-2xl border border-navy-900/8 bg-white p-6 transition-shadow hover:shadow-lg hover:shadow-navy-900/5"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900">
              <Icon className="h-6 w-6 text-gold-400" />
            </span>
            <h3 className="mt-5 font-display text-lg font-semibold text-navy-900">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-navy-900/60">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
