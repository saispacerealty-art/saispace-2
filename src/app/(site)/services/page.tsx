import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { CTASection } from "@/components/home/CTASection";
import { repo } from "@/lib/repository";
import { getIcon } from "@/lib/icons";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Services",
  description: "End-to-end real estate services from Sai Space Realty — buying, selling, renting, legal support and more.",
};

export default async function ServicesPage() {
  const [copy, services] = await Promise.all([repo.getPageCopy(), repo.listContent("services")]);

  return (
    <>
      <section className="bg-navy-950 py-16">
        <Reveal className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">{copy.servicesHeroEyebrow}</p>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl">
            {copy.servicesHeroTitle}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/60">{copy.servicesHeroText}</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ id, icon, title, description, points }) => {
            const Icon = getIcon(icon);
            return (
              <div key={id} className="h-full rounded-2xl border border-navy-900/8 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-navy-900/5">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900">
                  <Icon className="h-6 w-6 text-gold-400" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-navy-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-900/60">{description}</p>
                <ul className="mt-4 space-y-2">
                  {points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-xs font-medium text-navy-900/70">
                      <Check className="h-3.5 w-3.5 shrink-0 text-gold-600" /> {p}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="group mt-5 flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-gold-600"
                >
                  Get started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            );
          })}
        </RevealGroup>
      </section>

      <CTASection copy={copy} />
    </>
  );
}
