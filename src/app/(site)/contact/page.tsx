import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { repo } from "@/lib/repository";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Sai Space Realty for expert real estate advisory and property listings.",
};

export default async function ContactPage() {
  const settings = await repo.getSettings();

  const cards = [
    { icon: MapPin, label: "Visit Us", value: settings.address },
    { icon: Phone, label: "Call Us", value: settings.phone, href: `tel:${settings.phone}` },
    { icon: Mail, label: "Email Us", value: settings.email, href: `mailto:${settings.email}` },
    { icon: Clock, label: "Office Hours", value: settings.officeHours },
  ];

  return (
    <>
      <section className="bg-navy-950 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">Get in Touch</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
            We&apos;d love to hear from you
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/60">
            Whether you have a property in mind or just want to explore your options, our team is one message away.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: Icon, label, value, href }) => {
            const content = (
              <div className="h-full rounded-2xl border border-navy-900/8 bg-white p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900">
                  <Icon className="h-5 w-5 text-gold-400" />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-gold-600">{label}</p>
                <p className="mt-1.5 text-sm text-navy-900/70">{value}</p>
              </div>
            );
            return href ? (
              <a key={label} href={href}>{content}</a>
            ) : (
              <div key={label}>{content}</div>
            );
          })}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <div className="rounded-2xl border border-navy-900/8 bg-white p-8 lg:col-span-2">
            <h2 className="font-display text-xl font-semibold text-navy-900">Send us a message</h2>
            <p className="mt-1 text-sm text-navy-900/60">
              Fill in your details and we&apos;ll get back to you within one business day.
            </p>
            <div className="mt-6">
              <InquiryForm />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-navy-900/8 lg:col-span-3">
            <iframe
              title="Office location map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`}
              className="h-full min-h-[420px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
