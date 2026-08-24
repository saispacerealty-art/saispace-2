import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { repo } from "@/lib/repository";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, navLinks, propertyTypes] = await Promise.all([
    repo.getSettings(),
    repo.listContent("navLinks"),
    repo.listContent("propertyTypes"),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header settings={settings} navLinks={navLinks} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} navLinks={navLinks} propertyTypes={propertyTypes} />
      <WhatsAppButton phone={settings.whatsapp} />
    </div>
  );
}
