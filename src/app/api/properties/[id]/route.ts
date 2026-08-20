import { NextRequest, NextResponse } from "next/server";
import { repo } from "@/lib/repository";
import { isAdminRequest } from "@/lib/require-admin";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await repo.getProperty(id);
  if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(property);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const updated = await repo.updateProperty(id, {
    ...body,
    price: body.price !== undefined ? Number(body.price) : undefined,
    bedrooms: body.bedrooms !== undefined ? Number(body.bedrooms) : undefined,
    bathrooms: body.bathrooms !== undefined ? Number(body.bathrooms) : undefined,
    areaSqft: body.areaSqft !== undefined ? Number(body.areaSqft) : undefined,
  });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const ok = await repo.deleteProperty(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
