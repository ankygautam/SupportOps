package com.supportops.backend.mapper;

import com.supportops.backend.dto.auth.UserProfileResponse;
import com.supportops.backend.dto.auth.LoginResponse;
import com.supportops.backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {

    public LoginResponse toLoginResponse(User user, String token) {
        return new LoginResponse(token, toProfile(user));
    }

    public UserProfileResponse toProfile(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getTeam(),
                user.getRole().getName().name(),
                user.isActive()
        );
    }
}
