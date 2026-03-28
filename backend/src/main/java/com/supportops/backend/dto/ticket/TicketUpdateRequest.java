package com.supportops.backend.dto.ticket;

import com.supportops.backend.enums.TicketPriority;
import com.supportops.backend.enums.TicketStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public record TicketUpdateRequest(
        @Size(max = 180) String subject,
        @Size(max = 5000) String description,
        TicketStatus status,
        TicketPriority priority,
        String assignedAgentId,
        String relatedIncidentId,
        String escalatedToTeam,
        @Size(max = 3000) String escalationReason,
        @Size(max = 5000) String resolutionSummary,
        @Size(max = 5000) String closeNotes,
        @Size(max = 3000) String reopenReason,
        @Future Instant dueAt
) {
}
