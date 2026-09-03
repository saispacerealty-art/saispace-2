import { repo } from "@/lib/repository";
import { PageCopyEditor } from "@/components/admin/PageCopyEditor";
import { ContentListEditor } from "@/components/admin/ContentListEditor";
import type { ReferralStep } from "@/lib/types";

export default async function AdminReferralPagePage() {
  const [copy, steps] = await Promise.all([repo.getPageCopy(), repo.listContent("referralSteps")]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900">Referral Page</h1>
      <p className="mt-1 text-sm text-navy-900/60">
        Edit the hero copy and the &quot;how it works&quot; steps on the Refer &amp; Earn page.
      </p>
      <p className="mt-3 rounded-xl border border-navy-900/8 bg-ivory-50 px-4 py-3 text-sm text-navy-900/60">
        Looking for submitted referral leads instead? Go to Communication → Referrals.
      </p>

      <div className="mt-6 max-w-3xl space-y-8">
        <PageCopyEditor
          copy={copy}
          title="Hero Section"
          fields={[
            { key: "referHeroEyebrow", label: "Eyebrow Text" },
            { key: "referHeroTitle", label: "Title" },
            { key: "referHeroText", label: "Subcopy", type: "textarea" },
          ]}
        />

        <ContentListEditor<ReferralStep>
          section="referralSteps"
          title="How It Works"
          description="The 3-step process cards shown on the Refer & Earn page."
          fields={[
            { key: "icon", label: "Icon", type: "icon" },
            { key: "title", label: "Title", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
          ]}
          initialItems={steps}
          emptyItem={{ icon: "Share2", title: "New Step", description: "" }}
        />
      </div>
    </div>
  );
}
