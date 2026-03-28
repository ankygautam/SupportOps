import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/ui/EmptyState";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { SlaBadge } from "@/components/ui/SlaBadge";
import type { Ticket } from "@/types/models";

export function AssignedTicketsCard({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="panel p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Assigned to Me</p>
          <p className="mt-1 text-sm text-slate-500">Personal queue, deadlines, and current customer pressure.</p>
        </div>
        <Link to="/tickets" className="text-sm font-semibold text-sky-700">
          View all
        </Link>
      </div>
      <div className="space-y-3">
        {tickets.length ? tickets.map((ticket) => (
            <Link
              key={ticket.id}
              to={`/tickets/${ticket.id}`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-100 px-4 py-4 transition hover:border-slate-200 hover:bg-slate-50/80"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900">{ticket.id}</p>
                  <PriorityBadge priority={ticket.priority} />
                  {ticket.slaState ? <SlaBadge state={ticket.slaState} /> : null}
                </div>
                <p className="mt-2 truncate text-sm text-slate-700">{ticket.subject}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{ticket.customerCompany}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Due</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{ticket.dueAt}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1" />
              </div>
            </Link>
          )) : <EmptyState title="No assigned tickets" description="Your active queue is clear right now." />}
      </div>
    </div>
  );
}
