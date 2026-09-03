import { repo } from "@/lib/repository";
import { PageCopyEditor } from "@/components/admin/PageCopyEditor";
import { ContentListEditor } from "@/components/admin/ContentListEditor";
import type { CareerRole } from "@/lib/types";

export default async function AdminCareersPage() {
  const [copy, roles] = await Promise.all([repo.getPageCopy(), repo.listContent("careerRoles")]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900">Careers Page</h1>
      <p className="mt-1 text-sm text-navy-900/60">Edit the hero copy and manage open job postings.</p>

      <div className="mt-6 max-w-3xl space-y-8">
        <PageCopyEditor
          copy={copy}
          title="Hero Section"
          fields={[
            { key: "careersHeroEyebrow", label: "Eyebrow Text" },
            { key: "careersHeroTitle", label: "Title" },
            { key: "careersHeroText", label: "Subcopy", type: "textarea" },
          ]}
        />

        <ContentListEditor<CareerRole>
          section="careerRoles"
          title="Open Roles"
          description="Job postings shown under 'Current openings' on the Careers page."
          fields={[
            { key: "title", label: "Role Title", type: "text" },
            { key: "type", label: "Employment Type / Location", type: "text", placeholder: "Full-time · Pune" },
            { key: "description", label: "Description", type: "textarea" },
          ]}
          initialItems={roles}
          emptyItem={{ title: "New Role", type: "Full-time · Pune", description: "" }}
        />
      </div>
    </div>
  );
}
