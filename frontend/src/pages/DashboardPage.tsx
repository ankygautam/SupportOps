import { motion } from "framer-motion";
import { ArrowUpRight, Filter, Plus } from "lucide-react";
import { Button } from "@/components/forms/Button";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { AssignedTicketsCard } from "@/components/dashboard/AssignedTicketsCard";
import { IncidentDeck } from "@/components/dashboard/IncidentDeck";
import { ResponseTrendCard } from "@/components/dashboard/ResponseTrendCard";
import { StatusBreakdownCard } from "@/components/dashboard/StatusBreakdownCard";
import { TeamUtilizationCard } from "@/components/dashboard/TeamUtilizationCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageErrorState } from "@/components/ui/PageErrorState";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";
import { StatCard } from "@/components/ui/StatCard";
import { getDashboardActivity, getDashboardSummary, getIncidents, getTickets, getUsers } from "@/api";
import { mapActivityLogToFeed, mapIncident, mapTicket, mapUser } from "@/api/mappers";
import { useAuth } from "@/contexts/AuthContext";
import { useApiQuery } from "@/hooks/useApiQuery";
import type { StatusBreakdown, TrendPoint } from "@/types/models";

function buildResponseTrend(values: ReturnType<typeof mapTicket>[]): TrendPoint[] {
  const formatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
  const days = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return {
      key: date.toISOString().slice(0, 10),
      label: formatter.format(date),
      value: 0,
      count: 0,
    };
  });

  values.forEach((ticket) => {
    const key = ticket.createdAtValue.slice(0, 10);
    const bucket = days.find((item) => item.key === key);
    if (!bucket) {
      return;
    }

    const responseMinutes = Math.max(
      Math.round((new Date(ticket.updatedAtValue).getTime() - new Date(ticket.createdAtValue).getTime()) / 60000),
      1,
    );
    bucket.value += responseMinutes;
    bucket.count += 1;
  });

  return days.map((item) => ({
    label: item.label,
    value: item.count ? Math.round(item.value / item.count) : 0,
  }));
}

function buildStatusBreakdown(values: ReturnType<typeof mapTicket>[]): StatusBreakdown[] {
  return [
    { label: "New", value: values.filter((ticket) => ticket.status === "New").length, colorClass: "bg-sky-500" },
    { label: "In Progress", value: values.filter((ticket) => ticket.status === "In Progress").length, colorClass: "bg-amber-500" },
    {
      label: "Waiting on Customer",
      value: values.filter((ticket) => ticket.status === "Waiting on Customer").length,
      colorClass: "bg-violet-500",
    },
    { label: "Resolved", value: values.filter((ticket) => ticket.status === "Resolved").length, colorClass: "bg-emerald-500" },
    { label: "Closed", value: values.filter((ticket) => ticket.status === "Closed").length, colorClass: "bg-slate-400" },
  ];
}

