package com.supportops.backend.dto.common;

import java.time.Instant;

public record ActivityLogResponse(
        String id,
        String entityType,
        String entityId,
        String action,
        String description,
        String actorName,
        Instant createdAt
) {
}
