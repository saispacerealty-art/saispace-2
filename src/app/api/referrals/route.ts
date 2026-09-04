import { NextRequest, NextResponse } from "next/server";
import { repo } from "@/lib/repository";
import { isAdminRequest } from "@/lib/require-admin";
import { apiError, apiErrorFromException } from "@/lib/api-errors";

export async function GET(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return apiError("UNAUTHORIZED", "You must be signed in as an admin.", 401);
  }
  try {
    const referrals = await repo.listReferrals();
    return NextResponse.json(referrals);
  } catch (err) {
    return apiErrorFromException(err, "GET /api/referrals");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.referrerName || !body?.referrerPhone || !body?.referredName || !body?.referredPhone) {
      return apiError(
        "VALIDATION_ERROR",
        "Your name, your phone, and the friend's name and phone are required.",
        400
      );
    }

    const referral = await repo.createReferral({
      referrerName: body.referrerName,
      referrerPhone: body.referrerPhone,
      referrerEmail: body.referrerEmail ?? undefined,
      referredName: body.referredName,
      referredPhone: body.referredPhone,
      referredEmail: body.referredEmail ?? undefined,
      message: body.message ?? undefined,
    });

    return NextResponse.json(referral, { status: 201 });
  } catch (err) {
    return apiErrorFromException(err, "POST /api/referrals");
  }
}
