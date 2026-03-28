package com.supportops.backend.dto.incident;

public record IncidentQuery(
        String q,
        String severity,
        String status
) {
}
