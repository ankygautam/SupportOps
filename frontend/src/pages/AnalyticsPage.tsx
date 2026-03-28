import { useState } from "react";
import { queryStaleTimes } from "@/app/config/query";
import { AnalyticsFiltersBar } from "@/components/analytics/AnalyticsFiltersBar";
import { DistributionCard } from "@/components/analytics/DistributionCard";
import { OperationalInsightsCard } from "@/components/analytics/OperationalInsightsCard";
import { RecurringIssueCategoriesCard } from "@/components/analytics/RecurringIssueCategoriesCard";
import { SlaPerformanceCard } from "@/components/analytics/SlaPerformanceCard";
import { TeamPerformanceTable } from "@/components/analytics/TeamPerformanceTable";
import { VolumeTrendCard } from "@/components/analytics/VolumeTrendCard";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageErrorState } from "@/components/ui/PageErrorState";
import { StatCard } from "@/components/ui/StatCard";
import { getAnalyticsIssues, getAnalyticsSummary, getAnalyticsTeamPerformance } from "@/api";
import type { AnalyticsRange } from "@/data/analyticsData";
import { useApiQuery } from "@/hooks/useApiQuery";

export function AnalyticsPage() {
  const [range, setRange] = useState<AnalyticsRange>("30d");
  const [team, setTeam] = useState<string>("All Teams");
  const [exportQueued, setExportQueued] = useState(false);

  const analyticsQuery = useApiQuery(
    [range, team],
    async () => {
      const [summary, teamPerformance, issues] = await Promise.all([
        getAnalyticsSummary(range, team),
        getAnalyticsTeamPerformance(team),
        getAnalyticsIssues(range, team),
      ]);

      return { summary, teamPerformance, issues };
    },
    { enabled: true, staleTimeMs: queryStaleTimes.analytics },
  );

  function queueExport() {
    setExportQueued(true);
    window.setTimeout(() => setExportQueued(false), 1800);
  }

  const data = analyticsQuery.data;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Performance Review"
        title="Analytics"
        description="Review throughput, responsiveness, SLA discipline, and recurring issue themes across the support organization."
      />

      <AnalyticsFiltersBar
        range={range}
        team={team}
        onRangeChange={setRange}
        onTeamChange={setTeam}
        onExport={queueExport}
        exportLabel={exportQueued ? "Export queued" : "Export report"}
        teams={data?.summary.teamOptions ?? ["All Teams"]}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="default">{team}</Badge>
        <Badge tone="info">{range === "7d" ? "7 day review" : range === "30d" ? "30 day review" : "90 day review"}</Badge>
        <Badge tone="success">Leadership snapshot</Badge>
      </div>

      {(analyticsQuery.error && !data) || !data ? (
        analyticsQuery.loading ? (
          <div className="grid gap-5 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="panel h-40 animate-pulse bg-slate-100" />
            ))}
          </div>
        ) : (
          <PageErrorState
            title="Analytics unavailable"
            description={analyticsQuery.error || "We couldn't load the performance review."}
            onRetry={analyticsQuery.retry}
          />
        )
      ) : (
        <>
          <div className="grid gap-5 xl:grid-cols-4">
            <StatCard
              label="Tickets Resolved"
              value={data.summary.ticketsResolved}
              delta={data.summary.ticketsResolvedDelta}
              trend="up"
              supportingText="Resolution volume reflects the currently selected reporting window."
            />
            <StatCard
              label="Avg First Response Time"
              value={data.summary.avgFirstResponse}
              delta={data.summary.avgFirstResponseDelta}
              trend="down"
              supportingText="Average first-touch speed across active frontline handling."
            />
            <StatCard
              label="SLA Compliance"
              value={data.summary.slaCompliance}
              delta={data.summary.slaComplianceDelta}
              trend="up"
              supportingText="Commitments met before breach across the selected view."
            />
            <StatCard
              label="Active Incidents"
              value={data.summary.activeIncidents}
              delta={data.summary.activeIncidentsDelta}
              trend="down"
              supportingText="Live reliability events still influencing support demand."
            />
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            <StatCard
              label="Mean Time To Resolution"
              value={data.summary.meanTimeToResolution}
              delta="current period"
              trend="down"
              supportingText="Average time from ticket creation to resolution across completed work."
            />
            <StatCard
              label="Reopened Ticket Rate"
              value={data.summary.reopenedTicketRate}
              delta="quality signal"
              trend="up"
              supportingText="A useful proxy for resolution quality and customer confidence."
            />
            <StatCard
              label="Incident Frequency"
              value={data.summary.incidentFrequency}
              delta="reliability load"
              trend="up"
              supportingText="Declared incidents affecting support demand in the current reporting window."
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <VolumeTrendCard range={range} points={data.summary.volumeTrend} onRangeChange={setRange} />
            <OperationalInsightsCard insights={data.issues.insights} />
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <DistributionCard
              title="Tickets by Status"
              description="Distribution across active and completed queue states."
              items={data.summary.statusDistribution}
            />
            <DistributionCard
              title="Tickets by Priority"
              description="Operational weight of lower versus higher urgency workloads."
              items={data.summary.priorityDistribution}
            />
            <SlaPerformanceCard points={data.summary.slaPerformance} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <DistributionCard
              title="Agent Workload Distribution"
              description="Open queue ownership pressure across active teammates."
              items={data.summary.workloadDistribution}
            />
            <div className="panel p-6">
              <p className="section-title">Period comparison</p>
              <p className="section-helper mt-1">Current period performance against the previous review window.</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {data.summary.comparisonMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-4">
                    <p className="meta-label">{metric.label}</p>
                    <div className="mt-3 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-slate-950">{metric.currentValue}</p>
                        <p className="mt-1 text-sm text-slate-500">Previous: {metric.previousValue}</p>
                      </div>
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">{metric.delta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <TeamPerformanceTable rows={data.teamPerformance.rows} />

          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <RecurringIssueCategoriesCard items={data.issues.categories} />
            <div className="panel p-6">
              <p className="section-title">Most impacted customers</p>
              <p className="section-helper mt-1">Accounts currently carrying the highest operational load.</p>
              <div className="mt-5 space-y-4">
                {data.summary.impactedCustomers.map((customer) => (
                  <div key={customer.customerId} className="rounded-2xl bg-slate-50 px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{customer.company}</p>
                        <p className="mt-1 text-sm text-slate-500">{customer.note}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{customer.openTickets} open</p>
                        <p className="mt-1 text-sm text-slate-500">{customer.highPriorityTickets} high priority</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
