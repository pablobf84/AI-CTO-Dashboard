import { StatusBadge } from "@/components/ui/status-badge";
import type { PhaseStatus } from "@/types/domain";

export function PhaseStepper({
  phases
}: {
  phases: Array<{
    id: string;
    name: string;
    status: PhaseStatus;
    order_index: number;
  }>;
}) {
  return (
    <ol className="grid gap-3">
      {phases.map((phase) => (
        <li key={phase.id} className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-md bg-muted font-mono text-sm">{phase.order_index}</span>
            <span className="font-medium">{phase.name}</span>
          </div>
          <StatusBadge status={phase.status} />
        </li>
      ))}
    </ol>
  );
}
