import { AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { incidentSeverityTone, incidentStatusTone } from "@/lib/operations";
import type { Incident } from "@/types/models";

export function IncidentDeck({ incidents }: { incidents: Incident[] }) {
  return (
    <div className="panel p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Critical Incidents</p>
          <p className="mt-1 text-sm text-slate-500">Current service impact and response ownership.</p>
        </div>
        <Link to="/incidents" className="text-sm font-semibold text-sky-700">
          Incident center
        </Link>
      </div>
      <div className="space-y-4">
        {incidents.length ? incidents.slice(0, 3).map((incident) => (
          <div key={incident.id} className="rounded-3xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={incidentSeverityTone[incident.severity]}>{incident.severity}</Badge>
                  <Badge tone={incidentStatusTone[incident.status]}>{incident.status}</Badge>
                </div>
                <p className="mt-3 text-base font-semibold text-slate-900">{incident.title}</p>
                <p className="mt-1 text-sm text-slate-500">{incident.summary}</p>
              </div>
              <div className="rounded-2xl bg-white p-3 text-rose-600 shadow-soft">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/70 pt-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{incident.affectedService}</p>
                <p className="mt-1 text-sm font-medium text-slate-700">{incident.ownerName ?? "Incident owner"}</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-sky-700">
                {incident.startedAt}
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        )) : <EmptyState title="No active incidents" description="There are no reliability events in the current queue snapshot." />}
      </div>
    </div>
  );
}
