package com.supportops.backend.dto.analytics;

public record OperationalInsightResponse(
        String id,
        String title,
        String description,
        String tone
) {
}
