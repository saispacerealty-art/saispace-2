import { repo } from "@/lib/repository";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { PageCopyEditor } from "@/components/admin/PageCopyEditor";

export default async function AdminSettingsPage() {
  const [settings, copy] = await Promise.all([repo.getSettings(), repo.getPageCopy()]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900">General Settings</h1>
      <p className="mt-1 text-sm text-navy-900/60">Update the homepage copy, contact details, and links shown across your site.</p>
      <div className="mt-6 max-w-3xl space-y-8">
        <SettingsForm settings={settings} />
        <PageCopyEditor
          copy={copy}
          title="Contact Page Hero"
          fields={[
            { key: "contactHeroEyebrow", label: "Eyebrow Text" },
            { key: "contactHeroTitle", label: "Title" },
            { key: "contactHeroText", label: "Subcopy", type: "textarea" },
          ]}
        />
      </div>
    </div>
  );
}
