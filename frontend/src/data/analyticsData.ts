export type AnalyticsRange = "7d" | "30d" | "90d";

export interface AnalyticsSummarySnapshot {
  ticketsResolved: string;
  ticketsResolvedDelta: string;
  avgFirstResponse: string;
  avgFirstResponseDelta: string;
  slaCompliance: string;
  slaComplianceDelta: string;
  activeIncidents: string;
  activeIncidentsDelta: string;
}

export interface VolumePoint {
  label: string;
  opened: number;
  resolved: number;
}

export interface DistributionDatum {
  label: string;
  value: number;
  toneClass: string;
}

export interface TeamPerformanceRow {
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

export interface IssueCategoryDatum {
  category: string;
  count: number;
  delta: string;
  toneClass: string;
}

export interface OperationalInsight {
  id: string;
  title: string;
  description: string;
  tone: "default" | "success" | "warning" | "danger";
}

export const analyticsRangeOptions = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
] as const;

export const analyticsTeamOptions = [
  "All Teams",
  "Enterprise Escalations",
  "Core Platform",
  "Reliability",
  "Billing",
  "Operations Leadership",
] as const;

export const analyticsSummaryByRange: Record<AnalyticsRange, AnalyticsSummarySnapshot> = {
  "7d": {
    ticketsResolved: "126",
    ticketsResolvedDelta: "+14%",
    avgFirstResponse: "18m",
    avgFirstResponseDelta: "-12%",
    slaCompliance: "96.8%",
    slaComplianceDelta: "+1.6%",
    activeIncidents: "2",
    activeIncidentsDelta: "-1",
  },
  "30d": {
    ticketsResolved: "542",
    ticketsResolvedDelta: "+9%",
    avgFirstResponse: "21m",
    avgFirstResponseDelta: "-8%",
    slaCompliance: "95.9%",
    slaComplianceDelta: "+1.1%",
    activeIncidents: "6",
    activeIncidentsDelta: "-2",
  },
  "90d": {
    ticketsResolved: "1,648",
    ticketsResolvedDelta: "+6%",
    avgFirstResponse: "24m",
    avgFirstResponseDelta: "-5%",
    slaCompliance: "94.7%",
    slaComplianceDelta: "+0.8%",
    activeIncidents: "14",
    activeIncidentsDelta: "-4",
  },
};

export const volumeTrendByRange: Record<AnalyticsRange, VolumePoint[]> = {
  "7d": [
    { label: "Mar 22", opened: 48, resolved: 41 },
    { label: "Mar 23", opened: 52, resolved: 47 },
    { label: "Mar 24", opened: 57, resolved: 51 },
    { label: "Mar 25", opened: 61, resolved: 56 },
    { label: "Mar 26", opened: 54, resolved: 59 },
    { label: "Mar 27", opened: 49, resolved: 58 },
    { label: "Mar 28", opened: 45, resolved: 63 },
  ],
  "30d": [
    { label: "Week 1", opened: 286, resolved: 271 },
    { label: "Week 2", opened: 301, resolved: 292 },
    { label: "Week 3", opened: 315, resolved: 309 },
    { label: "Week 4", opened: 298, resolved: 326 },
  ],
  "90d": [
    { label: "Jan", opened: 1180, resolved: 1114 },
    { label: "Feb", opened: 1248, resolved: 1211 },
    { label: "Mar", opened: 1215, resolved: 1304 },
  ],
};

export const ticketStatusAnalytics: DistributionDatum[] = [
  { label: "New", value: 14, toneClass: "bg-sky-500" },
  { label: "In Progress", value: 34, toneClass: "bg-amber-500" },
  { label: "Waiting on Customer", value: 11, toneClass: "bg-violet-500" },
  { label: "Resolved", value: 28, toneClass: "bg-emerald-500" },
  { label: "Closed", value: 13, toneClass: "bg-slate-400" },
];

export const ticketPriorityAnalytics: DistributionDatum[] = [
  { label: "Low", value: 18, toneClass: "bg-slate-400" },
  { label: "Medium", value: 37, toneClass: "bg-sky-500" },
  { label: "High", value: 29, toneClass: "bg-amber-500" },
  { label: "Critical", value: 16, toneClass: "bg-rose-500" },
];

export const slaPerformanceTrend = [
  { label: "Mon", met: 94, breached: 6 },
  { label: "Tue", met: 95, breached: 5 },
  { label: "Wed", met: 93, breached: 7 },
  { label: "Thu", met: 96, breached: 4 },
  { label: "Fri", met: 97, breached: 3 },
  { label: "Sat", met: 98, breached: 2 },
  { label: "Sun", met: 96, breached: 4 },
];

export const teamPerformanceRows: TeamPerformanceRow[] = [
  {
    id: "tp1",
    agent: "Maya Patel",
    team: "Enterprise Escalations",
    assigned: 18,
    resolved: 14,
    avgResponse: "12m",
    slaScore: "98%",
    csat: "96",
    workload: 74,
  },
  {
    id: "tp2",
    agent: "Daniel Kim",
    team: "Core Platform",
    assigned: 22,
    resolved: 17,
    avgResponse: "16m",
    slaScore: "97%",
    csat: "94",
    workload: 82,
  },
  {
    id: "tp3",
    agent: "Ivy Chen",
    team: "Reliability",
    assigned: 11,
    resolved: 9,
    avgResponse: "19m",
    slaScore: "95%",
    csat: "93",
    workload: 69,
  },
  {
    id: "tp4",
    agent: "Noah Thompson",
    team: "Billing",
    assigned: 20,
    resolved: 15,
    avgResponse: "22m",
    slaScore: "91%",
    csat: "89",
    workload: 86,
  },
  {
    id: "tp5",
    agent: "Sarah Chen",
    team: "Operations Leadership",
    assigned: 8,
    resolved: 6,
    avgResponse: "14m",
    slaScore: "99%",
    csat: "97",
    workload: 53,
  },
];

export const recurringIssueCategories: IssueCategoryDatum[] = [
  { category: "Login / Authentication", count: 84, delta: "+9%", toneClass: "text-sky-700 bg-sky-50" },
  { category: "Billing", count: 67, delta: "+18%", toneClass: "text-amber-700 bg-amber-50" },
  { category: "API Errors", count: 53, delta: "-4%", toneClass: "text-rose-700 bg-rose-50" },
  { category: "Email Notifications", count: 46, delta: "-7%", toneClass: "text-emerald-700 bg-emerald-50" },
  { category: "Appointment Sync", count: 31, delta: "+6%", toneClass: "text-violet-700 bg-violet-50" },
  { category: "Mobile App Stability", count: 28, delta: "-2%", toneClass: "text-slate-700 bg-slate-100" },
];

export const operationalInsights: OperationalInsight[] = [
  {
    id: "oi1",
    title: "Billing-related tickets increased 18% this week",
    description: "Month-end reconciliation traffic is driving higher finance queue pressure for WestGrid and related SMB accounts.",
    tone: "warning",
  },
  {
    id: "oi2",
    title: "Avg first response improved by 12%",
    description: "Core Platform handoff coverage is reducing wait time during the morning intake surge.",
    tone: "success",
  },
  {
    id: "oi3",
    title: "Two incidents impacted portal availability",
    description: "Authentication and portal degradation combined to raise customer-facing risk for enterprise accounts.",
    tone: "danger",
  },
  {
    id: "oi4",
    title: "Critical queue is lower than last period",
    description: "Escalation pacing improved after enterprise triage rotation changes landed earlier this week.",
    tone: "default",
  },
];
