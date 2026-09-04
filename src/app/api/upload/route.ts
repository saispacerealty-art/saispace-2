import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { isAdminRequest } from "@/lib/require-admin";
import { getSupabase } from "@/lib/supabase";
import { apiError, apiErrorFromException } from "@/lib/api-errors";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const STORAGE_BUCKET = "uploads";
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return apiError("UNAUTHORIZED", "You must be signed in as an admin.", 401);
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return apiError("NO_FILE_PROVIDED", "No file was included in the upload.", 400);
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return apiError(
      "UNSUPPORTED_FILE_TYPE",
      `"${file.type || "unknown"}" isn't supported. Use JPEG, PNG, WebP, or AVIF.`,
      400
    );
  }
  if (file.size > MAX_SIZE) {
    return apiError("FILE_TOO_LARGE", "File exceeds the 5MB limit.", 400);
  }

  const ext = file.type.split("/")[1];
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Local disk is fine for `next dev` but is read-only/ephemeral on most
    // production hosts, so uploads go to Supabase Storage whenever it's
    // configured — matching the DataRepository fallback in src/lib/repository.ts.
    if (supabaseConfigured) {
      const { error } = await getSupabase()
        .storage.from(STORAGE_BUCKET)
        .upload(filename, buffer, { contentType: file.type });
      if (error) {
        return apiError("STORAGE_ERROR", error.message, 500);
      }
      const {
        data: { publicUrl },
      } = getSupabase().storage.from(STORAGE_BUCKET).getPublicUrl(filename);
      return NextResponse.json({ url: publicUrl }, { status: 201 });
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
  } catch (err) {
    return apiErrorFromException(err, "POST /api/upload");
  }
}
