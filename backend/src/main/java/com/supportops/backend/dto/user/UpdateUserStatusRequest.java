package com.supportops.backend.dto.user;

public record UpdateUserStatusRequest(
        boolean active,
        String reassignToUserId
) {
}
