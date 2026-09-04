import type { Metadata } from "next";
import { Gift } from "lucide-react";
import { ReferralForm } from "@/components/ReferralForm";
import { repo } from "@/lib/repository";
import { getIcon } from "@/lib/icons";

export const metadata: Metadata = {
  title: "Refer & Earn",
  description: "Refer a friend to Sai Space Realty and earn a reward when their deal closes.",
};

export default async function ReferPage() {
  const [copy, steps, settings] = await Promise.all([
    repo.getPageCopy(),
    repo.listContent("referralSteps"),
    repo.getSettings(),
  ]);

  return (
    <>
      <section className="bg-navy-950 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">{copy.referHeroEyebrow}</p>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl">
            {copy.referHeroTitle}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/60">{copy.referHeroText}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map(({ id, icon, title, description }, i) => {
            const Icon = getIcon(icon);
            return (
              <div key={id} className="relative rounded-2xl border border-navy-900/8 bg-white p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900">
                  <Icon className="h-6 w-6 text-gold-400" />
                </span>
                <p className="mt-4 font-mono text-xs font-semibold text-gold-600">STEP 0{i + 1}</p>
                <h3 className="mt-1 font-display text-lg font-semibold text-navy-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-900/60">{description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-ivory-100 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-2xl border border-navy-900/8 bg-white p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-500/15">
                <Gift className="h-5 w-5 text-gold-600" />
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold text-navy-900">Submit a referral</h2>
                <p className="mt-0.5 text-sm text-navy-900/60">
                  You&apos;ll get a unique referral code the moment you submit.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <ReferralForm whatsapp={settings.whatsapp} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
