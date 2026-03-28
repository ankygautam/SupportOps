package com.supportops.backend.service.impl;

import com.supportops.backend.dto.auth.LoginRequest;
import com.supportops.backend.dto.auth.LoginResponse;
import com.supportops.backend.dto.auth.UserProfileResponse;
import com.supportops.backend.entity.User;
import com.supportops.backend.exception.ResourceNotFoundException;
import com.supportops.backend.mapper.AuthMapper;
import com.supportops.backend.repository.UserRepository;
import com.supportops.backend.security.JwtService;
import com.supportops.backend.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthMapper authMapper;

    public AuthServiceImpl(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            JwtService jwtService,
            AuthMapper authMapper
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.authMapper = authMapper;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmailIgnoreCase(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        return authMapper.toLoginResponse(user, jwtService.generateToken(user));
    }

    @Override
    public UserProfileResponse currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        return authMapper.toProfile(user);
    }
}
