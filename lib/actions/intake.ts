"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireActiveOrganization } from "@/lib/db/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseFormData } from "@/lib/validations/form";
import { intakeSchema } from "@/lib/validations/schemas";
import type { ActionState, IntakeData } from "@/types/domain";

export async function saveIntakeAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const organization = await requireActiveOrganization();
  const projectId = formData.get("project_id");

  if (typeof projectId !== "string" || projectId.length === 0) {
    return {
      status: "error",
      message: "Project id is required."
    };
  }

  const parsed = parseFormData(intakeSchema, formData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Complete all intake fields before saving.",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("org_id", organization.id)
    .maybeSingle();

  if (projectError) {
    return {
      status: "error",
      message: projectError.message
    };
  }

  if (!project) {
    return {
      status: "error",
      message: "Project not found for the active organization."
    };
  }

  const data: IntakeData = parsed.data;
  const { error: briefError } = await supabase.from("project_briefs").upsert(
    {
      project_id: project.id,
      data,
      updated_at: new Date().toISOString()
    },
    {
      onConflict: "project_id"
    }
  );

  if (briefError) {
    return {
      status: "error",
      message: briefError.message
    };
  }

  const { error: statusError } = await supabase
    .from("projects")
    .update({ status: "intake_ready", updated_at: new Date().toISOString() })
    .eq("id", project.id)
    .eq("org_id", organization.id);

  if (statusError) {
    return {
      status: "error",
      message: statusError.message
    };
  }

  revalidatePath(`/app/projects/${project.id}`);
  redirect(`/app/projects/${project.id}`);
}
