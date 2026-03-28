package com.supportops.backend.dto.sla;

import java.time.Instant;

public record SlaRecordResponse(
        String id,
        String ticketId,
        String subject,
        String customerCompany,
        String assignedAgentName,
        String assignedTeam,
        Instant firstResponseTargetAt,
        Instant resolutionTargetAt,
        String state,
        boolean breached,
        Instant updatedAt
) {
}
