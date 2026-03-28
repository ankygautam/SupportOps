package com.supportops.backend.dto.analytics;

public record ComparisonMetricResponse(
        String label,
        String currentValue,
        String previousValue,
        String delta,
        String tone
) {
}
