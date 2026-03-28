import { useDeferredValue, useState } from "react";
import { Filter } from "lucide-react";
import { CustomerDrawer } from "@/components/customers/CustomerDrawer";
import { CustomersFiltersBar, type CustomersFiltersState } from "@/components/customers/CustomersFiltersBar";
import { CustomersStatsRow } from "@/components/customers/CustomersStatsRow";
import { CustomersTable } from "@/components/customers/CustomersTable";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageErrorState } from "@/components/ui/PageErrorState";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { getCustomer, getCustomers, getTickets, getUsers } from "@/api";
import { mapCustomer, mapCustomerActivity, mapCustomerNotes, mapTicket, mapUser } from "@/api/mappers";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useUrlQueryState } from "@/hooks/useUrlQueryState";

function toApiSegment(value: string) {
  switch (value) {
    case "Individual":
      return "INDIVIDUAL";
    case "Enterprise":
      return "ENTERPRISE";
    case "SMB":
      return "SMB";
    default:
      return undefined;
  }
}

function toApiHealth(value: string) {
  switch (value) {
    case "At Risk":
      return "AT_RISK";
    case "Watchlist":
      return "WATCHLIST";
    case "Healthy":
      return "HEALTHY";
    default:
      return undefined;
  }
}

export function CustomersPage() {
  const { state: urlState, setState: setUrlState } = useUrlQueryState({
    q: "",
    segment: "",
    health: "",
  });
  const search = urlState.q;
  const filters: CustomersFiltersState = {
    segment: urlState.segment,
    health: urlState.health,
  };
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search);

  const usersQuery = useApiQuery([], async () => (await getUsers()).map(mapUser), { enabled: true });
  const customersQuery = useApiQuery(
    [deferredSearch, filters.segment, filters.health, usersQuery.data?.length],
    async () => {
      const customers = await getCustomers({
        q: deferredSearch.trim() || undefined,
        segment: toApiSegment(filters.segment),
        health: toApiHealth(filters.health),
      });

      return customers.map((customer) => mapCustomer(customer, usersQuery.data ?? []));
    },
    { enabled: Boolean(usersQuery.data) },
  );
  const customerDetailQuery = useApiQuery(
    [selectedCustomerId, usersQuery.data?.length],
    async () => {
      const customer = await getCustomer(selectedCustomerId ?? "");
      const ticketDtos = await getTickets({ customerId: selectedCustomerId ?? "" });
      const relatedTickets = ticketDtos.map((ticket) => mapTicket(ticket, usersQuery.data ?? []));
      const mappedCustomer = mapCustomer(customer, usersQuery.data ?? [], relatedTickets);

      return {
        customer: mappedCustomer,
        relatedTickets: relatedTickets.slice(0, 4),
        activity: mapCustomerActivity(mappedCustomer),
        notes: mapCustomerNotes(mappedCustomer),
      };
    },
    { enabled: Boolean(selectedCustomerId) && Boolean(usersQuery.data) },
  );

  const customers = customersQuery.data ?? [];
  const totalCustomers = customers.length;
  const atRiskAccounts = customers.filter((customer) => customer.health === "At Risk").length;
  const enterpriseAccounts = customers.filter((customer) => customer.segment === "Enterprise").length;
  const recentTickets = customers.reduce((sum, customer) => sum + customer.openTickets, 0);
  const loading = usersQuery.loading || customersQuery.loading;
  const error = usersQuery.error || customersQuery.error;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Support Records"
        title="Customers"
        description="Review customer support records, surface account risk, and keep ownership context visible for frontline teams."
      />

      <SearchFilterBar
        value={search}
        onChange={(event) => setUrlState({ q: event.target.value })}
        placeholder="Search customer, company, or segment"
        filters={
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-soft">
              <Filter className="h-4 w-4" />
              Segment and health filters
            </div>
            <CustomersFiltersBar filters={filters} onChange={(next) => setUrlState(next)} />
          </div>
        }
      />

      <CustomersStatsRow
        totalCustomers={totalCustomers}
        atRiskAccounts={atRiskAccounts}
        enterpriseAccounts={enterpriseAccounts}
        recentTickets={recentTickets}
        loading={loading}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="default">{customers.length} customers visible</Badge>
        <Badge tone="warning">{customers.filter((customer) => customer.health === "Watchlist").length} watchlist</Badge>
        <Badge tone="danger">{atRiskAccounts} at risk</Badge>
      </div>

      {error ? (
        <PageErrorState
          title="Customer records unavailable"
          description={error}
          onRetry={() => {
            usersQuery.retry();
            customersQuery.retry();
            customerDetailQuery.retry();
          }}
        />
      ) : (
        <CustomersTable customers={customers} onOpen={(customer) => setSelectedCustomerId(customer.id)} loading={loading} />
      )}
      <CustomerDrawer
        customer={customerDetailQuery.data?.customer ?? null}
        relatedTickets={customerDetailQuery.data?.relatedTickets ?? []}
        activity={customerDetailQuery.data?.activity ?? []}
        notes={customerDetailQuery.data?.notes ?? []}
        onClose={() => setSelectedCustomerId(null)}
      />
    </div>
  );
}
