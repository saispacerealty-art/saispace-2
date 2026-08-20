import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { repo } from "@/lib/repository";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await repo.getSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton phone={settings.whatsapp} />
    </div>
  );
}
