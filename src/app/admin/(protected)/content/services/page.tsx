import { repo } from "@/lib/repository";
import { PageCopyEditor } from "@/components/admin/PageCopyEditor";
import { ContentListEditor } from "@/components/admin/ContentListEditor";
import type { ServiceItem } from "@/lib/types";

export default async function AdminServicesPage() {
  const [copy, services] = await Promise.all([repo.getPageCopy(), repo.listContent("services")]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900">Services Page</h1>
      <p className="mt-1 text-sm text-navy-900/60">Edit the hero copy and service offerings list.</p>

      <div className="mt-6 max-w-3xl space-y-8">
        <PageCopyEditor
          copy={copy}
          title="Hero Section"
          fields={[
            { key: "servicesHeroEyebrow", label: "Eyebrow Text" },
            { key: "servicesHeroTitle", label: "Title" },
            { key: "servicesHeroText", label: "Subcopy", type: "textarea" },
          ]}
        />

        <ContentListEditor<ServiceItem>
          section="services"
          title="Services"
          fields={[
            { key: "icon", label: "Icon", type: "icon" },
            { key: "title", label: "Title", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "points", label: "Bullet Points", type: "list" },
          ]}
          initialItems={services}
          emptyItem={{ icon: "Home", title: "New Service", description: "", points: [] }}
        />
      </div>
    </div>
  );
}
