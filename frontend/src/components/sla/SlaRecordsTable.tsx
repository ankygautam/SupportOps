import { AlertTriangle, Clock3 } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { SlaBadge } from "@/components/ui/SlaBadge";
import { TableWrapper } from "@/components/ui/TableWrapper";
import type { SlaQueueRow } from "@/lib/sla";

interface SlaRecordsTableProps {
  rows: SlaQueueRow[];
  selectedTicketId?: string;
  onSelect: (row: SlaQueueRow) => void;
  loading?: boolean;
}

export function SlaRecordsTable({ rows, selectedTicketId, onSelect, loading }: SlaRecordsTableProps) {
  const hasRows = rows.length > 0;

  return (
    <TableWrapper
      title="SLA queue"
      description="Operational timers prioritized for support leads and frontline owners."
      loading={loading}
      emptyState={
        <EmptyState
          icon={<Clock3 className="h-6 w-6 text-slate-500" />}
          title="No SLA items match this view"
          description="This queue is clear for the current filters. Broaden the team or state filter to surface more live commitments."
        />
      }
    >
      {hasRows ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="table-head px-5 py-4">Ticket ID</th>
                <th className="table-head px-5 py-4">Subject</th>
                <th className="table-head px-5 py-4">Customer</th>
                <th className="table-head px-5 py-4">Assigned Team</th>
                <th className="table-head px-5 py-4">First Response SLA</th>
                <th className="table-head px-5 py-4">Resolution SLA</th>
                <th className="table-head px-5 py-4">Current State</th>
                <th className="table-head px-5 py-4">Time Remaining</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.ticketId}
                  onClick={() => onSelect(row)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect(row);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open SLA record for ticket ${row.ticketId}`}
                  className={`group table-row-interactive ${
                    selectedTicketId === row.ticketId
                      ? "bg-sky-50/60"
                      : row.currentState === "Breached"
                        ? "bg-rose-50/30"
                        : ""
                  }`}
                >
                  <td className="table-cell">
                    <div className="min-w-[96px]">
                      <p className="font-semibold text-slate-900">{row.ticketId}</p>
                      <div className="mt-2">
                        <PriorityBadge priority={row.priority} />
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="min-w-[280px]">
                      <p className="font-semibold text-slate-900 transition group-hover:text-sky-700">{row.subject}</p>
                      <p className="table-meta">{row.assignedOwner}</p>
                    </div>
                  </td>
                  <td className="table-cell">{row.customer}</td>
                  <td className="table-cell">{row.assignedTeam}</td>
                  <td className="table-cell">
                    <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-200/70">
                      <Clock3 className="h-4 w-4 text-slate-400" />
                      {row.firstResponseSla}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-200/70">
                      <Clock3 className="h-4 w-4 text-slate-400" />
                      {row.resolutionSla}
                    </div>
                  </td>
                  <td className="table-cell">
                    <SlaBadge state={row.currentState} className="px-3 py-1.5" />
                  </td>
                  <td className="table-cell">
                    <div
                      className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold ${
                        row.urgencyTone === "danger"
                          ? "bg-rose-50 text-rose-700"
                          : row.urgencyTone === "warning"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {row.urgencyTone === "danger" ? <AlertTriangle className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
                      {row.timeRemaining}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </TableWrapper>
  );
}
