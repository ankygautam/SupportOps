import { demoAccountConfigs } from "@/app/config/demo";
import type { ApiRole } from "@/types/models";

export interface DemoRoleGuide {
  role: ApiRole;
  title: string;
  subtitle: string;
  summary: string;
  checklist: string[];
  email: string;
  password: string;
}

export const demoRoleGuides: DemoRoleGuide[] = [
  {
    role: "ADMIN",
    title: "Admin",
    subtitle: "Platform oversight and operational policy",
    summary: "Best for showing the full platform, including analytics, team management, settings depth, and cross-workspace visibility.",
    checklist: [
      "Review the dashboard overview and shift snapshot.",
      "Open Team to manage roles, staffing, and ownership coverage.",
      "Inspect Analytics for operational comparison, workload, and impacted-customer reporting.",
      "Visit Settings to show role-aware operational controls and persisted workspace preferences.",
    ],
    email: demoAccountConfigs[0].email,
    password: demoAccountConfigs[0].password,
  },
  {
    role: "TEAM_LEAD",
    title: "Team Lead",
    subtitle: "Queue health, escalation, and incident coordination",
    summary: "Best for demonstrating ticket reassignment, escalation workflows, SLA pressure, and incident management.",
    checklist: [
      "Open Tickets and use saved views like Critical Queue or Waiting on Customer.",
      "Inspect a ticket detail screen to show escalation, resolution, reopen, and incident linkage.",
      "Review Incidents and SLA Monitor for active operational pressure.",
      "Use the notification bell to show escalations, incidents, and SLA events.",
    ],
    email: demoAccountConfigs[2].email,
    password: demoAccountConfigs[2].password,
  },
  {
    role: "SUPPORT_AGENT",
    title: "Support Agent",
    subtitle: "Frontline case handling and customer follow-up",
    summary: "Best for showing day-to-day support work: assigned tickets, comments, internal notes, customer context, and workflow updates.",
    checklist: [
      "Open your queue and use the Assigned to me filter.",
      "Add a public reply or internal note from the ticket workspace.",
      "Update ticket status and review the mixed activity timeline.",
      "Check customer history and linked incident context on active cases.",
    ],
    email: demoAccountConfigs[1].email,
    password: demoAccountConfigs[1].password,
  },
];

export const showcaseQuickLinks = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Tickets", to: "/tickets" },
  { label: "Incidents", to: "/incidents" },
  { label: "SLA", to: "/sla" },
  { label: "Analytics", to: "/analytics" },
  { label: "Team", to: "/team" },
];

export const productTourByRoute: Record<string, { title: string; description: string; bullets: string[] }> = {
  "/dashboard": {
    title: "Dashboard summary",
    description: "Start here to explain the product quickly.",
    bullets: [
      "Summary cards show queue pressure, incident severity, and SLA exposure.",
      "Activity, assigned work, and handoff narrative make the screen presentation-friendly.",
    ],
  },
  "/tickets": {
    title: "Ticket queue",
    description: "This is the core support workflow surface.",
    bullets: [
      "Saved views, filters, sorting, and pagination reflect real support operations behavior.",
      "Escalated and incident-linked tickets are surfaced directly in the table for fast triage.",
    ],
  },
  "/tickets/:id": {
    title: "Ticket detail",
    description: "Use this view to show operational depth.",
    bullets: [
      "Escalation, reassignment, waiting-on-customer state, resolution notes, and reopen flow are all modeled here.",
      "Comments and system events share a unified activity feed so the case history feels realistic.",
    ],
  },
  "/incidents": {
    title: "Incident command",
    description: "Shows how support and reliability workflows connect.",
    bullets: [
      "Incidents display linked ticket counts and affected customer context.",
      "Saved incident views make the screen stronger for demos and screenshots.",
    ],
  },
  "/sla": {
    title: "SLA monitor",
    description: "Use this page to explain urgency and operational risk.",
    bullets: [
      "The queue emphasizes on-track, due soon, and breached states clearly.",
      "This surface helps tell the story of how support teams prioritize work in real time.",
    ],
  },
  "/analytics": {
    title: "Analytics",
    description: "Best for product storytelling with leadership-focused insights.",
    bullets: [
      "Trend comparison, workload distribution, MTTR, reopened rate, and impacted customers show operational depth.",
      "The page is designed for demos, screenshots, and stakeholder walkthroughs.",
    ],
  },
  "/team": {
    title: "Team management",
    description: "Demonstrates admin tooling and role-aware operations controls.",
    bullets: [
      "Role changes, active/inactive state, and ownership coverage are all visible here.",
      "This page helps showcase product thinking beyond dashboards and tables.",
    ],
  },
};
