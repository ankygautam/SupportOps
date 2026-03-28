export type ApiRole = "ADMIN" | "SUPPORT_AGENT" | "TEAM_LEAD";

export interface AuthUserDto {
  id: string;
  fullName: string;
  email: string;
  team: string;
  role: ApiRole;
  active: boolean;
}

export interface LoginResponseDto {
  token: string;
  user: AuthUserDto;
}

export interface DashboardSummaryDto {
  openTickets: number;
  criticalIncidents: number;
  slaBreaches: number;
  averageFirstResponseMinutes: number;
  assignedToMeCount: number;
}

export interface ActivityLogDto {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  description: string;
  actorName: string;
  createdAt: string;
}

export interface UserSummaryDto {
  id: string;
  fullName: string;
  email: string;
  role: ApiRole;
  team: string;
  active?: boolean;
}

export interface TeamMemberDto {
  id: string;
  fullName: string;
  email: string;
  team: string;
  role: ApiRole;
  activeTickets: number;
  resolvedThisWeek: number;
  averageResponseMinutes: number;
  active: boolean;
}

export interface TicketSummaryDto {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  customerId: string;
  customerName: string;
  customerCompany: string;
  assignedAgentId: string | null;
  assignedAgentName: string | null;
  relatedIncidentId: string | null;
  relatedIncidentTitle: string | null;
  escalated: boolean;
  escalatedToTeam: string | null;
  resolutionSummary: string | null;
  dueAt: string | null;
  waitingSince: string | null;
  resolvedAt: string | null;
  reopenedAt: string | null;
  createdAt: string;
  updatedAt: string;
  slaState: string;
}

export interface TicketCommentDto {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  internalNote: boolean;
  createdAt: string;
}

export interface TicketDetailDto extends TicketSummaryDto {
  escalationReason: string | null;
  escalatedAt: string | null;
  closeNotes: string | null;
  reopenReason: string | null;
  comments: TicketCommentDto[];
  activity: ActivityLogDto[];
}

export interface TicketCreateRequestDto {
  subject: string;
  description: string;
  customerId: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "NEW" | "IN_PROGRESS" | "WAITING_ON_CUSTOMER" | "RESOLVED" | "CLOSED";
  assignedAgentId: string;
  relatedIncidentId?: string;
  dueAt: string;
}

export interface TicketUpdateRequestDto {
  subject?: string;
  description?: string;
  status?: "NEW" | "IN_PROGRESS" | "WAITING_ON_CUSTOMER" | "RESOLVED" | "CLOSED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  assignedAgentId?: string;
  relatedIncidentId?: string;
  escalatedToTeam?: string;
  escalationReason?: string;
  resolutionSummary?: string;
  closeNotes?: string;
  reopenReason?: string;
  dueAt?: string;
}

export interface TicketCommentRequestDto {
  content: string;
  internalNote: boolean;
}

export interface CustomerSummaryDto {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  segment: string;
  health: string;
  ownerId: string;
  ownerName: string;
  openTickets: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDetailDto extends CustomerSummaryDto {
  recentTicketIds: string[];
}

export interface IncidentSummaryDto {
  id: string;
  title: string;
  affectedService: string;
  severity: string;
  status: string;
  ownerId: string;
  ownerName: string;
  linkedTicketCount: number;
  affectedCustomerCount: number;
  startedAt: string;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentDetailDto extends IncidentSummaryDto {
  summary: string;
  rootCause: string;
  mitigation: string;
  linkedTicketIds: string[];
  timeline: ActivityLogDto[];
}

export interface IncidentCreateRequestDto {
  title: string;
  affectedService: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "INVESTIGATING" | "IDENTIFIED" | "MONITORING" | "RESOLVED";
  ownerId: string;
  summary: string;
  rootCause: string;
  mitigation: string;
  startedAt: string;
  linkedTicketIds?: string[];
}

export interface IncidentUpdateRequestDto extends Partial<IncidentCreateRequestDto> {
  resolvedAt?: string;
}

export interface SlaRecordDto {
  id: string;
  ticketId: string;
  subject: string;
  customerCompany: string;
  assignedAgentName: string | null;
  assignedTeam: string | null;
  firstResponseTargetAt: string;
  resolutionTargetAt: string;
  state: string;
  breached: boolean;
  updatedAt: string;
}

export interface SlaSummaryDto {
  onTrack: number;
  dueSoon: number;
  breached: number;
  averageResolutionMinutes: number;
}

export interface AnalyticsVolumePointDto {
  label: string;
  opened: number;
  resolved: number;
}

export interface AnalyticsDistributionItemDto {
  label: string;
  value: number;
  toneClass: string;
}

export interface AnalyticsSlaPerformancePointDto {
  label: string;
  met: number;
  breached: number;
}

export interface AnalyticsSummaryDto {
  ticketsResolved: string;
  ticketsResolvedDelta: string;
  avgFirstResponse: string;
  avgFirstResponseDelta: string;
  slaCompliance: string;
  slaComplianceDelta: string;
  activeIncidents: string;
  activeIncidentsDelta: string;
  meanTimeToResolution: string;
  reopenedTicketRate: string;
  incidentFrequency: string;
  volumeTrend: AnalyticsVolumePointDto[];
  statusDistribution: AnalyticsDistributionItemDto[];
  priorityDistribution: AnalyticsDistributionItemDto[];
  workloadDistribution: AnalyticsDistributionItemDto[];
  slaPerformance: AnalyticsSlaPerformancePointDto[];
  comparisonMetrics: AnalyticsComparisonMetricDto[];
  impactedCustomers: AnalyticsImpactedCustomerDto[];
  teamOptions: string[];
}

export interface AnalyticsComparisonMetricDto {
  label: string;
  currentValue: string;
  previousValue: string;
  delta: string;
  tone: "default" | "success" | "warning" | "danger" | "info";
}

export interface AnalyticsImpactedCustomerDto {
  customerId: string;
  company: string;
  openTickets: number;
  highPriorityTickets: number;
  note: string;
}

export interface AnalyticsTeamPerformanceRowDto {
  id: string;
  agent: string;
  team: string;
  assigned: number;
  resolved: number;
  avgResponse: string;
  slaScore: string;
  csat: string;
  workload: number;
}

export interface AnalyticsTeamPerformanceDto {
  rows: AnalyticsTeamPerformanceRowDto[];
}

export interface AnalyticsIssueCategoryDto {
  category: string;
  count: number;
  delta: string;
  toneClass: string;
}

export interface AnalyticsOperationalInsightDto {
  id: string;
  title: string;
  description: string;
  tone: "default" | "success" | "warning" | "danger";
}

export interface AnalyticsIssuesDto {
  categories: AnalyticsIssueCategoryDto[];
  insights: AnalyticsOperationalInsightDto[];
}

export interface UserPreferencesDto {
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

export interface NotificationItemDto {
  id: string;
  type: "TICKET_ASSIGNED" | "TICKET_ESCALATED" | "SLA_BREACHED" | "INCIDENT_CREATED" | "INCIDENT_RESOLVED";
  title: string;
  message: string;
  link: string | null;
  unread: boolean;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationResponseDto {
  items: NotificationItemDto[];
  unreadCount: number;
}

export interface ApiErrorDto {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  details?: string[];
}
