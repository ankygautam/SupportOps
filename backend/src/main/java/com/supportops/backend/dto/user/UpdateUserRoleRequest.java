package com.supportops.backend.dto.user;

import com.supportops.backend.enums.RoleType;
import jakarta.validation.constraints.NotNull;

public record UpdateUserRoleRequest(
        @NotNull RoleType role
) {
}
