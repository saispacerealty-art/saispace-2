import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { repo } from "@/lib/repository";
import { isAdminRequest } from "@/lib/require-admin";
import { apiError, apiErrorFromException } from "@/lib/api-errors";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const property = await repo.getProperty(id);
    if (!property) return apiError("NOT_FOUND", "Property not found.", 404);
    return NextResponse.json(property);
  } catch (err) {
    return apiErrorFromException(err, `GET /api/properties/${id}`);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(req))) {
    return apiError("UNAUTHORIZED", "You must be signed in as an admin.", 401);
  }
  const { id } = await params;
  try {
    const body = await req.json();
    const updated = await repo.updateProperty(id, {
      ...body,
      price: body.price !== undefined ? Number(body.price) : undefined,
      bedrooms: body.bedrooms !== undefined ? Number(body.bedrooms) : undefined,
      bathrooms: body.bathrooms !== undefined ? Number(body.bathrooms) : undefined,
      areaSqft: body.areaSqft !== undefined ? Number(body.areaSqft) : undefined,
    });
    if (!updated) return apiError("NOT_FOUND", "Property not found.", 404);

    revalidatePath("/");
    revalidatePath("/properties");
    revalidatePath("/properties/[slug]", "page");

    return NextResponse.json(updated);
  } catch (err) {
    return apiErrorFromException(err, `PUT /api/properties/${id}`);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(req))) {
    return apiError("UNAUTHORIZED", "You must be signed in as an admin.", 401);
  }
  const { id } = await params;
  try {
    const ok = await repo.deleteProperty(id);
    if (!ok) return apiError("NOT_FOUND", "Property not found.", 404);

    revalidatePath("/");
    revalidatePath("/properties");
    revalidatePath("/properties/[slug]", "page");

    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiErrorFromException(err, `DELETE /api/properties/${id}`);
  }
}
