import { IntakeForm } from "@/components/intake/intake-form";
import { getProject } from "@/lib/db/queries";

export default async function IntakePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const { project, brief } = await getProject(projectId);

  return (
    <section className="mx-auto max-w-3xl">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h1 className="text-3xl font-semibold">Intake for {project.name}</h1>
        <p className="mt-2 text-muted-foreground">Complete every field to persist the initial JSONB brief and move the project to intake_ready.</p>
        <div className="mt-7">
          <IntakeForm projectId={project.id} defaultValues={brief?.data} />
        </div>
      </div>
    </section>
  );
}
