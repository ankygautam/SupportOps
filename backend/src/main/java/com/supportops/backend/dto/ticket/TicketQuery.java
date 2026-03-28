package com.supportops.backend.dto.ticket;

public record TicketQuery(
        String q,
        String status,
        String priority,
        String assignedAgentId,
        String customerId,
        String slaState
) {
}
