package com.supportops.backend.dto.ticket;

import com.supportops.backend.dto.common.ActivityLogResponse;
import java.time.Instant;
import java.util.List;

public record TicketDetailResponse(
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
        String escalationReason,
        Instant escalatedAt,
        Instant dueAt,
        Instant waitingSince,
        Instant resolvedAt,
        String resolutionSummary,
        String closeNotes,
        Instant reopenedAt,
        String reopenReason,
        Instant createdAt,
        Instant updatedAt,
        String slaState,
        List<TicketCommentResponse> comments,
        List<ActivityLogResponse> activity
) {
}
