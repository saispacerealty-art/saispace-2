import { repo } from "@/lib/repository";
import { ContentListEditor } from "@/components/admin/ContentListEditor";
import type { NavLink } from "@/lib/types";

export default async function AdminNavigationPage() {
  const navLinks = await repo.listContent("navLinks");

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900">Navigation</h1>
      <p className="mt-1 text-sm text-navy-900/60">
        Edit the links shown in the header menu and the footer &quot;Explore&quot; column.
      </p>

      <div className="mt-6 max-w-3xl">
        <ContentListEditor<NavLink>
          section="navLinks"
          title="Nav Links"
          description="Use paths starting with / (e.g. /properties) or full URLs."
          fields={[
            { key: "label", label: "Label", type: "text" },
            { key: "href", label: "Link", type: "text" },
          ]}
          initialItems={navLinks}
          emptyItem={{ label: "New Link", href: "/" }}
        />
      </div>
    </div>
  );
}
