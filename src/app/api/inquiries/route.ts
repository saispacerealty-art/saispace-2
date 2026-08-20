import { NextRequest, NextResponse } from "next/server";
import { repo } from "@/lib/repository";
import { isAdminRequest } from "@/lib/require-admin";

export async function GET(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const inquiries = await repo.listInquiries();
  return NextResponse.json(inquiries);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body?.name || !body?.phone) {
    return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
  }

  const inquiry = await repo.createInquiry({
    name: body.name,
    email: body.email ?? "",
    phone: body.phone,
    message: body.message ?? "",
    propertyId: body.propertyId,
    propertyTitle: body.propertyTitle,
  });

  return NextResponse.json(inquiry, { status: 201 });
}
