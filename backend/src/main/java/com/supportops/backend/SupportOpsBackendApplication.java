package com.supportops.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class SupportOpsBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SupportOpsBackendApplication.class, args);
    }
}
