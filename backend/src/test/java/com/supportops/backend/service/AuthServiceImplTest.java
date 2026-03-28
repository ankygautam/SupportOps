package com.supportops.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.supportops.backend.dto.auth.LoginRequest;
import com.supportops.backend.entity.Role;
import com.supportops.backend.entity.User;
import com.supportops.backend.enums.RoleType;
import com.supportops.backend.mapper.AuthMapper;
import com.supportops.backend.repository.UserRepository;
import com.supportops.backend.security.JwtService;
import com.supportops.backend.service.impl.AuthServiceImpl;
import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

class AuthServiceImplTest {

    private AuthenticationManager authenticationManager;
    private UserRepository userRepository;
    private JwtService jwtService;
    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        authenticationManager = mock(AuthenticationManager.class);
        userRepository = mock(UserRepository.class);
        jwtService = mock(JwtService.class);

        authService = new AuthServiceImpl(authenticationManager, userRepository, jwtService, new AuthMapper());
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void loginReturnsTokenAndProfileForValidCredentials() {
        User user = demoUser("admin@supportops.dev", RoleType.ADMIN);
        UserDetails principal = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities("ROLE_ADMIN")
                .build();

        when(authenticationManager.authenticate(any()))
                .thenReturn(new UsernamePasswordAuthenticationToken(principal, "token", principal.getAuthorities()));
        when(userRepository.findByEmailIgnoreCase(user.getEmail())).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("jwt-token-123");

        var response = authService.login(new LoginRequest(user.getEmail(), "supportops"));

        assertThat(response.token()).isEqualTo("jwt-token-123");
        assertThat(response.user().email()).isEqualTo("admin@supportops.dev");
        assertThat(response.user().role()).isEqualTo("ADMIN");
    }

    @Test
    void currentUserReadsTheAuthenticatedPrincipal() {
        User user = demoUser("lead@supportops.dev", RoleType.TEAM_LEAD);
        when(userRepository.findByEmailIgnoreCase(user.getEmail())).thenReturn(Optional.of(user));

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(user.getEmail(), "jwt-token")
        );

        var profile = authService.currentUser();

        assertThat(profile.fullName()).isEqualTo("Demo User");
        assertThat(profile.role()).isEqualTo("TEAM_LEAD");
    }

    private User demoUser(String email, RoleType roleType) {
        Role role = new Role();
        role.setId("role-" + roleType.name().toLowerCase());
        role.setName(roleType);

        User user = new User();
        user.setId("usr-1");
        user.setFullName("Demo User");
        user.setEmail(email);
        user.setPassword("$2a$10$demo");
        user.setTeam("Operations");
        user.setActive(true);
        user.setRole(role);
        return user;
    }
}
