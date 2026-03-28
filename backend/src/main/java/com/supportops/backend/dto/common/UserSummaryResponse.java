package com.supportops.backend.dto.common;

public record UserSummaryResponse(
        String id,
        String fullName,
        String email,
        String team,
        String role,
        boolean active
) {
}
