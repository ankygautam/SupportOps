package com.supportops.backend.dto.analytics;

public record SlaPerformancePointResponse(
        String label,
        int met,
        int breached
) {
}
