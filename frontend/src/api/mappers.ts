import { roleLabels } from "@/app/config/options";
import {
  customerActivityById,
  customerMap,
  customerNotesById,
  incidents as mockIncidents,
  customers as mockCustomers,
  tickets as mockTickets,
  users as mockUsers,
} from "@/data/sampleData";
import { formatDateOnly, formatDateTime, formatRelativeTime } from "@/lib/format/date";
import type {
  ActivityLogDto,
  AuthUserDto,
  CustomerDetailDto,
  CustomerSummaryDto,
  IncidentDetailDto,
  IncidentSummaryDto,
  NotificationItemDto,
  SlaRecordDto,
  TeamMemberDto,
  TicketCommentDto,
  TicketDetailDto,
  TicketSummaryDto,
  UserSummaryDto,
} from "@/types/api";
import type {
  ActivityLog,
  AppRole,
  Customer,
  CustomerActivity,
  Incident,
  NotificationItem,
  SLARecord,
  Ticket,
  TicketActivity,
  TicketActivityType,
  TicketComment,
  TicketPriority,
  TicketSlaState,
  TicketStatus,
  TeamMember,
  User,
} from "@/types/models";

function buildInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function mapRole(role: AuthUserDto["role"] | UserSummaryDto["role"]): AppRole {
  return roleLabels[role] as AppRole;
}

export function mapUser(dto: AuthUserDto | UserSummaryDto): User {
  return {
    id: dto.id,
    name: dto.fullName,
    email: dto.email,
    role: mapRole(dto.role),
    roleKey: dto.role,
    team: dto.team,
    status: "Online",
    initials: buildInitials(dto.fullName),
  };
}

export function mapTeamMember(dto: TeamMemberDto): TeamMember {
  return {
    id: dto.id,
    name: dto.fullName,
    email: dto.email,
    team: dto.team,
    role: mapRole(dto.role),
    roleKey: dto.role,
    activeTickets: dto.activeTickets,
    resolvedThisWeek: dto.resolvedThisWeek,
    avgResponseTime: `${dto.averageResponseMinutes}m`,
    active: dto.active,
  };
}

export function mapNotification(dto: NotificationItemDto): NotificationItem {
  return {
    id: dto.id,
    type: dto.type,
    title: dto.title,
    message: dto.message,
    link: dto.link ?? undefined,
    unread: dto.unread,
    createdAt: formatRelativeTime(dto.createdAt),
    createdAtValue: dto.createdAt,
  };
}

function toTicketStatus(value: string): TicketStatus {
  switch (value) {
    case "IN_PROGRESS":
      return "In Progress";
    case "WAITING_ON_CUSTOMER":
      return "Waiting on Customer";
    case "RESOLVED":
      return "Resolved";
    case "CLOSED":
      return "Closed";
    default:
      return "New";
  }
}

function toTicketPriority(value: string): TicketPriority {
  switch (value) {
    case "LOW":
      return "Low";
    case "HIGH":
      return "High";
    case "CRITICAL":
      return "Critical";
    default:
      return "Medium";
  }
}

function toSlaState(value: string): TicketSlaState {
  switch (value) {
    case "DUE_SOON":
      return "Due Soon";
    case "BREACHED":
      return "Breached";
    default:
      return "On Track";
  }
}

function mapActivityType(action: string): TicketActivityType {
  const normalized = action.toLowerCase();

  if (normalized.includes("escalat")) {
    return "escalation";
  }
  if (normalized.includes("reopen")) {
    return "reopened";
  }
  if (normalized.includes("incident")) {
    return "incident_linked";
  }
  if (normalized.includes("resolved") || normalized.includes("closed")) {
    return "resolution";
  }
  if (normalized.includes("waiting")) {
    return "waiting_on_customer";
  }
  if (normalized.includes("assignment") || normalized.includes("reassign")) {
    return "assignment";
  }
  if (normalized.includes("note")) {
    return "internal_note";
  }
  if (normalized.includes("comment") || normalized.includes("reply")) {
    return "customer_reply";
  }
  if (normalized.includes("status") || normalized.includes("updated")) {
    return "status_change";
  }
  if (normalized.includes("sla") || normalized.includes("breach")) {
    return "sla_warning";
  }

  return "created";
}

