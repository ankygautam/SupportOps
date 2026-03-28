package com.supportops.backend.dto.incident;

import com.supportops.backend.enums.IncidentSeverity;
import com.supportops.backend.enums.IncidentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;

public record CreateIncidentRequest(
        @NotBlank String title,
        @NotBlank String affectedService,
        @NotNull IncidentSeverity severity,
        @NotNull IncidentStatus status,
        @NotBlank String ownerId,
        @NotBlank String summary,
        @NotBlank String rootCause,
        @NotBlank String mitigation,
        @NotNull Instant startedAt,
        List<String> linkedTicketIds
) {
}
