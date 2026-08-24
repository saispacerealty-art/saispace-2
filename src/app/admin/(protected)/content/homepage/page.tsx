import { repo } from "@/lib/repository";
import { PageCopyEditor } from "@/components/admin/PageCopyEditor";
import { ContentListEditor } from "@/components/admin/ContentListEditor";
import type { Testimonial, WhyChooseUsPoint, PropertyTypeCard } from "@/lib/types";

export default async function AdminHomepagePage() {
  const [copy, whyChooseUs, testimonials, propertyTypes] = await Promise.all([
    repo.getPageCopy(),
    repo.listContent("whyChooseUs"),
    repo.listContent("testimonials"),
    repo.listContent("propertyTypes"),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900">Homepage</h1>
      <p className="mt-1 text-sm text-navy-900/60">
        Edit the hero copy, category cards, feature highlights and testimonials shown on your homepage.
      </p>

      <div className="mt-6 max-w-3xl space-y-8">
        <p className="rounded-xl border border-navy-900/8 bg-ivory-50 px-4 py-3 text-sm text-navy-900/60">
          The hero headline, eyebrow and subcopy are edited from Site Content → General Settings, under
          &quot;Homepage Hero&quot;.
        </p>

        <PageCopyEditor
          copy={copy}
          title="Call-to-Action Banner"
          description="Shown near the bottom of the Home, About and Services pages."
          fields={[
            { key: "ctaEyebrow", label: "Eyebrow Text" },
            { key: "ctaTitle", label: "Title" },
            { key: "ctaSubcopy", label: "Subcopy", type: "textarea" },
            { key: "ctaPrimaryLabel", label: "Primary Button Label" },
            { key: "ctaSecondaryLabel", label: "Secondary Button Label" },
          ]}
        />

        <ContentListEditor<PropertyTypeCard>
          section="propertyTypes"
          title="Browse by Category cards"
          description="The property-type cards shown on the homepage and reused in the footer."
          fields={[
            { key: "label", label: "Label", type: "text" },
            {
              key: "type",
              label: "Property Type",
              type: "select",
              options: ["Residential", "Commercial", "Plot", "Villa", "Apartment"],
            },
            { key: "image", label: "Image URL", type: "image" },
          ]}
          initialItems={propertyTypes}
          emptyItem={{ label: "New Category", type: "Apartment", image: "" }}
        />

        <ContentListEditor<WhyChooseUsPoint>
          section="whyChooseUs"
          title="Why Choose Us"
          fields={[
            { key: "icon", label: "Icon", type: "icon" },
            { key: "title", label: "Title", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
          ]}
          initialItems={whyChooseUs}
          emptyItem={{ icon: "Building2", title: "New Point", description: "" }}
        />

        <ContentListEditor<Testimonial>
          section="testimonials"
          title="Testimonials"
          fields={[
            { key: "name", label: "Name", type: "text" },
            { key: "role", label: "Role / Context", type: "text" },
            { key: "quote", label: "Quote", type: "textarea" },
          ]}
          initialItems={testimonials}
          emptyItem={{ name: "New Client", role: "", quote: "" }}
        />
      </div>
    </div>
  );
}