export function mapActivityLogToFeed(dto: ActivityLogDto): ActivityLog {
  const type = dto.entityType === "SLA"
    ? "SLA"
    : dto.entityType === "INCIDENT"
      ? "Incident"
      : dto.entityType === "CUSTOMER"
        ? "Customer"
        : "Ticket";

  return {
    id: dto.id,
    type,
    title: dto.action.replace(/_/g, " "),
    description: dto.description,
    actor: dto.actorName,
    occurredAt: formatRelativeTime(dto.createdAt),
  };
}

export function mapActivityLogToTicketActivity(dto: ActivityLogDto): TicketActivity {
  return {
    id: dto.id,
    type: mapActivityType(dto.action),
    title: dto.action.replace(/_/g, " "),
    description: dto.description,
    actor: dto.actorName,
    occurredAt: formatRelativeTime(dto.createdAt),
  };
}

export function mapComment(dto: TicketCommentDto): TicketComment {
  return {
    id: dto.id,
    authorId: dto.authorId,
    authorName: dto.authorName,
    authorInitials: buildInitials(dto.authorName),
    message: dto.content,
    createdAt: formatRelativeTime(dto.createdAt),
    internal: dto.internalNote,
  };
}

function getMockTicketEnrichment(dto: TicketSummaryDto | TicketDetailDto) {
  return mockTickets.find((ticket) => ticket.subject === dto.subject || ticket.id === dto.id);
}

function getMockCustomerEnrichment(company: string) {
  return mockCustomers.find((customer) => customer.company === company);
}

export function mapTicket(dto: TicketSummaryDto | TicketDetailDto, agents: User[] = []): Ticket {
  const mockTicket = getMockTicketEnrichment(dto);
  const mockCustomer = getMockCustomerEnrichment(dto.customerCompany);
  const agent = agents.find((item) => item.id === dto.assignedAgentId) ?? mockUsers.find((item) => item.name === dto.assignedAgentName);
  const channel = mockTicket?.channel ?? "Email";
  const waitingSinceValue = dto.waitingSince ?? undefined;
  const resolvedAtValue = dto.resolvedAt ?? undefined;
  const reopenedAtValue = dto.reopenedAt ?? undefined;
  const escalatedAtValue = "escalatedAt" in dto ? dto.escalatedAt ?? undefined : undefined;

  return {
    id: dto.id,
    subject: dto.subject,
    description: dto.description,
    customerId: dto.customerId,
    customerName: dto.customerName,
    customerCompany: dto.customerCompany,
    requesterName: mockTicket?.requesterName ?? dto.customerName,
    requesterEmail: mockTicket?.requesterEmail ?? mockCustomer?.primaryEmail ?? "support@customer.com",
    service: mockTicket?.service ?? dto.customerCompany,
    impactSummary: mockTicket?.impactSummary ?? dto.description,
    priority: toTicketPriority(dto.priority),
    status: toTicketStatus(dto.status),
    assignedAgentId: dto.assignedAgentId ?? "",
    assignedAgentName: dto.assignedAgentName ?? agent?.name,
    assignedAgentTeam: agent?.team,
    relatedIncidentId: dto.relatedIncidentId ?? undefined,
    relatedIncidentTitle: dto.relatedIncidentTitle ?? undefined,
    escalated: dto.escalated,
    escalatedToTeam: dto.escalatedToTeam ?? undefined,
    escalationReason: "escalationReason" in dto ? dto.escalationReason ?? undefined : undefined,
    escalatedAt: escalatedAtValue ? formatDateTime(escalatedAtValue) : undefined,
    waitingSince: waitingSinceValue ? formatDateTime(waitingSinceValue) : undefined,
    waitingDuration: waitingSinceValue ? formatRelativeTime(waitingSinceValue) : undefined,
    resolvedAt: resolvedAtValue ? formatDateTime(resolvedAtValue) : undefined,
    resolutionSummary: dto.resolutionSummary ?? undefined,
    closeNotes: "closeNotes" in dto ? dto.closeNotes ?? undefined : undefined,
    reopenedAt: reopenedAtValue ? formatDateTime(reopenedAtValue) : undefined,
    reopenReason: "reopenReason" in dto ? dto.reopenReason ?? undefined : undefined,
    createdAt: formatDateTime(dto.createdAt),
    createdAtValue: dto.createdAt,
    updatedAt: formatRelativeTime(dto.updatedAt),
    updatedAtValue: dto.updatedAt,
    dueAt: formatDateTime(dto.dueAt),
    dueAtValue: dto.dueAt ?? dto.updatedAt,
    channel,
    tags: mockTicket?.tags ?? [dto.priority.toLowerCase(), dto.status.toLowerCase()],
    comments: "comments" in dto ? dto.comments.map(mapComment) : [],
    activity: "activity" in dto ? dto.activity.map(mapActivityLogToTicketActivity) : [],
    slaState: toSlaState(dto.slaState),
  };
}

