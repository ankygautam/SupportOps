import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { queryStaleTimes } from "@/app/config/query";
import { QueueHealthWidget } from "@/components/sla/QueueHealthWidget";
import { SlaDetailPanel } from "@/components/sla/SlaDetailPanel";
import { SlaFiltersBar, type SlaFiltersState } from "@/components/sla/SlaFiltersBar";
import { SlaPriorityBreakdownCard } from "@/components/sla/SlaPriorityBreakdownCard";
import { SlaRecordsTable } from "@/components/sla/SlaRecordsTable";
import { SlaStatsRow } from "@/components/sla/SlaStatsRow";
import { SlaTrendWidget } from "@/components/sla/SlaTrendWidget";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageErrorState } from "@/components/ui/PageErrorState";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { getSla, getSlaSummary, getTickets, getUsers } from "@/api";
import { mapTicket, mapUser } from "@/api/mappers";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useUrlQueryState } from "@/hooks/useUrlQueryState";
import { averageResolutionTimeLabel, buildSlaQueueRows, type SlaQueueRow } from "@/lib/sla";

function toApiSlaState(value: SlaFiltersState["state"]) {
  switch (value) {
    case "Due Soon":
      return "DUE_SOON";
    case "Breached":
      return "BREACHED";
    case "On Track":
      return "ON_TRACK";
    default:
      return undefined;
  }
}

export function SlaPage() {
  const { state: urlState, setState: setUrlState } = useUrlQueryState({
    q: "",
    team: "",
    state: "",
  });
  const search = urlState.q;
  const filters: SlaFiltersState = {
    team: urlState.team,
    state: urlState.state,
  };
  const [selectedRow, setSelectedRow] = useState<SlaQueueRow | null>(null);
  const deferredSearch = useDeferredValue(search);

  const usersQuery = useApiQuery([], async () => (await getUsers()).map(mapUser), {
    enabled: true,
    staleTimeMs: queryStaleTimes.directory,
  });
  const queueQuery = useApiQuery(
    [deferredSearch, filters.team, filters.state, usersQuery.data?.length],
    async () => {
      const [slaRecords, slaSummary, ticketDtos] = await Promise.all([
        getSla({
          q: deferredSearch.trim() || undefined,
          team: filters.team || undefined,
          state: toApiSlaState(filters.state),
        }),
        getSlaSummary(),
        getTickets(),
      ]);

      const tickets = ticketDtos.map((ticket) => mapTicket(ticket, usersQuery.data ?? []));
      return {
        rows: buildSlaQueueRows(slaRecords, tickets, slaSummary.averageResolutionMinutes),
        summary: slaSummary,
      };
    },
    { enabled: Boolean(usersQuery.data) },
  );

  const allRows = useMemo(() => queueQuery.data?.rows ?? [], [queueQuery.data?.rows]);
  const teamOptions = useMemo(() => Array.from(new Set(allRows.map((row) => row.assignedTeam))).sort(), [allRows]);

  useEffect(() => {
    if (!allRows.length) {
      setSelectedRow(null);
      return;
    }

    setSelectedRow((current) => (current && allRows.some((row) => row.ticketId === current.ticketId) ? current : allRows[0]));
  }, [allRows]);

  const summaryMetrics = useMemo(() => {
    const onTrack = queueQuery.data?.summary.onTrack ?? 0;
    const dueSoon = queueQuery.data?.summary.dueSoon ?? 0;
    const breached = queueQuery.data?.summary.breached ?? 0;

    return {
      onTrack,
      dueSoon,
      breached,
      avgResolutionTime: averageResolutionTimeLabel(allRows, queueQuery.data?.summary.averageResolutionMinutes),
      trend: [
        { day: "Mon", breached: Math.max(breached - 1, 0), resolved: Math.max(onTrack - 3, 1) },
        { day: "Tue", breached: Math.max(breached - 1, 0), resolved: Math.max(onTrack - 1, 1) },
        { day: "Wed", breached, resolved: Math.max(onTrack, 1) },
        { day: "Thu", breached: Math.max(breached - 1, 0), resolved: Math.max(onTrack + dueSoon, 1) },
        { day: "Fri", breached, resolved: Math.max(onTrack, 1) },
        { day: "Sat", breached: Math.max(breached - 2, 0), resolved: Math.max(onTrack - 2, 1) },
        { day: "Sun", breached: Math.max(breached - 1, 0), resolved: Math.max(onTrack - 1, 1) },
      ],
    };
  }, [allRows, queueQuery.data?.summary.averageResolutionMinutes, queueQuery.data?.summary.breached, queueQuery.data?.summary.dueSoon, queueQuery.data?.summary.onTrack]);
  const loading = usersQuery.loading || queueQuery.loading;
  const error = usersQuery.error || queueQuery.error;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Deadline Control"
        title="SLA Monitor"
        description="Watch queue urgency in real time, surface upcoming breaches, and keep support teams ahead of customer commitments."
      />

      <SearchFilterBar
        value={search}
        onChange={(event) => setUrlState({ q: event.target.value })}
        placeholder="Search ticket ID, customer, or subject"
        filters={<SlaFiltersBar filters={filters} teams={teamOptions} onChange={(next) => setUrlState(next)} />}
      />

      <SlaStatsRow
        onTrack={summaryMetrics.onTrack}
        dueSoon={summaryMetrics.dueSoon}
        breached={summaryMetrics.breached}
        avgResolutionTime={summaryMetrics.avgResolutionTime}
        loading={loading}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="default">{allRows.length} queue items visible</Badge>
        <Badge tone="warning">{summaryMetrics.dueSoon} due soon</Badge>
        <Badge tone="danger">{summaryMetrics.breached} breached</Badge>
      </div>

      {error ? (
        <PageErrorState
          title="SLA queue unavailable"
          description={error}
          onRetry={() => {
            usersQuery.retry();
            queueQuery.retry();
          }}
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <SlaRecordsTable rows={allRows} selectedTicketId={selectedRow?.ticketId} onSelect={setSelectedRow} loading={loading} />
          <div className="space-y-6">
            <SlaDetailPanel row={selectedRow} />
            <SlaPriorityBreakdownCard rows={allRows} />
            <SlaTrendWidget trend={summaryMetrics.trend} />
            <QueueHealthWidget
              onTrack={summaryMetrics.onTrack}
              dueSoon={summaryMetrics.dueSoon}
              breached={summaryMetrics.breached}
            />
          </div>
        </div>
      )}
    </div>
  );
}
