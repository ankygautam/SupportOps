import { formatDateTime } from "@/lib/format/date";
import type { Incident, IncidentSeverity, IncidentStatus } from "@/types/models";

export function formatDurationFromIso(startedAtValue: string, resolvedAtValue?: string) {
  const started = new Date(startedAtValue).getTime();
  const ended = resolvedAtValue ? new Date(resolvedAtValue).getTime() : Date.now();
  const minutes = Math.max(Math.round((ended - started) / 60000), 1);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (!hours) {
    return `${remainingMinutes}m`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

export function buildCreatedIncident({
  incidentId,
  title,
  affectedService,
  severity,
  status,
  ownerId,
  summary,
  rootCause,
  mitigation,
  startedAtValue,
}: {
  incidentId: string;
  title: string;
  affectedService: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  ownerId: string;
  summary: string;
  rootCause: string;
  mitigation: string;
  startedAtValue: string;
}): Incident {
  return {
    id: incidentId,
    title,
    affectedService,
    affectedServices: [affectedService],
    severity,
    status,
    ownerId,
    startedAt: formatDateTime(startedAtValue),
    startedAtValue,
    duration: formatDurationFromIso(startedAtValue),
    summary,
    rootCause,
    mitigation,
    mitigationSteps: mitigation
      .split(".")
      .map((step) => step.trim())
      .filter(Boolean),
    detectionSource: "Manual incident declaration",
    customerImpact: "Customer impact assessment pending incident triage.",
    timeline: [
      {
        id: `${incidentId}-1`,
        title: "Incident declared",
        description: "A new incident was created from the operations workspace.",
        actor: "SupportOps Workspace",
        occurredAt: "Just now",
      },
    ],
  };
}
