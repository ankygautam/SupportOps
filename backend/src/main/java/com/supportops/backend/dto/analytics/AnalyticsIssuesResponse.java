package com.supportops.backend.dto.analytics;

import java.util.List;

public record AnalyticsIssuesResponse(
        List<IssueCategoryResponse> categories,
        List<OperationalInsightResponse> insights
) {
}