export function DashboardPage() {
  const { user, hasRole } = useAuth();
  const canViewReliability = hasRole("ADMIN", "TEAM_LEAD");
  const { data, loading, error, retry } = useApiQuery(
    [user?.id, canViewReliability],
    async () => {
      const [summary, activityDtos, userDtos, ticketDtos, incidentDtos] = await Promise.all([
        getDashboardSummary(),
        getDashboardActivity(),
        getUsers(),
        getTickets(),
        canViewReliability ? getIncidents() : Promise.resolve([]),
      ]);

      const agents = userDtos.map(mapUser);
      const tickets = ticketDtos.map((ticket) => mapTicket(ticket, agents));
      const incidents = incidentDtos.map((incident) => mapIncident(incident, agents));

      return {
        summary,
        activity: activityDtos.map(mapActivityLogToFeed),
        agents,
        tickets,
        incidents,
      };
    },
    { enabled: Boolean(user) },
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonBlock className="h-28 w-full" />
        <div className="grid gap-5 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-48 w-full" />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <SkeletonBlock className="h-[430px] w-full" />
          <SkeletonBlock className="h-[430px] w-full" />
        </div>
      </div>
    );
  }

  if ((error && !data) || !data) {
    return (
      <PageErrorState
        title="Dashboard unavailable"
        description={error || "We couldn't load the operations snapshot."}
        onRetry={retry}
      />
    );
  }

  const summaryMetrics = [
    {
      label: "Open Tickets",
      value: String(data.summary.openTickets),
      delta: `${data.summary.assignedToMeCount} assigned`,
      trend: "up" as const,
      supportingText: "Active work that still needs customer follow-up or operational action.",
    },
    {
      label: "Critical Incidents",
      value: String(data.summary.criticalIncidents),
      delta: canViewReliability ? "live feed" : "restricted",
      trend: data.summary.criticalIncidents > 0 ? ("up" as const) : ("down" as const),
      supportingText: "Reliability events with the highest potential customer impact.",
    },
    {
      label: "SLA Breaches",
        value: String(data.summary.slaBreaches),
        delta: data.summary.slaBreaches > 0 ? "needs review" : "stable",
        trend: data.summary.slaBreaches > 0 ? ("up" as const) : ("down" as const),
        supportingText: "Tickets that crossed their active target window and need intervention.",
    },
    {
      label: "Avg First Response",
      value: `${data.summary.averageFirstResponseMinutes}m`,
      delta: "current period",
      trend: "down" as const,
      supportingText: "Average time to first support touch across the active queue snapshot.",
    },
  ];

  const statusBreakdown = buildStatusBreakdown(data.tickets);
  const responseTrend = buildResponseTrend(data.tickets);
  const assignedTickets = data.tickets.filter((ticket) => ticket.assignedAgentId === user?.id).slice(0, 4);
  const teamUtilization = data.agents.map((agent) => {
    const assigned = data.tickets.filter((ticket) => ticket.assignedAgentId === agent.id);
    const resolvedToday = assigned.filter((ticket) => ticket.status === "Resolved" || ticket.status === "Closed").length;
    return {
      name: agent.name,
      tickets: assigned.length,
      resolvedToday,
      utilization: Math.min(35 + assigned.length * 12, 96),
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Morning Snapshot"
        title="Support operations at a glance"
        description="Stay on top of live queue health, customer risk, and incident pressure with a single operational view built for support teams."
        actions={
          <>
            <Button type="button" variant="secondary">
              <Filter className="h-4 w-4" />
              Filter view
            </Button>
            <Button type="button">
              <Plus className="h-4 w-4" />
              New ticket
            </Button>
          </>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid gap-5 xl:grid-cols-4"
      >
        {summaryMetrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ResponseTrendCard points={responseTrend} />
            <StatusBreakdownCard items={statusBreakdown} />
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <ActivityFeed items={data.activity} />
            <AssignedTicketsCard tickets={assignedTickets} />
          </div>
        </div>
        <div className="space-y-6">
          <IncidentDeck incidents={data.incidents} />
          <TeamUtilizationCard rows={teamUtilization} />
          <div className="panel overflow-hidden p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-title">Shift handoff</p>
                <p className="section-helper mt-1">Operations summary prepared for the next regional team.</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-700 shadow-soft">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-6 rounded-3xl bg-slate-950 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Queue Brief</p>
              <p className="mt-3 text-xl font-semibold tracking-tight">
                {data.summary.openTickets > 20
                  ? "Queue pressure is elevated and should stay visible during the next handoff."
                  : "Queue volume is stable, with focused attention needed on a few high-urgency items."}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {data.summary.slaBreaches > 0
                  ? `${data.summary.slaBreaches} breached SLA items need follow-up, and ${data.summary.assignedToMeCount} tickets remain directly assigned to you.`
                  : `No active breaches are visible right now. Keep watching ${data.summary.criticalIncidents} critical incident signals and ${data.summary.openTickets} open tickets.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
