package com.supportops.backend.dto.incident;

import com.supportops.backend.dto.common.ActivityLogResponse;
import java.time.Instant;
import java.util.List;

public record IncidentDetailResponse(
        String id,
        String title,
        String affectedService,
        String severity,
        String status,
        String ownerId,
        String ownerName,
        String summary,
        String rootCause,
        String mitigation,
        List<String> linkedTicketIds,
        int affectedCustomerCount,
        Instant startedAt,
        Instant resolvedAt,
        Instant createdAt,
        Instant updatedAt,
        List<ActivityLogResponse> timeline
) {
}
