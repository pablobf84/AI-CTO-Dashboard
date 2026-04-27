import { Plus } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { listProjects } from "@/lib/db/queries";

export default async function ProjectsPage() {
  const { projects } = await listProjects();

  return (
    <section className="grid gap-8">
      <PageHeader
        title="Projects"
        description="Every project belongs to the active organization and is protected by membership-based RLS."
        actions={
          <Button asChild href="/app/projects/new">
            <Plus size={18} />
            New project
          </Button>
        }
      />

      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-8">
          <h2 className="text-xl font-semibold">No projects yet</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">Create the first project, then complete the structured intake to persist the initial brief.</p>
          <Button asChild href="/app/projects/new" className="mt-5">
            Create project
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
