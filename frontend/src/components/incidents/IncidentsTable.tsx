import { Activity } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TableWrapper } from "@/components/ui/TableWrapper";
import type { Incident } from "@/types/models";

interface IncidentsTableProps {
  incidents: Incident[];
  onOpen: (incident: Incident) => void;
  loading?: boolean;
}

export function IncidentsTable({ incidents, onOpen, loading }: IncidentsTableProps) {
  const hasRows = incidents.length > 0;

  return (
    <TableWrapper
      title="Incident command queue"
      description="Live service issues prioritized for reliability response, leadership visibility, and post-mitigation follow-through."
      loading={loading}
      emptyState={
        <EmptyState
          icon={<Activity className="h-6 w-6 text-slate-500" />}
          title="No incidents match the current search"
          description="No active or historical incidents fit this view right now. Try broadening the severity or status filters to reopen the reliability timeline."
        />
      }
    >
      {hasRows ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="table-head px-5 py-4">Incident ID</th>
                <th className="table-head px-5 py-4">Title</th>
                <th className="table-head px-5 py-4">Affected Service</th>
                <th className="table-head px-5 py-4">Severity</th>
                <th className="table-head px-5 py-4">Status</th>
                <th className="table-head px-5 py-4">Owner</th>
                <th className="table-head px-5 py-4">Started</th>
                <th className="table-head px-5 py-4">Duration</th>
                <th className="table-head px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr
                  key={incident.id}
                  onClick={() => onOpen(incident)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onOpen(incident);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open incident ${incident.id}`}
                  className="group table-row-interactive"
                >
                  <td className="table-cell">
                    <p className="font-semibold text-slate-900">{incident.id}</p>
                  </td>
                  <td className="table-cell">
                    <div className="min-w-[280px]">
                      <p className="font-semibold text-slate-900 transition group-hover:text-sky-700">{incident.title}</p>
                      <p className="table-meta">{incident.summary}</p>
                    </div>
                  </td>
                  <td className="table-cell">
                    <p className="font-medium text-slate-900">{incident.affectedService}</p>
                    <p className="table-meta">{incident.affectedServices.length} services in scope</p>
                  </td>
                  <td className="table-cell">
                    <SeverityBadge severity={incident.severity} />
                  </td>
                  <td className="table-cell">
                    <StatusBadge status={incident.status} />
                  </td>
                  <td className="table-cell">
                    <p className="font-medium text-slate-900">{incident.ownerName ?? "Incident owner"}</p>
                    <p className="table-meta">{incident.ownerTeam ?? "Operations"}</p>
                  </td>
                  <td className="table-cell">{incident.startedAt}</td>
                  <td className="table-cell font-medium text-slate-900">{incident.duration}</td>
                  <td className="table-cell">
                    <span className="table-action-pill">
                      Open details
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
