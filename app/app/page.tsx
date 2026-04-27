import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { listProjects } from "@/lib/db/queries";

export default async function AppHomePage() {
  const { organization, projects } = await listProjects();

  if (projects.length === 0) {
    redirect("/app/projects");
  }

  return (
    <section className="grid gap-8">
      <PageHeader
        title={`${organization.name} dashboard`}
        description="Track the projects currently moving from idea intake into technical execution."
        actions={
          <Button asChild href="/app/projects/new">
            New project
          </Button>
        }
      />
      <div className="grid gap-4 rounded-lg border border-border bg-card p-6">
        <p className="font-mono text-sm uppercase tracking-[0.18em] text-muted-foreground">Active organization</p>
        <h2 className="text-2xl font-semibold">{organization.name}</h2>
        <p className="text-muted-foreground">{projects.length} project{projects.length === 1 ? "" : "s"} available.</p>
      </div>
    </section>
  );
}
