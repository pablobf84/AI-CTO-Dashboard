import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { PhaseStepper } from "@/components/projects/phase-stepper";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { getProject } from "@/lib/db/queries";

export default async function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const { project, phases, brief } = await getProject(projectId);

  return (
    <section className="grid gap-8">
      <PageHeader
        title={project.name}
        description={project.description ?? "Project dashboard for Sprint 1 execution state."}
        actions={
          <Button asChild href={`/app/projects/${project.id}/intake`} variant="secondary">
            Edit intake
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Overview</h2>
            <StatusBadge status={project.status} />
          </div>
          <dl className="mt-6 grid gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Organization project id</dt>
              <dd className="mt-1 font-mono">{project.id}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Last updated</dt>
              <dd className="mt-1">{new Date(project.updated_at).toLocaleString()}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Phase progress</h2>
          <div className="mt-5">
            <PhaseStepper phases={phases} />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Project brief</h2>
          {!brief ? (
            <Link className="text-sm font-medium text-primary" href={`/app/projects/${project.id}/intake`}>
              Complete intake
            </Link>
          ) : null}
        </div>
        {brief ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {Object.entries(brief.data).map(([key, value]) => (
              <div key={key} className="rounded-md border border-border bg-background p-4">
                <h3 className="text-sm font-semibold capitalize">{key.replaceAll("_", " ")}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{value}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-muted-foreground">No brief has been saved for this project yet.</p>
        )}
      </div>
    </section>
  );
}