export function mapCustomer(dto: CustomerSummaryDto | CustomerDetailDto, agents: User[] = [], relatedTickets: Ticket[] = []): Customer {
  const mockCustomer = getMockCustomerEnrichment(dto.company) ?? mockCustomers.find((item) => item.name === dto.name);
  const owner = agents.find((item) => item.id === dto.ownerId) ?? mockUsers.find((item) => item.name === dto.ownerName);
  const matchingTickets = relatedTickets.filter((ticket) => ticket.customerId === dto.id);

  return {
    id: dto.id,
    name: dto.name,
    company: dto.company,
    segment: dto.segment === "INDIVIDUAL" ? "Individual" : dto.segment === "ENTERPRISE" ? "Enterprise" : "SMB",
    plan: mockCustomer?.plan ?? "Support Plan",
    region: mockCustomer?.region ?? "North America",
    industry: mockCustomer?.industry ?? "Technology",
    health: dto.health === "AT_RISK" ? "At Risk" : dto.health === "WATCHLIST" ? "Watchlist" : "Healthy",
    ownerId: dto.ownerId,
    ownerName: dto.ownerName ?? owner?.name,
    ownerTitle: mockCustomer?.ownerTitle ?? "Support Owner",
    primaryEmail: dto.email,
    primaryPhone: dto.phone,
    executiveSponsor: mockCustomer?.executiveSponsor ?? "SupportOps Leadership",
    lastContactedAt: mockCustomer?.lastContactedAt ?? formatRelativeTime(dto.updatedAt),
    renewalAt: mockCustomer?.renewalAt ?? formatDateOnly(dto.updatedAt),
    openTickets: dto.openTickets,
    ticketsLast30Days: mockCustomer?.ticketsLast30Days ?? matchingTickets.length,
    avgResolutionHours: mockCustomer?.avgResolutionHours ?? 4.2,
    averageResponseTime: mockCustomer?.averageResponseTime ?? "18m",
    ticketsOpenedCount: mockCustomer?.ticketsOpenedCount ?? matchingTickets.length,
    lastIncidentAffected: mockCustomer?.lastIncidentAffected ?? "No major incident impact logged",
    lastEscalationDate: mockCustomer?.lastEscalationDate ?? "No recent escalation",
    csat: mockCustomer?.csat ?? 94,
    mrr: mockCustomer?.mrr ?? 12000,
    lifetimeValue: mockCustomer?.lifetimeValue ?? 144000,
  };
}

export function mapCustomerActivity(customer: Customer): CustomerActivity[] {
  const matchingMockCustomer = mockCustomers.find((item) => item.company === customer.company);
  if (matchingMockCustomer) {
    return customerActivityById[matchingMockCustomer.id] ?? [];
  }

  return [];
}

export function mapCustomerNotes(customer: Customer): string[] {
  const matchingMockCustomer = mockCustomers.find((item) => item.company === customer.company);
  if (matchingMockCustomer) {
    return customerNotesById[matchingMockCustomer.id] ?? [];
  }

  return [];
}

