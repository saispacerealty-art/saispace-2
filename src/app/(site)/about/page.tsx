import type { Metadata } from "next";
import Image from "next/image";
import { Award, Handshake, Target, Users } from "lucide-react";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Sai Space Realty's mission, values, and the team behind your next move.",
};

const TEAM = [
  {
    name: "Sai Prakash Rane",
    role: "Founder & Principal Broker",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Meera Kulkarni",
    role: "Head of Residential Sales",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Aditya Verma",
    role: "Commercial Leasing Lead",
    img: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Ritika Shah",
    role: "Client Relations Manager",
    img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
  },
];

const VALUES = [
  { icon: Target, title: "Clarity First", desc: "We simplify every transaction with straight answers and clear documentation." },
  { icon: Handshake, title: "Client-Centred", desc: "Your goals shape every recommendation we make — never the other way around." },
  { icon: Award, title: "Proven Track Record", desc: "Nine years and 1,400+ families served across residential and commercial real estate." },
  { icon: Users, title: "Community Rooted", desc: "Deep local relationships that translate into better access and better deals." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy-950 py-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=80"
            alt="Modern architecture"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/60 to-navy-950" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">Our Story</p>
          <h1 className="mt-4 font-display text-3xl font-semibold text-white sm:text-5xl">
            Built on trust. Driven by <span className="gold-gradient-text">your future.</span>
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-white/70 sm:text-base">
            Sai Space Realty was founded on a simple belief — that finding the right property should feel
            exciting, not exhausting. For nearly a decade, we&apos;ve guided individuals, families, and
            businesses to spaces that truly fit their future, backed by honest advice and meticulous care.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative h-80 overflow-hidden rounded-3xl sm:h-[420px]">
            <Image
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80"
              alt="Our office"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">Our Mission</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-navy-900">
              Making real estate feel personal again
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-navy-900/60">
              In a market crowded with listings and noise, we act as a trusted filter — surfacing only the
              properties that genuinely match what you need, and standing beside you through every visit,
              negotiation, and signature.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-navy-900/60">
              Whether you&apos;re buying your first home, expanding your business footprint, or searching for
              the perfect rental, our advisors bring the same level of care to every engagement — big or small.
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-navy-900/8 bg-white p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900">
                <Icon className="h-6 w-6 text-gold-400" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-navy-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-900/60">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ivory-100 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">The People</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">
            Meet the team
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member) => (
              <div key={member.name} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="relative h-56 w-full">
                  <Image src={member.img} alt={member.name} fill className="object-cover" />
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

      <CTASection />
    </>
  );
}
