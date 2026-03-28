package com.supportops.backend.dto.analytics;

import java.util.List;

public record AnalyticsTeamPerformanceResponse(
        List<TeamPerformanceRowResponse> rows
) {
}
