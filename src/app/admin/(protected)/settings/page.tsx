import { repo } from "@/lib/repository";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await repo.getSettings();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900">Site Content</h1>
      <p className="mt-1 text-sm text-navy-900/60">Update the homepage copy, contact details, and links shown across your site.</p>
      <div className="mt-6 max-w-3xl">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
