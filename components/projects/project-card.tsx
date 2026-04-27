import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";
import type { ProjectStatus } from "@/types/domain";

export function ProjectCard({
  project
}: {
  project: {
    id: string;
    name: string;
    description: string | null;
    status: ProjectStatus;
    created_at: string;
  };
}) {
  return (
    <Link href={`/app/projects/${project.id}`} className="group block rounded-lg border border-border bg-card p-5 shadow-sm transition hover:border-primary/50">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{project.name}</h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{project.description || "No description yet."}</p>
        </div>
        <StatusBadge status={project.status} />
      </div>
      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="font-mono text-muted-foreground">{new Date(project.created_at).toLocaleDateString()}</span>
        <span className="inline-flex items-center gap-1 font-medium text-primary">
          Open <ArrowRight className="transition group-hover:translate-x-0.5" size={16} />
        </span>
      </div>
    </Link>
  );
}
