import { AlertTriangle, Clock3, ShieldCheck } from "lucide-react";
import { InfoCard } from "@/components/ui/InfoCard";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { SlaBadge } from "@/components/ui/SlaBadge";
import type { SlaQueueRow } from "@/lib/sla";

interface SlaDetailPanelProps {
  row: SlaQueueRow | null;
}

export function SlaDetailPanel({ row }: SlaDetailPanelProps) {
  if (!row) {
    return <InfoCard title="Focused timer" description="Select a queue item to review the most urgent commitment and next support action."><div /></InfoCard>;
  }

  return (
    <InfoCard title="Focused timer" description="A closer read on the selected SLA commitment.">
      <div className="flex flex-wrap items-center gap-2">
        <PriorityBadge priority={row.priority} />
        <SlaBadge state={row.currentState} />
      </div>
      <p className="mt-4 text-lg font-semibold text-slate-950">{row.ticketId}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{row.subject}</p>

      <div className="mt-5 space-y-3">
        <div className="rounded-2xl bg-slate-50 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Customer</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">{row.customer}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Assigned team</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">{row.assignedTeam}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Current countdown</p>
          <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
            {row.currentState === "Breached" ? <AlertTriangle className="h-4 w-4 text-rose-500" /> : <Clock3 className="h-4 w-4 text-slate-400" />}
            {row.timeRemaining}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-slate-950 p-5 text-white shadow-panel">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-sky-300" />
          <p className="text-sm font-semibold">Operational note</p>
        </div>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          {row.currentState === "Breached"
            ? "This timer has crossed its target. Leadership review and customer-facing documentation should happen immediately."
            : row.currentState === "Due Soon"
              ? "This timer is approaching breach. Confirm next action and customer update before the remaining window closes."
              : "This commitment is healthy. Keep the queue moving and preserve margin before the next customer touchpoint."}
        </p>
      </div>
    </InfoCard>
  );
}
