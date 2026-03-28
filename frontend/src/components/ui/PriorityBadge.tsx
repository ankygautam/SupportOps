import { Badge } from "@/components/ui/Badge";
import { ticketPriorityTone } from "@/utils/badges";
import type { TicketPriority } from "@/types/models";

interface PriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <Badge tone={ticketPriorityTone[priority]} className={className}>
      {priority}
    </Badge>
  );
}
