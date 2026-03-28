package com.supportops.backend.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record ApplicationProperties(
        Security security,
        Cors cors,
        Demo demo
) {

    public record Security(
            String jwtSecret,
            long jwtExpirationMillis
    ) {
    }

    public record Cors(
            List<String> allowedOrigins
    ) {
    }

    public record Demo(
            boolean enabled
    ) {
    }
}
