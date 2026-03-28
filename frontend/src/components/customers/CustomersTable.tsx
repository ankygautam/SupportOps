import { ContactRound } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableWrapper } from "@/components/ui/TableWrapper";
import { customerHealthTone } from "@/lib/operations";
import type { Customer } from "@/types/models";

interface CustomersTableProps {
  customers: Customer[];
  onOpen: (customer: Customer) => void;
  loading?: boolean;
}

export function CustomersTable({ customers, onOpen, loading }: CustomersTableProps) {
  const hasRows = customers.length > 0;

  return (
    <TableWrapper
      title="Customer support records"
      description="Account context, ownership, and recent support load for frontline teams and escalation managers."
      loading={loading}
      emptyState={
        <EmptyState
          icon={<ContactRound className="h-6 w-6 text-slate-500" />}
          title="No customer records match these filters"
          description="No support records fit the current view. Clear a filter or broaden the search to bring account context back into the workspace."
        />
      }
    >
      {hasRows ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="table-head px-5 py-4">Customer</th>
                <th className="table-head px-5 py-4">Company</th>
                <th className="table-head px-5 py-4">Segment</th>
                <th className="table-head px-5 py-4">Open Tickets</th>
                <th className="table-head px-5 py-4">Last Contact</th>
                <th className="table-head px-5 py-4">Health</th>
                <th className="table-head px-5 py-4">Assigned CSM / Owner</th>
                <th className="table-head px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  onClick={() => onOpen(customer)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onOpen(customer);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open customer ${customer.company}`}
                  className="group table-row-interactive"
                >
                  <td className="table-cell">
                    <div className="min-w-[220px]">
                      <p className="font-semibold text-slate-900 transition group-hover:text-sky-700">{customer.name}</p>
                      <p className="table-meta">{customer.primaryEmail}</p>
                    </div>
                  </td>
                  <td className="table-cell">
                    <p className="font-medium text-slate-900">{customer.company}</p>
                    <p className="table-meta">{customer.plan}</p>
                  </td>
                  <td className="table-cell">{customer.segment}</td>
                  <td className="table-cell font-medium text-slate-900">{customer.openTickets}</td>
                  <td className="table-cell">{customer.lastContactedAt}</td>
                  <td className="table-cell">
                    <Badge tone={customerHealthTone[customer.health]}>{customer.health}</Badge>
                  </td>
                  <td className="table-cell">
                    <p className="font-medium text-slate-900">{customer.ownerName ?? "Account owner"}</p>
                    <p className="table-meta">{customer.ownerTitle}</p>
                  </td>
                  <td className="table-cell">
                    <span className="table-action-pill">
                      Open record
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </TableWrapper>
  );
}
