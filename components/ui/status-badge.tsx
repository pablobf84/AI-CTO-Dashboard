import { cn } from "@/lib/utils";
import type { ProjectStatus, PhaseStatus } from "@/types/domain";

const statusLabels: Record<ProjectStatus | PhaseStatus, string> = {
  active: "Active",
  archived: "Archived",
  architecture_pending: "Architecture pending",
  approved: "Approved",
  draft: "Draft",
  in_progress: "In progress",
  intake_ready: "Intake ready",
  locked: "Locked",
  pending: "Pending",
  prd_pending: "PRD pending",
  ready_for_approval: "Ready for approval"
};

export function StatusBadge({ status }: { status: ProjectStatus | PhaseStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium",
        status === "active" || status === "approved"
          ? "border-primary/30 bg-primary/10 text-primary"
          : status === "archived" || status === "locked"
            ? "border-border bg-muted text-muted-foreground"
            : "border-accent/30 bg-accent/10 text-accent"
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
