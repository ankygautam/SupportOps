package com.supportops.backend.dto.analytics;

public record ImpactedCustomerResponse(
        String customerId,
        String company,
        int openTickets,
        int highPriorityTickets,
        String note
) {
}
