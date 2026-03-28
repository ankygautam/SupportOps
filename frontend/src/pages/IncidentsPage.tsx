import { useDeferredValue, useEffect, useState } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import { queryStaleTimes } from "@/app/config/query";
import { defaultTablePageSizes } from "@/app/config/options";
import { storageKeys } from "@/app/config/storage";
import { CreateIncidentModal, type NewIncidentValues } from "@/components/incidents/CreateIncidentModal";
import { IncidentDrawer } from "@/components/incidents/IncidentDrawer";
import { IncidentsFiltersBar, type IncidentsFiltersState } from "@/components/incidents/IncidentsFiltersBar";
import { IncidentsStatsRow } from "@/components/incidents/IncidentsStatsRow";
import { IncidentsTable } from "@/components/incidents/IncidentsTable";
import { Button } from "@/components/forms/Button";
import { SelectField } from "@/components/forms/SelectField";
import { DataTablePagination } from "@/components/tables/DataTablePagination";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageErrorState } from "@/components/ui/PageErrorState";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { createIncident, getIncident, getIncidents, getUsers } from "@/api";
import { mapIncident, mapUser } from "@/api/mappers";
import { useToast } from "@/contexts/ToastContext";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useUrlQueryState } from "@/hooks/useUrlQueryState";
import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from "@/lib/browserStorage";

const initialFilters: IncidentsFiltersState = {
  severity: "",
  status: "",
};

const savedIncidentViews = [
  { id: "active", label: "Active Incidents", filters: { status: "Investigating" as const } },
  { id: "critical", label: "Critical", filters: { severity: "Critical" as const } },
  { id: "monitoring", label: "Monitoring", filters: { status: "Monitoring" as const } },
  { id: "portal", label: "Portal / Auth", query: "portal" },
];

function toApiSeverity(value: IncidentsFiltersState["severity"] | NewIncidentValues["severity"]) {
  switch (value) {
    case "Low":
      return "LOW";
    case "High":
      return "HIGH";
    case "Critical":
      return "CRITICAL";
    case "Medium":
      return "MEDIUM";
    default:
      return undefined;
  }
}

function toApiIncidentStatus(value: IncidentsFiltersState["status"] | NewIncidentValues["status"]) {
  switch (value) {
    case "Investigating":
      return "INVESTIGATING";
    case "Identified":
      return "IDENTIFIED";
    case "Monitoring":
      return "MONITORING";
    case "Resolved":
      return "RESOLVED";
    default:
      return undefined;
  }
}

