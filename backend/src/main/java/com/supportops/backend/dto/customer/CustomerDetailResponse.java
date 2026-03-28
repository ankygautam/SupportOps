package com.supportops.backend.dto.customer;

import java.time.Instant;
import java.util.List;

public record CustomerDetailResponse(
        String id,
        String name,
        String company,
        String email,
        String phone,
        String segment,
        String health,
        String ownerId,
        String ownerName,
        long openTickets,
        Instant createdAt,
        Instant updatedAt,
        List<String> recentTicketIds
) {
}
