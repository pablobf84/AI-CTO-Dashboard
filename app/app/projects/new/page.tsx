import { CreateProjectForm } from "@/components/projects/create-project-form";

export default function NewProjectPage() {
  return (
    <section className="mx-auto max-w-2xl">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h1 className="text-3xl font-semibold">Create project</h1>
        <p className="mt-2 text-muted-foreground">The system will create default PRD, Architecture and Backlog phases automatically.</p>
        <div className="mt-7">
          <CreateProjectForm />
        </div>
      </div>
    </section>
  );
}
