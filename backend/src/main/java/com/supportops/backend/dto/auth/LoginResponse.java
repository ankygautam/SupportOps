package com.supportops.backend.dto.auth;

public record LoginResponse(
        String token,
        UserProfileResponse user
) {
}
