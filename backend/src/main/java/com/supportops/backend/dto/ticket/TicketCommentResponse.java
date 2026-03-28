package com.supportops.backend.dto.ticket;

import java.time.Instant;

public record TicketCommentResponse(
        String id,
        String authorId,
        String authorName,
        String content,
        boolean internalNote,
        Instant createdAt
) {
}
