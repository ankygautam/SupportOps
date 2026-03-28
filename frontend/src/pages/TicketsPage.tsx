import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Filter, Plus, RefreshCcw, UserRound } from "lucide-react";
import { queryStaleTimes } from "@/app/config/query";
import { defaultTablePageSizes } from "@/app/config/options";
import { storageKeys } from "@/app/config/storage";
import { Button } from "@/components/forms/Button";
import { SelectField } from "@/components/forms/SelectField";
import { DataTablePagination } from "@/components/tables/DataTablePagination";
import { CreateTicketModal, type NewTicketFormValues } from "@/components/tickets/CreateTicketModal";
import { TicketFiltersBar, type TicketFiltersState } from "@/components/tickets/TicketFiltersBar";
import { TicketsStatsRow } from "@/components/tickets/TicketsStatsRow";
import { TicketsTable } from "@/components/tickets/TicketsTable";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageErrorState } from "@/components/ui/PageErrorState";
import { createTicket, getCustomers, getTickets, getUsers } from "@/api";
import { mapCustomer, mapTicket, mapUser } from "@/api/mappers";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useUrlQueryState } from "@/hooks/useUrlQueryState";
import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from "@/lib/browserStorage";
import { matchesDateRange } from "@/lib/tickets";

const emptyFilters: TicketFiltersState = {
  status: "",
  priority: "",
  assignedAgentId: "",
  slaState: "",
  fromDate: "",
  toDate: "",
};

type SortMode = "updated" | "due" | "priority";

const savedViews = [
  { id: "my-open", label: "My Open Tickets", filters: { status: "In Progress" as const }, scope: "mine" as const },
  { id: "critical", label: "Critical Queue", filters: { priority: "Critical" as const } },
  { id: "waiting", label: "Waiting on Customer", filters: { status: "Waiting on Customer" as const } },
  { id: "breached", label: "Breached SLA", filters: { slaState: "Breached" as const } },
  { id: "billing", label: "Billing Issues", query: "billing" },
];

function toApiTicketStatus(value: NewTicketFormValues["status"] | TicketFiltersState["status"]) {
  switch (value) {
    case "In Progress":
      return "IN_PROGRESS";
    case "Waiting on Customer":
      return "WAITING_ON_CUSTOMER";
    case "Resolved":
      return "RESOLVED";
    case "Closed":
      return "CLOSED";
    case "New":
      return "NEW";
    default:
      return undefined;
  }
}

