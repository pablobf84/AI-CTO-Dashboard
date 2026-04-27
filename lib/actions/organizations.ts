"use server";

import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseFormData } from "@/lib/validations/form";
import { createOrganizationSchema } from "@/lib/validations/schemas";
import type { ActionState } from "@/types/domain";

export async function createOrganizationAction(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser();

  const parsed = parseFormData(createOrganizationSchema, formData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the organization fields.",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("create_organization_with_owner", {
    organization_name: parsed.data.name,
    organization_slug: parsed.data.slug
  });

  if (error) {
    const duplicateSlug = error.message.toLowerCase().includes("duplicate") || error.code === "23505";

    return {
      status: "error",
      message: duplicateSlug ? "That organization slug is already taken." : error.message
    };
  }

  redirect("/app/projects");
}
