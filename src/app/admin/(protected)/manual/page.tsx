import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  Newspaper,
  Home,
  Users,
  Wrench,
  Briefcase,
  Gift as GiftIcon,
  Compass,
  Settings,
  MessageSquare,
  Image as ImageIcon,
  type LucideIcon,
} from "lucide-react";

type ManualSection = {
  icon: LucideIcon;
  title: string;
  path?: string;
  points: string[];
};

const SECTIONS: ManualSection[] = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    path: "/admin",
    points: [
      "Landing page after login — a quick snapshot of the site.",
      "Use the sidebar (or the menu icon on mobile) to reach every other section.",
    ],
  },
  {
    icon: Building2,
    title: "Properties",
    path: "/admin/properties",
    points: [
      "Click \"Add Property\" to create a new listing — fill in price, location, bedrooms/bathrooms, features and photos, then Save.",
      "Click a row to edit it, or use the delete icon to remove a listing. Deleting cannot be undone.",
      "Mark a listing \"Featured\" to have it highlighted on the homepage.",
    ],
  },
  {
    icon: FolderKanban,
    title: "Projects",
    path: "/admin/projects",
    points: [
      "Same pattern as Properties — add, edit or delete real-estate projects (e.g. under-construction developments).",
    ],
  },
  {
    icon: Newspaper,
    title: "Blog Posts",
    path: "/admin/blog",
    points: [
      "Write and publish articles for the site's blog. Each post needs a title, category, excerpt, cover image and content.",
    ],
  },
  {
    icon: Home,
    title: "Homepage",
    path: "/admin/content/homepage",
    points: [
      "Edit the bottom call-to-action banner text and buttons.",
      "Manage the \"Browse by Category\" cards, the \"Why Choose Us\" points, and client testimonials — click Add to create a new card, edit the fields inline, then Save. Delete removes a card.",
      "The main hero headline is edited from General Settings, not here.",
    ],
  },
  {
    icon: Users,
    title: "About Page",
    path: "/admin/content/about",
    points: [
      "Edit the hero section, the \"Our Mission\" paragraphs, the company Values list, and the Team member list (name, role, photo).",
    ],
  },
  {
    icon: Wrench,
    title: "Services Page",
    path: "/admin/content/services",
    points: ["Edit the hero copy and the list of services offered, each with an icon, title, description and bullet points."],
  },
  {
    icon: Briefcase,
    title: "Careers Page",
    path: "/admin/content/careers",
    points: [
      "Edit the hero copy at the top of the Careers page.",
      "Add, edit or delete job postings under \"Open Roles\" — set the role title, employment type/location, and description. Applicants apply by email automatically.",
      "Deleting a role removes it from the public Careers page immediately.",
    ],
  },
  {
    icon: GiftIcon,
    title: "Referral Page",
    path: "/admin/content/referral",
    points: [
      "Edit the hero copy and the 3-step \"how it works\" cards on the Refer & Earn page.",
      "This only controls the page's content — to view referrals people have actually submitted, go to Communication → Referrals instead.",
    ],
  },
  {
    icon: Compass,
    title: "Navigation",
    path: "/admin/content/navigation",
    points: ["Add, reorder or remove links shown in the site's main navigation menu."],
  },
  {
    icon: Settings,
    title: "General Settings",
    path: "/admin/settings",
    points: [
      "Site name, tagline, contact phone/WhatsApp/email, address and office hours.",
      "Homepage hero headline and social media links.",
    ],
  },
  {
    icon: MessageSquare,
    title: "Messages",
    path: "/admin/messages",
    points: ["Inquiries submitted through contact forms and property pages. Mark them contacted or closed as you follow up."],
  },
  {
    icon: GiftIcon,
    title: "Referrals",
    path: "/admin/referrals",
    points: [
      "Every referral submitted through the Refer & Earn page, with the referrer's and referred friend's details.",
      "Update a referral's status (pending → contacted → rewarded) as you process it.",
    ],
  },
  {
    icon: ImageIcon,
    title: "Uploading Images",
    points: [
      "Any field marked with an image uploader lets you either upload a photo from your device or paste an image URL directly.",
      "Uploaded images are stored automatically — no need to host them elsewhere first.",
    ],
  },
];

export default function AdminManualPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900">User Manual</h1>
      <p className="mt-1 text-sm text-navy-900/60">
        A quick reference for everything you can do in this admin console.
      </p>

      <div className="mt-6 grid gap-4 max-w-3xl">
        {SECTIONS.map(({ icon: Icon, title, path, points }) => (
          <section key={title} className="rounded-2xl border border-navy-900/8 bg-white p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-900">
                <Icon className="h-5 w-5 text-gold-400" />
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold text-navy-900">{title}</h2>
                {path && <p className="font-mono text-xs text-navy-900/40">{path}</p>}
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {points.map((point) => (
                <li key={point} className="flex gap-2 text-sm leading-relaxed text-navy-900/70">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-500" />
                  {point}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
