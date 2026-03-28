import { Badge } from "@/components/ui/Badge";
import { slaDisplayTone } from "@/utils/badges";
import type { TicketSlaState } from "@/types/models";

interface SlaBadgeProps {
  state: TicketSlaState;
  className?: string;
}

export function SlaBadge({ state, className }: SlaBadgeProps) {
  return (
    <Badge tone={slaDisplayTone[state]} className={className}>
      {state}
    </Badge>
  );
}
