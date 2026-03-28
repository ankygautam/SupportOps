import {
  AlertTriangle,
  BarChart3,
  Clock3,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Ticket,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ApiRole } from "@/types/models";

export interface NavigationRoute {
  label: string;
  to: string;
  icon: LucideIcon;
  allowedRoles?: ApiRole[];
}

export const navigationRoutes: NavigationRoute[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Tickets", to: "/tickets", icon: Ticket },
  { label: "Incidents", to: "/incidents", icon: AlertTriangle, allowedRoles: ["ADMIN", "TEAM_LEAD"] },
  { label: "Customers", to: "/customers", icon: Users },
  { label: "SLA Monitor", to: "/sla", icon: Clock3, allowedRoles: ["ADMIN", "TEAM_LEAD"] },
  { label: "Analytics", to: "/analytics", icon: BarChart3, allowedRoles: ["ADMIN", "TEAM_LEAD"] },
  { label: "Team", to: "/team", icon: ShieldCheck, allowedRoles: ["ADMIN", "TEAM_LEAD"] },
  { label: "Settings", to: "/settings", icon: Settings },
];

export const restrictedRouteRoles: Partial<Record<string, ApiRole[]>> = {
  "/incidents": ["ADMIN", "TEAM_LEAD"],
  "/sla": ["ADMIN", "TEAM_LEAD"],
  "/analytics": ["ADMIN", "TEAM_LEAD"],
  "/team": ["ADMIN", "TEAM_LEAD"],
};

export const routeHeaderCopy: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Monitor queue health, incidents, and SLA pressure in one view." },
  "/tickets": { title: "Tickets", subtitle: "Review customer issues, routing, and ownership across the queue." },
  "/incidents": { title: "Incidents", subtitle: "Track active outages, impact, and post-incident follow-through." },
  "/customers": { title: "Customers", subtitle: "Keep context on account health, history, and escalations." },
  "/sla": { title: "SLA Monitor", subtitle: "Stay ahead of deadlines and prioritize customers at risk." },
  "/analytics": { title: "Analytics", subtitle: "Measure response performance, throughput, and team load." },
  "/team": { title: "Team", subtitle: "Manage support staff, ownership, and operational coverage." },
  "/settings": { title: "Settings", subtitle: "Manage support workflow defaults, notifications, and access." },
};
