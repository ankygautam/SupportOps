package com.supportops.backend.dto.sla;

public record SlaSummaryResponse(
        long onTrack,
        long dueSoon,
        long breached,
        long averageResolutionMinutes
) {
}
