import { Badge } from "@/components/ui/Badge";
import { incidentSeverityTone } from "@/utils/badges";
import type { IncidentSeverity } from "@/types/models";

interface SeverityBadgeProps {
  severity: IncidentSeverity;
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  return (
    <Badge tone={incidentSeverityTone[severity]} className={className}>
      {severity}
    </Badge>
  );
}
