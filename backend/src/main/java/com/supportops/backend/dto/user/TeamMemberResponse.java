package com.supportops.backend.dto.user;

public record TeamMemberResponse(
        String id,
        String fullName,
        String email,
        String team,
        String role,
        long activeTickets,
        long resolvedThisWeek,
        long averageResponseMinutes,
        boolean active
) {
}
