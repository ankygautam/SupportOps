import type {
  ActivityLogDto,
  AuthUserDto,
  CustomerDetailDto,
  CustomerSummaryDto,
  IncidentDetailDto,
  IncidentSummaryDto,
  TicketCommentDto,
  TicketDetailDto,
  TicketSummaryDto,
  UserPreferencesDto,
  UserSummaryDto,
} from "@/types/api";

const defaultTimestamp = "2026-03-28T15:00:00Z";

export function makeAuthUserDto(overrides: Partial<AuthUserDto> = {}): AuthUserDto {
  return {
    id: "usr-admin",
    fullName: "Sarah Chen",
    email: "admin@supportops.dev",
    team: "Operations Leadership",
    role: "ADMIN",
    active: true,
    ...overrides,
  };
}

export function makeUserSummaryDto(overrides: Partial<UserSummaryDto> = {}): UserSummaryDto {
  return {
    id: "usr-agent-1",
    fullName: "Daniel Kim",
    email: "agent1@supportops.dev",
    role: "SUPPORT_AGENT",
    team: "Core Support",
    active: true,
    ...overrides,
  };
}

export function makeActivityLogDto(overrides: Partial<ActivityLogDto> = {}): ActivityLogDto {
  return {
    id: "activity-1",
    entityType: "TICKET",
    entityId: "SUP-4102",
    action: "STATUS_CHANGED",
    description: "Status updated to in progress.",
    actorName: "Daniel Kim",
    createdAt: defaultTimestamp,
    ...overrides,
  };
}

export function makeTicketCommentDto(overrides: Partial<TicketCommentDto> = {}): TicketCommentDto {
  return {
    id: "comment-1",
    authorId: "usr-agent-1",
    authorName: "Daniel Kim",
    content: "We are tracing the issue with the customer now.",
    internalNote: false,
    createdAt: defaultTimestamp,
    ...overrides,
  };
}

export function makeTicketSummaryDto(overrides: Partial<TicketSummaryDto> = {}): TicketSummaryDto {
  return {
    id: "SUP-4102",
    subject: "Billing portal returns 500 error",
    description: "Finance staff hit a 500 error when exporting invoice history.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    customerId: "cust-1",
    customerName: "Marlon Hayes",
    customerCompany: "Prairie Connect Services",
    assignedAgentId: "usr-agent-1",
    assignedAgentName: "Daniel Kim",
    relatedIncidentId: null,
    relatedIncidentTitle: null,
    escalated: false,
    escalatedToTeam: null,
    resolutionSummary: null,
    dueAt: "2026-03-28T18:00:00Z",
    waitingSince: null,
    resolvedAt: null,
    reopenedAt: null,
    createdAt: "2026-03-28T11:00:00Z",
    updatedAt: defaultTimestamp,
    slaState: "DUE_SOON",
    ...overrides,
  };
}

export function makeTicketDetailDto(overrides: Partial<TicketDetailDto> = {}): TicketDetailDto {
  return {
    ...makeTicketSummaryDto(),
    escalationReason: null,
    escalatedAt: null,
    closeNotes: null,
    reopenReason: null,
    comments: [makeTicketCommentDto()],
    activity: [makeActivityLogDto()],
    ...overrides,
  };
}

export function makeCustomerSummaryDto(overrides: Partial<CustomerSummaryDto> = {}): CustomerSummaryDto {
  return {
    id: "cust-1",
    name: "Marlon Hayes",
    company: "Prairie Connect Services",
    email: "marlon@prairieconnect.com",
    phone: "+1 403 555 0194",
    segment: "ENTERPRISE",
    health: "WATCHLIST",
    ownerId: "usr-lead-1",
    ownerName: "Nina Patel",
    openTickets: 3,
    createdAt: "2026-01-15T09:00:00Z",
    updatedAt: defaultTimestamp,
    ...overrides,
  };
}

export function makeCustomerDetailDto(overrides: Partial<CustomerDetailDto> = {}): CustomerDetailDto {
  return {
    ...makeCustomerSummaryDto(),
    recentTicketIds: ["SUP-4102", "SUP-4089"],
    ...overrides,
  };
}

export function makeIncidentSummaryDto(overrides: Partial<IncidentSummaryDto> = {}): IncidentSummaryDto {
  return {
    id: "INC-901",
    title: "API gateway latency spike",
    affectedService: "API Gateway",
    severity: "HIGH",
    status: "INVESTIGATING",
    ownerId: "usr-lead-1",
    ownerName: "Nina Patel",
    linkedTicketCount: 4,
    affectedCustomerCount: 3,
    startedAt: "2026-03-28T12:45:00Z",
    resolvedAt: null,
    createdAt: "2026-03-28T12:45:00Z",
    updatedAt: defaultTimestamp,
    ...overrides,
  };
}

export function makeIncidentDetailDto(overrides: Partial<IncidentDetailDto> = {}): IncidentDetailDto {
  return {
    ...makeIncidentSummaryDto(),
    summary: "Latency increased across the API edge tier for customer portal traffic.",
    rootCause: "Gateway node autoscaling lagged under a burst of billing traffic.",
    mitigation: "Shifted traffic and recycled the busiest nodes.",
    linkedTicketIds: ["SUP-4102", "SUP-4114"],
    timeline: [
      makeActivityLogDto({
        entityType: "INCIDENT",
        entityId: "INC-901",
        action: "ISSUE_DETECTED",
        description: "Monitoring alerted on elevated p95 latency.",
      }),
    ],
    ...overrides,
  };
}

export function makeUserPreferencesDto(overrides: Partial<UserPreferencesDto> = {}): UserPreferencesDto {
  return {
    profile: {
      name: "Sarah Chen",
      email: "admin@supportops.dev",
      role: "Admin",
      timezone: "America/Edmonton",
      dateFormat: "MMM d, yyyy",
    },
    notifications: {
      emailAlerts: true,
      assignmentAlerts: true,
      slaBreachAlerts: true,
      escalationAlerts: true,
      incidentAlerts: true,
      incidentResolvedAlerts: true,
      dailySummary: true,
      sound: false,
    },
    display: {
      compactTableMode: false,
      defaultDashboardView: "Operations Overview",
      defaultLandingPage: "/dashboard",
      tableDensity: "comfortable",
      showResolvedTickets: true,
      sidebarCollapsed: false,
    },
    operations: {
      businessHours: "Mon-Fri 08:00-18:00",
      workingHours: "08:00-17:00",
      defaultSlaTargets: "Critical 30m / High 2h / Medium 8h / Low 24h",
      escalationRules: "Escalate high-impact issues after 30 minutes without ownership.",
      autoAssignment: true,
    },
    ...overrides,
  };
}