export function mapIncident(dto: IncidentSummaryDto | IncidentDetailDto, agents: User[] = []): Incident {
  const mockIncident = mockIncidents.find((item) => item.title === dto.title || item.id === dto.id);
  const owner = agents.find((item) => item.id === dto.ownerId) ?? mockUsers.find((item) => item.name === dto.ownerName);

  return {
    id: dto.id,
    title: dto.title,
    affectedService: dto.affectedService,
    affectedServices: mockIncident?.affectedServices ?? [dto.affectedService],
    severity: dto.severity === "LOW" ? "Low" : dto.severity === "HIGH" ? "High" : dto.severity === "CRITICAL" ? "Critical" : "Medium",
    status:
      dto.status === "INVESTIGATING"
        ? "Investigating"
        : dto.status === "IDENTIFIED"
          ? "Identified"
          : dto.status === "MONITORING"
            ? "Monitoring"
            : "Resolved",
    ownerId: dto.ownerId,
    ownerName: dto.ownerName,
    ownerTeam: owner?.team,
    startedAt: formatDateTime(dto.startedAt),
    startedAtValue: dto.startedAt,
    resolvedAt: formatDateTime(dto.resolvedAt),
    resolvedAtValue: dto.resolvedAt ?? undefined,
    duration: buildDuration(dto.startedAt, dto.resolvedAt),
    summary: "summary" in dto ? dto.summary : mockIncident?.summary ?? dto.affectedService,
    rootCause: "rootCause" in dto ? dto.rootCause : mockIncident?.rootCause ?? "Root cause still under review.",
    mitigation: "mitigation" in dto ? dto.mitigation : mockIncident?.mitigation ?? "Mitigation in progress.",
    linkedTicketIds: "linkedTicketIds" in dto ? dto.linkedTicketIds : [],
    linkedTicketCount: dto.linkedTicketCount ?? 0,
    affectedCustomerCount: dto.affectedCustomerCount ?? 0,
    mitigationSteps:
      ("mitigation" in dto ? dto.mitigation : mockIncident?.mitigation ?? "")
        .split(".")
        .map((step) => step.trim())
        .filter(Boolean),
    detectionSource: mockIncident?.detectionSource ?? "Monitoring",
    customerImpact: mockIncident?.customerImpact ?? "Customer impact under active review.",
    timeline: "timeline" in dto ? dto.timeline.map((item) => ({
      id: item.id,
      title: item.action.replace(/_/g, " "),
      description: item.description,
      actor: item.actorName,
      occurredAt: formatRelativeTime(item.createdAt),
    })) : mockIncident?.timeline ?? [],
  };
}

export function buildDuration(startedAt: string, resolvedAt?: string | null) {
  const start = new Date(startedAt).getTime();
  const end = resolvedAt ? new Date(resolvedAt).getTime() : Date.now();
  const minutes = Math.max(Math.round((end - start) / 60000), 1);
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  if (!hours) {
    return `${remaining}m`;
  }

  return remaining ? `${hours}h ${remaining}m` : `${hours}h`;
}

export function mapSlaRecord(dto: SlaRecordDto, ticket?: Ticket): SLARecord {
  const now = Date.now();
  const currentState = toSlaState(dto.state);

  return {
    id: dto.id,
    ticketId: dto.ticketId,
    customerId: ticket?.customerId ?? "",
    ownerId: ticket?.assignedAgentId ?? "",
    policyName: "Priority Based Policy",
    metricType: "Resolution",
    targetMinutes: Math.max(
      Math.round((new Date(dto.resolutionTargetAt).getTime() - new Date(ticket?.createdAtValue ?? dto.updatedAt).getTime()) / 60000),
      1,
    ),
    elapsedMinutes: Math.max(Math.round((now - new Date(ticket?.createdAtValue ?? dto.updatedAt).getTime()) / 60000), 0),
    status: currentState === "Breached" ? "Breached" : currentState === "Due Soon" ? "At Risk" : "Healthy",
    displayStatus: currentState,
    breachRisk: currentState === "Breached" ? "Immediate action required" : currentState === "Due Soon" ? "Priority watch" : "Within target",
    deadlineAt: formatDateTime(dto.resolutionTargetAt),
    deadlineAtValue: dto.resolutionTargetAt,
    lastUpdatedAt: formatRelativeTime(dto.updatedAt),
  };
}

export function buildUserMap(users: User[]) {
  return Object.fromEntries(users.map((user) => [user.id, user]));
}

export function buildCustomerMap(customers: Customer[]) {
  return Object.fromEntries(customers.map((customer) => [customer.id, customer]));
}

export const fallbackCustomerMap = customerMap;
