package com.supportops.backend.dto.analytics;

public record TeamPerformanceRowResponse(
        String id,
        String agent,
        String team,
        int assigned,
        int resolved,
        String avgResponse,
        String slaScore,
        String csat,
        int workload
) {
}
