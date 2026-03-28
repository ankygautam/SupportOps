export type TicketStatus =
  | "New"
  | "In Progress"
  | "Waiting on Customer"
  | "Resolved"
  | "Closed";

export type TicketPriority = "Low" | "Medium" | "High" | "Critical";

export type TicketSlaState = "On Track" | "Due Soon" | "Breached";

export type TicketActivityType =
  | "created"
  | "assignment"
  | "customer_reply"
  | "internal_note"
  | "status_change"
  | "sla_warning"
  | "escalation"
  | "resolution"
  | "reopened"
  | "incident_linked"
  | "waiting_on_customer";

export type IncidentSeverity = "Low" | "Medium" | "High" | "Critical";

export type IncidentStatus = "Investigating" | "Identified" | "Monitoring" | "Resolved";

export type SlaStatus = "Healthy" | "At Risk" | "Breached";

export type AppRole = "Admin" | "Support Agent" | "Team Lead" | "Senior Agent" | "Incident Commander";
export type ApiRole = "ADMIN" | "SUPPORT_AGENT" | "TEAM_LEAD";

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  roleKey?: ApiRole;
  team: string;
  status: "Online" | "Away" | "Offline";
  initials: string;
}

export interface AuthUser extends User {
  active: boolean;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  segment: "Individual" | "SMB" | "Enterprise";
  plan: string;
  region: string;
  industry: string;
  health: "Healthy" | "Watchlist" | "At Risk";
  ownerId: string;
  ownerTitle: string;
  ownerName?: string;
  primaryEmail: string;
  primaryPhone: string;
  executiveSponsor: string;
  lastContactedAt: string;
  renewalAt: string;
  openTickets: number;
  ticketsLast30Days: number;
  avgResolutionHours: number;
  averageResponseTime: string;
  ticketsOpenedCount: number;
  lastIncidentAffected: string;
  lastEscalationDate: string;
  csat: number;
  mrr: number;
  lifetimeValue: number;
}

export interface CustomerActivity {
  id: string;
  title: string;
  description: string;
  actor: string;
  occurredAt: string;
}

export interface TicketComment {
  id: string;
  authorId: string;
  authorName?: string;
  authorInitials?: string;
  message: string;
  createdAt: string;
  internal: boolean;
}

export interface TicketActivity {
  id: string;
  type: TicketActivityType;
  title: string;
  description: string;
  actor: string;
  occurredAt: string;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  customerId: string;
  customerName?: string;
  customerCompany?: string;
  requesterName: string;
  requesterEmail: string;
  service: string;
  impactSummary: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedAgentId: string;
  assignedAgentName?: string;
  assignedAgentTeam?: string;
  relatedIncidentId?: string;
  relatedIncidentTitle?: string;
  escalated?: boolean;
  escalatedToTeam?: string;
  escalationReason?: string;
  escalatedAt?: string;
  waitingSince?: string;
  waitingDuration?: string;
  resolvedAt?: string;
  resolutionSummary?: string;
  closeNotes?: string;
  reopenedAt?: string;
  reopenReason?: string;
  createdAt: string;
  createdAtValue: string;
  updatedAt: string;
  updatedAtValue: string;
  dueAt: string;
  dueAtValue: string;
  channel: "Email" | "Chat" | "Phone" | "API";
  tags: string[];
  comments: TicketComment[];
  activity: TicketActivity[];
  slaState?: TicketSlaState;
}

export interface IncidentTimelineEvent {
  id: string;
  title: string;
  description: string;
  actor: string;
  occurredAt: string;
}

export interface Incident {
  id: string;
  title: string;
  affectedService: string;
  affectedServices: string[];
  severity: IncidentSeverity;
  status: IncidentStatus;
  ownerId: string;
  ownerName?: string;
  ownerTeam?: string;
  startedAt: string;
  startedAtValue: string;
  resolvedAt?: string;
  resolvedAtValue?: string;
  duration: string;
  summary: string;
  rootCause: string;
  mitigation: string;
  mitigationSteps: string[];
  linkedTicketIds?: string[];
  linkedTicketCount?: number;
  affectedCustomerCount?: number;
  detectionSource: string;
  customerImpact: string;
  timeline: IncidentTimelineEvent[];
}

export interface SLARecord {
  id: string;
  ticketId: string;
  customerId: string;
  ownerId: string;
  policyName: string;
  metricType: "First Response" | "Next Response" | "Resolution";
  targetMinutes: number;
  elapsedMinutes: number;
  status: SlaStatus;
  displayStatus: TicketSlaState;
  breachRisk: string;
  deadlineAt: string;
  deadlineAtValue: string;
  lastUpdatedAt: string;
}

export interface ActivityLog {
  id: string;
  type: "Ticket" | "Incident" | "SLA" | "Customer";
  title: string;
  description: string;
  actor: string;
  occurredAt: string;
}

export interface DashboardSummary {
  openTickets: number;
  criticalIncidents: number;
  slaBreaches: number;
  averageFirstResponseMinutes: number;
  assignedToMeCount: number;
}

export interface AnalyticsSummary {
  ticketsResolved: string;
  avgFirstResponse: string;
  slaCompliance: string;
  activeIncidents: string;
}

export interface UserPreferences {
  profile: {
    name: string;
    email: string;
    role: string;
    timezone: string;
    dateFormat: string;
  };
  notifications: {
    emailAlerts: boolean;
    assignmentAlerts: boolean;
    slaBreachAlerts: boolean;
    escalationAlerts: boolean;
    incidentAlerts: boolean;
    incidentResolvedAlerts: boolean;
    dailySummary: boolean;
    sound: boolean;
  };
  display: {
    compactTableMode: boolean;
    defaultDashboardView: string;
    defaultLandingPage: string;
    tableDensity: string;
    showResolvedTickets: boolean;
    sidebarCollapsed: boolean;
  };
  operations: {
    businessHours: string;
    workingHours: string;
    defaultSlaTargets: string;
    escalationRules: string;
    autoAssignment: boolean;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  team: string;
  role: AppRole;
  roleKey: ApiRole;
  activeTickets: number;
  resolvedThisWeek: number;
  avgResponseTime: string;
  active: boolean;
}

export interface NotificationItem {
  id: string;
  type: "TICKET_ASSIGNED" | "TICKET_ESCALATED" | "SLA_BREACHED" | "INCIDENT_CREATED" | "INCIDENT_RESOLVED";
  title: string;
  message: string;
  link?: string;
  unread: boolean;
  createdAt: string;
  createdAtValue: string;
}

export interface SummaryMetric {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  supportingText: string;
}

export interface StatusBreakdown {
  label: string;
  value: number;
  colorClass: string;
}

export interface TrendPoint {
  label: string;
  value: number;
}
