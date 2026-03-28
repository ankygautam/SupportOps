import type {
  ApiRole,
  Customer,
  IncidentSeverity,
  IncidentStatus,
  TicketPriority,
  TicketSlaState,
  TicketStatus,
} from "@/types/models";

export const roleLabels: Record<ApiRole, string> = {
  ADMIN: "Admin",
  SUPPORT_AGENT: "Support Agent",
  TEAM_LEAD: "Team Lead",
};

export const ticketStatusOptions: TicketStatus[] = ["New", "In Progress", "Waiting on Customer", "Resolved", "Closed"];
export const ticketPriorityOptions: TicketPriority[] = ["Low", "Medium", "High", "Critical"];
export const ticketSlaStateOptions: TicketSlaState[] = ["On Track", "Due Soon", "Breached"];
export const incidentSeverityOptions: IncidentSeverity[] = ["Low", "Medium", "High", "Critical"];
export const incidentStatusOptions: IncidentStatus[] = ["Investigating", "Identified", "Monitoring", "Resolved"];
export const customerSegmentOptions: Customer["segment"][] = ["Individual", "SMB", "Enterprise"];
export const customerHealthOptions: Customer["health"][] = ["Healthy", "Watchlist", "At Risk"];
export const defaultTablePageSizes = [10, 20, 50] as const;
