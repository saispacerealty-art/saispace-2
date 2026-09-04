import { NextRequest, NextResponse } from "next/server";
import { repo } from "@/lib/repository";
import { isAdminRequest } from "@/lib/require-admin";
import { apiError, apiErrorFromException } from "@/lib/api-errors";

export async function GET(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return apiError("UNAUTHORIZED", "You must be signed in as an admin.", 401);
  }
  try {
    const inquiries = await repo.listInquiries();
    return NextResponse.json(inquiries);
  } catch (err) {
    return apiErrorFromException(err, "GET /api/inquiries");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.name || !body?.phone) {
      return apiError("VALIDATION_ERROR", "Name and phone are required.", 400);
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
  } catch (err) {
    return apiErrorFromException(err, "POST /api/inquiries");
  }
}
