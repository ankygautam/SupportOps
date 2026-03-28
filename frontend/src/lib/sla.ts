import type { SlaRecordDto } from "@/types/api";
import type { SLARecord, Ticket, TicketPriority, TicketSlaState } from "@/types/models";

export interface SlaQueueRow {
  ticketId: string;
  subject: string;
  customer: string;
  priority: TicketPriority;
  assignedTeam: string;
  assignedOwner: string;
  firstResponseSla: string;
  resolutionSla: string;
  currentState: TicketSlaState;
  timeRemaining: string;
  urgencyTone: "success" | "warning" | "danger";
  firstResponseMinutes: number;
  resolutionMinutes: number;
  record?: SLARecord;
  ticket: Ticket;
}

const responseTargets: Record<TicketPriority, number> = {
  Critical: 15,
  High: 30,
  Medium: 120,
  Low: 240,
};

const resolutionTargets: Record<TicketPriority, number> = {
  Critical: 240,
  High: 480,
  Medium: 960,
  Low: 1440,
};

function formatMinutes(totalMinutes: number) {
  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}

function buildTimeRemaining(deadlineAt: string, currentState: TicketSlaState) {
  const remaining = Math.round((new Date(deadlineAt).getTime() - Date.now()) / 60000);

  if (remaining <= 0 || currentState === "Breached") {
    return { label: `Breached by ${formatMinutes(Math.abs(remaining))}`, tone: "danger" as const };
  }

  if (currentState === "Due Soon") {
    return { label: `${formatMinutes(remaining)} left`, tone: "warning" as const };
  }

  return { label: `${formatMinutes(remaining)} left`, tone: "success" as const };
}

export function buildSlaQueueRows(records: SlaRecordDto[], tickets: Ticket[], summaryAverageMinutes?: number): SlaQueueRow[] {
  return records
    .map((record) => {
      const ticket = tickets.find((item) => item.id === record.ticketId);
      if (!ticket) {
        return null;
      }

      const priority = ticket.priority;
      const firstResponseMinutes = responseTargets[priority];
      const resolutionMinutes = resolutionTargets[priority];
      const currentState = ticket.slaState ?? (record.state === "BREACHED" ? "Breached" : record.state === "DUE_SOON" ? "Due Soon" : "On Track");
      const remaining = buildTimeRemaining(record.resolutionTargetAt, currentState);

      return {
        ticketId: ticket.id,
        subject: ticket.subject,
        customer: ticket.customerCompany ?? record.customerCompany,
        priority,
        assignedTeam: record.assignedTeam ?? ticket.assignedAgentTeam ?? "Support",
        assignedOwner: record.assignedAgentName ?? ticket.assignedAgentName ?? "Unassigned",
        firstResponseSla: formatMinutes(firstResponseMinutes),
        resolutionSla: formatMinutes(resolutionMinutes),
        currentState,
        timeRemaining: remaining.label,
        urgencyTone: remaining.tone,
        firstResponseMinutes,
        resolutionMinutes: summaryAverageMinutes ?? resolutionMinutes,
        ticket,
      };
    })
    .filter((row): row is SlaQueueRow => Boolean(row));
}

export function averageResolutionTimeLabel(rows: SlaQueueRow[], averageMinutes?: number) {
  if (typeof averageMinutes === "number" && averageMinutes > 0) {
    return formatMinutes(averageMinutes);
  }

  const avg = Math.round(rows.reduce((sum, row) => sum + row.resolutionMinutes, 0) / (rows.length || 1));
  return formatMinutes(avg);
}
