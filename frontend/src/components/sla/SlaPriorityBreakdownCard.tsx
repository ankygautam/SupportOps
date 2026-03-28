import { Badge } from "@/components/ui/Badge";
import { InfoCard } from "@/components/ui/InfoCard";
import type { SlaQueueRow } from "@/lib/sla";
import type { TicketPriority } from "@/types/models";

interface SlaPriorityBreakdownCardProps {
  rows: SlaQueueRow[];
}

const priorities: TicketPriority[] = ["Critical", "High", "Medium", "Low"];

export function SlaPriorityBreakdownCard({ rows }: SlaPriorityBreakdownCardProps) {
  const total = rows.length || 1;

  return (
    <InfoCard
      title="SLA Breakdown by Priority"
      description="Higher priority queues consume more aggressive response and resolution targets."
    >
      <div className="mt-5 space-y-4">
        {priorities.map((priority) => {
          const count = rows.filter((row) => row.priority === priority).length;
          const breached = rows.filter((row) => row.priority === priority && row.currentState === "Breached").length;
          return (
            <div key={priority}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <p className="font-medium text-slate-700">{priority}</p>
                <div className="flex items-center gap-2">
                  {breached ? <Badge tone="danger">{breached} breached</Badge> : null}
                  <span className="text-slate-500">{count}</span>
                </div>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className={`h-3 rounded-full ${
                    priority === "Critical" ? "bg-rose-500" : priority === "High" ? "bg-amber-500" : priority === "Medium" ? "bg-sky-500" : "bg-slate-500"
                  }`}
                  style={{ width: `${(count / total) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </InfoCard>
  );
}
