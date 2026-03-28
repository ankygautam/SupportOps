package com.supportops.backend.dto.sla;

public record SlaQuery(
        String q,
        String team,
        String state
) {
}
