import { repo } from "@/lib/repository";
import { ReferralsTable } from "@/components/admin/ReferralsTable";

export default async function AdminReferralsPage() {
  const referrals = await repo.listReferrals();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900">Referrals</h1>
      <p className="mt-1 text-sm text-navy-900/60">{referrals.length} referrals submitted so far.</p>
      <div className="mt-6">
        <ReferralsTable referrals={referrals} />
      </div>
    </div>
  );
}
