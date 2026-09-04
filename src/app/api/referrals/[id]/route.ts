import { NextRequest, NextResponse } from "next/server";
import { repo } from "@/lib/repository";
import { isAdminRequest } from "@/lib/require-admin";
import { apiError, apiErrorFromException } from "@/lib/api-errors";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(req))) {
    return apiError("UNAUTHORIZED", "You must be signed in as an admin.", 401);
  }
  const { id } = await params;
  try {
    const body = await req.json();
    const updated = await repo.updateReferral(id, body);
    if (!updated) return apiError("NOT_FOUND", "Referral not found.", 404);
    return NextResponse.json(updated);
  } catch (err) {
    return apiErrorFromException(err, `PATCH /api/referrals/${id}`);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(req))) {
    return apiError("UNAUTHORIZED", "You must be signed in as an admin.", 401);
  }
  const { id } = await params;
  try {
    const ok = await repo.deleteReferral(id);
    if (!ok) return apiError("NOT_FOUND", "Referral not found.", 404);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiErrorFromException(err, `DELETE /api/referrals/${id}`);
  }
}
