import { redirect } from "next/navigation";

import { CreateOrganizationForm } from "@/components/organizations/create-organization-form";
import { getActiveOrganization } from "@/lib/db/queries";

export default async function OnboardingPage() {
  const organization = await getActiveOrganization();

  if (organization) {
    redirect("/app/projects");
  }

  return (
    <section className="mx-auto max-w-xl">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h1 className="text-3xl font-semibold">Create your organization</h1>
        <p className="mt-2 text-muted-foreground">Sprint 1 uses organization membership as the tenant boundary for every project.</p>
        <div className="mt-7">
          <CreateOrganizationForm />
        </div>
      </div>
    </section>
  );
}
