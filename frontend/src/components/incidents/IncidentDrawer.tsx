import { AlertTriangle, Clock3, Radar } from "lucide-react";
import { DetailPanel } from "@/components/ui/DetailPanel";
import { InfoCard } from "@/components/ui/InfoCard";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TimelineItem } from "@/components/ui/TimelineItem";
import type { Incident } from "@/types/models";

interface IncidentDrawerProps {
  incident: Incident | null;
  onClose: () => void;
}

export function IncidentDrawer({ incident, onClose }: IncidentDrawerProps) {
  return (
    <DetailPanel
      open={Boolean(incident)}
      onClose={onClose}
      eyebrow={incident?.id}
      title={incident?.title}
      size="md"
      headerMeta={
        incident ? (
          <>
            <SeverityBadge severity={incident.severity} />
            <StatusBadge status={incident.status} />
          </>
        ) : null
      }
    >
      {incident ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard title="Started" icon={<Clock3 className="h-5 w-5" />} muted>
              <p className="text-sm font-semibold text-slate-900">{incident.startedAt}</p>
            </InfoCard>
            <InfoCard title="Duration" icon={<AlertTriangle className="h-5 w-5 text-rose-500" />} muted>
              <p className="text-sm font-semibold text-slate-900">{incident.duration}</p>
            </InfoCard>
          </div>

          <InfoCard title="Affected services" description="Systems and customer touchpoints currently in scope." icon={<Radar className="h-5 w-5" />} muted>
            <div className="flex flex-wrap gap-2">
              {incident.affectedServices.map((service) => (
                <span key={service} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-soft">
                  {service}
                </span>
              ))}
            </div>
          </InfoCard>

          <InfoCard title="Operational linkage" description="Open support volume currently tied to this incident.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Affected tickets</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{incident.linkedTicketCount ?? incident.linkedTicketIds?.length ?? 0}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Affected customers</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{incident.affectedCustomerCount ?? 0}</p>
              </div>
            </div>
            {incident.linkedTicketIds?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {incident.linkedTicketIds.map((ticketId) => (
                  <span key={ticketId} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {ticketId}
                  </span>
                ))}
              </div>
            ) : null}
          </InfoCard>

          <InfoCard title="Incident summary">
            <p className="text-sm leading-7 text-slate-600">{incident.summary}</p>
          </InfoCard>

          <InfoCard title="Root cause">
            <p className="text-sm leading-7 text-slate-600">{incident.rootCause}</p>
          </InfoCard>

          <InfoCard title="Mitigation steps" description={incident.mitigation}>
            <div className="space-y-3">
              {incident.mitigationSteps.map((step) => (
                <div key={step} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  {step}
                </div>
              ))}
            </div>
          </InfoCard>

          <InfoCard title="Ownership" description="Current incident command and detection context.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Owner</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{incident.ownerName ?? "Incident owner"}</p>
                <p className="mt-1 text-sm text-slate-500">{incident.ownerTeam ?? "Operations"}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Detection source</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{incident.detectionSource}</p>
                <p className="mt-1 text-sm text-slate-500">{incident.customerImpact}</p>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="Timeline of updates" description="Detection, mitigation, and stabilization milestones.">
            <div className="space-y-4">
              {incident.timeline.map((event) => (
                <TimelineItem
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  actor={event.actor}
                  occurredAt={event.occurredAt}
                />
              ))}
            </div>
          </InfoCard>
        </div>
      ) : null}
    </DetailPanel>
  );
}
