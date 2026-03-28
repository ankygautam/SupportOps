package com.supportops.backend.dto.analytics;

public record VolumePointResponse(
        String label,
        int opened,
        int resolved
) {
}
