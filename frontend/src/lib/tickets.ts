import { formatDateOnly } from "@/lib/format/date";
import type { SLARecord, Ticket, TicketPriority, TicketStatus } from "@/types/models";
import { slaStatusDisplay } from "@/utils/badges";
export {
  slaStatusDisplay,
  ticketActivityAccent,
  ticketPriorityTone,
  slaDisplayTone as ticketSlaTone,
  ticketStatusTone,
} from "@/utils/badges";

export function getTicketSlaDisplay(record?: SLARecord) {
  if (!record) {
    return "On Track";
  }

  return record.displayStatus ?? slaStatusDisplay[record.status];
}

export function getDateInputValue(value: string) {
  return value.slice(0, 10);
}

export function matchesDateRange(value: string, fromDate: string, toDate: string) {
  const normalized = getDateInputValue(value);

  if (fromDate && normalized < fromDate) {
    return false;
  }

  if (toDate && normalized > toDate) {
    return false;
  }

  return true;
}

export function buildCreatedTicket({
  ticketId,
  subject,
  description,
  customerId,
  requesterName,
  requesterEmail,
  priority,
  status,
  assignedAgentId,
  dueAtValue,
}: {
  ticketId: string;
  subject: string;
  description: string;
  customerId: string;
  requesterName: string;
  requesterEmail: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedAgentId: string;
  dueAtValue: string;
}): Ticket {
  const now = new Date();
  return {
    id: ticketId,
    subject,
    description,
    customerId,
    requesterName,
    requesterEmail,
    service: "Support Workspace",
    impactSummary: "Newly created support case awaiting workflow follow-up.",
    priority,
    status,
    assignedAgentId,
    escalated: false,
    createdAt: "Just now",
    createdAtValue: now.toISOString(),
    updatedAt: "Just now",
    updatedAtValue: now.toISOString(),
    dueAt: formatDateOnly(`${dueAtValue}T12:00:00.000Z`),
    dueAtValue: `${dueAtValue}T12:00:00.000Z`,
    channel: "Email",
    tags: ["new-case"],
    comments: [],
    activity: [
      {
        id: `${ticketId}-activity-created`,
        type: "created",
        title: "Ticket created",
        description: "A new support case was added from the queue workspace.",
        actor: "SupportOps Workspace",
        occurredAt: "Just now",
      },
    ],
  };
}
