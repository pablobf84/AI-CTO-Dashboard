"use server";

import { redirect } from "next/navigation";

import { requireActiveOrganization } from "@/lib/db/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseFormData } from "@/lib/validations/form";
import { createProjectSchema } from "@/lib/validations/schemas";
import type { ActionState } from "@/types/domain";

export async function createProjectAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const organization = await requireActiveOrganization();
  const parsed = parseFormData(createProjectSchema, formData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the project fields.",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data: projectId, error } = await supabase.rpc("create_project_with_default_phases", {
    target_org_id: organization.id,
    project_name: parsed.data.name,
    project_description: parsed.data.description || null
  });

  if (error || !projectId) {
    return {
      status: "error",
      message: error?.message ?? "Project could not be created."
    };
  }

  redirect(`/app/projects/${projectId}/intake`);
}
