import type {
  Customer,
  IncidentSeverity,
  IncidentStatus,
  SlaStatus,
  TicketActivityType,
  TicketPriority,
  TicketSlaState,
  TicketStatus,
} from "@/types/models";

export const ticketPriorityTone: Record<TicketPriority, "default" | "info" | "warning" | "danger"> = {
  Low: "default",
  Medium: "info",
  High: "warning",
  Critical: "danger",
};

export const ticketStatusTone: Record<TicketStatus, "info" | "warning" | "default" | "success" | "neutral"> = {
  New: "info",
  "In Progress": "warning",
  "Waiting on Customer": "default",
  Resolved: "success",
  Closed: "neutral",
};

export const incidentSeverityTone: Record<IncidentSeverity, "default" | "info" | "warning" | "danger"> = {
  Low: "default",
  Medium: "info",
  High: "warning",
  Critical: "danger",
};

export const incidentStatusTone: Record<IncidentStatus, "danger" | "warning" | "info" | "success"> = {
  Investigating: "danger",
  Identified: "info",
  Monitoring: "warning",
  Resolved: "success",
};

export const customerHealthTone: Record<Customer["health"], "success" | "warning" | "danger"> = {
  Healthy: "success",
  Watchlist: "warning",
  "At Risk": "danger",
};

export const slaStatusDisplay: Record<SlaStatus, TicketSlaState> = {
  Healthy: "On Track",
  "At Risk": "Due Soon",
  Breached: "Breached",
};

export const slaDisplayTone: Record<TicketSlaState, "success" | "warning" | "danger"> = {
  "On Track": "success",
  "Due Soon": "warning",
  Breached: "danger",
};

export const ticketActivityAccent: Record<TicketActivityType, string> = {
  created: "bg-sky-50 text-sky-700",
  assignment: "bg-slate-100 text-slate-700",
  customer_reply: "bg-emerald-50 text-emerald-700",
  internal_note: "bg-violet-50 text-violet-700",
  status_change: "bg-amber-50 text-amber-700",
  sla_warning: "bg-rose-50 text-rose-700",
  escalation: "bg-rose-50 text-rose-700",
  resolution: "bg-emerald-50 text-emerald-700",
  reopened: "bg-cyan-50 text-cyan-700",
  incident_linked: "bg-indigo-50 text-indigo-700",
  waiting_on_customer: "bg-orange-50 text-orange-700",
};