export function IncidentsPage() {
  const { pushToast } = useToast();
  const initialSavedView = getLocalStorageItem(storageKeys.incidentsView) ?? "";
  const { state: urlState, setState: setUrlState } = useUrlQueryState({
    q: "",
    severity: "",
    status: "",
    pageSize: Number(defaultTablePageSizes[0]),
    page: 1,
    view: initialSavedView,
  });
  const search = urlState.q;
  const filters: IncidentsFiltersState = {
    severity: urlState.severity as IncidentsFiltersState["severity"],
    status: urlState.status as IncidentsFiltersState["status"],
  };
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const savedViewId = urlState.view;
  const pageSize = Number(urlState.pageSize) || Number(defaultTablePageSizes[0]);
  const page = Number(urlState.page) || 1;
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    if (savedViewId) {
      const view = savedIncidentViews.find((item) => item.id === savedViewId);
      if (view) {
        setUrlState({
          q: view.query ?? "",
          severity: view.filters?.severity ?? "",
          status: view.filters?.status ?? "",
          page: 1,
        });
      }
    }
  }, [savedViewId, setUrlState]);

  const usersQuery = useApiQuery([], async () => (await getUsers()).map(mapUser), {
    enabled: true,
    staleTimeMs: queryStaleTimes.directory,
  });
  const incidentsQuery = useApiQuery(
    [reloadKey, deferredSearch, filters.severity, filters.status],
    async () => {
      const incidents = await getIncidents({
        q: deferredSearch.trim() || undefined,
        severity: toApiSeverity(filters.severity),
        status: toApiIncidentStatus(filters.status),
      });

      return incidents.map((incident) => mapIncident(incident, usersQuery.data ?? []));
    },
    { enabled: Boolean(usersQuery.data) },
  );
  const detailQuery = useApiQuery(
    [selectedIncidentId, reloadKey],
    async () => mapIncident(await getIncident(selectedIncidentId ?? ""), usersQuery.data ?? []),
    { enabled: Boolean(selectedIncidentId) && Boolean(usersQuery.data) },
  );

  async function handleCreateIncident(values: NewIncidentValues) {
    try {
      await createIncident({
        title: values.title,
        affectedService: values.affectedService,
        severity: toApiSeverity(values.severity) ?? "MEDIUM",
        status: toApiIncidentStatus(values.status) ?? "INVESTIGATING",
        ownerId: values.ownerId,
        summary: values.summary,
        rootCause: values.rootCause,
        mitigation: values.mitigation,
        startedAt: new Date(values.startedAt).toISOString(),
      });

      setReloadKey((value) => value + 1);
      pushToast({ tone: "success", title: "Incident created", description: "The incident has been added to the active command queue." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create incident.";
      pushToast({ tone: "error", title: "Incident creation failed", description: message });
      throw error;
    }
  }

  function applySavedView(viewId: string) {
    const nextView = savedIncidentViews.find((view) => view.id === viewId);
    if (!nextView) {
      removeLocalStorageItem(storageKeys.incidentsView);
      setUrlState({ view: "", page: 1 });
      return;
    }

    setLocalStorageItem(storageKeys.incidentsView, viewId);
    setUrlState({
      view: viewId,
      q: nextView.query ?? "",
      severity: nextView.filters?.severity ?? "",
      status: nextView.filters?.status ?? "",
      page: 1,
    });
  }

  const allIncidents = incidentsQuery.data ?? [];
  const paginatedIncidents = allIncidents.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(Math.ceil(allIncidents.length / pageSize), 1);
  const activeCount = allIncidents.filter((incident) => incident.status !== "Resolved").length;
  const criticalCount = allIncidents.filter((incident) => incident.severity === "Critical").length;
  const monitoringCount = allIncidents.filter((incident) => incident.status === "Monitoring").length;
  const resolvedTodayCount = allIncidents.filter((incident) => incident.status === "Resolved").length;
  const loading = usersQuery.loading || incidentsQuery.loading;
  const error = usersQuery.error || incidentsQuery.error;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reliability"
        title="Incidents"
        description="Coordinate outages, see affected ticket volume, and keep customer impact readable for support leadership."
      />

      <SearchFilterBar
        value={search}
        onChange={(event) => {
          setUrlState({ q: event.target.value, page: 1, view: "" });
        }}
        placeholder="Search incident ID, title, or service"
        filters={
          <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
            <IncidentsFiltersBar filters={filters} onChange={(next) => { setUrlState({ ...next, page: 1, view: "" }); }} />
            <div className="grid gap-3 md:grid-cols-2">
              <SelectField value={String(pageSize)} onChange={(event) => { setUrlState({ pageSize: Number(event.target.value), page: 1 }); }}>
                {defaultTablePageSizes.map((size) => (
                  <option key={size} value={String(size)}>
                    {size} rows
                  </option>
                ))}
              </SelectField>
              <Button type="button" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                Create incident
              </Button>
            </div>
          </div>
        }
      />

      <IncidentsStatsRow
        active={activeCount}
        critical={criticalCount}
        monitoring={monitoringCount}
        resolvedToday={resolvedTodayCount}
        loading={loading}
      />

      <div className="panel p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {savedIncidentViews.map((view) => (
              <button
                key={view.id}
                type="button"
                onClick={() => applySavedView(view.id)}
                className={`filter-chip ${
                  savedViewId === view.id ? "bg-slate-950 text-white shadow-soft" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              removeLocalStorageItem(storageKeys.incidentsView);
              setUrlState({ q: "", ...initialFilters, page: 1, view: "" });
            }}
          >
            <RefreshCcw className="h-4 w-4" />
            Reset all
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="default">{allIncidents.length} incidents visible</Badge>
        <Badge tone="danger">{criticalCount} critical</Badge>
        <Badge tone="warning">{monitoringCount} monitoring</Badge>
        <Badge tone="info">{allIncidents.reduce((sum, incident) => sum + (incident.linkedTicketCount ?? 0), 0)} linked tickets</Badge>
      </div>

      {error ? (
        <PageErrorState
          title="Incident queue unavailable"
          description={error}
          onRetry={() => {
            usersQuery.retry();
            incidentsQuery.retry();
            detailQuery.retry();
          }}
        />
      ) : (
        <IncidentsTable incidents={paginatedIncidents} onOpen={(incident) => setSelectedIncidentId(incident.id)} loading={loading} />
      )}

      <DataTablePagination
        page={page}
        totalPages={totalPages}
        totalItems={allIncidents.length}
        pageSize={pageSize}
        currentCount={paginatedIncidents.length}
        onPrevious={() => setUrlState({ page: Math.max(page - 1, 1) })}
        onNext={() => setUrlState({ page: Math.min(page + 1, totalPages) })}
      />

      <IncidentDrawer incident={detailQuery.data ?? null} onClose={() => setSelectedIncidentId(null)} />
      <CreateIncidentModal open={createOpen} users={usersQuery.data ?? []} onClose={() => setCreateOpen(false)} onCreate={handleCreateIncident} />
    </div>
  );
}
