package com.supportops.backend.dto.incident;

import com.supportops.backend.enums.IncidentSeverity;
import com.supportops.backend.enums.IncidentStatus;
import java.time.Instant;
import java.util.List;

public record UpdateIncidentRequest(
        String title,
        String affectedService,
        IncidentSeverity severity,
        IncidentStatus status,
        String ownerId,
        String summary,
        String rootCause,
        String mitigation,
        Instant startedAt,
        Instant resolvedAt,
        List<String> linkedTicketIds
) {
}
