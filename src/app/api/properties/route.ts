import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { repo } from "@/lib/repository";
import { isAdminRequest } from "@/lib/require-admin";
import { apiError, apiErrorFromException } from "@/lib/api-errors";

export async function GET() {
  try {
    const properties = await repo.listProperties();
    return NextResponse.json(properties);
  } catch (err) {
    return apiErrorFromException(err, "GET /api/properties");
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return apiError("UNAUTHORIZED", "You must be signed in as an admin.", 401);
  }

  try {
    const body = await req.json();

    if (!body?.title || typeof body.title !== "string") {
      return apiError("VALIDATION_ERROR", "Title is required.", 400);
    }

    const property = await repo.createProperty({
      title: body.title,
      slug: body.slug ?? "",
      type: body.type ?? "Residential",
      status: body.status ?? "For Sale",
      price: Number(body.price) || 0,
      priceUnit: body.priceUnit === "month" ? "month" : "total",
      city: body.city ?? "",
      locality: body.locality ?? "",
      address: body.address ?? "",
      bedrooms: Number(body.bedrooms) || 0,
      bathrooms: Number(body.bathrooms) || 0,
      areaSqft: Number(body.areaSqft) || 0,
      description: body.description ?? "",
      features: Array.isArray(body.features) ? body.features : [],
      images: Array.isArray(body.images) ? body.images : [],
      featured: Boolean(body.featured),
    });

    revalidatePath("/");
    revalidatePath("/properties");

    return NextResponse.json(property, { status: 201 });
  } catch (err) {
    return apiErrorFromException(err, "POST /api/properties");
  }
}
