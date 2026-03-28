package com.supportops.backend.dto.incident;

import java.time.Instant;

public record IncidentSummaryResponse(
        String id,
        String title,
        String affectedService,
        String severity,
        String status,
        String ownerId,
        String ownerName,
        int linkedTicketCount,
        int affectedCustomerCount,
        Instant startedAt,
        Instant resolvedAt,
        Instant createdAt,
        Instant updatedAt
) {
}
