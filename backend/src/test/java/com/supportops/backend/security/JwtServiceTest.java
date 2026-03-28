package com.supportops.backend.security;

import static org.assertj.core.api.Assertions.assertThat;

import com.supportops.backend.config.ApplicationProperties;
import com.supportops.backend.entity.Role;
import com.supportops.backend.entity.User;
import com.supportops.backend.enums.RoleType;
import java.util.List;
import org.junit.jupiter.api.Test;

class JwtServiceTest {

    @Test
    void generatedTokenCanBeParsedAndValidated() {
        ApplicationProperties properties = new ApplicationProperties(
                new ApplicationProperties.Security("c3VwcG9ydG9wcy1kZW1vLXNlY3JldC1rZXktZm9yLXRlc3Rpbmc=", 3_600_000),
                new ApplicationProperties.Cors(List.of("http://localhost:5173")),
                new ApplicationProperties.Demo(true)
        );
        JwtService jwtService = new JwtService(properties);
        User user = demoUser();

        String token = jwtService.generateToken(user);

        var userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities("ROLE_" + user.getRole().getName().name())
                .build();

        assertThat(jwtService.extractUsername(token)).isEqualTo(user.getEmail());
        assertThat(jwtService.extractRole(token)).isEqualTo("TEAM_LEAD");
        assertThat(jwtService.isTokenValid(token, userDetails)).isTrue();
    }

    private User demoUser() {
        Role role = new Role();
        role.setId("role-team-lead");
        role.setName(RoleType.TEAM_LEAD);

        User user = new User();
        user.setId("usr-22");
        user.setFullName("Nina Patel");
        user.setEmail("lead@supportops.dev");
        user.setPassword("$2a$10$demo");
        user.setTeam("Command Center");
        user.setRole(role);
        return user;
    }
}
