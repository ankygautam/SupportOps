import { ArrowUpRight, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "@/components/ui/EmptyState";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { SlaBadge } from "@/components/ui/SlaBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TableWrapper } from "@/components/ui/TableWrapper";
import type { Ticket } from "@/types/models";

interface TicketsTableProps {
  tickets: Ticket[];
  loading?: boolean;
}

export function TicketsTable({ tickets, loading }: TicketsTableProps) {
  const navigate = useNavigate();

  const hasRows = tickets.length > 0;

  return (
    <TableWrapper
      title="Ticket queue"
      description="Customer issues, ownership, and SLA pressure in one support workspace."
      loading={loading}
      emptyState={
        <EmptyState
          title="No tickets match these filters"
          description="Adjust the search or clear some filters to bring tickets back into view."
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
                <th className="table-head px-5 py-4">Priority</th>
                <th className="table-head px-5 py-4">Status</th>
                <th className="table-head px-5 py-4">Assigned To</th>
                <th className="table-head px-5 py-4">Updated</th>
                <th className="table-head px-5 py-4">SLA</th>
                <th className="table-head px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => {
                return (
                  <tr
                    key={ticket.id}
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        navigate(`/tickets/${ticket.id}`);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Open ticket ${ticket.id}`}
                    className="group table-row-interactive"
                  >
                    <td className="table-cell">
                      <div className="min-w-[96px]">
                        <p className="font-semibold text-slate-900">{ticket.id}</p>
                        <p className="table-kicker">{ticket.channel}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="min-w-[320px] max-w-[420px]">
                        <p className="truncate font-semibold text-slate-900 transition group-hover:text-sky-700">{ticket.subject}</p>
                        <p className="table-meta truncate">{ticket.impactSummary}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {ticket.relatedIncidentTitle ? (
                            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-200/90">
                              Incident: {ticket.relatedIncidentId}
                            </span>
                          ) : null}
                          {ticket.escalated ? (
                            <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-200/90">
                              Escalated {ticket.escalatedToTeam ? `to ${ticket.escalatedToTeam}` : ""}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <p className="font-medium text-slate-900">{ticket.customerCompany}</p>
                      <p className="table-meta">{ticket.requesterName}</p>
                    </td>
                    <td className="table-cell">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="table-cell">
                      <StatusBadge status={ticket.status} />
                      {ticket.waitingSince ? <p className="mt-2 text-xs text-slate-500">Waiting {ticket.waitingDuration}</p> : null}
                    </td>
                    <td className="table-cell">
                      <div>
                        <p className="font-medium text-slate-900">{ticket.assignedAgentName ?? "Unassigned"}</p>
                        <p className="table-meta">{ticket.assignedAgentTeam ?? "Support queue"}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div>
                        <p className="font-medium text-slate-900">{ticket.updatedAt}</p>
                        <p className="table-meta">{ticket.dueAt}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <SlaBadge state={ticket.slaState ?? "On Track"} />
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/tickets/${ticket.id}`);
                          }}
                          className="table-action-pill"
                        >
                          Open
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(event) => event.stopPropagation()}
                          className="icon-btn icon-btn-sm"
                          aria-label={`More actions for ${ticket.id}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </TableWrapper>
  );
}
