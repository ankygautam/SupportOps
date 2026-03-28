package com.supportops.backend.dto.analytics;

import java.util.List;

public record AnalyticsSummaryResponse(
        String ticketsResolved,
        String ticketsResolvedDelta,
        String avgFirstResponse,
        String avgFirstResponseDelta,
        String slaCompliance,
        String slaComplianceDelta,
        String activeIncidents,
        String activeIncidentsDelta,
        String meanTimeToResolution,
        String reopenedTicketRate,
        String incidentFrequency,
        List<VolumePointResponse> volumeTrend,
        List<DistributionItemResponse> statusDistribution,
        List<DistributionItemResponse> priorityDistribution,
        List<DistributionItemResponse> workloadDistribution,
        List<SlaPerformancePointResponse> slaPerformance,
        List<ComparisonMetricResponse> comparisonMetrics,
        List<ImpactedCustomerResponse> impactedCustomers,
        List<String> teamOptions
) {
}