function toApiTicketPriority(value: NewTicketFormValues["priority"] | TicketFiltersState["priority"]) {
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

function toApiSlaState(value: TicketFiltersState["slaState"]) {
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

function sortTickets<T extends { updatedAtValue: string; dueAtValue: string; priority: string }>(tickets: T[], sortMode: SortMode) {
  return [...tickets].sort((left, right) => {
    if (sortMode === "due") {
      return new Date(left.dueAtValue).getTime() - new Date(right.dueAtValue).getTime();
    }
    if (sortMode === "priority") {
      const order = { Critical: 4, High: 3, Medium: 2, Low: 1 } as const;
      return order[right.priority as keyof typeof order] - order[left.priority as keyof typeof order];
    }
    return new Date(right.updatedAtValue).getTime() - new Date(left.updatedAtValue).getTime();
  });
}

export function TicketsPage() {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const initialSavedView = getLocalStorageItem(storageKeys.ticketsView) ?? "";
  const { state: urlState, setState: setUrlState } = useUrlQueryState({
    q: "",
    status: "",
    priority: "",
    assignedAgentId: "",
    slaState: "",
    fromDate: "",
    toDate: "",
    sort: "updated",
    pageSize: Number(defaultTablePageSizes[0]),
    page: 1,
    view: initialSavedView,
  });
  const search = urlState.q;
  const filters: TicketFiltersState = {
    status: urlState.status as TicketFiltersState["status"],
    priority: urlState.priority as TicketFiltersState["priority"],
    assignedAgentId: urlState.assignedAgentId,
    slaState: urlState.slaState as TicketFiltersState["slaState"],
    fromDate: urlState.fromDate,
    toDate: urlState.toDate,
  };
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [submitError, setSubmitError] = useState("");
  const savedViewId = urlState.view;
  const sortMode = urlState.sort as SortMode;
  const pageSize = Number(urlState.pageSize) || Number(defaultTablePageSizes[0]);
  const page = Number(urlState.page) || 1;
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    if (savedViewId) {
      const view = savedViews.find((item) => item.id === savedViewId);
      if (view) {
        setUrlState({
          q: view.query ?? "",
          status: view.filters?.status ?? "",
          priority: view.filters?.priority ?? "",
          assignedAgentId: view.scope === "mine" ? user?.id ?? "" : "",
          slaState: view.filters?.slaState ?? "",
          fromDate: "",
          toDate: "",
          page: 1,
        });
      }
    }
  }, [savedViewId, setUrlState, user?.id]);

  const optionsQuery = useApiQuery(
    [],
    async () => {
      const [userDtos, customerDtos] = await Promise.all([getUsers(), getCustomers()]);
      const users = userDtos.map(mapUser);
      const customers = customerDtos.map((customer) => mapCustomer(customer, users));
      return { users, customers };
    },
    { enabled: true, staleTimeMs: queryStaleTimes.directory },
  );

  const ticketsQuery = useApiQuery(
    [reloadKey, deferredSearch, filters.status, filters.priority, filters.assignedAgentId, filters.slaState, Boolean(optionsQuery.data)],
    async () => {
      const ticketDtos = await getTickets({
        q: deferredSearch.trim() || undefined,
        status: toApiTicketStatus(filters.status),
        priority: toApiTicketPriority(filters.priority),
        assignedAgentId: filters.assignedAgentId || undefined,
        slaState: toApiSlaState(filters.slaState),
      });

      return ticketDtos.map((ticket) => mapTicket(ticket, optionsQuery.data?.users ?? []));
    },
    { enabled: Boolean(optionsQuery.data) },
  );

  const filteredTickets = useMemo(() => {
    const dated = (ticketsQuery.data ?? []).filter((ticket) => matchesDateRange(ticket.createdAtValue, filters.fromDate, filters.toDate));
    return sortTickets(dated, sortMode);
  }, [filters.fromDate, filters.toDate, sortMode, ticketsQuery.data]);

  const paginatedTickets = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTickets.slice(start, start + pageSize);
  }, [filteredTickets, page, pageSize]);

  const totalPages = Math.max(Math.ceil(filteredTickets.length / pageSize), 1);

  async function handleCreateTicket(values: NewTicketFormValues) {
    setSubmitError("");

    try {
      await createTicket({
        subject: values.subject,
        description: values.description,
        customerId: values.customerId,
        priority: toApiTicketPriority(values.priority) ?? "MEDIUM",
        status: toApiTicketStatus(values.status) ?? "NEW",
        assignedAgentId: values.assignedAgentId,
        dueAt: new Date(values.dueDate).toISOString(),
      });

      setReloadKey((value) => value + 1);
      pushToast({ tone: "success", title: "Ticket created", description: "The new ticket is now in the active queue." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create ticket.";
      setSubmitError(message);
      pushToast({ tone: "error", title: "Ticket creation failed", description: message });
      throw error;
    }
  }

  function applySavedView(viewId: string) {
    const nextView = savedViews.find((view) => view.id === viewId);
    if (!nextView) {
      removeLocalStorageItem(storageKeys.ticketsView);
      setUrlState({ view: "", page: 1 });
      return;
    }

    setLocalStorageItem(storageKeys.ticketsView, viewId);
    setUrlState({
      view: viewId,
      q: nextView.query ?? "",
      status: nextView.filters?.status ?? "",
      priority: nextView.filters?.priority ?? "",
      assignedAgentId: nextView.scope === "mine" ? user?.id ?? "" : "",
      slaState: nextView.filters?.slaState ?? "",
      fromDate: "",
      toDate: "",
      page: 1,
    });
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const allTickets = ticketsQuery.data ?? [];
  const openTickets = allTickets.filter((ticket) => !["Resolved", "Closed"].includes(ticket.status)).length;
  const waitingTickets = allTickets.filter((ticket) => ticket.status === "Waiting on Customer").length;
  const criticalTickets = allTickets.filter((ticket) => ticket.priority === "Critical").length;
  const escalatedCount = allTickets.filter((ticket) => ticket.escalated).length;
  const loading = optionsQuery.loading || ticketsQuery.loading;
  const error = optionsQuery.error || ticketsQuery.error || submitError;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Queue Management"
        title="Support tickets"
        description="Review incoming issues, escalate with context, and manage queue ownership with workflow-safe updates."
      />

      <div className="panel p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="section-title">Ticket workspace</p>
            <p className="section-helper mt-1">Search by ticket ID, subject, customer, or escalation notes to move through the queue quickly.</p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="filter-search min-w-[320px] shadow-soft">
              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setUrlState({ q: event.target.value, page: 1, view: "" });
                }}
                placeholder="Search ticket ID, subject, customer, or escalation context"
                className="w-full border-none bg-transparent p-0 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </label>
            <Button type="button" variant="secondary" onClick={() => setFiltersOpen((value) => !value)}>
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount ? <Badge tone="info">{activeFilterCount}</Badge> : null}
            </Button>
            <Button type="button" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Create ticket
            </Button>
          </div>
        </div>
      </div>

      <TicketsStatsRow
        allTickets={allTickets.length}
        openTickets={openTickets}
        waitingOnCustomer={waitingTickets}
        criticalTickets={criticalTickets}
        loading={loading}
      />

      <div className="panel p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="section-title">Saved views</p>
            <p className="section-helper mt-1">Jump into the queues support leads use most often.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {savedViews.map((view) => (
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
        </div>
      </div>

      {filtersOpen ? (
        <TicketFiltersBar
          filters={filters}
          agents={optionsQuery.data?.users ?? []}
          onChange={(next) => {
            setUrlState({ ...next, page: 1, view: "" });
          }}
          onClear={() => {
            removeLocalStorageItem(storageKeys.ticketsView);
            setUrlState({ ...emptyFilters, q: "", page: 1, view: "" });
          }}
        />
      ) : null}

      <div className="panel p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="default">{filteredTickets.length} visible</Badge>
            <Badge tone="warning">{waitingTickets} waiting on customer</Badge>
            <Badge tone="danger">{criticalTickets} critical</Badge>
            <Badge tone="info">{escalatedCount} escalated</Badge>
            <button
              type="button"
              onClick={() => {
                setUrlState({
                  assignedAgentId: filters.assignedAgentId === user?.id ? "" : user?.id ?? "",
                  page: 1,
                  view: "",
                });
              }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 transition hover:bg-slate-50"
            >
              <UserRound className="h-3.5 w-3.5" />
              Assigned to me
            </button>
            <button
              type="button"
              onClick={() => {
                removeLocalStorageItem(storageKeys.ticketsView);
                setUrlState({ ...emptyFilters, q: "", page: 1, view: "" });
              }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 transition hover:bg-slate-50"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Reset all
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Sort
              <SelectField className="mt-2 min-w-[180px]" value={sortMode} onChange={(event) => setUrlState({ sort: event.target.value as SortMode, page: 1 })}>
                <option value="updated">Recently updated</option>
                <option value="due">Due soonest</option>
                <option value="priority">Priority</option>
              </SelectField>
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Page size
              <SelectField className="mt-2 min-w-[120px]" value={pageSize} onChange={(event) => setUrlState({ pageSize: Number(event.target.value), page: 1 })}>
                {defaultTablePageSizes.map((size) => (
                  <option key={size} value={size}>
                    {size} rows
                  </option>
                ))}
              </SelectField>
            </label>
          </div>
        </div>
      </div>

      {error ? (
        <PageErrorState
          title="Ticket queue unavailable"
          description={error}
          onRetry={() => {
            setSubmitError("");
            optionsQuery.retry();
            ticketsQuery.retry();
          }}
        />
      ) : (
        <TicketsTable tickets={paginatedTickets} loading={loading} />
      )}

      <DataTablePagination
        page={page}
        totalPages={totalPages}
        totalItems={filteredTickets.length}
        pageSize={pageSize}
        currentCount={paginatedTickets.length}
        onPrevious={() => setUrlState({ page: Math.max(page - 1, 1) })}
        onNext={() => setUrlState({ page: Math.min(page + 1, totalPages) })}
      />

      <CreateTicketModal
        open={createOpen}
        customers={optionsQuery.data?.customers ?? []}
        users={optionsQuery.data?.users ?? []}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateTicket}
      />
    </div>
  );
}
