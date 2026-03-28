package com.supportops.backend.dto.analytics;

public record DistributionItemResponse(
        String label,
        int value,
        String toneClass
) {
}
