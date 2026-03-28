package com.supportops.backend.dto.dashboard;

public record DashboardSummaryResponse(
        long openTickets,
        long criticalIncidents,
        long slaBreaches,
        long averageFirstResponseMinutes,
        long assignedToMeCount
) {
}
