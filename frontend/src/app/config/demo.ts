import type { ApiRole } from "@/types/models";

export interface DemoAccountConfig {
  id: string;
  role: ApiRole;
  roleLabel: "Admin" | "Support Agent" | "Team Lead";
  email: string;
  password: string;
  description: string;
  accessSummary: string;
}

export const demoAccountConfigs: DemoAccountConfig[] = [
  {
    id: "demo-admin",
    role: "ADMIN",
    roleLabel: "Admin",
    email: "admin@supportops.dev",
    password: "supportops",
    description: "Workspace administration, reporting controls, and policy oversight.",
    accessSummary: "Full platform access, including analytics, team operations, incidents, and settings.",
  },
  {
    id: "demo-agent",
    role: "SUPPORT_AGENT",
    roleLabel: "Support Agent",
    email: "agent1@supportops.dev",
    password: "supportops",
    description: "Frontline queue ownership, customer follow-up, and incident support.",
    accessSummary: "Ticket, customer, and workflow views focused on day-to-day case handling.",
  },
  {
    id: "demo-team-lead",
    role: "TEAM_LEAD",
    roleLabel: "Team Lead",
    email: "lead@supportops.dev",
    password: "supportops",
    description: "Escalation management, queue balancing, and shift leadership.",
    accessSummary: "Queue health, incidents, SLA, analytics, and team-level operational controls.",
  },
];
