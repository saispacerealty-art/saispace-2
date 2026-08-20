import { repo } from "@/lib/repository";
import { InquiriesTable } from "@/components/admin/InquiriesTable";

export default async function AdminMessagesPage() {
  const inquiries = await repo.listInquiries();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900">Messages</h1>
      <p className="mt-1 text-sm text-navy-900/60">{inquiries.length} leads received so far.</p>
      <div className="mt-6">
        <InquiriesTable inquiries={inquiries} />
      </div>
    </div>
  );
}
