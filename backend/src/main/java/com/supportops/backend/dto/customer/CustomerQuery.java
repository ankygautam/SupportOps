package com.supportops.backend.dto.customer;

public record CustomerQuery(
        String q,
        String segment,
        String health
) {
}
