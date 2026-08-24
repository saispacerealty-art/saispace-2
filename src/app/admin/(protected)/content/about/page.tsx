import { repo } from "@/lib/repository";
import { PageCopyEditor } from "@/components/admin/PageCopyEditor";
import { ContentListEditor } from "@/components/admin/ContentListEditor";
import type { ValueItem, TeamMember } from "@/lib/types";

export default async function AdminAboutPage() {
  const [copy, values, team] = await Promise.all([
    repo.getPageCopy(),
    repo.listContent("values"),
    repo.listContent("team"),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900">About Page</h1>
      <p className="mt-1 text-sm text-navy-900/60">
        Edit the story, mission, values and team shown on your About Us page.
      </p>

      <div className="mt-6 max-w-3xl space-y-8">
        <PageCopyEditor
          copy={copy}
          title="Hero Section"
          fields={[
            { key: "aboutHeroEyebrow", label: "Eyebrow Text" },
            { key: "aboutHeroTitle", label: "Title (before accent)" },
            { key: "aboutHeroAccent", label: "Accent Phrase (gold text)" },
            { key: "aboutHeroText", label: "Paragraph", type: "textarea" },
          ]}
        />

        <PageCopyEditor
          copy={copy}
          title="Our Mission"
          fields={[
            { key: "aboutMissionEyebrow", label: "Eyebrow Text" },
            { key: "aboutMissionTitle", label: "Title" },
            { key: "aboutMissionParagraph1", label: "Paragraph 1", type: "textarea" },
            { key: "aboutMissionParagraph2", label: "Paragraph 2", type: "textarea" },
          ]}
        />

        <ContentListEditor<ValueItem>
          section="values"
          title="Our Values"
          fields={[
            { key: "icon", label: "Icon", type: "icon" },
            { key: "title", label: "Title", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
          ]}
          initialItems={values}
          emptyItem={{ icon: "Target", title: "New Value", description: "" }}
        />

        <ContentListEditor<TeamMember>
          section="team"
          title="Team"
          fields={[
            { key: "name", label: "Name", type: "text" },
            { key: "role", label: "Role", type: "text" },
            { key: "photo", label: "Photo URL", type: "image" },
          ]}
          initialItems={team}
          emptyItem={{ name: "New Member", role: "", photo: "" }}
        />
      </div>
    </div>
  );
}
