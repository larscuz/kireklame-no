"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

type AllowedStatus = "pending" | "approved" | "rejected";

function isAllowedStatus(v: string): v is AllowedStatus {
  return v === "pending" || v === "approved" || v === "rejected";
}

export async function setSubmissionStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? "").trim();

  if (!id) {
    throw new Error("Mangler submission id");
  }
  if (!isAllowedStatus(statusRaw)) {
    throw new Error("Ugyldig status");
  }

  const db = supabaseAdmin();

  const { error } = await db
    .from("submissions")
    .update({ status: statusRaw })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  // Oppdater siden etter submit
  revalidatePath("/admin/moderate");
}
