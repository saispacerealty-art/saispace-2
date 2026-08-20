import Link from "next/link";
import { Building2, FolderKanban, HeartHandshake, MessageSquare, PlusCircle, Settings } from "lucide-react";
import { repo } from "@/lib/repository";
import { formatPrice, formatDateTime } from "@/lib/format";

export default async function AdminDashboardPage() {
  const [properties, projects, inquiries, settings] = await Promise.all([
    repo.listProperties(),
    repo.listProjects(),
    repo.listInquiries(),
    repo.getSettings(),
  ]);

  const ongoingProjects = projects.filter((p) => p.status !== "Ready to Move").length;
  const newInquiries = inquiries.filter((i) => i.status === "new").length;

  const stats = [
    { label: "Properties", value: properties.length, icon: Building2, accent: "text-navy-900" },
    { label: "Ongoing Projects", value: ongoingProjects, icon: FolderKanban, accent: "text-gold-600" },
    { label: "Happy Clients", value: settings.happyClients.toLocaleString("en-IN"), icon: HeartHandshake, accent: "text-navy-600" },
    { label: "New Messages", value: newInquiries, icon: MessageSquare, accent: "text-red-500" },
  ];

  const quickActions = [
    { href: "/admin/properties/new", label: "Add Property", icon: PlusCircle, primary: true },
    { href: "/admin/projects/new", label: "Add Project", icon: FolderKanban, primary: false },
    { href: "/admin/blog/new", label: "Add Blog Post", icon: PlusCircle, primary: false },
    { href: "/admin/settings", label: "Edit Site Content", icon: Settings, primary: false },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy-900">Dashboard</h1>
          <p className="mt-1 text-sm text-navy-900/60">Here&apos;s what&apos;s happening with your listings.</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
        >
          <PlusCircle className="h-4 w-4" /> Add Property
        </Link>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, accent }, i) => (
          <div
            key={label}
            style={{ animationDelay: `${i * 60}ms` }}
            className="animate-fade-up rounded-2xl border border-navy-900/8 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-900/50">{label}</p>
              <Icon className={`h-4 w-4 ${accent}`} />
            </div>
            <p className="mt-3 font-display text-3xl font-semibold text-navy-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-navy-900/8 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-navy-900">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {quickActions.map(({ href, label, icon: Icon, primary }) => (
            <Link
              key={href}
              href={href}
              className={
                primary
                  ? "flex items-center gap-2 rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
                  : "flex items-center gap-2 rounded-xl border border-navy-900/10 px-4 py-2.5 text-sm font-semibold text-navy-900 hover:bg-navy-900/5"
              }
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-navy-900/8 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-navy-900">Recent Messages</h2>
            <Link href="/admin/messages" className="text-xs font-semibold text-gold-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 divide-y divide-navy-900/6">
            {inquiries.slice(0, 5).map((i) => (
              <div key={i.id} className="flex items-start justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-semibold text-navy-900">{i.name}</p>
                  <p className="text-xs text-navy-900/50">{i.propertyTitle ?? "General inquiry"}</p>
                  <p className="mt-0.5 text-xs text-navy-900/40">{formatDateTime(i.createdAt)}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
                    i.status === "new"
                      ? "bg-red-50 text-red-600"
                      : i.status === "contacted"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {i.status}
                </span>
              </div>
            ))}
            {inquiries.length === 0 && <p className="py-6 text-center text-sm text-navy-900/40">No messages yet</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-navy-900/8 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-navy-900">Recent Properties</h2>
            <Link href="/admin/properties" className="text-xs font-semibold text-gold-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 divide-y divide-navy-900/6">
            {properties.slice(0, 5).map((p) => (
              <Link
                key={p.id}
                href={`/admin/properties/${p.id}/edit`}
                className="flex items-center justify-between gap-3 py-3 hover:opacity-70"
              >
                <div>
                  <p className="text-sm font-semibold text-navy-900">{p.title}</p>
                  <p className="text-xs text-navy-900/50">{p.city} · {p.type}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-navy-900">
                  {formatPrice(p.price, p.priceUnit)}
                </span>
              </Link>
            ))}
            {properties.length === 0 && <p className="py-6 text-center text-sm text-navy-900/40">No properties yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
