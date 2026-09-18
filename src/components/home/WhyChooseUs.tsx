import { getIcon } from "@/lib/icons";
import type { WhyChooseUsPoint } from "@/lib/types";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";

export function WhyChooseUs({ points }: { points: WhyChooseUsPoint[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <Reveal className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">Why Sai Space Realty</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">
          Real estate, handled with real care
        </h2>
      </Reveal>

      <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {points.map(({ id, icon, title, description }) => {
          const Icon = getIcon(icon);
          return (
            <div
              key={id}
              className="h-full rounded-2xl border border-navy-900/8 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-navy-900/5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900">
                <Icon className="h-6 w-6 text-gold-400" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-navy-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-900/60">{description}</p>
            </div>
          );
        })}
      </RevealGroup>
    </section>
  );
}
