package com.supportops.backend.dto.analytics;

public record IssueCategoryResponse(
        String category,
        int count,
        String delta,
        String toneClass
) {
}
