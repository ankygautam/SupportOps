import {
  ClipboardPlus,
  MessagesSquare,
  RefreshCcw,
  ShieldAlert,
  Siren,
  Split,
  TimerReset,
  UserRoundPlus,
  Workflow,
  BadgeCheck,
} from "lucide-react";
import { ticketActivityAccent } from "@/lib/tickets";
import type { TicketActivity } from "@/types/models";

const iconMap = {
  created: ClipboardPlus,
  assignment: UserRoundPlus,
  customer_reply: MessagesSquare,
  internal_note: MessagesSquare,
  status_change: Workflow,
  sla_warning: ShieldAlert,
  escalation: Siren,
  resolution: BadgeCheck,
  reopened: RefreshCcw,
  incident_linked: Split,
  waiting_on_customer: TimerReset,
} as const;

interface TicketTimelineProps {
  activity: TicketActivity[];
}

export function TicketTimeline({ activity }: TicketTimelineProps) {
  return (
    <div className="panel p-6">
      <div className="mb-5">
        <p className="section-title">Activity timeline</p>
        <p className="section-helper mt-1">Operational history for this case, including customer and internal workflow events.</p>
      </div>
      <div className="space-y-4">
        {activity.map((event) => {
          const Icon = iconMap[event.type];

          return (
            <div key={event.id} className="flex gap-4 rounded-3xl border border-slate-100 bg-white/70 px-4 py-4 transition duration-200 hover:border-slate-200 hover:bg-slate-50/80">
              <div className={`mt-0.5 rounded-2xl p-3 ${ticketActivityAccent[event.type]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{event.description}</p>
                  </div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{event.occurredAt}</p>
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{event.actor}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
