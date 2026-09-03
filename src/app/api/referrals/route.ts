import { NextRequest, NextResponse } from "next/server";
import { repo } from "@/lib/repository";
import { isAdminRequest } from "@/lib/require-admin";

export async function GET(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const referrals = await repo.listReferrals();
  return NextResponse.json(referrals);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body?.referrerName || !body?.referrerPhone || !body?.referredName || !body?.referredPhone) {
    return NextResponse.json(
      { error: "Your name, your phone, and the friend's name and phone are required" },
      { status: 400 }
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
}
