package com.supportops.backend.dto.auth;

public record UserProfileResponse(
        String id,
        String fullName,
        String email,
        String team,
        String role,
        boolean active
) {
}
