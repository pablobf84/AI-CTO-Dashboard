import { notFound, redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getActiveOrganization() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("organization_memberships")
    .select(
      `
        *,
        organizations (*)
      `
    )
    .eq("profile_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  const organization = data?.organizations;

  if (!organization) {
    return null;
  }

  return {
    ...organization,
    role: data.role
  };
}

export async function requireActiveOrganization() {
  const organization = await getActiveOrganization();

  if (!organization) {
    redirect("/app/onboarding");
  }

  return organization;
}

export async function listProjects() {
  const organization = await requireActiveOrganization();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("projects")
    .select("id, name, description, status, created_at, updated_at")
    .eq("org_id", organization.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return {
    organization,
    projects: data ?? []
  };
}

export async function getProject(projectId: string) {
  const organization = await requireActiveOrganization();
  const supabase = await createSupabaseServerClient();

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, org_id, name, description, status, created_at, updated_at")
    .eq("id", projectId)
    .eq("org_id", organization.id)
    .maybeSingle();

  if (projectError) {
    throw new Error(projectError.message);
  }

  if (!project) {
    notFound();
  }

  const [{ data: phases, error: phasesError }, { data: brief, error: briefError }] = await Promise.all([
    supabase
      .from("project_phases")
      .select("id, project_id, name, status, order_index, created_at")
      .eq("project_id", project.id)
      .order("order_index", { ascending: true }),
    supabase.from("project_briefs").select("id, project_id, data, created_at, updated_at").eq("project_id", project.id).maybeSingle()
  ]);

  if (phasesError) {
    throw new Error(phasesError.message);
  }

  if (briefError) {
    throw new Error(briefError.message);
  }

  return {
    organization,
    project,
    phases: phases ?? [],
    brief
  };
}
