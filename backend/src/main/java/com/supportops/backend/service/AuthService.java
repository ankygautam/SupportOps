package com.supportops.backend.service;

import com.supportops.backend.dto.auth.LoginRequest;
import com.supportops.backend.dto.auth.LoginResponse;
import com.supportops.backend.dto.auth.UserProfileResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    UserProfileResponse currentUser();
}
