package com.supportops.backend.config;

import java.util.Arrays;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class StartupReadinessValidator implements InitializingBean {

    private static final Logger log = LoggerFactory.getLogger(StartupReadinessValidator.class);
    private static final String LOCAL_DEVELOPMENT_SECRET = "supportops-super-secret-jwt-key-for-local-development-only";

    private final ApplicationProperties properties;
    private final Environment environment;

    @Value("${spring.datasource.url:}")
    private String datasourceUrl;

    public StartupReadinessValidator(ApplicationProperties properties, Environment environment) {
        this.properties = properties;
        this.environment = environment;
    }

    @Override
    public void afterPropertiesSet() {
        Set<String> activeProfiles = Set.of(environment.getActiveProfiles());
        log.info(
                "SupportOps backend startup profile check: profiles={}, demoMode={}, corsOrigins={}",
                activeProfiles.isEmpty() ? Set.of("default") : activeProfiles,
                properties.demo().enabled(),
                properties.cors().allowedOrigins()
        );

        if (!activeProfiles.contains("prod")) {
            return;
        }

        if (LOCAL_DEVELOPMENT_SECRET.equals(properties.security().jwtSecret())) {
            throw new IllegalStateException("JWT_SECRET must be configured with a non-default value when the prod profile is active.");
        }

        if (properties.demo().enabled()) {
            throw new IllegalStateException("DEMO_MODE must be disabled when the prod profile is active.");
        }

        if (datasourceUrl == null || datasourceUrl.isBlank() || datasourceUrl.contains("localhost:5432/supportops")) {
            throw new IllegalStateException("DB_URL must point to a deployed PostgreSQL instance when the prod profile is active.");
        }

        if (properties.cors().allowedOrigins() == null || properties.cors().allowedOrigins().isEmpty()) {
            throw new IllegalStateException("FRONTEND_ORIGIN must be configured when the prod profile is active.");
        }

        log.info("SupportOps backend production readiness validation passed for profiles={}", Arrays.toString(environment.getActiveProfiles()));
    }
}
