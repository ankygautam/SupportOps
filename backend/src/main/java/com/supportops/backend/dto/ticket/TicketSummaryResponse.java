package com.supportops.backend.dto.ticket;

import java.time.Instant;

public record TicketSummaryResponse(
        String id,
        String subject,
        String description,
        String status,
        String priority,
        String customerId,
        String customerName,
        String customerCompany,
        String assignedAgentId,
        String assignedAgentName,
        String relatedIncidentId,
        String relatedIncidentTitle,
        boolean escalated,
        String escalatedToTeam,
        String resolutionSummary,
        Instant dueAt,
        Instant waitingSince,
        Instant resolvedAt,
        Instant reopenedAt,
        Instant createdAt,
        Instant updatedAt,
        String slaState
) {
}
