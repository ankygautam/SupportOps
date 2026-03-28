package com.supportops.backend.dto.ticket;

import com.supportops.backend.enums.TicketPriority;
import com.supportops.backend.enums.TicketStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public record CreateTicketRequest(
        @NotBlank @Size(max = 180) String subject,
        @NotBlank @Size(max = 5000) String description,
        @NotBlank String customerId,
        @NotNull TicketPriority priority,
        @NotNull TicketStatus status,
        @NotBlank String assignedAgentId,
        String relatedIncidentId,
        @NotNull @Future Instant dueAt
) {
}
