import type { Metadata } from "next";
import Image from "next/image";
import { CTASection } from "@/components/home/CTASection";
import { repo } from "@/lib/repository";
import { getIcon } from "@/lib/icons";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Sai Space Realty's mission, values, and the team behind your next move.",
};

export default async function AboutPage() {
  const [copy, values, team] = await Promise.all([
    repo.getPageCopy(),
    repo.listContent("values"),
    repo.listContent("team"),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-navy-950 py-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=80"
            alt="Modern architecture"
            fill
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/60 to-navy-950" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">{copy.aboutHeroEyebrow}</p>
          <h1 className="mt-4 font-display text-3xl font-semibold text-white sm:text-5xl">
            {copy.aboutHeroTitle} <span className="gold-gradient-text">{copy.aboutHeroAccent}</span>
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-white/70 sm:text-base">{copy.aboutHeroText}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative h-80 overflow-hidden rounded-3xl sm:h-[420px]">
            <Image
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80"
              alt="Our office"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">{copy.aboutMissionEyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-navy-900">{copy.aboutMissionTitle}</h2>
            <p className="mt-4 text-sm leading-relaxed text-navy-900/60">{copy.aboutMissionParagraph1}</p>
            <p className="mt-4 text-sm leading-relaxed text-navy-900/60">{copy.aboutMissionParagraph2}</p>
          </div>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ id, icon, title, description }) => {
            const Icon = getIcon(icon);
            return (
              <div key={id} className="rounded-2xl border border-navy-900/8 bg-white p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900">
                  <Icon className="h-6 w-6 text-gold-400" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-navy-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-900/60">{description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-ivory-100 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">The People</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">
            Meet the team
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="relative h-56 w-full">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-navy-900">
                      <span className="font-display text-3xl font-semibold text-gold-400">
                        {member.name
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base font-semibold text-navy-900">{member.name}</h3>
                  <p className="text-xs text-gold-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection copy={copy} />
    </>
  );
}
