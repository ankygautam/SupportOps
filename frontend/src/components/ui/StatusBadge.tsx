import { Badge } from "@/components/ui/Badge";
import { incidentStatusTone, ticketStatusTone } from "@/utils/badges";
import type { IncidentStatus, TicketStatus } from "@/types/models";

interface StatusBadgeProps {
  status: TicketStatus | IncidentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const tone = status in ticketStatusTone ? ticketStatusTone[status as TicketStatus] : incidentStatusTone[status as IncidentStatus];

  return (
    <Badge tone={tone} className={className}>
      {status}
    </Badge>
  );
}
