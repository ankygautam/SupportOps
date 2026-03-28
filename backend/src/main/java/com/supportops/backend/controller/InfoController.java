package com.supportops.backend.controller;

import com.supportops.backend.config.ApplicationProperties;
import java.time.Instant;
import java.util.Map;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/info")
public class InfoController {

    private final Environment environment;
    private final ApplicationProperties properties;

    public InfoController(Environment environment, ApplicationProperties properties) {
        this.environment = environment;
        this.properties = properties;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> info() {
        return ResponseEntity.ok(Map.of(
                "service", "supportops-backend",
                "profiles", environment.getActiveProfiles(),
                "demoMode", properties.demo().enabled(),
                "timestamp", Instant.now().toString()
        ));
    }
}
