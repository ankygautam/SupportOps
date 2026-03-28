package com.supportops.backend.dto.ticket;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateTicketCommentRequest(
        @NotBlank @Size(max = 3000) String content,
        boolean internalNote
) {
}
